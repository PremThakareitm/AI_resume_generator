package com.resume.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeServiceImpl implements ResumeService {

    private ChatClient chatClient;

    public ResumeServiceImpl(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @Override
    public   Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {

        String promptString = this.loadPromptFromFile("resume_prompt.txt");
        String promptContent = this.putValuesToTemplate(promptString, Map.of(
                "userDescription", userResumeDescription
        ));
        Prompt prompt = new Prompt(promptContent);
        String response = chatClient.prompt(prompt).call().content();
        Map<String, Object> stringObjectMap = parseMultipleResponses(response);
        //modify :
        return stringObjectMap;
    }
    
    @Override
    public Map<String, Object> generateTailoredResumeResponse(String userResumeDescription, String jobDescription) throws IOException {
        String promptString = this.loadPromptFromFile("job_resume_prompt.txt");
        String promptContent = this.putValuesToTemplate(promptString, Map.of(
                "userDescription", userResumeDescription,
                "jobDescription", jobDescription
        ));
        Prompt prompt = new Prompt(promptContent);
        String response = chatClient.prompt(prompt).call().content();
        Map<String, Object> stringObjectMap = parseMultipleResponses(response);
        return stringObjectMap;
    }

    String loadPromptFromFile(String filename) throws IOException {
        Path path = new ClassPathResource(filename).getFile().toPath();
        return Files.readString(path);
    }

    String putValuesToTemplate(String template, Map<String, String> values) {
        for (Map.Entry<String, String> entry : values.entrySet()) {

            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());

        }
        return template;
    }


    public static Map<String, Object> parseMultipleResponses(String response) {
        Map<String, Object> jsonResponse = new HashMap<>();
        
        System.out.println("=== RAW AI RESPONSE ===");
        System.out.println(response);
        System.out.println("=== END RAW RESPONSE ===");

        // Extract content inside <think> tags (if any)
        int thinkStart = response.indexOf("<think>") + 7;
        int thinkEnd = response.indexOf("</think>");
        if (thinkStart != -1 && thinkEnd != -1 && thinkStart < thinkEnd) {
            String thinkContent = response.substring(thinkStart, thinkEnd).trim();
            jsonResponse.put("think", thinkContent);
        } else {
            jsonResponse.put("think", null); // Handle missing <think> tags
        }

        // First try: Extract content from ```json code blocks
        int jsonStart = response.indexOf("```json") + 7; // Start after ```json
        if (jsonStart <= 7) { // If "```json" not found, try just "```"
            jsonStart = response.indexOf("```") + 3;
        }
        int jsonEnd = response.lastIndexOf("```");
        
        System.out.println("JSON Start Index: " + jsonStart);
        System.out.println("JSON End Index: " + jsonEnd);
        
        boolean jsonParsingSuccessful = false;
        
        // Method 1: Try extracting JSON from code blocks
        if (jsonStart > 3 && jsonEnd != -1 && jsonStart < jsonEnd) {
            String jsonContent = response.substring(jsonStart, jsonEnd).trim();
            System.out.println("=== EXTRACTED JSON FROM CODE BLOCK ===");
            System.out.println(jsonContent);
            System.out.println("=== END EXTRACTED JSON ===");
            
            try {
                // Convert JSON string to Map using Jackson ObjectMapper
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> dataContent = objectMapper.readValue(jsonContent, Map.class);
                jsonResponse.put("data", dataContent);
                System.out.println("JSON parsing successful from code block!");
                jsonParsingSuccessful = true;
            } catch (Exception e) {
                System.err.println("Invalid JSON format in the code block: " + e.getMessage());
            }
        }
        
        // Method 2: Try parsing the entire response as JSON
        if (!jsonParsingSuccessful) {
            System.out.println("Trying to parse entire response as JSON...");
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> dataContent = objectMapper.readValue(response.trim(), Map.class);
                jsonResponse.put("data", dataContent);
                System.out.println("Direct JSON parsing successful!");
                jsonParsingSuccessful = true;
            } catch (Exception e) {
                System.err.println("Direct JSON parsing failed: " + e.getMessage());
            }
        }
        
        // Method 3: Look for first { and last } in the response
        if (!jsonParsingSuccessful) {
            System.out.println("Trying to extract JSON between curly braces...");
            int braceStart = response.indexOf('{');
            int braceEnd = response.lastIndexOf('}') + 1;
            
            if (braceStart != -1 && braceEnd != -1 && braceStart < braceEnd) {
                String jsonContent = response.substring(braceStart, braceEnd).trim();
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    Map<String, Object> dataContent = objectMapper.readValue(jsonContent, Map.class);
                    jsonResponse.put("data", dataContent);
                    System.out.println("JSON parsing successful from curly braces extraction!");
                    jsonParsingSuccessful = true;
                } catch (Exception e) {
                    System.err.println("JSON curly braces extraction parsing failed: " + e.getMessage());
                }
            }
        }
        
        // If all methods failed, return a fallback error message
        if (!jsonParsingSuccessful) {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("error", "Could not parse the AI response as valid JSON. Please try again.");
            jsonResponse.put("data", errorData);
            System.err.println("All JSON parsing methods failed for the response.");
        }

        return jsonResponse;
    }
}


