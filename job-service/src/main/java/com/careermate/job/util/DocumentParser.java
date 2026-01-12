package com.careermate.job.util;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class DocumentParser {

    public static String extractTextFromDocx(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             XWPFDocument document = new XWPFDocument(is)) {
            
            StringBuilder text = new StringBuilder();
            List<XWPFParagraph> paragraphs = document.getParagraphs();
            
            for (XWPFParagraph paragraph : paragraphs) {
                text.append(paragraph.getText()).append("\n");
            }
            
            return text.toString().trim();
        }
    }

    public static String extractTextFromFile(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        
        if (fileName == null) {
            return "Unknown file";
        }
        
        String lowerFileName = fileName.toLowerCase();
        
        if (lowerFileName.endsWith(".docx")) {
            return extractTextFromDocx(file);
        } else if (lowerFileName.endsWith(".txt")) {
            return new String(file.getBytes());
        } else if (lowerFileName.endsWith(".doc")) {
            // .doc (old format) would need different library
            return "File uploaded: " + fileName + " (old .doc format not supported, please use .docx or .txt)";
        } else if (lowerFileName.endsWith(".pdf")) {
            // PDF would need Apache PDFBox
            return "File uploaded: " + fileName + " (PDF format not yet supported, please use .docx or .txt)";
        } else {
            return "File uploaded: " + fileName + " (unsupported format)";
        }
    }
}
