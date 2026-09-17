package com.taxedge.security.jwt.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.security.jwt.entity.RefreshToken;
import com.taxedge.security.jwt.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    private static final int REFRESH_TOKEN_EXPIRY_DAYS = 30;

    public String createRefreshToken(Customer customer) {

        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        String refreshToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        String tokenHash = hashToken(refreshToken);

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .tokenHash(tokenHash)
                .customer(customer)
                .createdAt(LocalDateTime.now())
                .expiresAt(
                        LocalDateTime.now()
                                .plusDays(REFRESH_TOKEN_EXPIRY_DAYS)
                )
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        return refreshToken;
    }

    public Optional<RefreshToken> validateRefreshToken(
            String refreshToken) {

        String tokenHash = hashToken(refreshToken);

        Optional<RefreshToken> token =
                refreshTokenRepository.findByTokenHash(tokenHash);

        if (token.isEmpty()) {
            return Optional.empty();
        }

        RefreshToken storedToken = token.get();

        if (storedToken.isRevoked()) {
            return Optional.empty();
        }

        if (storedToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            return Optional.empty();
        }

        return Optional.of(storedToken);
    }

    public void revokeRefreshToken(String refreshToken) {

        String tokenHash = hashToken(refreshToken);

        Optional<RefreshToken> token =
                refreshTokenRepository.findByTokenHash(tokenHash);

        if (token.isPresent()) {

            RefreshToken storedToken = token.get();

            storedToken.setRevoked(true);

            refreshTokenRepository.save(storedToken);
        }
    }

    private String hashToken(String token) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            token.getBytes(StandardCharsets.UTF_8)
                    );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm not available",
                    e
            );
        }
    }
}