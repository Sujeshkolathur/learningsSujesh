package com.sujesh.prep.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "notification")
public class NotificationProperties {

    private NotificationProvider provider = NotificationProvider.CONSOLE;
    private final Telegram telegram = new Telegram();
    private final CallMeBot callmebot = new CallMeBot();
    private final Ntfy ntfy = new Ntfy();

    public NotificationProvider getProvider() {
        return provider;
    }

    public void setProvider(NotificationProvider provider) {
        this.provider = provider;
    }

    public Telegram getTelegram() {
        return telegram;
    }

    public CallMeBot getCallmebot() {
        return callmebot;
    }

    public Ntfy getNtfy() {
        return ntfy;
    }

    public static class Telegram {
        private String botToken = "";
        private String chatId = "";

        public boolean isConfigured() {
            return botToken != null && !botToken.isBlank()
                    && chatId != null && !chatId.isBlank();
        }

        public String getBotToken() {
            return botToken;
        }

        public void setBotToken(String botToken) {
            this.botToken = botToken;
        }

        public String getChatId() {
            return chatId;
        }

        public void setChatId(String chatId) {
            this.chatId = chatId;
        }
    }

    public static class CallMeBot {
        private String phone = "";
        private String apiKey = "";

        public boolean isConfigured() {
            return phone != null && !phone.isBlank()
                    && apiKey != null && !apiKey.isBlank();
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }
    }

    public static class Ntfy {
        private String server = "https://ntfy.sh";
        private String topic = "";

        public boolean isConfigured() {
            return topic != null && !topic.isBlank();
        }

        public String getServer() {
            return server;
        }

        public void setServer(String server) {
            this.server = server;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }
    }
}
