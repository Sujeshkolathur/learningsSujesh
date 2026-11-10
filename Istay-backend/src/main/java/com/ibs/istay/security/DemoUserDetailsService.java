package com.ibs.istay.security;

import java.util.Map;
import java.util.Set;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Local demo users (not production IdP).
 * front_desk / revenue → DEMO-01; other_desk → OTHER-01 (for isolation tests).
 */
@Service
public class DemoUserDetailsService implements UserDetailsService {

    private final Map<String, IstayUser> users;

    public DemoUserDetailsService(PasswordEncoder passwordEncoder) {
        String hash = passwordEncoder.encode("password");
        this.users = Map.of(
                "front_desk", new IstayUser("front_desk", hash, "DEMO-01", Set.of("FRONT_DESK")),
                "revenue", new IstayUser("revenue", hash, "DEMO-01", Set.of("REVENUE")),
                "other_desk", new IstayUser("other_desk", hash, "OTHER-01", Set.of("FRONT_DESK"))
        );
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        IstayUser user = users.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return user;
    }
}
