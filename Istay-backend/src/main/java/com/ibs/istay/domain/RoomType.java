package com.ibs.istay.domain;

import java.math.BigDecimal;

/**
 * Sellable room category for a property.
 * {@code totalRooms} is the physical inventory count for this type.
 * Availability for a stay = totalRooms minus bookings for each night (added later).
 */
public record RoomType(
        String roomTypeId,
        String propertyId,
        String name,
        int totalRooms,
        BigDecimal nightlyRate
) {
}
