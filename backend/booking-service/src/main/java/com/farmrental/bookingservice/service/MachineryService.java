package com.farmrental.bookingservice.service;

import com.farmrental.bookingservice.exception.MachineryNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * MachineryService
 * Manages farm machinery rentals and pricing
 */
@Service
@Slf4j
public class MachineryService {

    // Mock machinery inventory with prices per month
    private static final Map<String, BigDecimal> MACHINERY_PRICES = new HashMap<>();

    static {
        MACHINERY_PRICES.put("tractor", new BigDecimal("5000"));
        MACHINERY_PRICES.put("harvester", new BigDecimal("8000"));
        MACHINERY_PRICES.put("plough", new BigDecimal("2000"));
        MACHINERY_PRICES.put("sprayer", new BigDecimal("1500"));
        MACHINERY_PRICES.put("thresher", new BigDecimal("3000"));
        MACHINERY_PRICES.put("pump", new BigDecimal("1000"));
    }

    /**
     * Calculate total machinery cost
     */
    public BigDecimal calculateMachineryCost(List<String> machineryIds, Integer months) {
        if (machineryIds == null || machineryIds.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalCost = BigDecimal.ZERO;
        for (String machineryId : machineryIds) {
            BigDecimal monthlyPrice = MACHINERY_PRICES.get(machineryId.toLowerCase());
            if (monthlyPrice == null) {
                throw new MachineryNotFoundException("Machinery not found: " + machineryId);
            }
            totalCost = totalCost.add(monthlyPrice.multiply(BigDecimal.valueOf(months)));
            log.info("Added machinery {} at ₹{}/month", machineryId, monthlyPrice);
        }
        return totalCost;
    }

    /**
     * Check if machinery exists
     */
    public boolean existsMachinery(String machineryId) {
        return MACHINERY_PRICES.containsKey(machineryId.toLowerCase());
    }

    /**
     * Get monthly rental price for machinery
     */
    public BigDecimal getMachineryPrice(String machineryId) {
        BigDecimal price = MACHINERY_PRICES.get(machineryId.toLowerCase());
        if (price == null) {
            throw new MachineryNotFoundException("Machinery not found: " + machineryId);
        }
        return price;
    }

    /**
     * Get all available machinery
     */
    public Map<String, BigDecimal> getAvailableMachinery() {
        return new HashMap<>(MACHINERY_PRICES);
    }
}
