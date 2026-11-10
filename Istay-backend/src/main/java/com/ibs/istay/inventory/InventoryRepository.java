package com.ibs.istay.inventory;

import java.util.Optional;

import com.ibs.istay.domain.PropertyInventory;

public interface InventoryRepository {

    Optional<PropertyInventory> findByPropertyId(String propertyId);
}
