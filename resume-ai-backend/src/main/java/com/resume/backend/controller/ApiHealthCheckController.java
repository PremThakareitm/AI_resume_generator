package com.resume.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * A dedicated health check controller for /api/health endpoints
 * This ensures our frontend can easily check if the backend is up
 */
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api")
public class ApiHealthCheckController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("message", "Resume AI Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("version", "1.0.0");
        response.put("endpoint", "/api/health");
        return ResponseEntity.ok(response);
    }
}
