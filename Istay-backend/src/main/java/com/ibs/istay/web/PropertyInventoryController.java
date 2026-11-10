package com.ibs.istay.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ibs.istay.domain.PropertyInventory;
import com.ibs.istay.inventory.InventoryRepository;
import com.ibs.istay.security.PropertyAccessGuard;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/** Read-only view of property catalog. */
@RestController
@RequestMapping("/api/properties")
@Tag(name = "Inventory")
public class PropertyInventoryController {

    private final InventoryRepository inventoryRepository;
    private final PropertyAccessGuard propertyAccessGuard;

    public PropertyInventoryController(
            InventoryRepository inventoryRepository,
            PropertyAccessGuard propertyAccessGuard
    ) {
        this.inventoryRepository = inventoryRepository;
        this.propertyAccessGuard = propertyAccessGuard;
    }

    @GetMapping("/{propertyId}/inventory")
    @Operation(summary = "Get property room-type catalog")
    public ResponseEntity<PropertyInventory> getInventory(@PathVariable String propertyId) {
        propertyAccessGuard.requireProperty(propertyId);
        return inventoryRepository.findByPropertyId(propertyId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
