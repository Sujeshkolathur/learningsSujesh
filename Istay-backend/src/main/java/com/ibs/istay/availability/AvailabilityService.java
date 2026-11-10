package com.ibs.istay.availability;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ibs.istay.domain.AvailabilityOffer;
import com.ibs.istay.domain.AvailabilityResult;
import com.ibs.istay.domain.PropertyInventory;
import com.ibs.istay.domain.RoomType;
import com.ibs.istay.inventory.InventoryRepository;
import com.ibs.istay.persistence.ReservationJpaRepository;
import com.ibs.istay.web.error.PropertyNotFoundException;

/**
 * Available rooms for a room type = min(rooms left on each night of the stay).
 * Rooms left on a night = totalRooms - confirmed reservation holds for that night.
 */
@Service
public class AvailabilityService {

    private final InventoryRepository inventoryRepository;
    private final ReservationJpaRepository reservationJpaRepository;
    private final StayDateValidator stayDateValidator;

    public AvailabilityService(
            InventoryRepository inventoryRepository,
            ReservationJpaRepository reservationJpaRepository,
            StayDateValidator stayDateValidator
    ) {
        this.inventoryRepository = inventoryRepository;
        this.reservationJpaRepository = reservationJpaRepository;
        this.stayDateValidator = stayDateValidator;
    }

    @Transactional(readOnly = true)
    public AvailabilityResult search(String propertyId, LocalDate checkIn, LocalDate checkOut) {
        int nights = stayDateValidator.validateAndCountNights(checkIn, checkOut);

        PropertyInventory inventory = inventoryRepository.findByPropertyId(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId));

        List<AvailabilityOffer> offers = new ArrayList<>();
        for (RoomType roomType : inventory.roomTypes()) {
            int availableRooms = roomsAvailableForStay(propertyId, roomType, checkIn, nights);
            if (availableRooms <= 0) {
                continue;
            }
            BigDecimal totalRate = roomType.nightlyRate().multiply(BigDecimal.valueOf(nights));
            offers.add(new AvailabilityOffer(
                    roomType.roomTypeId(),
                    roomType.name(),
                    availableRooms,
                    roomType.nightlyRate(),
                    totalRate
            ));
        }

        return new AvailabilityResult(
                inventory.property().propertyId(),
                inventory.property().name(),
                checkIn,
                checkOut,
                nights,
                List.copyOf(offers)
        );
    }

    public int roomsAvailableForStay(String propertyId, RoomType roomType, LocalDate checkIn, int nights) {
        int minAcrossNights = roomType.totalRooms();
        for (int i = 0; i < nights; i++) {
            LocalDate night = checkIn.plusDays(i);
            long held = reservationJpaRepository.countRoomsHeldOnNight(
                    propertyId,
                    roomType.roomTypeId(),
                    night
            );
            int leftTonight = roomType.totalRooms() - (int) held;
            minAcrossNights = Math.min(minAcrossNights, leftTonight);
        }
        return Math.max(minAcrossNights, 0);
    }
}
