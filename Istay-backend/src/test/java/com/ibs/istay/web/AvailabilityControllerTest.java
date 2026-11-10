package com.ibs.istay.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import com.ibs.istay.support.AuthTestSupport;
import com.ibs.istay.support.PostgresIntegrationTest;

@AutoConfigureMockMvc
class AvailabilityControllerTest extends PostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthTestSupport auth;

    @Test
    void searchReturnsDemoOffers() throws Exception {
        mockMvc.perform(get("/api/properties/DEMO-01/availability")
                        .headers(auth.frontDeskDemoHeaders())
                        .param("checkIn", "2026-11-01")
                        .param("checkOut", "2026-11-03"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.propertyId").value("DEMO-01"))
                .andExpect(jsonPath("$.nights").value(2))
                .andExpect(jsonPath("$.offers.length()").value(2));
    }

    @Test
    void invalidDatesReturn400() throws Exception {
        mockMvc.perform(get("/api/properties/DEMO-01/availability")
                        .headers(auth.frontDeskDemoHeaders())
                        .param("checkIn", "2026-11-03")
                        .param("checkOut", "2026-11-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void unknownPropertyReturns404WhenTokenMatchesPath() throws Exception {
        mockMvc.perform(get("/api/properties/NOPE/availability")
                        .header(HttpHeaders.AUTHORIZATION, auth.bearer("x", "NOPE", "FRONT_DESK"))
                        .param("checkIn", "2026-11-01")
                        .param("checkOut", "2026-11-02"))
                .andExpect(status().isNotFound());
    }

    @Test
    void missingTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/properties/DEMO-01/availability")
                        .param("checkIn", "2026-11-01")
                        .param("checkOut", "2026-11-02"))
                .andExpect(status().isUnauthorized());
    }
}
