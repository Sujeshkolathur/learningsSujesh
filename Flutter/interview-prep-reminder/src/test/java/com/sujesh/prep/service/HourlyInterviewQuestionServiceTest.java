package com.sujesh.prep.service;

import com.sujesh.prep.config.PrepProperties;
import com.sujesh.prep.model.InterviewQuestion;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HourlyInterviewQuestionServiceTest {

    @Test
    void messageContainsDeepExplanationSections() {
        PrepProperties props = new PrepProperties();
        InterviewQuestionGenerator generator = triggerTime -> new InterviewQuestion(
                "Java",
                "Explain happens-before?",
                "JMM ordering rule.",
                "Deep content here.",
                "volatile?",
                "Use concurrency story.");
        HourlyInterviewQuestionService service = new HourlyInterviewQuestionService(props, generator);

        String message = service.buildMessageForNow();

        assertTrue(message.contains("Deep explanation"));
        assertTrue(message.contains("AI generated"));
        assertTrue(message.contains("Follow-ups"));
    }

    @Test
    void activeHoursRespectConfig() {
        PrepProperties props = new PrepProperties();
        props.getSchedule().setHourlyActiveFrom(7);
        props.getSchedule().setHourlyActiveTo(22);
        HourlyInterviewQuestionService service = new HourlyInterviewQuestionService(
                props, triggerTime -> new InterviewQuestion("x", "q", "i", "d", "f", "r"));

        assertTrue(service.isWithinActiveHours(LocalDateTime.of(2026, 9, 14, 10, 0)));
        assertFalse(service.isWithinActiveHours(LocalDateTime.of(2026, 9, 14, 23, 0)));
    }
}
