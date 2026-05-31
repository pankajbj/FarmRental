package com.farmrental.bookingservice.exception;

/**
 * Exception thrown when lease period is invalid
 */
public class InvalidLeasePeriodException extends RuntimeException {
    public InvalidLeasePeriodException(String message) {
        super(message);
    }

    public InvalidLeasePeriodException(String message, Throwable cause) {
        super(message, cause);
    }
}
