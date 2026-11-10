package com.ibs.istay.web.error;

public class InsufficientAvailabilityException extends RuntimeException {

    public InsufficientAvailabilityException(String message) {
        super(message);
    }
}
