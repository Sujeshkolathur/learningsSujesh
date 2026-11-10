package com.ibs.istay.security;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class IstayUser implements UserDetails {

    private final String username;
    private final String passwordHash;
    private final String propertyId;
    private final Set<String> roles;

    public IstayUser(String username, String passwordHash, String propertyId, Set<String> roles) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.propertyId = propertyId;
        this.roles = Set.copyOf(roles);
    }

    public String getPropertyId() {
        return propertyId;
    }

    public Set<String> getRoles() {
        return roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
