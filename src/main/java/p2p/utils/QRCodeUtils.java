package p2p.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class QRCodeUtils {
    
    /**
     * Generate QR code as byte array
     */
    public static byte[] generateQRCode(String data, int width, int height) throws WriterException, IOException {
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.MARGIN, 2);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, width, height, hints);
        
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = image.createGraphics();
        
        // Set background to white
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, width, height);
        
        // Set QR code color to black
        graphics.setColor(Color.BLACK);
        
        // Draw the QR code
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                if (bitMatrix.get(x, y)) {
                    graphics.fillRect(x, y, 1, 1);
                }
            }
        }
        
        graphics.dispose();
        
        // Convert to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", baos);
        return baos.toByteArray();
    }
    
    /**
     * Generate QR code with default size (256x256)
     */
    public static byte[] generateQRCode(String data) throws WriterException, IOException {
        return generateQRCode(data, 256, 256);
    }
    
    /**
     * Generate QR code as base64 string
     */
    public static String generateQRCodeBase64(String data) throws WriterException, IOException {
        byte[] qrCodeBytes = generateQRCode(data);
        return java.util.Base64.getEncoder().encodeToString(qrCodeBytes);
    }
    
    /**
     * Generate QR code data URL for web display
     */
    public static String generateQRCodeDataURL(String data) throws WriterException, IOException {
        String base64 = generateQRCodeBase64(data);
        return "data:image/png;base64," + base64;
    }
} 