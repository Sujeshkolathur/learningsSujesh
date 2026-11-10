package com.ibs.istay.web;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Health")
public class HealthController {

    @GetMapping("/api/health")
    @SecurityRequirements
    @Operation(summary = "Application liveness probe")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "service", "istay-backend"
        );
    }

    @GetMapping("/api/hello")
    @SecurityRequirements
    @Operation(summary = "Simple hello message")
    public Map<String, String> hello() {
        return Map.of("message", "Welcome to iStay sample API");
    }
}
