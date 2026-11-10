package com.ibs.istay.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.ibs.istay.security.JwtProperties;

/**
 * Fail fast in production if required secrets are missing or look like local defaults.
 */
@Component
@Profile("prod")
public class ProdEnvironmentValidator implements ApplicationRunner {

    static final String LOCAL_JWT_DEFAULT = "aXN0YXktbG9jYWwtc2VjcmV0LWtleS0zMi1ieXRlcy1taW4hISE=";

    private static final Logger log = LoggerFactory.getLogger(ProdEnvironmentValidator.class);

    private final JwtProperties jwtProperties;
    private final IstayCorsProperties corsProperties;
    private final Environment environment;

    public ProdEnvironmentValidator(
            JwtProperties jwtProperties,
            IstayCorsProperties corsProperties,
            Environment environment
    ) {
        this.jwtProperties = jwtProperties;
        this.corsProperties = corsProperties;
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        validateJwtSecret(jwtProperties.getSecret());
        validateRequired("ISTAY_DB_URL / spring.datasource.url", environment.getProperty("spring.datasource.url"));
        validateRequired("ISTAY_DB_USERNAME", environment.getProperty("spring.datasource.username"));
        validateRequired("ISTAY_DB_PASSWORD", environment.getProperty("spring.datasource.password"));
        if (corsProperties.allowedOriginList().isEmpty()) {
            throw new IllegalStateException("ISTAY_CORS_ALLOWED_ORIGINS must be set in prod");
        }
        if (corsProperties.allowedOriginList().stream().anyMatch(o -> o.contains("localhost"))) {
            log.warn("CORS allows localhost in prod — confirm this is intentional");
        }
        log.info("Production environment secret checks passed");
    }

    static void validateJwtSecret(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("ISTAY_JWT_SECRET must be set in prod");
        }
        if (LOCAL_JWT_DEFAULT.equals(secret)) {
            throw new IllegalStateException("ISTAY_JWT_SECRET must not use the local default value in prod");
        }
        if (secret.getBytes().length < 32) {
            throw new IllegalStateException("ISTAY_JWT_SECRET must be at least 32 bytes");
        }
    }

    private static void validateRequired(String name, String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(name + " must be set in prod");
        }
    }
}
