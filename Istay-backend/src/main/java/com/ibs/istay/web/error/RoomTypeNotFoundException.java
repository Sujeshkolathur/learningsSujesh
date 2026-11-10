package com.ibs.istay.web.error;

public class RoomTypeNotFoundException extends RuntimeException {

    public RoomTypeNotFoundException(String propertyId, String roomTypeId) {
        super("Room type not found: " + roomTypeId + " for property " + propertyId);
    }
}
