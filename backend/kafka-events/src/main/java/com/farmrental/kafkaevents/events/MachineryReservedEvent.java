package com.farmrental.kafkaevents.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Event published when machinery is reserved
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineryReservedEvent implements Serializable {
    private String machineryId;
    private String machineryName;
    private String reservedBy;
    private LocalDateTime reservationStartDate;
    private LocalDateTime reservationEndDate;
    private BigDecimal dailyRate;
    private LocalDateTime eventTimestamp = LocalDateTime.now();
}
