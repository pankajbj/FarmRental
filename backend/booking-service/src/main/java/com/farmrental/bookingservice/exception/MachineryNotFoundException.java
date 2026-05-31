package com.farmrental.bookingservice.exception;

/**
 * Exception thrown when machinery is not found
 */
public class MachineryNotFoundException extends RuntimeException {
    public MachineryNotFoundException(String message) {
        super(message);
    }

    public MachineryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
