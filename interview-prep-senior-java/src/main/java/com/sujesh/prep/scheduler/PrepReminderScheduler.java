package com.sujesh.prep.scheduler;

import com.sujesh.prep.config.PrepProperties;
import com.sujesh.prep.model.ReminderSlot;
import com.sujesh.prep.service.HourlyInterviewQuestionService;
import com.sujesh.prep.service.InterviewPrepContentService;
import com.sujesh.prep.service.PrepNotificationService;

import java.time.LocalDateTime;
import java.time.ZoneId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "prep.schedule", name = "internal-enabled", havingValue = "true", matchIfMissing = true)
public class PrepReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(PrepReminderScheduler.class);

    private final PrepProperties prepProperties;
    private final InterviewPrepContentService contentService;
    private final HourlyInterviewQuestionService hourlyQuestionService;
    private final PrepNotificationService notificationService;

    public PrepReminderScheduler(
            PrepProperties prepProperties,
            InterviewPrepContentService contentService,
            HourlyInterviewQuestionService hourlyQuestionService,
            PrepNotificationService notificationService) {
        this.prepProperties = prepProperties;
        this.contentService = contentService;
        this.hourlyQuestionService = hourlyQuestionService;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "${prep.schedule.morning-cron}", zone = "${prep.timezone}")
    public void sendMorningReminder() {
        sendReminder(ReminderSlot.MORNING);
    }

    @Scheduled(cron = "${prep.schedule.evening-cron}", zone = "${prep.timezone}")
    public void sendEveningReminder() {
        sendReminder(ReminderSlot.EVENING);
    }

    @Scheduled(cron = "${prep.schedule.hourly-cron}", zone = "${prep.timezone}")
    public void sendHourlyInterviewQuestion() {
        if (!prepProperties.getSchedule().isHourlyEnabled()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now(ZoneId.of(prepProperties.getTimezone()));
        if (!hourlyQuestionService.isWithinActiveHours(now)) {
            return;
        }

        try {
            String message = hourlyQuestionService.buildMessageForNow();
            notificationService.send(message);
        } catch (Exception ex) {
            log.error("Failed to send hourly interview question", ex);
        }
    }

    private void sendReminder(ReminderSlot slot) {
        try {
            String message = contentService.buildMessage(slot);
            notificationService.send(message);
        } catch (Exception ex) {
            log.error("Failed to send {} reminder", slot, ex);
        }
    }
}
