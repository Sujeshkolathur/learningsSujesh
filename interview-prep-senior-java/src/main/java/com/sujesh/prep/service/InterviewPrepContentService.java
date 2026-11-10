package com.sujesh.prep.service;

import com.sujesh.prep.config.PrepProperties;
import com.sujesh.prep.model.ReminderSlot;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
public class InterviewPrepContentService {

    private final PrepProperties prepProperties;

    public InterviewPrepContentService(PrepProperties prepProperties) {
        this.prepProperties = prepProperties;
    }

    public String buildMessage(ReminderSlot slot) {
        LocalDate today = LocalDate.now(ZoneId.of(prepProperties.getTimezone()));
        DayOfWeek day = today.getDayOfWeek();
        String dayName = day.getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        StringBuilder message = new StringBuilder();
        message.append("📚 *Interview Prep Reminder*\n");
        message.append("Hi ").append(prepProperties.getCandidateName()).append("!\n");
        message.append("📅 ").append(dayName).append(" | ").append(slot.name().toLowerCase()).append(" check-in\n");
        message.append("🎯 Target: ").append(prepProperties.getTargetRole()).append("\n\n");

        message.append(dayFocus(day)).append("\n\n");
        message.append(leetcodeBlock(day, slot)).append("\n\n");
        message.append(dsaBlock(day)).append("\n\n");
        message.append(jobHuntBlock(day)).append("\n\n");
        message.append(googlePrepBlock(day, slot)).append("\n\n");
        message.append(resumeSkillRefresh(day)).append("\n\n");
        message.append(eveningReflection(slot));

        return message.toString().trim();
    }

