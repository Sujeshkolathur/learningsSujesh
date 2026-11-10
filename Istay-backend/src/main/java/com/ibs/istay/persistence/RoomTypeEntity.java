package com.ibs.istay.persistence;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "room_type")
public class RoomTypeEntity {

    @Id
    @Column(name = "room_type_id", nullable = false, length = 64)
    private String roomTypeId;

    @Column(name = "property_id", nullable = false, length = 64)
    private String propertyId;

    @Column(nullable = false)
    private String name;

    @Column(name = "total_rooms", nullable = false)
    private int totalRooms;

    @Column(name = "nightly_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal nightlyRate;

    protected RoomTypeEntity() {
    }

    public String getRoomTypeId() {
        return roomTypeId;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public String getName() {
        return name;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public BigDecimal getNightlyRate() {
        return nightlyRate;
    }
}
