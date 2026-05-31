package com.farmrental.farmlistingservice.service;

import com.farmrental.farmlistingservice.entity.FarmListing;
import com.farmrental.farmlistingservice.repository.FarmListingRepository;
import com.farmrental.farmlistingservice.dto.FarmListingDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FarmListingService {

    private final FarmListingRepository farmListingRepository;

    /**
     * Get all active farms
     */
    public List<FarmListingDTO> getActiveFarms() {
        return farmListingRepository.findByStatus(FarmListing.FarmStatusEnum.ACTIVE)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get a farm by ID
     */
    public FarmListingDTO getFarmById(String id) {
        return farmListingRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Farm not found with id: " + id));
    }

    /**
     * Search farms by acreage range
     */
    public List<FarmListingDTO> searchByAcreage(Double minAcreage, Double maxAcreage) {
        return farmListingRepository.findByAcreageRange(minAcreage, maxAcreage)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Search farms by soil type
     */
    public List<FarmListingDTO> searchBySoilType(FarmListing.SoilTypeEnum soilType) {
        return farmListingRepository.findBySoilTypeAndStatus(soilType, FarmListing.FarmStatusEnum.ACTIVE)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Search farms by water source
     */
    public List<FarmListingDTO> searchByWaterSource(FarmListing.WaterSourceEnum waterSource) {
        return farmListingRepository.findByWaterSourceAndStatus(waterSource, FarmListing.FarmStatusEnum.ACTIVE)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Create a new farm listing
     */
    public FarmListingDTO createFarmListing(FarmListingDTO dto) {
        FarmListing farmListing = new FarmListing();
        farmListing.setTitle(dto.getTitle());
        farmListing.setDescription(dto.getDescription());
        farmListing.setAcreage(dto.getAcreage());
        farmListing.setSoilType(dto.getSoilType());
        farmListing.setWaterSource(dto.getWaterSource());
        farmListing.setPricePerMonth(dto.getPricePerMonth());
        farmListing.setStatus(FarmListing.FarmStatusEnum.PENDING);
        
        FarmListing saved = farmListingRepository.save(farmListing);
        return convertToDTO(saved);
    }

    /**
     * Update a farm listing
     */
    public FarmListingDTO updateFarmListing(String id, FarmListingDTO dto) {
        FarmListing farmListing = farmListingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Farm not found with id: " + id));
        
        if (dto.getTitle() != null) farmListing.setTitle(dto.getTitle());
        if (dto.getDescription() != null) farmListing.setDescription(dto.getDescription());
        if (dto.getAcreage() != null) farmListing.setAcreage(dto.getAcreage());
        if (dto.getSoilType() != null) farmListing.setSoilType(dto.getSoilType());
        if (dto.getWaterSource() != null) farmListing.setWaterSource(dto.getWaterSource());
        if (dto.getPricePerMonth() != null) farmListing.setPricePerMonth(dto.getPricePerMonth());
        
        FarmListing updated = farmListingRepository.save(farmListing);
        return convertToDTO(updated);
    }

    /**
     * Get farms by owner
     */
    public List<FarmListingDTO> getFarmsByOwner(String ownerId) {
        return farmListingRepository.findByOwnerId(ownerId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Delete a farm listing
     */
    public void deleteFarmListing(String id) {
        FarmListing farmListing = farmListingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Farm not found with id: " + id));
        farmListingRepository.delete(farmListing);
    }

    /**
     * Convert entity to DTO
     */
    private FarmListingDTO convertToDTO(FarmListing farmListing) {
        return FarmListingDTO.builder()
            .id(farmListing.getId())
            .title(farmListing.getTitle())
            .description(farmListing.getDescription())
            .acreage(farmListing.getAcreage())
            .soilType(farmListing.getSoilType())
            .waterSource(farmListing.getWaterSource())
            .pricePerMonth(farmListing.getPricePerMonth())
            .status(farmListing.getStatus())
            .build();
    }
}
