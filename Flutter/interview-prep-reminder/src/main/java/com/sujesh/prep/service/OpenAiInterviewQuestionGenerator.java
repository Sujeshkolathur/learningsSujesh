package com.sujesh.prep.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sujesh.prep.config.AiProperties;
import com.sujesh.prep.model.InterviewQuestion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OpenAiInterviewQuestionGenerator implements InterviewQuestionGenerator {

    private static final Logger log = LoggerFactory.getLogger(OpenAiInterviewQuestionGenerator.class);

    private final AiProperties aiProperties;
    private final InterviewQuestionPromptBuilder promptBuilder;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OpenAiInterviewQuestionGenerator(
            AiProperties aiProperties,
            InterviewQuestionPromptBuilder promptBuilder,
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper) {
        this.aiProperties = aiProperties;
        this.promptBuilder = promptBuilder;
        this.objectMapper = objectMapper;
        this.restClient = restClientBuilder.build();
    }

    @Override
    public InterviewQuestion generate(LocalDateTime triggerTime) {
        if (!aiProperties.isConfigured()) {
            throw new IllegalStateException(
                    "AI is not configured. Free options: ai.provider=ollama (local), or set GEMINI_API_KEY / GROQ_API_KEY.");
        }

        ResponseFormat responseFormat = aiProperties.supportsJsonResponseFormat()
                ? new ResponseFormat("json_object")
                : null;

        ChatCompletionRequest request = new ChatCompletionRequest(
                aiProperties.resolvedModel(),
                List.of(
                        new ChatMessage("system", promptBuilder.systemPrompt()),
                        new ChatMessage("user", promptBuilder.userPrompt(triggerTime))),
                aiProperties.getTemperature(),
                aiProperties.getMaxTokens(),
                responseFormat);

        try {
            ChatCompletionResponse response = restClient.post()
                    .uri(aiProperties.resolvedBaseUrl() + "/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + aiProperties.resolvedApiKey())
                    .body(request)
                    .retrieve()
                    .body(ChatCompletionResponse.class);

            if (response == null || response.choices == null || response.choices.isEmpty()) {
                throw new IllegalStateException("Empty AI response");
            }

            String content = response.choices.get(0).message.content;
            log.debug("AI ({}) generated question for {}", aiProperties.getProvider(), triggerTime);
            return AiResponseJsonParser.parse(content, objectMapper);
        } catch (RestClientResponseException ex) {
            throw new IllegalStateException(
                    "AI API error (" + ex.getStatusCode().value() + "): " + ex.getResponseBodyAsString(), ex);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private record ChatCompletionRequest(
            String model,
            List<ChatMessage> messages,
            double temperature,
            @JsonProperty("max_tokens") int maxTokens,
            @JsonProperty("response_format") ResponseFormat responseFormat) {
    }

    private record ResponseFormat(String type) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ChatMessage(String role, String content) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ChatCompletionResponse(List<Choice> choices) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Choice(ChatMessage message) {
    }
}
