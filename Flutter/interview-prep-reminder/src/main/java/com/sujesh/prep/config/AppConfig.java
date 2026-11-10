package com.sujesh.prep.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({PrepProperties.class, AiProperties.class, NotificationProperties.class})
public class AppConfig {
}
