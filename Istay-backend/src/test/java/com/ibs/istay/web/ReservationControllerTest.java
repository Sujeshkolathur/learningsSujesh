package com.ibs.istay.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibs.istay.support.AuthTestSupport;
import com.ibs.istay.support.PostgresIntegrationTest;

@AutoConfigureMockMvc
class ReservationControllerTest extends PostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthTestSupport auth;

    @Test
    void createReservationReturns201() throws Exception {
        String body = """
                {
                  "roomTypeId": "STD",
                  "checkIn": "2027-04-01",
                  "checkOut": "2027-04-03",
                  "guestName": "Alan Turing",
                  "guestEmail": "alan@example.com"
                }
                """;

        mockMvc.perform(post("/api/properties/DEMO-01/reservations")
                        .headers(auth.frontDeskDemoHeaders())
                        .header("Idempotency-Key", "http-alan-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reservationId").exists())
                .andExpect(jsonPath("$.roomTypeId").value("STD"))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void missingIdempotencyKeyReturns400() throws Exception {
        String body = """
                {
                  "roomTypeId": "STD",
                  "checkIn": "2027-04-10",
                  "checkOut": "2027-04-11",
                  "guestName": "No Header",
                  "guestEmail": "noheader@example.com"
                }
                """;

        mockMvc.perform(post("/api/properties/DEMO-01/reservations")
                        .headers(auth.frontDeskDemoHeaders())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void revenueCannotCreateReservation() throws Exception {
        String body = """
                {
                  "roomTypeId": "STD",
                  "checkIn": "2027-07-01",
                  "checkOut": "2027-07-02",
                  "guestName": "Revenue User",
                  "guestEmail": "rev@example.com"
                }
                """;

        mockMvc.perform(post("/api/properties/DEMO-01/reservations")
                        .headers(auth.revenueDemoHeaders())
                        .header("Idempotency-Key", "rev-denied-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void wrongPropertyTokenReturns403() throws Exception {
        String body = """
                {
                  "roomTypeId": "STD",
                  "checkIn": "2027-08-01",
                  "checkOut": "2027-08-02",
                  "guestName": "Wrong Prop",
                  "guestEmail": "wrong@example.com"
                }
                """;

        mockMvc.perform(post("/api/properties/DEMO-01/reservations")
                        .headers(auth.otherPropertyFrontDeskHeaders())
                        .header("Idempotency-Key", "wrong-prop-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void cancelReservationReturnsCancelled() throws Exception {
        String body = """
                {
                  "roomTypeId": "STD",
                  "checkIn": "2027-06-01",
                  "checkOut": "2027-06-02",
                  "guestName": "Cancel Via Http",
                  "guestEmail": "cancel-http@example.com"
                }
                """;

        String createJson = mockMvc.perform(post("/api/properties/DEMO-01/reservations")
                        .headers(auth.frontDeskDemoHeaders())
                        .header("Idempotency-Key", "http-cancel-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode created = objectMapper.readTree(createJson);
        String reservationId = created.get("reservationId").asText();

        mockMvc.perform(post("/api/properties/DEMO-01/reservations/" + reservationId + "/cancel")
                        .headers(auth.frontDeskDemoHeaders()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"))
                .andExpect(jsonPath("$.reservationId").value(reservationId));
    }

    @Test
    void missingTokenReturns401() throws Exception {
        mockMvc.perform(post("/api/properties/DEMO-01/reservations")
                        .header("Idempotency-Key", "no-auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void listReservationsReturnsItemsForRevenue() throws Exception {
        String body = """
                {
                  "roomTypeId": "STD",
                  "checkIn": "2027-10-01",
                  "checkOut": "2027-10-02",
                  "guestName": "List Via Http",
                  "guestEmail": "list-http@example.com"
                }
                """;

        String createJson = mockMvc.perform(post("/api/properties/DEMO-01/reservations")
                        .headers(auth.frontDeskDemoHeaders())
                        .header("Idempotency-Key", "http-list-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String reservationId = objectMapper.readTree(createJson).get("reservationId").asText();

        mockMvc.perform(get("/api/properties/DEMO-01/reservations")
                        .headers(auth.revenueDemoHeaders()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").isNumber())
                .andExpect(jsonPath("$.reservations[?(@.reservationId == '%s')]", reservationId).exists());

        mockMvc.perform(get("/api/properties/DEMO-01/reservations")
                        .param("status", "CONFIRMED")
                        .headers(auth.frontDeskDemoHeaders()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservations[?(@.reservationId == '%s')]", reservationId).exists());
    }

    @Test
    void listWrongPropertyReturns403() throws Exception {
        mockMvc.perform(get("/api/properties/DEMO-01/reservations")
                        .headers(auth.otherPropertyFrontDeskHeaders()))
                .andExpect(status().isForbidden());
    }
}
