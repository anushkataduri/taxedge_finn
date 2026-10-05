package com.taxedge.itr.filing.helper;

import java.util.Random;
import static com.taxedge.gst.helper.GstRandomNumberGenerator.generateDocumentId;

public class FilingRandomNumberGenerator {

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
        return com.taxedge.gst.helper.GstRandomNumberGenerator.generateDocumentId();
    }
}
