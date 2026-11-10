package com.sujesh.prep.service;

import com.sujesh.prep.config.PrepProperties;
import com.sujesh.prep.model.InterviewQuestion;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class HourlyInterviewQuestionService {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final PrepProperties prepProperties;
    private final InterviewQuestionGenerator questionGenerator;

    public HourlyInterviewQuestionService(
            PrepProperties prepProperties,
            InterviewQuestionGenerator questionGenerator) {
        this.prepProperties = prepProperties;
        this.questionGenerator = questionGenerator;
    }

    public InterviewQuestion questionForNow() {
        return questionFor(LocalDateTime.now(ZoneId.of(prepProperties.getTimezone())));
    }

    public InterviewQuestion questionFor(LocalDateTime dateTime) {
        return questionGenerator.generate(dateTime);
    }

    public String buildMessage(InterviewQuestion question, LocalDateTime dateTime) {
        return """
                🎤 *Hourly Interview Question* (AI generated)
                %s IST | %s

                *Category:* %s

                *Question*
                %s

                *Quick intuition*
                %s

                *Deep explanation*
                %s

                *Follow-ups to expect*
                %s

                *Tie to your experience*
                %s

                ⏱ Spend 10 min: answer aloud, then check gaps.
                """.formatted(
                        dateTime.format(TIME_FORMAT),
                        prepProperties.getCandidateName(),
                        question.category(),
                        question.question(),
                        question.intuition(),
                        question.deepExplanation(),
                        question.followUps(),
                        question.resumeTip())
                .trim();
    }

    public String buildMessageForNow() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of(prepProperties.getTimezone()));
        return buildMessage(questionFor(now), now);
    }

    public boolean isWithinActiveHours(LocalDateTime dateTime) {
        int hour = dateTime.getHour();
        int from = prepProperties.getSchedule().getHourlyActiveFrom();
        int to = prepProperties.getSchedule().getHourlyActiveTo();
        return hour >= from && hour <= to;
    }
}
