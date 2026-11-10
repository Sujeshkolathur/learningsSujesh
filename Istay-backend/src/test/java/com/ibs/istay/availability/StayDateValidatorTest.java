package com.ibs.istay.availability;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.ibs.istay.web.error.InvalidStayException;

class StayDateValidatorTest {

    private StayDateValidator validator;

    @BeforeEach
    void setUp() {
        validator = new StayDateValidator();
    }

    @Test
    void countsNightsForValidStay() {
        assertThat(validator.validateAndCountNights(
                LocalDate.of(2026, 11, 1),
                LocalDate.of(2026, 11, 3)
        )).isEqualTo(2);
    }

    @Test
    void rejectsCheckoutNotAfterCheckIn() {
        LocalDate checkIn = LocalDate.of(2026, 11, 1);
        LocalDate checkOut = LocalDate.of(2026, 11, 1);
        assertThatThrownBy(() -> validator.validateAndCountNights(checkIn, checkOut))
                .isInstanceOf(InvalidStayException.class)
                .hasMessageContaining("checkOut must be after checkIn");
    }

    @Test
    void rejectsStayLongerThanMax() {
        LocalDate checkIn = LocalDate.of(2026, 11, 1);
        LocalDate checkOut = checkIn.plusDays(StayDateValidator.MAX_STAY_NIGHTS + 1);
        assertThatThrownBy(() -> validator.validateAndCountNights(checkIn, checkOut))
                .isInstanceOf(InvalidStayException.class)
                .hasMessageContaining("cannot exceed");
    }
}
