package com.ibs.istay.web.error;

public class InvalidStayException extends RuntimeException {

    public InvalidStayException(String message) {
        super(message);
    }
}
