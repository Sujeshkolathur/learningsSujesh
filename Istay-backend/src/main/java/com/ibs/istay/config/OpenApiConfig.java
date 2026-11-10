package com.ibs.istay.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
@ConditionalOnProperty(prefix = "istay.security", name = "open-api-enabled", havingValue = "true")
public class OpenApiConfig {

    public static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    OpenAPI istayOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("iStay API")
                        .description("""
                                Hospitality booking spine: property inventory, availability search, \
                                and reservations. Most endpoints require a JWT from POST /api/auth/login. \
                                The token propertyId claim must match the path propertyId.
                                """)
                        .version("0.1.0")
                        .contact(new Contact().name("iStay Engineering")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .components(new Components()
                        .addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
                                .name(BEARER_SCHEME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Paste the accessToken from /api/auth/login")));
    }
}
