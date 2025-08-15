import emailjs from 'emailjs-com';
import { EMAILJS_CONFIG } from '../config/emailConfig';

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.USER_ID);

export const sendBetaSignupEmail = async (formData) => {
  try {
    // Compile all beta signup information into a single message
    const compiledMessage = `BETA TEST SIGNUP

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Vehicle: ${formData.vehicle || 'Not specified'}

Form submitted at: ${new Date().toLocaleString()}`;

    const templateParams = {
      subject: 'beta test',
      message: compiledMessage
    };

    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending beta signup email:', error);
    throw new Error('Failed to send email. Please try again.');
  }
};

export const sendOrganizationContactEmail = async (formData) => {
  try {
    // Compile all organization contact information into a single message
    const compiledMessage = `ORGANIZATION CONTACT

Name: ${formData.name}
Company: ${formData.company}
Email: ${formData.email}
Phone: ${formData.phone}
Facility Type: ${formData.facilityType}
Message: ${formData.message}

Form submitted at: ${new Date().toLocaleString()}`;

    const templateParams = {
      subject: 'org contact',
      message: compiledMessage
    };

    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending organization contact email:', error);
    throw new Error('Failed to send email. Please try again.');
  }
};

// Fallback email service using mailto link (for cases where EmailJS is not configured)
export const sendFallbackEmail = (formData, type) => {
  const subject = type === 'beta' 
    ? 'beta test'
    : 'org contact';
  
  const body = type === 'beta'
    ? `BETA TEST SIGNUP\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nVehicle: ${formData.vehicle || 'Not specified'}`
    : `ORGANIZATION CONTACT\n\nName: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nFacility Type: ${formData.facilityType}\nMessage: ${formData.message}`;

  const mailtoLink = `mailto:${EMAILJS_CONFIG.TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.open(mailtoLink);
};
