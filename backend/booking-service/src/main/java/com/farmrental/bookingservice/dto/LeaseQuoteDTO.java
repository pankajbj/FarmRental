package com.farmrental.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * LeaseQuoteDTO
 * Response DTO containing detailed lease price breakdown
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaseQuoteDTO {

    private BigDecimal baseLandCost;
    private BigDecimal machineryCost;
    private BigDecimal subtotal;
    private BigDecimal depositAmount;
    private BigDecimal processingFees;
    private BigDecimal grandTotal;

    private Integer leaseDurationMonths;
    private String cropSeason;
    private Double totalAcreage;
    private BigDecimal basePricePerAcre;

    private Double appliedDiscountPercentage;
    private Double appliedPremiumPercentage;

    private String breakdownSummary;

    @Override
    public String toString() {
        return "LeaseQuoteDTO{" +
                "\n  Base Land Cost: ₹" + baseLandCost +
                "\n  Machinery Cost: ₹" + machineryCost +
                "\n  Subtotal: ₹" + subtotal +
                "\n  Deposit (3 months): ₹" + depositAmount +
                "\n  Processing Fees (5%): ₹" + processingFees +
                "\n  Grand Total: ₹" + grandTotal +
                "\n  Lease Duration: " + leaseDurationMonths + " months" +
                "\n  Crop Season: " + cropSeason +
                "\n  Total Acreage: " + totalAcreage + " acres" +
                "\n  Base Price/Acre: ₹" + basePricePerAcre +
                "\n  Applied Discount: " + appliedDiscountPercentage + "%" +
                "\n  Applied Premium: " + appliedPremiumPercentage + "%" +
                "\n}";
    }
}
