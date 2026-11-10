package com.ibs.istay.support;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import com.ibs.istay.security.IstayUser;
import com.ibs.istay.security.JwtService;

@Component
public class AuthTestSupport {

    @Autowired
    private JwtService jwtService;

    public String bearer(String username, String propertyId, String... roles) {
        IstayUser user = new IstayUser(username, "N/A", propertyId, Set.of(roles));
        return "Bearer " + jwtService.createToken(user);
    }

    public HttpHeaders frontDeskDemoHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, bearer("front_desk", "DEMO-01", "FRONT_DESK"));
        return headers;
    }

    public HttpHeaders revenueDemoHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, bearer("revenue", "DEMO-01", "REVENUE"));
        return headers;
    }

    public HttpHeaders otherPropertyFrontDeskHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, bearer("other_desk", "OTHER-01", "FRONT_DESK"));
        return headers;
    }
}
