package com.farmrental.kafkaevents.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Event published when a farm is leased
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmLeasedEvent implements Serializable {
    private String farmId;
    private String lesseId;
    private String ownerId;
    private LocalDateTime leaseStartDate;
    private LocalDateTime leaseEndDate;
    private BigDecimal leaseAmount;
    private String cropSeason;
    private LocalDateTime eventTimestamp = LocalDateTime.now();
}
