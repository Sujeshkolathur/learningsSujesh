package com.ibs.istay.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "istay.security")
public class IstaySecurityProperties {

    /**
     * When true, metrics/prometheus/info are anonymously readable (local observe only).
     */
    private boolean actuatorOpen = false;

    /**
     * When true, Swagger UI and OpenAPI docs are publicly reachable (local only).
     */
    private boolean openApiEnabled = false;

    public boolean isActuatorOpen() {
        return actuatorOpen;
    }

    public void setActuatorOpen(boolean actuatorOpen) {
        this.actuatorOpen = actuatorOpen;
    }

    public boolean isOpenApiEnabled() {
        return openApiEnabled;
    }

    public void setOpenApiEnabled(boolean openApiEnabled) {
        this.openApiEnabled = openApiEnabled;
    }
}
