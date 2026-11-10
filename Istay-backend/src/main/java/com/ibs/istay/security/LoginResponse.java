package com.ibs.istay.security;

import java.util.Set;

public record LoginResponse(
        String accessToken,
        String tokenType,
        String username,
        String propertyId,
        Set<String> roles
) {
}
