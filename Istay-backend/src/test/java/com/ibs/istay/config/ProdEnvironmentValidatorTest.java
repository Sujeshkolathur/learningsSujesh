package com.ibs.istay.config;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ProdEnvironmentValidatorTest {

    @Test
    void rejectsBlankSecret() {
        assertThatThrownBy(() -> ProdEnvironmentValidator.validateJwtSecret(" "))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ISTAY_JWT_SECRET");
    }

    @Test
    void rejectsLocalDefaultSecret() {
        assertThatThrownBy(() -> ProdEnvironmentValidator.validateJwtSecret(ProdEnvironmentValidator.LOCAL_JWT_DEFAULT))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("local default");
    }

    @Test
    void acceptsStrongSecret() {
        assertThatCode(() -> ProdEnvironmentValidator.validateJwtSecret("prod-grade-secret-value-at-least-32b"))
                .doesNotThrowAnyException();
    }
}
