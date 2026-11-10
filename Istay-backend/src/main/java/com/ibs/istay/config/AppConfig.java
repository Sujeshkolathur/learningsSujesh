package com.ibs.istay.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.ibs.istay.security.JwtProperties;

@Configuration
@EnableConfigurationProperties({
        JwtProperties.class,
        IstayCorsProperties.class,
        IstaySecurityProperties.class
})
public class AppConfig {
}
