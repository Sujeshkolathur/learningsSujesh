package com.ibs.istay.availability;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Component;

import com.ibs.istay.web.error.InvalidStayException;

@Component
public class StayDateValidator {

    public static final int MAX_STAY_NIGHTS = 30;

    public int validateAndCountNights(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new InvalidStayException("checkIn and checkOut are required");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidStayException("checkOut must be after checkIn");
        }
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights > MAX_STAY_NIGHTS) {
            throw new InvalidStayException("Stay cannot exceed " + MAX_STAY_NIGHTS + " nights");
        }
        return (int) nights;
    }
}
