package com.resume.backend;

public record WhatsAppRequest(
    String phoneNumber,
    String resumeData
) {
}