    private String dayFocus(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "*Today's theme:* DSA fundamentals + Arrays/Hashing refresh";
            case TUESDAY -> "*Today's theme:* Trees, Graphs & BFS/DFS";
            case WEDNESDAY -> "*Today's theme:* Job applications + LinkedIn visibility";
            case THURSDAY -> "*Today's theme:* Google-style coding + complexity analysis";
            case FRIDAY -> "*Today's theme:* System design lite + microservices stories";
            case SATURDAY -> "*Today's theme:* Naukri Gulf + mock interview";
            case SUNDAY -> "*Today's theme:* Weekly review + weak-topic revision";
        };
    }

    private String leetcodeBlock(DayOfWeek day, ReminderSlot slot) {
        String problems = switch (day) {
            case MONDAY -> "• Two Sum (#1)\n• Best Time to Buy and Sell Stock (#121)\n• Group Anagrams (#49)";
            case TUESDAY -> "• Binary Tree Level Order (#102)\n• Number of Islands (#200)\n• Course Schedule (#207)";
            case WEDNESDAY -> "• Valid Parentheses (#20)\n• Merge Intervals (#56)\n• LRU Cache (#146)";
            case THURSDAY -> "• Koko Eating Bananas (#875)\n• Word Break (#139)\n• Median of Two Sorted Arrays (#4) — read only";
            case FRIDAY -> "• Design Parking System (#1603)\n• Cheapest Flights Within K Stops (#787)\n• Serialize BST (#449)";
            case SATURDAY -> "• Mock: 1 medium in 35 min + explain approach aloud";
            case SUNDAY -> "• Re-solve 2 problems you got wrong this week";
        };
        int count = slot == ReminderSlot.MORNING ? 2 : 1;
        return "*LeetCode* (solve " + count + " today)\n" + problems
                + "\n✅ After each: state brute force → optimal → time/space complexity.";
    }

    private String dsaBlock(DayOfWeek day) {
        String topic = switch (day) {
            case MONDAY -> "Arrays, HashMap, Prefix Sum, Sliding Window";
            case TUESDAY -> "Binary Trees, BST, Graph adjacency, Topological sort";
            case WEDNESDAY -> "Stacks, Queues, Heaps, Monotonic stack";
            case THURSDAY -> "Binary Search, Recursion, Backtracking";
            case FRIDAY -> "Dynamic Programming (1D/2D), Memo vs Tabulation";
            case SATURDAY -> "Mixed revision: Big-O cheatsheet + 10 flashcards";
            case SUNDAY -> "Weak areas from last 7 days — 45 min deep dive";
        };
        return "*DSA focus*\n• Topic: " + topic
                + "\n• Write 3 bullet notes in your own words (no copy-paste).";
    }

    private String jobHuntBlock(DayOfWeek day) {
        var portals = prepProperties.getJobPortals();
        return switch (day) {
            case MONDAY, TUESDAY, THURSDAY, FRIDAY -> "*Job hunt (India)*\n"
                    + "• Naukri: apply to 5 *Senior Java / Spring Boot* roles\n"
                    + "  " + portals.getNaukri() + "\n"
                    + "• LinkedIn: apply 3 + message 1 recruiter\n"
                    + "  " + portals.getLinkedin() + "\n"
                    + "• Keywords: Java 17, Spring Boot, Kafka, Microservices, Azure";
            case WEDNESDAY -> "*Job hunt — LinkedIn day*\n"
                    + "• Update headline: Senior Java Developer | Spring Boot | Microservices | Azure\n"
                    + "• Post 1 short learning insight (Kafka, Dapr, or CI/CD)\n"
                    + "• Apply 5 roles on LinkedIn\n"
                    + "  " + portals.getLinkedin();
            case SATURDAY -> "*Job hunt — Gulf*\n"
                    + "• Naukri Gulf: apply 5 roles (UAE/KSA/Qatar)\n"
                    + "  " + portals.getNaukriGulf() + "\n"
                    + "• Tailor resume: emphasize T-Mobile multi-cloud + Trader Joe's microservices";
            case SUNDAY -> "*Job hunt — pipeline review*\n"
                    + "• Track applications in a sheet (company, date, status, follow-up)\n"
                    + "• Follow up on 2 pending applications";
        };
    }

    private String googlePrepBlock(DayOfWeek day, ReminderSlot slot) {
        if (slot == ReminderSlot.EVENING && day != DayOfWeek.THURSDAY && day != DayOfWeek.SUNDAY) {
            return "*Google prep (light)*\n• Read 1 Google interview experience article (15 min)";
        }
        return switch (day) {
            case MONDAY -> "*Google prep*\n"
                    + "• Practice *clarifying questions* before coding (5 min)\n"
                    + "• Review: HashMap internals, equals/hashCode contract";
            case TUESDAY -> "*Google prep*\n"
                    + "• Graph patterns: BFS shortest path, DFS cycle detection\n"
                    + "• Explain T-Mobile policy microservices story in STAR format";
            case WEDNESDAY -> "*Google prep*\n"
                    + "• Behavioral: 2 stories — conflict & tight deadline (Infosys/UST)\n"
                    + "• Googleyness: ownership, ambiguity, collaboration";
            case THURSDAY -> "*Google prep — coding day*\n"
                    + "• 45 min timed medium problem\n"
                    + "• Must: dry-run, edge cases, optimize, clean Java code";
            case FRIDAY -> "*Google prep*\n"
                    + "• System design: design URL shortener OR rate limiter (30 min)\n"
                    + "• Tie to your Kafka + ActiveMQ async experience";
            case SATURDAY -> "*Google prep*\n"
                    + "• Mock: explain Conagra Spring Boot API design aloud\n"
                    + "• Review: CAP theorem, load balancing, caching basics";
            case SUNDAY -> "*Google prep — weekly*\n"
                    + "• Score yourself 1–5 on: DSA, system design, behavioral, Java depth\n"
                    + "• Plan next week's weakest bucket";
        };
    }

    private String resumeSkillRefresh(DayOfWeek day) {
        String skill = switch (day) {
            case MONDAY -> "Spring Boot: auto-config, actuator, transaction boundaries";
            case TUESDAY -> "Spring Cloud: discovery, config, resilience patterns";
            case WEDNESDAY -> "Kafka vs ActiveMQ — when you used each (Dex/Trader Joe's)";
            case THURSDAY -> "JUnit + Mockito: test doubles, verify interactions";
            case FRIDAY -> "Docker + Azure DevOps/GitHub Actions CI/CD flow";
            case SATURDAY -> "SQL vs NoSQL + Cosmos DB — trade-offs from your projects";
            case SUNDAY -> "React.js basics — bridge full-stack talking points";
        };
        return "*Resume-aligned revision*\n• Deep dive: " + skill
                + "\n• Prepare 1 interview answer linking to XPO / Conagra / T-Mobile / Trader Joe's.";
    }

    private String eveningReflection(ReminderSlot slot) {
        if (slot != ReminderSlot.EVENING) {
            return "*Evening*\n• Quick win: log what you completed today (5 min).";
        }
        return "*Evening reflection*\n"
                + "• Did you solve LeetCode? Applied jobs? DSA notes?\n"
                + "• Tomorrow's #1 priority: ___________\n"
                + "💪 7.2+ years experience — stay consistent!";
    }
}
