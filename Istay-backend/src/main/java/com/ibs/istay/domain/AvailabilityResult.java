package com.ibs.istay.domain;

import java.time.LocalDate;
import java.util.List;

public record AvailabilityResult(
        String propertyId,
        String propertyName,
        LocalDate checkIn,
        LocalDate checkOut,
        int nights,
        List<AvailabilityOffer> offers
) {
}
