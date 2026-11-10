package com.sujesh.prep.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "prep")
public class PrepProperties {

    @NotBlank
    private String candidateName = "Sujesh K R";

    @NotBlank
    private String targetRole = "Senior Java Developer";

    @NotBlank
    private String timezone = "Asia/Kolkata";

    private boolean dryRun = true;

    private String apiSecret = "";

    private final Schedule schedule = new Schedule();
    private final JobPortals jobPortals = new JobPortals();

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean isDryRun() {
        return dryRun;
    }

    public void setDryRun(boolean dryRun) {
        this.dryRun = dryRun;
    }

    public String getApiSecret() {
        return apiSecret;
    }

    public void setApiSecret(String apiSecret) {
        this.apiSecret = apiSecret;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public JobPortals getJobPortals() {
        return jobPortals;
    }

    public static class Schedule {
        private boolean internalEnabled = true;
        private String morningCron = "0 0 7 * * *";
        private String eveningCron = "0 0 20 * * *";
        private String hourlyCron = "0 0 * * * *";
        private boolean hourlyEnabled = true;
        private int hourlyActiveFrom = 7;
        private int hourlyActiveTo = 22;

        public boolean isInternalEnabled() {
            return internalEnabled;
        }

        public void setInternalEnabled(boolean internalEnabled) {
            this.internalEnabled = internalEnabled;
        }

        public String getMorningCron() {
            return morningCron;
        }

        public void setMorningCron(String morningCron) {
            this.morningCron = morningCron;
        }

        public String getEveningCron() {
            return eveningCron;
        }

        public void setEveningCron(String eveningCron) {
            this.eveningCron = eveningCron;
        }

        public String getHourlyCron() {
            return hourlyCron;
        }

        public void setHourlyCron(String hourlyCron) {
            this.hourlyCron = hourlyCron;
        }

        public boolean isHourlyEnabled() {
            return hourlyEnabled;
        }

        public void setHourlyEnabled(boolean hourlyEnabled) {
            this.hourlyEnabled = hourlyEnabled;
        }

        public int getHourlyActiveFrom() {
            return hourlyActiveFrom;
        }

        public void setHourlyActiveFrom(int hourlyActiveFrom) {
            this.hourlyActiveFrom = hourlyActiveFrom;
        }

        public int getHourlyActiveTo() {
            return hourlyActiveTo;
        }

        public void setHourlyActiveTo(int hourlyActiveTo) {
            this.hourlyActiveTo = hourlyActiveTo;
        }
    }

    public static class JobPortals {
        private String naukri = "https://www.naukri.com/";
        private String naukriGulf = "https://www.naukrigulf.com/";
        private String linkedin = "https://www.linkedin.com/jobs/";

        public String getNaukri() {
            return naukri;
        }

        public void setNaukri(String naukri) {
            this.naukri = naukri;
        }

        public String getNaukriGulf() {
            return naukriGulf;
        }

        public void setNaukriGulf(String naukriGulf) {
            this.naukriGulf = naukriGulf;
        }

        public String getLinkedin() {
            return linkedin;
        }

        public void setLinkedin(String linkedin) {
            this.linkedin = linkedin;
        }
    }
}
