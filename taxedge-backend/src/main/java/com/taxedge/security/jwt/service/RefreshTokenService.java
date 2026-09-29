package com.taxedge.security.jwt.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.security.jwt.entity.RefreshToken;
import com.taxedge.security.jwt.repository.RefreshTokenRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;


 
@Slf4j
@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    
    private static final int REFRESH_TOKEN_EXPIRY_DAYS = 30;

    
    @Transactional
    public String createRefreshToken(Customer customer) {
        String rawToken = generateRawToken();
        String tokenHash = hashToken(rawToken);

        List<RefreshToken> activeTokens =
                refreshTokenRepository.findAllByCustomerAndRevokedFalse(customer);

        RefreshToken tokenEntity;

        if (!activeTokens.isEmpty()) {
            // Reuse the latest active row — update its hash and reset the window
            tokenEntity = activeTokens.get(0);
            tokenEntity.setTokenHash(tokenHash);
            tokenEntity.setCreatedAt(LocalDateTime.now());
            tokenEntity.setExpiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS));
            tokenEntity.setRevoked(false);

            // Revoke any duplicate active rows (defensive clean-up)
            if (activeTokens.size() > 1) {
                log.warn("[RefreshToken] Found {} duplicate active tokens for customer [{}] — revoking extras",
                        activeTokens.size() - 1, customer.getCustId());
                for (int i = 1; i < activeTokens.size(); i++) {
                    activeTokens.get(i).setRevoked(true);
                    refreshTokenRepository.save(activeTokens.get(i));
                }
            }
        } else {
            // First-time issuance
            tokenEntity = RefreshToken.builder()
                    .tokenHash(tokenHash)
                    .customer(customer)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS))
                    .revoked(false)
                    .build();
        }

        refreshTokenRepository.save(tokenEntity);
        log.debug("[RefreshToken] Issued new refresh token for customer [{}]", customer.getCustId());
        return rawToken;
    }

   
    @Transactional
    public String rotateRefreshToken(RefreshToken storedToken) {
        String newRawToken = generateRawToken();
        String newTokenHash = hashToken(newRawToken);

        // Overwrite the existing row atomically — the old hash is gone
        storedToken.setTokenHash(newTokenHash);
        storedToken.setCreatedAt(LocalDateTime.now());
        storedToken.setExpiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS));
        storedToken.setRevoked(false);

        refreshTokenRepository.save(storedToken);
        log.debug("[RefreshToken] Rotated refresh token (entity id={})", storedToken.getId());
        return newRawToken;
    }

    
    @Transactional
    public Optional<RefreshToken> validateRefreshToken(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);

        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);

        if (tokenOpt.isEmpty()) {
            log.warn("[RefreshToken] Validation failed — hash not found (possible replay or invalid token)");
            return Optional.empty();
        }

        RefreshToken storedToken = tokenOpt.get();

        if (storedToken.isRevoked()) {
            log.warn("[RefreshToken] Validation failed — token is revoked (entity id={})", storedToken.getId());
            return Optional.empty();
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.info("[RefreshToken] Validation failed — token expired at {} (entity id={})",
                    storedToken.getExpiresAt(), storedToken.getId());
            return Optional.empty();
        }

        return Optional.of(storedToken);
    }

   
    @Transactional
    public void revokeRefreshToken(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);

        refreshTokenRepository.findByTokenHash(tokenHash).ifPresentOrElse(
                storedToken -> {
                    storedToken.setRevoked(true);
                    refreshTokenRepository.save(storedToken);
                    log.info("[RefreshToken] Revoked token (entity id={})", storedToken.getId());
                },
                () -> log.warn("[RefreshToken] revokeRefreshToken — hash not found, nothing to revoke")
        );
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    
    private String generateRawToken() {
        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

   
    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available on this JVM", e);
        }
    }
}