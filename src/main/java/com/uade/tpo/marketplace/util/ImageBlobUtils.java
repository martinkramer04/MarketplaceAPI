package com.uade.tpo.marketplace.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Images are stored as a Blob, but that Blob may hold either real binary image
 * bytes (uploaded files) or a plain-text URL (seeded/external images). This
 * resolves either case into a single string the frontend can drop straight
 * into an <img src>: the URL as-is, or a data: URI for real binary bytes.
 */
public final class ImageBlobUtils {

    private ImageBlobUtils() {
    }

    public static String resolveSrc(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            return null;
        }
        if (isUrl(bytes)) {
            return new String(bytes, StandardCharsets.UTF_8);
        }
        String base64 = Base64.getEncoder().encodeToString(bytes);
        return "data:" + detectMimeType(bytes) + ";base64," + base64;
    }

    private static boolean isUrl(byte[] bytes) {
        int len = Math.min(bytes.length, 8);
        for (int i = 0; i < len; i++) {
            int b = bytes[i] & 0xFF;
            if (b < 0x20 || b > 0x7E) {
                return false;
            }
        }
        String prefix = new String(bytes, 0, len, StandardCharsets.US_ASCII);
        return prefix.startsWith("http://") || prefix.startsWith("https://");
    }

    private static String detectMimeType(byte[] bytes) {
        if (bytes.length >= 3 && (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (bytes.length >= 4 && (bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47) {
            return "image/png";
        }
        if (bytes.length >= 6 && bytes[0] == 'G' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == '8') {
            return "image/gif";
        }
        if (bytes.length >= 12 && bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P') {
            return "image/webp";
        }
        return "image/jpeg";
    }
}
