package com.ibs.istay.web;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibs.istay.persistence.ReservationStatus;
import com.ibs.istay.reservation.CreateReservationRequest;
import com.ibs.istay.reservation.ReservationListResponse;
import com.ibs.istay.reservation.ReservationResponse;
import com.ibs.istay.reservation.ReservationService;
import com.ibs.istay.security.PropertyAccessGuard;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/properties")
@Validated
@Tag(name = "Reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final PropertyAccessGuard propertyAccessGuard;

    public ReservationController(
            ReservationService reservationService,
            PropertyAccessGuard propertyAccessGuard
    ) {
        this.reservationService = reservationService;
        this.propertyAccessGuard = propertyAccessGuard;
    }

    @GetMapping("/{propertyId}/reservations")
    @Operation(summary = "List reservations for a property")
    public ReservationListResponse list(
            @PathVariable String propertyId,
            @Parameter(description = "Optional filter: CONFIRMED or CANCELLED")
            @RequestParam(required = false) ReservationStatus status
    ) {
        propertyAccessGuard.requireProperty(propertyId);
        return reservationService.list(propertyId, status);
    }

    @PostMapping("/{propertyId}/reservations")
    @Operation(summary = "Create a reservation (holds inventory)")
    public ResponseEntity<ReservationResponse> create(
            @PathVariable String propertyId,
            @Parameter(description = "Client-generated key for safe retries", required = true)
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody CreateReservationRequest request
    ) {
        propertyAccessGuard.requireProperty(propertyId);
        ReservationResponse created = reservationService.create(propertyId, idempotencyKey, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{propertyId}/reservations/{reservationId}/cancel")
    @Operation(summary = "Cancel a reservation (releases inventory)")
    public ReservationResponse cancel(
            @PathVariable String propertyId,
            @PathVariable UUID reservationId
    ) {
        propertyAccessGuard.requireProperty(propertyId);
        return reservationService.cancel(propertyId, reservationId);
    }
}
