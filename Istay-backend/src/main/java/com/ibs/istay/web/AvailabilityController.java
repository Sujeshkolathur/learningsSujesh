package com.ibs.istay.web;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibs.istay.availability.AvailabilityService;
import com.ibs.istay.domain.AvailabilityResult;
import com.ibs.istay.security.PropertyAccessGuard;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/properties")
@Tag(name = "Availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;
    private final PropertyAccessGuard propertyAccessGuard;

    public AvailabilityController(
            AvailabilityService availabilityService,
            PropertyAccessGuard propertyAccessGuard
    ) {
        this.availabilityService = availabilityService;
        this.propertyAccessGuard = propertyAccessGuard;
    }

    @GetMapping("/{propertyId}/availability")
    @Operation(summary = "Search room availability for a stay")
    public AvailabilityResult search(
            @PathVariable String propertyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut
    ) {
        propertyAccessGuard.requireProperty(propertyId);
        return availabilityService.search(propertyId, checkIn, checkOut);
    }
}
