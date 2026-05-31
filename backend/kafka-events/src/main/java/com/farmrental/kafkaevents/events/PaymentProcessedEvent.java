package com.farmrental.kafkaevents.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Event published when a payment is processed
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentProcessedEvent implements Serializable {
    private String paymentId;
    private String transactionType; // LEASE_DEPOSIT, MONTHLY_RENT, MACHINERY_RENTAL
    private BigDecimal amount;
    private String status; // SUCCESS, FAILED, PENDING
    private LocalDateTime paymentDate;
    private String referenceId;
    private LocalDateTime eventTimestamp = LocalDateTime.now();
}
