package com.sujesh.prep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sujesh.prep.model.InterviewQuestion;

final class AiResponseJsonParser {

    private AiResponseJsonParser() {
    }

    static InterviewQuestion parse(String rawContent, ObjectMapper objectMapper) {
        try {
            String json = extractJson(rawContent);
            JsonNode node = objectMapper.readTree(json);
            return new InterviewQuestion(
                    text(node, "category"),
                    text(node, "question"),
                    text(node, "intuition"),
                    text(node, "deepExplanation"),
                    text(node, "followUps"),
                    text(node, "resumeTip"));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to parse AI JSON response: " + ex.getMessage(), ex);
        }
    }

    private static String text(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull() || value.asText().isBlank()) {
            throw new IllegalStateException("Missing AI field: " + field);
        }
        return value.asText().trim();
    }

    private static String extractJson(String raw) {
        String trimmed = raw.trim();
        if (trimmed.startsWith("```")) {
            int start = trimmed.indexOf('{');
            int end = trimmed.lastIndexOf('}');
            if (start >= 0 && end > start) {
                return trimmed.substring(start, end + 1);
            }
        }
        return trimmed;
    }
}
