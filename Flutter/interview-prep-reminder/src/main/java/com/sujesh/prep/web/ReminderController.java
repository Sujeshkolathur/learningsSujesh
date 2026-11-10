package com.sujesh.prep.web;

import com.sujesh.prep.model.ReminderSlot;
import com.sujesh.prep.service.HourlyInterviewQuestionService;
import com.sujesh.prep.service.InterviewPrepContentService;
import com.sujesh.prep.service.PrepNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final InterviewPrepContentService contentService;
    private final HourlyInterviewQuestionService hourlyQuestionService;
    private final PrepNotificationService notificationService;
    private final PrepApiAuth apiAuth;

    public ReminderController(
            InterviewPrepContentService contentService,
            HourlyInterviewQuestionService hourlyQuestionService,
            PrepNotificationService notificationService,
            PrepApiAuth apiAuth) {
        this.contentService = contentService;
        this.hourlyQuestionService = hourlyQuestionService;
        this.notificationService = notificationService;
        this.apiAuth = apiAuth;
    }

    @GetMapping("/preview")
    public Map<String, String> preview(@RequestParam(defaultValue = "MORNING") ReminderSlot slot) {
        return Map.of("message", contentService.buildMessage(slot));
    }

    @GetMapping("/send")
    public ResponseEntity<Map<String, String>> send(
            @RequestParam(defaultValue = "MORNING") ReminderSlot slot,
            @RequestParam(name = "key", required = false) String key) {
        apiAuth.requireValidKey(key);
        String message = contentService.buildMessage(slot);
        notificationService.send(message);
        return ResponseEntity.ok(Map.of(
                "status", "sent",
                "slot", slot.name(),
                "preview", message));
    }

    @GetMapping("/hourly/preview")
    public Map<String, String> previewHourlyQuestion() {
        return Map.of("message", hourlyQuestionService.buildMessageForNow());
    }

    @GetMapping("/hourly/send")
    public ResponseEntity<Map<String, String>> sendHourlyQuestion(
            @RequestParam(name = "key", required = false) String key) {
        apiAuth.requireValidKey(key);
        String message = hourlyQuestionService.buildMessageForNow();
        notificationService.send(message);
        return ResponseEntity.ok(Map.of("status", "sent", "preview", message));
    }
}
