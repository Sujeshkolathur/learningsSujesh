package com.ibs.istay.web.error;

public class PropertyNotFoundException extends RuntimeException {

    public PropertyNotFoundException(String propertyId) {
        super("Property not found: " + propertyId);
    }
}
