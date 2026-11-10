package com.ibs.istay.reservation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.ibs.istay.availability.AvailabilityService;
import com.ibs.istay.domain.AvailabilityResult;
import com.ibs.istay.persistence.ReservationStatus;
import com.ibs.istay.support.PostgresIntegrationTest;
import com.ibs.istay.web.error.InsufficientAvailabilityException;
import com.ibs.istay.web.error.ReservationNotFoundException;

class ReservationServiceTest extends PostgresIntegrationTest {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private AvailabilityService availabilityService;

    @Test
    void createsReservationAndIsIdempotent() {
        LocalDate checkIn = LocalDate.of(2027, 1, 10);
        LocalDate checkOut = LocalDate.of(2027, 1, 12);
        CreateReservationRequest request = new CreateReservationRequest(
                "STD",
                checkIn,
                checkOut,
                "Grace Hopper",
                "grace@example.com"
        );

        ReservationResponse first = reservationService.create("DEMO-01", "idem-grace-1", request);
        ReservationResponse second = reservationService.create("DEMO-01", "idem-grace-1", request);

        assertThat(first.reservationId()).isEqualTo(second.reservationId());
        assertThat(first.status()).isEqualTo(ReservationStatus.CONFIRMED);
        assertThat(first.nights()).isEqualTo(2);
        assertThat(first.totalRate()).isEqualByComparingTo("240.00");
    }

    @Test
    void rejectsWhenSoldOut() {
        LocalDate checkIn = LocalDate.of(2027, 2, 1);
        LocalDate checkOut = LocalDate.of(2027, 2, 2);

        for (int i = 0; i < 5; i++) {
            reservationService.create(
                    "DEMO-01",
                    "sold-out-" + i,
                    new CreateReservationRequest("DLX", checkIn, checkOut, "Guest " + i, "g" + i + "@example.com")
            );
        }

        assertThatThrownBy(() -> reservationService.create(
                "DEMO-01",
                "sold-out-extra",
                new CreateReservationRequest("DLX", checkIn, checkOut, "Overflow", "overflow@example.com")
        )).isInstanceOf(InsufficientAvailabilityException.class);

        AvailabilityResult availability = availabilityService.search("DEMO-01", checkIn, checkOut);
        assertThat(availability.offers()).noneMatch(o -> "DLX".equals(o.roomTypeId()));
    }

    @Test
    void requiresIdempotencyKey() {
        CreateReservationRequest request = new CreateReservationRequest(
                "STD",
                LocalDate.of(2027, 3, 1),
                LocalDate.of(2027, 3, 2),
                "No Key",
                "nokey@example.com"
        );
        assertThatThrownBy(() -> reservationService.create("DEMO-01", "  ", request))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void cancelReleasesInventoryAndIsIdempotent() {
        LocalDate checkIn = LocalDate.of(2027, 5, 1);
        LocalDate checkOut = LocalDate.of(2027, 5, 3);

        ReservationResponse booked = reservationService.create(
                "DEMO-01",
                "cancel-flow-1",
                new CreateReservationRequest("STD", checkIn, checkOut, "Cancel Me", "cancel@example.com")
        );

        AvailabilityResult afterBook = availabilityService.search("DEMO-01", checkIn, checkOut);
        assertThat(afterBook.offers())
                .anySatisfy(o -> {
                    if ("STD".equals(o.roomTypeId())) {
                        assertThat(o.availableRooms()).isEqualTo(9);
                    }
                });

        ReservationResponse cancelled = reservationService.cancel("DEMO-01", booked.reservationId());
        assertThat(cancelled.status()).isEqualTo(ReservationStatus.CANCELLED);

        ReservationResponse cancelledAgain = reservationService.cancel("DEMO-01", booked.reservationId());
        assertThat(cancelledAgain.status()).isEqualTo(ReservationStatus.CANCELLED);

        AvailabilityResult afterCancel = availabilityService.search("DEMO-01", checkIn, checkOut);
        assertThat(afterCancel.offers())
                .anySatisfy(o -> {
                    if ("STD".equals(o.roomTypeId())) {
                        assertThat(o.availableRooms()).isEqualTo(10);
                    }
                });
    }

    @Test
    void cancelUnknownReservationReturnsNotFound() {
        UUID missing = UUID.fromString("00000000-0000-0000-0000-000000000099");
        assertThatThrownBy(() -> reservationService.cancel("DEMO-01", missing))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    @Test
    void listsReservationsNewestFirstAndFiltersByStatus() {
        LocalDate checkIn = LocalDate.of(2027, 9, 1);
        LocalDate checkOut = LocalDate.of(2027, 9, 2);

        ReservationResponse first = reservationService.create(
                "DEMO-01",
                "list-first",
                new CreateReservationRequest("STD", checkIn, checkOut, "List First", "list1@example.com")
        );
        ReservationResponse second = reservationService.create(
                "DEMO-01",
                "list-second",
                new CreateReservationRequest("STD", checkIn.plusDays(2), checkOut.plusDays(2), "List Second", "list2@example.com")
        );
        reservationService.cancel("DEMO-01", first.reservationId());

        ReservationListResponse all = reservationService.list("DEMO-01", null);
        assertThat(all.count()).isGreaterThanOrEqualTo(2);
        assertThat(all.reservations().get(0).reservationId()).isEqualTo(second.reservationId());
        assertThat(all.reservations())
                .extracting(ReservationResponse::reservationId)
                .contains(first.reservationId(), second.reservationId());

        ReservationListResponse confirmed = reservationService.list("DEMO-01", ReservationStatus.CONFIRMED);
        assertThat(confirmed.reservations())
                .extracting(ReservationResponse::reservationId)
                .contains(second.reservationId())
                .doesNotContain(first.reservationId());

        ReservationListResponse cancelled = reservationService.list("DEMO-01", ReservationStatus.CANCELLED);
        assertThat(cancelled.reservations())
                .extracting(ReservationResponse::reservationId)
                .contains(first.reservationId())
                .doesNotContain(second.reservationId());
    }
}
