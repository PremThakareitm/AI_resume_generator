package com.resume.backend.controller;

import com.resume.backend.JobResumeRequest;
import com.resume.backend.ResumeRequest;
import com.resume.backend.WhatsAppRequest;
import com.resume.backend.service.ResumeService;
import com.resume.backend.service.WhatsAppService;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final WhatsAppService whatsAppService;

    public ResumeController(ResumeService resumeService, WhatsAppService whatsAppService) {
        this.resumeService = resumeService;
        this.whatsAppService = whatsAppService;
    }


    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> getResumeData(
            @RequestBody ResumeRequest resumeRequest
    ) throws IOException {

        Map<String, Object> stringObjectMap = resumeService.generateResumeResponse(resumeRequest.userDescription());
        return new ResponseEntity<>(stringObjectMap, HttpStatus.OK);
    }

    @PostMapping("/generate-tailored")
    public ResponseEntity<Map<String, Object>> getTailoredResumeData(
            @RequestBody JobResumeRequest jobResumeRequest
    ) throws IOException {
        Map<String, Object> stringObjectMap = resumeService.generateTailoredResumeResponse(
                jobResumeRequest.userDescription(),
                jobResumeRequest.jobDescription()
        );
        return new ResponseEntity<>(stringObjectMap, HttpStatus.OK);
    }
    
    @PostMapping(value = {"/send-whatsapp", "/sendWhatsApp"})
    public ResponseEntity<Map<String, Object>> sendWhatsAppResume(
            @RequestBody WhatsAppRequest whatsAppRequest
    ) {
        System.out.println("==== WhatsApp API Request Received ====");
        System.out.println("Request object: " + (whatsAppRequest != null ? "valid" : "null"));
        if (whatsAppRequest != null) {
            System.out.println("Phone number: " + whatsAppRequest.phoneNumber());
            System.out.println("Resume data length: " + 
                (whatsAppRequest.resumeData() != null ? whatsAppRequest.resumeData().length() : 0));
        }
        
        Map<String, Object> response = new HashMap<>();
        
        if (whatsAppRequest == null || whatsAppRequest.phoneNumber() == null || whatsAppRequest.phoneNumber().isEmpty()) {
            System.out.println("Error: Phone number is missing or empty");
            response.put("success", false);
            response.put("message", "Phone number is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
        String message = "Here is your resume from Resume Bot. Thank you for using our service!";
        if (whatsAppRequest.resumeData() != null && !whatsAppRequest.resumeData().isEmpty()) {
            message = "Here is your resume from Resume Bot:\n\n" + whatsAppRequest.resumeData();
        }
        
        System.out.println("Sending WhatsApp message to: " + whatsAppRequest.phoneNumber());
        boolean sent = whatsAppService.sendWhatsAppMessage(whatsAppRequest.phoneNumber(), message);
        
        // Check if we're in demo mode (now using real credentials)
        boolean isDemoMode = whatsAppService.getAccountSid() == null || 
                             whatsAppService.getAccountSid().isEmpty();
                            
        if (sent) {
            System.out.println("WhatsApp message sent successfully" + (isDemoMode ? " (DEMO MODE)" : ""));
            response.put("success", true);
            response.put("isDemoMode", isDemoMode);
            response.put("message", "Resume sent to WhatsApp successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            System.out.println("Failed to send WhatsApp message");
            response.put("success", false);
            response.put("message", "Failed to send resume to WhatsApp. Please check your phone number or try again later.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
