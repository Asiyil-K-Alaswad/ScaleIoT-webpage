# Email Integration Setup Guide

This guide will help you set up the email functionality for the ScaleIoT landing page, allowing beta signup and organization contact forms to send emails to `aselkalswed@gmail.com`.

## Overview

The landing page now includes:
- **Beta Signup Form**: Collects user information for beta testing
- **Organization Contact Form**: Collects business inquiries
- **Email Service**: Automatically sends form submissions via EmailJS
- **Fallback System**: Opens email client if automatic sending fails

## Setup Steps

### 1. EmailJS Account Setup

1. **Sign up for EmailJS**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Create a free account
   - Verify your email address

2. **Create an Email Service**
   - In your EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps
   - Note down your **Service ID**

3. **Create an Email Template**
   - Go to "Email Templates" in your dashboard
   - Click "Create New Template"
   - Use this template structure:

```html
Subject: {{subject}}

Form Type: {{form_type}}
Name: {{name}}
Email: {{email}}
Phone: {{phone}}

{{#if company}}Company: {{company}}{{/if}}
{{#if facility_type}}Facility Type: {{facility_type}}{{/if}}
{{#if vehicle}}Vehicle: {{vehicle}}{{/if}}
{{#if message}}Message: {{message}}{{/if}}

This email was sent from the ScaleIoT website contact form.
```

   - Save the template and note down your **Template ID**

4. **Get Your User ID**
   - Go to "Account" → "API Keys" in your dashboard
   - Copy your **User ID**

### 2. Update Configuration

1. **Edit the configuration file**
   - Open `src/config/emailConfig.js`
   - Replace the placeholder values:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id_here',
  TEMPLATE_ID: 'your_actual_template_id_here',
  USER_ID: 'your_actual_user_id_here',
  TARGET_EMAIL: 'aselkalswed@gmail.com'  // This is already set correctly
};
```

### 3. Test the Integration

1. **Start your development server**
   ```bash
   npm start
   ```

2. **Test the forms**
   - Open the beta signup modal
   - Fill out the form and submit
   - Check if you receive an email at `aselkalswed@gmail.com`
   - Test the organization contact form as well

## How It Works

### Primary Method (EmailJS)
1. User fills out a form
2. Form data is sent to EmailJS
3. EmailJS sends an email to `aselkalswed@gmail.com`
4. User sees a success message

### Fallback Method (Mailto Link)
1. If EmailJS fails, the system shows an error message
2. After 2 seconds, it opens the user's default email client
3. Pre-fills the email with form data
4. User manually sends the email

## Troubleshooting

### Common Issues

1. **"Failed to send email automatically"**
   - Check your EmailJS credentials in `emailConfig.js`
   - Verify your EmailJS service is active
   - Check browser console for detailed error messages

2. **No emails received**
   - Check your spam folder
   - Verify the target email address is correct
   - Check EmailJS dashboard for delivery status

3. **Forms not working**
   - Ensure all dependencies are installed: `npm install`
   - Check browser console for JavaScript errors
   - Verify the email service is properly imported

### Debug Mode

To enable debug logging, you can add this to your browser console:
```javascript
localStorage.setItem('emailjs_debug', 'true');
```

## Security Considerations

- EmailJS credentials are visible in the frontend code
- This is acceptable for public forms but consider rate limiting
- The service includes basic spam protection
- Consider implementing CAPTCHA for production use

## Production Deployment

1. **Build your project**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service**
   - The email functionality will work the same in production
   - Ensure your domain is allowed in EmailJS settings

## Support

If you encounter issues:
1. Check the EmailJS documentation
2. Review browser console errors
3. Verify all configuration values are correct
4. Test with a simple form submission first

## Files Modified

- `src/services/emailService.js` - Email service logic
- `src/components/BetaModal.js` - Beta signup form integration
- `src/components/ContactModal.js` - Organization contact form integration
- `src/config/emailConfig.js` - Configuration file
- `src/index.css` - Error message styling
- `EMAIL_SETUP_README.md` - This setup guide
