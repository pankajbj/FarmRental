package com.farmrental.farmlistingservice.controller;

import com.farmrental.farmlistingservice.dto.FarmListingDTO;
import com.farmrental.farmlistingservice.entity.FarmListing;
import com.farmrental.farmlistingservice.service.FarmListingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * FarmListingController
 * REST API endpoints for farm listing management
 */
@RestController
@RequestMapping("/api/v1/farms")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FarmListingController {

    @Autowired
    private FarmListingService farmListingService;

    /**
     * Create a new farm listing
     */
    @PostMapping
    public ResponseEntity<FarmListingDTO> createFarmListing(@Valid @RequestBody FarmListingDTO farmListingDTO) {
        FarmListingDTO createdListing = farmListingService.createFarmListing(farmListingDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdListing);
    }

    /**
     * Get farm listing by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FarmListingDTO> getFarmListing(@PathVariable String id) {
        FarmListingDTO listing = farmListingService.getFarmById(id);
        return ResponseEntity.ok(listing);
    }

    /**
     * Get all active farm listings
     */
    @GetMapping("/status/active")
    public ResponseEntity<List<FarmListingDTO>> getActiveFarms() {
        List<FarmListingDTO> listings = farmListingService.getActiveFarms();
        return ResponseEntity.ok(listings);
    }

    /**
     * Search farms by acreage range
     */
    @GetMapping("/search/acreage")
    public ResponseEntity<List<FarmListingDTO>> searchByAcreage(
            @RequestParam Double minAcreage,
            @RequestParam Double maxAcreage) {
        List<FarmListingDTO> listings = farmListingService.searchByAcreage(minAcreage, maxAcreage);
        return ResponseEntity.ok(listings);
    }

    /**
     * Search farms by soil type
     */
    @GetMapping("/search/soil-type")
    public ResponseEntity<List<FarmListingDTO>> searchBySoilType(
            @RequestParam FarmListing.SoilTypeEnum soilType) {
        List<FarmListingDTO> listings = farmListingService.searchBySoilType(soilType);
        return ResponseEntity.ok(listings);
    }

    /**
     * Search farms by water source
     */
    @GetMapping("/search/water-source")
    public ResponseEntity<List<FarmListingDTO>> searchByWaterSource(
            @RequestParam FarmListing.WaterSourceEnum waterSource) {
        List<FarmListingDTO> listings = farmListingService.searchByWaterSource(waterSource);
        return ResponseEntity.ok(listings);
    }

    /**
     * Update farm listing
     */
    @PutMapping("/{id}")
    public ResponseEntity<FarmListingDTO> updateFarmListing(
            @PathVariable String id,
            @Valid @RequestBody FarmListingDTO farmListingDTO) {
        FarmListingDTO updatedListing = farmListingService.updateFarmListing(id, farmListingDTO);
        return ResponseEntity.ok(updatedListing);
    }

    /**
     * Delete farm listing
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarmListing(@PathVariable String id) {
        farmListingService.deleteFarmListing(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get farms by owner
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<FarmListingDTO>> getFarmsByOwner(@PathVariable String ownerId) {
        List<FarmListingDTO> listings = farmListingService.getFarmsByOwner(ownerId);
        return ResponseEntity.ok(listings);
    }
}
