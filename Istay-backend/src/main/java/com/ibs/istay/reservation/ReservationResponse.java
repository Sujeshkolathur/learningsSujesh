package com.ibs.istay.reservation;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.ibs.istay.persistence.ReservationStatus;

public record ReservationResponse(
        UUID reservationId,
        String propertyId,
        String roomTypeId,
        LocalDate checkIn,
        LocalDate checkOut,
        int nights,
        String guestName,
        String guestEmail,
        ReservationStatus status,
        BigDecimal nightlyRate,
        BigDecimal totalRate,
        Instant createdAt
) {
}
