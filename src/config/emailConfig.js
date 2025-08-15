// EmailJS Configuration
// To use this service, you need to:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Replace the placeholder values below with your actual credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS service ID (found in EmailJS dashboard under Email Services)
  SERVICE_ID: 'service_pbn7ufl',
  
  // Your EmailJS template ID (found in EmailJS dashboard under Email Templates)
  TEMPLATE_ID: 'template_9o5t0ch',
  
  // Your EmailJS user ID (found in EmailJS dashboard under Account > API Keys)
  USER_ID: 'kVZ0cS5x_p6vSMCWQ',
  
  // Target email address where all form submissions will be sent
  TARGET_EMAIL: 'contact@scaleiot.org'
};

// EmailJS Template Variables
// Your EmailJS template should now only include these two variables:
// - subject: Either "beta test" or "org contact"
// - message: Compiled text with all the inputted information

// Example EmailJS template:
/*
Subject: {{subject}}

{{message}}

This email was sent from the ScaleIoT website contact form.
*/
