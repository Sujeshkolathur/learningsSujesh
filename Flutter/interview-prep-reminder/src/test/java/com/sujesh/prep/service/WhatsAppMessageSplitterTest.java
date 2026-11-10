package com.sujesh.prep.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

class WhatsAppMessageSplitterTest {

    @Test
    void splitsLongMessagesUnderLimit() {
        String body = "A".repeat(2000);
        List<String> parts = WhatsAppMessageSplitter.split(body);

        assertTrue(parts.size() > 1);
        for (String part : parts) {
            assertTrue(part.length() <= WhatsAppMessageSplitter.MAX_LENGTH + 20);
        }
    }
}
