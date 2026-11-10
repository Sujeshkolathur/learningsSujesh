package com.ibs.istay.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class PropertyAccessGuard {

    public void requireProperty(String propertyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof IstayUser user)) {
            throw new AccessDeniedException("Authentication required");
        }
        if (!user.getPropertyId().equals(propertyId)) {
            throw new AccessDeniedException("Not allowed to access property " + propertyId);
        }
    }

    public IstayUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof IstayUser user)) {
            throw new AccessDeniedException("Authentication required");
        }
        return user;
    }
}
