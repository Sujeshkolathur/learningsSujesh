package com.ibs.istay.domain;

import java.util.List;

/** Seeded catalog for one property: master data + room types. */
public record PropertyInventory(
        Property property,
        List<RoomType> roomTypes
) {
}
