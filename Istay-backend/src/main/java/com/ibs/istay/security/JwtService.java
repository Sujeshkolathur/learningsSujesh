package com.ibs.istay.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey key;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        String secret = properties.getSecret();
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "istay.security.jwt.secret / ISTAY_JWT_SECRET is required"
            );
        }
        byte[] bytes;
        try {
            bytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException ex) {
            bytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 bytes");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String createToken(IstayUser user) {
        long now = System.currentTimeMillis();
        long expiry = now + properties.getExpirationMinutes() * 60_000L;
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("propertyId", user.getPropertyId())
                .claim("roles", user.getRoles())
                .issuedAt(new Date(now))
                .expiration(new Date(expiry))
                .signWith(key)
                .compact();
    }

    public IstayUser parseUser(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        @SuppressWarnings("unchecked")
        List<String> rolesList = claims.get("roles", List.class);
        Set<String> roles = rolesList == null
                ? Set.of()
                : rolesList.stream().map(String::valueOf).collect(Collectors.toSet());

        return new IstayUser(
                claims.getSubject(),
                "N/A",
                String.valueOf(claims.get("propertyId")),
                roles
        );
    }
}
