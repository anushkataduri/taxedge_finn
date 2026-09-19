package com.taxedge.gst.helper;

import java.security.SecureRandom;

public class RandomNumberGenerator {

    private static final SecureRandom random = new SecureRandom();



    public static String generateGstId() {
        long number = random.nextLong(1_000_000_000_000L);

        return String.format("GST%012d", number);
    }
    
    public static String generateFilingId() {

        int number = random.nextInt(1_000_000);

        return String.format("FIL%06d", number);
    }
    
    public static String generateComplianceId() {

        int number = random.nextInt(1_000_000);

        return String.format("COM%06d", number);
    }
}