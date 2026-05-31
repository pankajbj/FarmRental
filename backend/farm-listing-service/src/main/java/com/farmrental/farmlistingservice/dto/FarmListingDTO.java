package com.farmrental.farmlistingservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.farmrental.farmlistingservice.entity.FarmListing;

import java.math.BigDecimal;

/**
 * FarmListingDTO
 * Data Transfer Object for farm listing operations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmListingDTO {

    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Owner ID is required")
    private String ownerId;

    @NotNull(message = "Price per month is required")
    @Positive(message = "Price must be positive")
    private BigDecimal pricePerMonth;

    @Positive(message = "Seasonal price must be positive")
    private BigDecimal pricePerSeason;

    @NotNull(message = "Acreage is required")
    @Positive(message = "Acreage must be positive")
    private Double acreage;

    @Positive(message = "Arable land must be positive")
    private Double totalArableLand;

    @NotNull(message = "Water source is required")
    private FarmListing.WaterSourceEnum waterSource;

    @Positive(message = "Electricity phases must be positive")
    private Integer electricityPhases;

    @NotNull(message = "Soil type is required")
    private FarmListing.SoilTypeEnum soilType;

    @Builder.Default
    private Boolean hasFencing = false;

    @Builder.Default
    private FarmListing.FarmStatusEnum status = FarmListing.FarmStatusEnum.PENDING;

    // Geospatial data as WKT format strings
    private String locationWKT;    // POINT(latitude longitude)
    private String boundaryWKT;    // POLYGON(())
    
    private Long createdDate;
}
