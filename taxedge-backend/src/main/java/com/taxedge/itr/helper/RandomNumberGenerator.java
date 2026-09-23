package com.taxedge.itr.helper;

import java.security.SecureRandom;
import java.util.Random;

public class RandomNumberGenerator {

    private static final Random random = new Random();

    public static String generateItrId() {

        int number = random.nextInt(1_000_000);

        return String.format("ITR%06d", number);
    }
    
    
    
    public static String generateIncomeId() {
        int number = random.nextInt(1_000_000);
        return String.format("INM%06d", number);
    }
    
    public static String generateDocumentId() {
        int number = random.nextInt(1_000_000);
        return String.format("DOC%06d", number);
    }

    public static String generateRevisedItrId() {
        int number = random.nextInt(1_000_000);
        return String.format("RIT%06d", number);
    }

    public static String generateRevisedItrDetailsId() {
        int number = random.nextInt(1_000_000);
        return String.format("RDT%06d", number);
    }

    public static String generateRevisedItrDocumentId() {
        int number = random.nextInt(1_000_000);
        return String.format("RDC%06d", number);
    }

    public static String generateRevisionReasonId() {
        int number = random.nextInt(1_000_000);
        return String.format("RSN%06d", number);
    }
    
    
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

   

    /** e.g. TDSR-7K3QX9MB */
    public static String generateTdsRefundId() {
        StringBuilder sb = new StringBuilder("TDSR-");
        for (int i = 0; i < 8; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}