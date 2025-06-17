package com.resume.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class WhatsAppService {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.whatsapp.number:}")
    private String twilioWhatsAppNumber;
    
    // Getter for accountSid to check demo mode
    public String getAccountSid() {
        return accountSid;
    }

    @PostConstruct
    private void init() {
        if (!accountSid.isEmpty() && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
        }
    }

    public boolean sendWhatsAppMessage(String to, String messageBody) {
        try {
            System.out.println("Attempting to send WhatsApp message to: " + to);
            
            // Check if we're in demo mode
            boolean demoMode = accountSid.isEmpty() || 
                              authToken.isEmpty() || 
                              twilioWhatsAppNumber.isEmpty();
                              
            if (demoMode) {
                System.out.println("DEMO MODE: Twilio credentials not configured. Simulating successful WhatsApp send.");
                System.out.println("Phone number: " + to);
                System.out.println("Message length: " + (messageBody != null ? messageBody.length() : 0) + " characters");
                System.out.println("To receive actual messages:");
                System.out.println("1. Sign up for Twilio and set up WhatsApp sandbox");
                System.out.println("2. Update application.properties with your credentials");
                System.out.println("3. Register your phone number with Twilio's sandbox");
                return true;
            }

            // Real Twilio implementation
            System.out.println("Using Twilio with SID: " + accountSid.substring(0, 5) + "...");
            System.out.println("Using WhatsApp number: " + twilioWhatsAppNumber);
            
            // Format for WhatsApp needs to start with whatsapp:
            String formattedFrom = "whatsapp:" + twilioWhatsAppNumber;
            String formattedTo = "whatsapp:" + to;
            
            // For WhatsApp Sandbox, messages need to follow templates
            // Using a template-friendly format for the resume
            String sandboxCompliantMessage;
            if (messageBody.length() > 1000) {
                // For long messages, use a shorter template format
                sandboxCompliantMessage = "Your resume is ready! Here's a summary:\n\n" + 
                    messageBody.substring(0, Math.min(messageBody.length(), 1000)) + 
                    "\n\n[Message truncated due to length limits. Download the full resume from the website.]";
            } else {
                sandboxCompliantMessage = "Your resume is ready! Here's the content:\n\n" + messageBody;
            }

            Message message = Message.creator(
                    new PhoneNumber(formattedTo),
                    new PhoneNumber(formattedFrom),
                    sandboxCompliantMessage)
                    .create();

            System.out.println("Message SID: " + message.getSid());
            return true;
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp message: " + e.getMessage());
            System.err.println("Exception type: " + e.getClass().getName());
            e.printStackTrace();
            return false;
        }
    }
}
