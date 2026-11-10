package com.sujesh.prep.service;

import com.sujesh.prep.config.AiProperties;
import com.sujesh.prep.config.PrepProperties;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class InterviewQuestionPromptBuilder {

    private static final List<String> FOCUS_ROTATION = List.of(
            "Core Java (collections, concurrency, JVM)",
            "Spring Boot & Spring Cloud microservices",
            "DSA and LeetCode-style problem solving",
            "System design for scalable backends",
            "Apache Kafka and messaging patterns",
            "Behavioral STAR stories for senior roles",
            "Google interview coding and communication",
            "SQL/NoSQL, caching, and data modeling",
            "DevOps, CI/CD, Docker, Azure/AWS",
            "REST, GraphQL, API design, and testing with JUnit/Mockito");

    private final PrepProperties prepProperties;
    private final AiProperties aiProperties;

    public InterviewQuestionPromptBuilder(PrepProperties prepProperties, AiProperties aiProperties) {
        this.prepProperties = prepProperties;
        this.aiProperties = aiProperties;
    }

    public String systemPrompt() {
        return """
                You are an expert technical interview coach for senior backend engineers in India.
                Generate ONE fresh interview question every time. Never reuse generic textbook wording.
                Tailor difficulty to 7+ years experience and Google L4-L5 bar when relevant.
                Output ONLY valid JSON with exactly these keys (all strings, no markdown):
                category, question, intuition, deepExplanation, followUps, resumeTip
                Keep deepExplanation detailed (8-12 sentences) but concise enough for WhatsApp.
                Include one LeetCode-style or system design angle when the focus allows.
                """;
    }

    public String userPrompt(LocalDateTime triggerTime) {
        String focus = FOCUS_ROTATION.get(Math.floorMod(triggerTime.getHour(), FOCUS_ROTATION.size()));
        String nonce = UUID.randomUUID().toString();

        return """
                Generate a unique interview question now.
                Trigger timestamp (IST context): %s
                Uniqueness nonce: %s
                Candidate name: %s
                Target role: %s
                Today's focus area: %s

                Candidate background:
                %s

                Also weave in preparation goals:
                - Solve LeetCode daily
                - Apply jobs on Naukri, Naukri Gulf, LinkedIn
                - DSA depth and Google interview readiness

                Requirements:
                - Question must be different from typical canned prompts
                - deepExplanation must teach concepts deeply with examples
                - followUps: 2-3 bullets as a single string separated by newlines
                - resumeTip: how candidate can answer using retail/telecom/microservices experience
                """.formatted(
                triggerTime,
                nonce,
                prepProperties.getCandidateName(),
                prepProperties.getTargetRole(),
                focus,
                candidateContextBlock());
    }

    private String candidateContextBlock() {
        if (aiProperties.getCandidateContext() != null && !aiProperties.getCandidateContext().isBlank()) {
            return aiProperties.getCandidateContext();
        }
        return """
                Senior Java Developer, 7.2 years. Spring Boot, Spring Cloud, microservices, Kafka, ActiveMQ.
                Cloud: Azure, AWS, GCP. Projects: XPO middleware, Conagra Spring+Ionic, T-Mobile cloud security,
                Trader Joe's retail vendor lifecycle (Dapr, GitHub Actions). AZ-900 certified.
                """.trim();
    }
}
