# WhatsApp Integration Setup Guide

## 1. Sign Up for Twilio

1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Create an account (they offer free trials with credit)

## 2. Set Up WhatsApp Sandbox

1. In the Twilio console, navigate to "Messaging" > "Try it out" > "Send a WhatsApp message"
2. You'll see instructions to join your sandbox
3. From your phone (+919156621088), send the displayed code (like "join example-apple") to the provided Twilio WhatsApp number
4. Once connected, your number is registered with the sandbox

## 3. Get Your Credentials

1. Account SID: Found on your Twilio Dashboard
2. Auth Token: Found on your Twilio Dashboard
3. WhatsApp Number: The Twilio WhatsApp number shown in your sandbox

## 4. Update application.properties

```properties
twilio.account.sid=YOUR_TWILIO_ACCOUNT_SID
twilio.auth.token=YOUR_TWILIO_AUTH_TOKEN
twilio.whatsapp.number=YOUR_TWILIO_WHATSAPP_NUMBER
```

## 5. Restart the Backend Server

After updating the properties, restart your Spring Boot application.

## Important Notes About Twilio WhatsApp Sandbox:

1. **Pre-approved Templates**: In sandbox mode, you can only send messages that follow approved templates
2. **24-Hour Session Window**: You can only send free-form messages within 24 hours of the user's last message
3. **Recipient Approval**: Recipients must opt-in by joining your sandbox first
4. **Message Format Requirements**: Your initial messages must follow specific templates

## For Production Use:

For a production app, you'll need to:

1. Apply for a WhatsApp Business API account through Twilio
2. Get your WhatsApp Business Profile approved
3. Purchase a Twilio phone number
4. Submit message templates for approval

## Testing Your Integration:

- After setting up, try sending a short message first
- If it fails, check the Twilio console for error messages
- Verify your phone has joined the sandbox correctly
