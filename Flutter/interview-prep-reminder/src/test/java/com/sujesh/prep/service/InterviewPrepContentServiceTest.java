package com.sujesh.prep.service;

import com.sujesh.prep.config.PrepProperties;
import com.sujesh.prep.model.ReminderSlot;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class InterviewPrepContentServiceTest {

    @Test
    void buildMessageIncludesCoreSections() {
        PrepProperties props = new PrepProperties();
        props.setCandidateName("Sujesh K R");
        InterviewPrepContentService service = new InterviewPrepContentService(props);

        String message = service.buildMessage(ReminderSlot.MORNING);

        assertTrue(message.contains("LeetCode"));
        assertTrue(message.contains("DSA"));
        assertTrue(message.contains("Naukri"));
        assertTrue(message.contains("Google prep"));
        assertTrue(message.contains("Sujesh K R"));
    }
}
