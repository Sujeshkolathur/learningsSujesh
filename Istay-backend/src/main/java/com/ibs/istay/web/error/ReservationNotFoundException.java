package com.ibs.istay.web.error;

import java.util.UUID;

public class ReservationNotFoundException extends RuntimeException {

    public ReservationNotFoundException(String propertyId, UUID reservationId) {
        super("Reservation not found: " + reservationId + " for property " + propertyId);
    }
}
