package com.farmrental.farmlistingservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * FarmListing Entity
 * Represents a farm property available for leasing with geospatial data
 */
@Entity
@Table(name = "farm_listings", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_owner_id", columnList = "owner_id"),
    @Index(name = "idx_created_date", columnList = "created_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmListing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Farm title cannot be blank")
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Owner ID is required")
    @Column(nullable = false)
    private String ownerId;

    @NotNull(message = "Price per month is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false)
    private BigDecimal pricePerMonth;

    @Positive(message = "Seasonal price must be positive")
    private BigDecimal pricePerSeason;

    @NotNull(message = "Acreage is required")
    @Positive(message = "Acreage must be positive")
    @Column(nullable = false)
    private Double acreage;

    @Positive(message = "Arable land must be positive")
    private Double totalArableLand;

    @NotNull(message = "Water source is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WaterSourceEnum waterSource;

    @Positive(message = "Electricity phases must be positive")
    private Integer electricityPhases;

    @NotNull(message = "Soil type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SoilTypeEnum soilType;

    @Column(nullable = false)
    private Boolean hasFencing = false;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FarmStatusEnum status = FarmStatusEnum.PENDING;

    // Geospatial Data
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location; // Latitude/Longitude of farmhouse

    @Column(columnDefinition = "geometry(Polygon,4326)")
    private Polygon boundary; // Farm boundary polygon

    // Audit fields
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "verification_status")
    @Enumerated(EnumType.STRING)
    private VerificationStatusEnum verificationStatus = VerificationStatusEnum.PENDING;

    // Enums
    public enum WaterSourceEnum {
        BOREWELL,
        CANAL,
        RAINFALL_DEPENDENT,
        RIVER,
        RESERVOIR
    }

    public enum SoilTypeEnum {
        BLACK_COTTON,
        ALLUVIAL,
        RED,
        SANDY,
        LATERITE,
        LOAMY
    }

    public enum FarmStatusEnum {
        PENDING,
        ACTIVE,
        LEASED,
        INACTIVE,
        ARCHIVED
    }

    public enum VerificationStatusEnum {
        PENDING,
        APPROVED,
        REJECTED,
        UNDER_REVIEW
    }
}
