package com.taxedge.security.jwt;


public record JwtPrincipal(
        String custId,
        String name,
        String mobileNumber,
        String role
) {}
