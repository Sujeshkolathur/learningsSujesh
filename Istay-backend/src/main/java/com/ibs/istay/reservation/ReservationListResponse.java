package com.ibs.istay.reservation;

import java.util.List;

public record ReservationListResponse(
        List<ReservationResponse> reservations,
        int count
) {
}
