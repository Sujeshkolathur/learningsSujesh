package com.ibs.istay.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface RoomTypeJpaRepository extends JpaRepository<RoomTypeEntity, String> {

    List<RoomTypeEntity> findByPropertyIdOrderByRoomTypeIdAsc(String propertyId);

    Optional<RoomTypeEntity> findByPropertyIdAndRoomTypeId(String propertyId, String roomTypeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from RoomTypeEntity r where r.propertyId = :propertyId and r.roomTypeId = :roomTypeId")
    Optional<RoomTypeEntity> findForUpdate(
            @Param("propertyId") String propertyId,
            @Param("roomTypeId") String roomTypeId
    );
}
