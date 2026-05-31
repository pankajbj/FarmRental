package com.farmrental.farmlistingservice.repository;

import com.farmrental.farmlistingservice.entity.FarmListing;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * FarmListingRepository
 * Data access layer for FarmListing entities with PostGIS support
 */
@Repository
public interface FarmListingRepository extends JpaRepository<FarmListing, String> {

    /**
     * Find all ACTIVE farms whose boundary polygons intersect with a given point
     * @param userLocation User's coordinate point
     * @return List of farms containing the user location
     */
    @Query(value = "SELECT fl.* FROM farm_listings fl " +
            "WHERE fl.status = 'ACTIVE' " +
            "AND ST_Intersects(fl.boundary, ST_Buffer(CAST(?1 AS geometry), 0.05)) " +
            "ORDER BY ST_Distance(fl.location, CAST(?1 AS geometry))", 
            nativeQuery = true)
    List<FarmListing> findActiveFarmsByLocation(@Param("location") Point userLocation);

    /**
     * Find all ACTIVE farms within a search radius
     * @param centerPoint Center coordinate
     * @param radiusKm Radius in kilometers
     * @return List of farms within radius
     */
    @Query(value = "SELECT fl.* FROM farm_listings fl " +
            "WHERE fl.status = 'ACTIVE' " +
            "AND ST_DWithin(fl.location, ST_GeomFromText(?1, 4326), ?2 * 1000) " +
            "ORDER BY ST_Distance(fl.location, ST_GeomFromText(?1, 4326))",
            nativeQuery = true)
    List<FarmListing> findActiveFarmsByRadius(@Param("center") String centerPoint, 
                                              @Param("radiusKm") Double radiusKm);

    /**
     * Find farms by status
     */
    List<FarmListing> findByStatus(FarmListing.FarmStatusEnum status);

    /**
     * Find farms by owner
     */
    List<FarmListing> findByOwnerId(String ownerId);

    /**
     * Find farms by acreage range
     */
    @Query("SELECT fl FROM FarmListing fl WHERE fl.acreage BETWEEN ?1 AND ?2 AND fl.status = 'ACTIVE'")
    List<FarmListing> findByAcreageRange(Double minAcreage, Double maxAcreage);

    /**
     * Find farms by soil type
     */
    List<FarmListing> findBySoilTypeAndStatus(FarmListing.SoilTypeEnum soilType, FarmListing.FarmStatusEnum status);

    /**
     * Find farms by water source
     */
    List<FarmListing> findByWaterSourceAndStatus(FarmListing.WaterSourceEnum waterSource, FarmListing.FarmStatusEnum status);

    /**
     * Find verified farms
     */
    List<FarmListing> findByVerificationStatus(FarmListing.VerificationStatusEnum status);
}
