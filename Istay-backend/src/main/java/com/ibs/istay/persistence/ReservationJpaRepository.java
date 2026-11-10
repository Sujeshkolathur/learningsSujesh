package com.ibs.istay.persistence;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationJpaRepository extends JpaRepository<ReservationEntity, UUID> {

    Optional<ReservationEntity> findByIdempotencyKey(String idempotencyKey);

    Optional<ReservationEntity> findByIdAndPropertyId(UUID id, String propertyId);

    List<ReservationEntity> findByPropertyIdOrderByCreatedAtDesc(String propertyId);

    List<ReservationEntity> findByPropertyIdAndStatusOrderByCreatedAtDesc(
            String propertyId,
            ReservationStatus status
    );

    @Query("""
            select coalesce(sum(r.rooms), 0) from ReservationEntity r
            where r.propertyId = :propertyId
              and r.roomTypeId = :roomTypeId
              and r.status = com.ibs.istay.persistence.ReservationStatus.CONFIRMED
              and r.checkIn <= :night
              and r.checkOut > :night
            """)
    long countRoomsHeldOnNight(
            @Param("propertyId") String propertyId,
            @Param("roomTypeId") String roomTypeId,
            @Param("night") LocalDate night
    );
}
