package com.ibs.istay.availability;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.ibs.istay.domain.AvailabilityResult;
import com.ibs.istay.reservation.CreateReservationRequest;
import com.ibs.istay.reservation.ReservationService;
import com.ibs.istay.support.PostgresIntegrationTest;
import com.ibs.istay.web.error.PropertyNotFoundException;

class AvailabilityServiceTest extends PostgresIntegrationTest {

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private ReservationService reservationService;

    @Test
    void returnsOffersWithTotalRate() {
        AvailabilityResult result = availabilityService.search(
                "DEMO-01",
                LocalDate.of(2026, 11, 1),
                LocalDate.of(2026, 11, 3)
        );

        assertThat(result.nights()).isEqualTo(2);
        assertThat(result.propertyName()).isEqualTo("Demo Resort");
        assertThat(result.offers()).hasSize(2);
        assertThat(result.offers())
                .anySatisfy(o -> {
                    if ("STD".equals(o.roomTypeId())) {
                        assertThat(o.availableRooms()).isEqualTo(10);
                        assertThat(o.totalRate()).isEqualByComparingTo("240.00");
                    }
                });
    }

    @Test
    void availabilityDropsAfterReservation() {
        LocalDate checkIn = LocalDate.of(2026, 12, 1);
        LocalDate checkOut = LocalDate.of(2026, 12, 3);

        reservationService.create(
                "DEMO-01",
                "avail-drop-key-1",
                new CreateReservationRequest("DLX", checkIn, checkOut, "Ada Lovelace", "ada@example.com")
        );

        AvailabilityResult result = availabilityService.search("DEMO-01", checkIn, checkOut);
        assertThat(result.offers())
                .anySatisfy(o -> {
                    if ("DLX".equals(o.roomTypeId())) {
                        assertThat(o.availableRooms()).isEqualTo(4);
                    }
                });
    }

    @Test
    void unknownPropertyReturnsNotFound() {
        LocalDate checkIn = LocalDate.of(2026, 11, 1);
        LocalDate checkOut = LocalDate.of(2026, 11, 2);
        assertThatThrownBy(() -> availabilityService.search("UNKNOWN", checkIn, checkOut))
                .isInstanceOf(PropertyNotFoundException.class);
    }
}
