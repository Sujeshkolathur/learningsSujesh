package com.ibs.istay.persistence;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservation")
public class ReservationEntity {

    @Id
    private UUID id;

    @Column(name = "property_id", nullable = false, length = 64)
    private String propertyId;

    @Column(name = "room_type_id", nullable = false, length = 64)
    private String roomTypeId;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(name = "guest_name", nullable = false)
    private String guestName;

    @Column(name = "guest_email", nullable = false)
    private String guestEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ReservationStatus status;

    @Column(nullable = false)
    private int rooms;

    @Column(name = "nightly_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal nightlyRate;

    @Column(name = "total_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalRate;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 128)
    private String idempotencyKey;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected ReservationEntity() {
    }

    public ReservationEntity(
            UUID id,
            String propertyId,
            String roomTypeId,
            LocalDate checkIn,
            LocalDate checkOut,
            String guestName,
            String guestEmail,
            ReservationStatus status,
            int rooms,
            BigDecimal nightlyRate,
            BigDecimal totalRate,
            String idempotencyKey,
            Instant createdAt
    ) {
        this.id = id;
        this.propertyId = propertyId;
        this.roomTypeId = roomTypeId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.status = status;
        this.rooms = rooms;
        this.nightlyRate = nightlyRate;
        this.totalRate = totalRate;
        this.idempotencyKey = idempotencyKey;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public String getRoomTypeId() {
        return roomTypeId;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public String getGuestName() {
        return guestName;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
    }

    public int getRooms() {
        return rooms;
    }

    public BigDecimal getNightlyRate() {
        return nightlyRate;
    }

    public BigDecimal getTotalRate() {
        return totalRate;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
