package com.ibs.istay.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "istay.security.jwt")
public class JwtProperties {

    /**
     * Secret for HMAC signing (min 32 bytes). Prefer Base64. Required via env in prod.
     */
    private String secret = "";
    private long expirationMinutes = 480;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMinutes() {
        return expirationMinutes;
    }

    public void setExpirationMinutes(long expirationMinutes) {
        this.expirationMinutes = expirationMinutes;
    }
}
