package com.farmrental.bookingservice.service;

import com.farmrental.bookingservice.dto.LeaseQuoteDTO;
import com.farmrental.bookingservice.exception.InvalidLeasePeriodException;
import com.farmrental.bookingservice.exception.MachineryNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * FarmLeaseCalculatorService
 * Calculates complex lease prices based on agricultural variables
 */
@Service
@Slf4j
public class FarmLeaseCalculatorService {

    @Autowired
    private MachineryService machineryService;

    // Constants for calculations
    private static final BigDecimal LONG_TERM_DISCOUNT = new BigDecimal("0.10"); // 10% discount
    private static final BigDecimal SEASONAL_PREMIUM = new BigDecimal("0.15"); // 15% premium
    private static final BigDecimal DEPOSIT_MULTIPLIER = new BigDecimal("3"); // 3 months deposit
    private static final BigDecimal PROCESSING_FEE_PERCENTAGE = new BigDecimal("0.05"); // 5% fee
    private static final int LONG_TERM_THRESHOLD_MONTHS = 12;

    public enum CropSeason {
        KHARIF,      // Monsoon season (June-October)
        RABI,        // Winter season (October-March)
        ZAID,        // Summer season (March-June)
        YEAR_ROUND
    }

    /**
     * Calculate lease quote for a farm
     * @param basePricePerAcre Base price per acre
     * @param totalAcreage Total farm acreage
     * @param leaseDurationMonths Lease duration in months
     * @param cropSeason Crop season type
     * @param machineryIds List of machinery IDs to be used
     * @return LeaseQuoteDTO with detailed price breakdown
     * @throws InvalidLeasePeriodException if lease period is invalid
     * @throws MachineryNotFoundException if machinery not found
     */
    public LeaseQuoteDTO calculateLeaseQuote(
            BigDecimal basePricePerAcre,
            Double totalAcreage,
            Integer leaseDurationMonths,
            CropSeason cropSeason,
            List<String> machineryIds) {

        // Validate lease period
        validateLeasePeriod(leaseDurationMonths);

        log.info("Calculating lease quote for {} acres, {} months, {} season",
                totalAcreage, leaseDurationMonths, cropSeason);

        // Calculate base land lease cost
        BigDecimal baseLandCost = calculateBaseLandCost(basePricePerAcre, totalAcreage, leaseDurationMonths);

        // Apply discounts/premiums
        BigDecimal adjustedLandCost = applyAdjustments(baseLandCost, leaseDurationMonths, cropSeason);

        // Calculate machinery costs
        BigDecimal machineryCost = calculateMachineryCosts(machineryIds, leaseDurationMonths);

        // Calculate total before fees
        BigDecimal subtotal = adjustedLandCost.add(machineryCost);

        // Calculate deposit (3 months of base rate)
        BigDecimal depositAmount = baseLandCost.divide(
                BigDecimal.valueOf(leaseDurationMonths), 2, BigDecimal.ROUND_HALF_UP)
                .multiply(DEPOSIT_MULTIPLIER);

        // Calculate processing fees (5% of subtotal)
        BigDecimal processingFees = subtotal.multiply(PROCESSING_FEE_PERCENTAGE)
                .setScale(2, BigDecimal.ROUND_HALF_UP);

        // Calculate grand total
        BigDecimal grandTotal = subtotal.add(depositAmount).add(processingFees);

        return LeaseQuoteDTO.builder()
                .baseLandCost(adjustedLandCost)
                .machineryCost(machineryCost)
                .subtotal(subtotal)
                .depositAmount(depositAmount)
                .processingFees(processingFees)
                .grandTotal(grandTotal)
                .leaseDurationMonths(leaseDurationMonths)
                .cropSeason(cropSeason.toString())
                .totalAcreage(totalAcreage)
                .basePricePerAcre(basePricePerAcre)
                .appliedDiscountPercentage(isLongTermLease(leaseDurationMonths) ? 10.0 : 0.0)
                .appliedPremiumPercentage(isHighDemandSeason(cropSeason) ? 15.0 : 0.0)
                .build();
    }

    /**
     * Calculate base land cost
     */
    private BigDecimal calculateBaseLandCost(BigDecimal basePricePerAcre, Double totalAcreage, Integer months) {
        return basePricePerAcre
                .multiply(BigDecimal.valueOf(totalAcreage))
                .multiply(BigDecimal.valueOf(months))
                .setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Apply discounts for long-term and premiums for high-demand seasons
     */
    private BigDecimal applyAdjustments(BigDecimal baseCost, Integer leaseDurationMonths, CropSeason season) {
        BigDecimal adjusted = baseCost;

        // Apply 10% discount for long-term leases (>12 months)
        if (isLongTermLease(leaseDurationMonths)) {
            BigDecimal discount = adjusted.multiply(LONG_TERM_DISCOUNT);
            adjusted = adjusted.subtract(discount);
            log.info("Applied 10% long-term discount: {}", discount);
        }

        // Apply 15% premium for high-demand seasons
        if (isHighDemandSeason(season)) {
            BigDecimal premium = adjusted.multiply(SEASONAL_PREMIUM);
            adjusted = adjusted.add(premium);
            log.info("Applied 15% seasonal premium: {}", premium);
        }

        return adjusted.setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Calculate machinery costs
     */
    private BigDecimal calculateMachineryCosts(List<String> machineryIds, Integer leaseDurationMonths) {
        if (machineryIds == null || machineryIds.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalMachineryCost = BigDecimal.ZERO;

        for (String machineryId : machineryIds) {
            try {
                BigDecimal monthlyRate = machineryService.getMachineryPrice(machineryId);
                BigDecimal machineryCost = monthlyRate.multiply(BigDecimal.valueOf(leaseDurationMonths));
                totalMachineryCost = totalMachineryCost.add(machineryCost);
                log.info("Added machinery {} cost: {}", machineryId, machineryCost);
            } catch (Exception e) {
                throw new MachineryNotFoundException("Machinery not found: " + machineryId);
            }
        }

        return totalMachineryCost.setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Validate lease period
     */
    private void validateLeasePeriod(Integer months) {
        if (months == null || months <= 0) {
            throw new InvalidLeasePeriodException("Lease period must be greater than 0 months");
        }
        if (months > 120) { // Max 10 years
            throw new InvalidLeasePeriodException("Lease period cannot exceed 120 months");
        }
    }

    /**
     * Check if lease is long-term (>12 months)
     */
    private boolean isLongTermLease(Integer leaseDurationMonths) {
        return leaseDurationMonths > LONG_TERM_THRESHOLD_MONTHS;
    }

    /**
     * Check if season is high-demand (Kharif or Rabi)
     */
    private boolean isHighDemandSeason(CropSeason season) {
        return season == CropSeason.KHARIF || season == CropSeason.RABI;
    }
}
