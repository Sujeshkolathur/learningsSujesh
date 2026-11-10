package com.ibs.istay.inventory;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.ibs.istay.domain.PropertyInventory;
import com.ibs.istay.domain.RoomType;
import com.ibs.istay.support.PostgresIntegrationTest;

class InventorySeedTest extends PostgresIntegrationTest {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Test
    void demoResortIsSeededWithStandardAndDeluxe() {
        PropertyInventory inventory = inventoryRepository.findByPropertyId("DEMO-01")
                .orElseThrow();

        assertThat(inventory.property().name()).isEqualTo("Demo Resort");
        assertThat(inventory.roomTypes()).hasSize(2);

        RoomType standard = inventory.roomTypes().stream()
                .filter(rt -> "STD".equals(rt.roomTypeId()))
                .findFirst()
                .orElseThrow();
        assertThat(standard.totalRooms()).isEqualTo(10);
        assertThat(standard.nightlyRate()).isEqualByComparingTo(new BigDecimal("120.00"));

        RoomType deluxe = inventory.roomTypes().stream()
                .filter(rt -> "DLX".equals(rt.roomTypeId()))
                .findFirst()
                .orElseThrow();
        assertThat(deluxe.totalRooms()).isEqualTo(5);
        assertThat(deluxe.nightlyRate()).isEqualByComparingTo(new BigDecimal("180.00"));
    }
}
