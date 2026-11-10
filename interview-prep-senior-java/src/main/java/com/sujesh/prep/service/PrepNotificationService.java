package com.sujesh.prep.service;

import com.sujesh.prep.config.NotificationProperties;
import com.sujesh.prep.config.NotificationProvider;
import com.sujesh.prep.config.PrepProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class PrepNotificationService {

    private static final Logger log = LoggerFactory.getLogger(PrepNotificationService.class);

    private final PrepProperties prepProperties;
    private final NotificationProperties notificationProperties;
    private final RestClient restClient;

    public PrepNotificationService(
            PrepProperties prepProperties,
            NotificationProperties notificationProperties,
            RestClient.Builder restClientBuilder) {
        this.prepProperties = prepProperties;
        this.notificationProperties = notificationProperties;
        this.restClient = restClientBuilder.build();
    }

    public void send(String body) {
        for (String part : WhatsAppMessageSplitter.split(body)) {
            dispatch(part);
        }
    }

    private void dispatch(String body) {
        if (prepProperties.isDryRun()) {
            log.info("DRY RUN — message would be sent via {}:\n{}", notificationProperties.getProvider(), body);
            return;
        }

        NotificationProvider provider = notificationProperties.getProvider();
        switch (provider) {
            case CONSOLE -> log.info("CONSOLE notification:\n{}", body);
            case TELEGRAM -> sendTelegram(body);
            case CALLMEBOT -> sendCallMeBot(body);
            case NTFY -> sendNtfy(body);
        }
    }

    private void sendTelegram(String body) {
        NotificationProperties.Telegram telegram = notificationProperties.getTelegram();
        if (!telegram.isConfigured()) {
            throw new IllegalStateException(
                    "Telegram not configured. Set notification.telegram.bot-token and chat-id (free via @BotFather).");
        }

        restClient.post()
                .uri("https://api.telegram.org/bot" + telegram.getBotToken() + "/sendMessage")
                .body(Map.of("chat_id", telegram.getChatId(), "text", body))
                .retrieve()
                .toBodilessEntity();

        log.info("Telegram message sent");
    }

    private void sendCallMeBot(String body) {
        NotificationProperties.CallMeBot callMeBot = notificationProperties.getCallmebot();
        if (!callMeBot.isConfigured()) {
            throw new IllegalStateException(
                    "CallMeBot not configured. Get free API key from https://www.callmebot.com/blog/free-api-whatsapp-messages/");
        }

        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.callmebot.com/whatsapp.php")
                .queryParam("phone", callMeBot.getPhone())
                .queryParam("text", body)
                .queryParam("apikey", callMeBot.getApiKey())
                .encode()
                .build()
                .toUriString();

        restClient.get().uri(url).retrieve().toBodilessEntity();
        log.info("CallMeBot WhatsApp message sent");
    }

    private void sendNtfy(String body) {
        NotificationProperties.Ntfy ntfy = notificationProperties.getNtfy();
        if (!ntfy.isConfigured()) {
            throw new IllegalStateException("ntfy not configured. Set notification.ntfy.topic (free app: ntfy.sh).");
        }

        String server = ntfy.getServer().endsWith("/")
                ? ntfy.getServer().substring(0, ntfy.getServer().length() - 1)
                : ntfy.getServer();

        restClient.post()
                .uri(server + "/" + URLEncoder.encode(ntfy.getTopic(), StandardCharsets.UTF_8))
                .header("Title", "Interview Prep")
                .header("Priority", "default")
                .body(body)
                .retrieve()
                .toBodilessEntity();

        log.info("ntfy message sent to topic {}", ntfy.getTopic());
    }
}
