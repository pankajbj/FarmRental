package com.farmrental.kafkaevents.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event published when a new user registers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationEvent implements Serializable {
    private String userId;
    private String email;
    private String userType; // LANDLORD, TENANT, AGGREGATOR
    private String userName;
    private LocalDateTime registrationDate;
    private LocalDateTime eventTimestamp = LocalDateTime.now();
}
