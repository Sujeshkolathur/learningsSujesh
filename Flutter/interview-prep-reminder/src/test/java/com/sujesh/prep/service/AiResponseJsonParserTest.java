package com.sujesh.prep.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sujesh.prep.model.InterviewQuestion;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AiResponseJsonParserTest {

    @Test
    void parsesJsonWrappedInMarkdownFence() {
        String raw = """
                ```json
                {
                  "category": "DSA",
                  "question": "Find duplicate in array",
                  "intuition": "Use set or Floyd",
                  "deepExplanation": "Detailed answer",
                  "followUps": "O(1) space?",
                  "resumeTip": "Mention T-Mobile scale"
                }
                ```
                """;

        InterviewQuestion question = AiResponseJsonParser.parse(raw, new ObjectMapper());

        assertEquals("DSA", question.category());
        assertEquals("Find duplicate in array", question.question());
    }
}
