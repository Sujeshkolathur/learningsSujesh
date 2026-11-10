package com.sujesh.prep.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ai")
public class AiProperties {

    private boolean enabled = true;
    private AiProvider provider = AiProvider.GEMINI;
    private String apiKey = "";
    private String baseUrl = "";
    private String model = "";
    private double temperature = 0.85;
    private int maxTokens = 1800;
    private String candidateContext = "";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public AiProvider getProvider() {
        return provider;
    }

    public void setProvider(AiProvider provider) {
        this.provider = provider;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public int getMaxTokens() {
        return maxTokens;
    }

    public void setMaxTokens(int maxTokens) {
        this.maxTokens = maxTokens;
    }

    public String getCandidateContext() {
        return candidateContext;
    }

    public void setCandidateContext(String candidateContext) {
        this.candidateContext = candidateContext;
    }

    public String resolvedBaseUrl() {
        if (baseUrl != null && !baseUrl.isBlank()) {
            return trimTrailingSlash(baseUrl);
        }
        return switch (provider) {
            case GEMINI -> "https://generativelanguage.googleapis.com/v1beta/openai";
            case GROQ -> "https://api.groq.com/openai/v1";
            case OLLAMA -> "http://localhost:11434/v1";
        };
    }

    public String resolvedModel() {
        if (model != null && !model.isBlank()) {
            return model;
        }
        return switch (provider) {
            case GEMINI -> "gemini-2.0-flash";
            case GROQ -> "llama-3.3-70b-versatile";
            case OLLAMA -> "llama3.2";
        };
    }

    public boolean isConfigured() {
        if (!enabled) {
            return false;
        }
        if (provider == AiProvider.OLLAMA) {
            return true;
        }
        return apiKey != null && !apiKey.isBlank();
    }

    public String resolvedApiKey() {
        if (provider == AiProvider.OLLAMA) {
            return "ollama";
        }
        return apiKey;
    }

    public boolean supportsJsonResponseFormat() {
        return provider != AiProvider.OLLAMA;
    }

    private static String trimTrailingSlash(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
