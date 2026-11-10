package com.ibs.istay.inventory;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ibs.istay.domain.Property;
import com.ibs.istay.domain.PropertyInventory;
import com.ibs.istay.domain.RoomType;
import com.ibs.istay.persistence.PropertyJpaRepository;
import com.ibs.istay.persistence.RoomTypeEntity;
import com.ibs.istay.persistence.RoomTypeJpaRepository;

@Repository
public class JpaInventoryRepository implements InventoryRepository {

    private final PropertyJpaRepository propertyJpaRepository;
    private final RoomTypeJpaRepository roomTypeJpaRepository;

    public JpaInventoryRepository(
            PropertyJpaRepository propertyJpaRepository,
            RoomTypeJpaRepository roomTypeJpaRepository
    ) {
        this.propertyJpaRepository = propertyJpaRepository;
        this.roomTypeJpaRepository = roomTypeJpaRepository;
    }

    @Override
    public Optional<PropertyInventory> findByPropertyId(String propertyId) {
        return propertyJpaRepository.findById(propertyId).map(property -> {
            List<RoomType> roomTypes = roomTypeJpaRepository
                    .findByPropertyIdOrderByRoomTypeIdAsc(propertyId)
                    .stream()
                    .map(this::toDomain)
                    .toList();
            return new PropertyInventory(
                    new Property(property.getPropertyId(), property.getName()),
                    roomTypes
            );
        });
    }

    private RoomType toDomain(RoomTypeEntity entity) {
        return new RoomType(
                entity.getRoomTypeId(),
                entity.getPropertyId(),
                entity.getName(),
                entity.getTotalRooms(),
                entity.getNightlyRate()
        );
    }
}
