package com.sujesh.prep.web;

import com.sujesh.prep.config.PrepProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class PrepApiAuth {

    private final PrepProperties prepProperties;

    public PrepApiAuth(PrepProperties prepProperties) {
        this.prepProperties = prepProperties;
    }

    public void requireValidKey(String key) {
        String secret = prepProperties.getApiSecret();
        if (secret == null || secret.isBlank()) {
            return;
        }
        if (key == null || !secret.equals(key)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing API key");
        }
    }
}
