package com.ibs.istay.domain;

import java.math.BigDecimal;

public record AvailabilityOffer(
        String roomTypeId,
        String roomTypeName,
        int availableRooms,
        BigDecimal nightlyRate,
        BigDecimal totalRate
) {
}
