package com.farmrental.kafkaevents.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event published when a farm listing is verified
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmListingVerifiedEvent implements Serializable {
    private String farmId;
    private String surveyorName;
    private String verificationNotes;
    private Boolean isApproved;
    private LocalDateTime verificationDate;
    private LocalDateTime eventTimestamp = LocalDateTime.now();
}
