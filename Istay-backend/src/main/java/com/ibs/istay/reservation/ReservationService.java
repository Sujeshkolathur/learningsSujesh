package com.ibs.istay.reservation;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ibs.istay.availability.AvailabilityService;
import com.ibs.istay.availability.StayDateValidator;
import com.ibs.istay.domain.RoomType;
import com.ibs.istay.persistence.ReservationEntity;
import com.ibs.istay.persistence.ReservationJpaRepository;
import com.ibs.istay.persistence.ReservationStatus;
import com.ibs.istay.persistence.RoomTypeEntity;
import com.ibs.istay.persistence.RoomTypeJpaRepository;
import com.ibs.istay.inventory.InventoryRepository;
import com.ibs.istay.web.error.InsufficientAvailabilityException;
import com.ibs.istay.web.error.PropertyNotFoundException;
import com.ibs.istay.web.error.ReservationNotFoundException;
import com.ibs.istay.web.error.RoomTypeNotFoundException;

@Service
public class ReservationService {

    private final InventoryRepository inventoryRepository;
    private final RoomTypeJpaRepository roomTypeJpaRepository;
    private final ReservationJpaRepository reservationJpaRepository;
    private final StayDateValidator stayDateValidator;
    private final AvailabilityService availabilityService;

    public ReservationService(
            InventoryRepository inventoryRepository,
            RoomTypeJpaRepository roomTypeJpaRepository,
            ReservationJpaRepository reservationJpaRepository,
            StayDateValidator stayDateValidator,
            AvailabilityService availabilityService
    ) {
        this.inventoryRepository = inventoryRepository;
        this.roomTypeJpaRepository = roomTypeJpaRepository;
        this.reservationJpaRepository = reservationJpaRepository;
        this.stayDateValidator = stayDateValidator;
        this.availabilityService = availabilityService;
    }

    @Transactional
    public ReservationResponse create(String propertyId, String idempotencyKey, CreateReservationRequest request) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new IllegalArgumentException("Idempotency-Key header is required");
        }

        return reservationJpaRepository.findByIdempotencyKey(idempotencyKey)
                .map(this::toResponse)
                .orElseGet(() -> createNew(propertyId, idempotencyKey.trim(), request));
    }

    private ReservationResponse createNew(String propertyId, String idempotencyKey, CreateReservationRequest request) {
        inventoryRepository.findByPropertyId(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId));

        int nights = stayDateValidator.validateAndCountNights(request.checkIn(), request.checkOut());

        RoomTypeEntity roomTypeEntity = roomTypeJpaRepository
                .findForUpdate(propertyId, request.roomTypeId())
                .orElseThrow(() -> new RoomTypeNotFoundException(propertyId, request.roomTypeId()));

        RoomType roomType = new RoomType(
                roomTypeEntity.getRoomTypeId(),
                roomTypeEntity.getPropertyId(),
                roomTypeEntity.getName(),
                roomTypeEntity.getTotalRooms(),
                roomTypeEntity.getNightlyRate()
        );

        int available = availabilityService.roomsAvailableForStay(
                propertyId,
                roomType,
                request.checkIn(),
                nights
        );
        if (available < 1) {
            throw new InsufficientAvailabilityException(
                    "No availability for room type " + request.roomTypeId() + " on selected dates"
            );
        }

        BigDecimal totalRate = roomType.nightlyRate().multiply(BigDecimal.valueOf(nights));
        ReservationEntity saved = reservationJpaRepository.save(new ReservationEntity(
                UUID.randomUUID(),
                propertyId,
                roomType.roomTypeId(),
                request.checkIn(),
                request.checkOut(),
                request.guestName().trim(),
                request.guestEmail().trim().toLowerCase(),
                ReservationStatus.CONFIRMED,
                1,
                roomType.nightlyRate(),
                totalRate,
                idempotencyKey,
                Instant.now()
        ));
        return toResponse(saved);
    }

    /**
     * Cancels a confirmed reservation, releasing inventory holds.
     * Already-cancelled reservations are returned as-is (idempotent).
     */
    @Transactional
    public ReservationResponse cancel(String propertyId, UUID reservationId) {
        ReservationEntity reservation = reservationJpaRepository
                .findByIdAndPropertyId(reservationId, propertyId)
                .orElseThrow(() -> new ReservationNotFoundException(propertyId, reservationId));

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            reservation.cancel();
        }
        return toResponse(reservation);
    }

    @Transactional(readOnly = true)
    public ReservationListResponse list(String propertyId, ReservationStatus status) {
        inventoryRepository.findByPropertyId(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId));

        List<ReservationEntity> entities = status == null
                ? reservationJpaRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId)
                : reservationJpaRepository.findByPropertyIdAndStatusOrderByCreatedAtDesc(propertyId, status);

        List<ReservationResponse> reservations = entities.stream()
                .map(this::toResponse)
                .toList();
        return new ReservationListResponse(reservations, reservations.size());
    }

    private ReservationResponse toResponse(ReservationEntity entity) {
        int nights = (int) ChronoUnit.DAYS.between(entity.getCheckIn(), entity.getCheckOut());
        return new ReservationResponse(
                entity.getId(),
                entity.getPropertyId(),
                entity.getRoomTypeId(),
                entity.getCheckIn(),
                entity.getCheckOut(),
                nights,
                entity.getGuestName(),
                entity.getGuestEmail(),
                entity.getStatus(),
                entity.getNightlyRate(),
                entity.getTotalRate(),
                entity.getCreatedAt()
        );
    }
}
