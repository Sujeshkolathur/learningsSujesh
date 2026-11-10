package com.sujesh.prep.service;

import java.util.ArrayList;
import java.util.List;

final class WhatsAppMessageSplitter {

    static final int MAX_LENGTH = 1500;

    private WhatsAppMessageSplitter() {
    }

    static List<String> split(String body) {
        if (body.length() <= MAX_LENGTH) {
            return List.of(body);
        }

        List<String> parts = new ArrayList<>();
        String remaining = body;
        int partNumber = 1;

        while (!remaining.isEmpty()) {
            if (remaining.length() <= MAX_LENGTH) {
                parts.add(prefix(partNumber, remaining));
                break;
            }

            int cut = findCutIndex(remaining, MAX_LENGTH - 20);
            String chunk = remaining.substring(0, cut).trim();
            parts.add(prefix(partNumber, chunk));
            remaining = remaining.substring(cut).trim();
            partNumber++;
        }

        return parts;
    }

    private static int findCutIndex(String text, int max) {
        int cut = text.lastIndexOf("\n\n", max);
        if (cut < max / 2) {
            cut = text.lastIndexOf('\n', max);
        }
        if (cut < max / 2) {
            cut = text.lastIndexOf(' ', max);
        }
        if (cut <= 0) {
            cut = max;
        }
        return cut;
    }

    private static String prefix(int partNumber, String chunk) {
        if (partNumber == 1) {
            return chunk;
        }
        return "(Part " + partNumber + ")\n" + chunk;
    }
}
