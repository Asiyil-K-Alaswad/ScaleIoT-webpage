import React, { useState } from 'react';
import { sendOrganizationContactEmail, sendFallbackEmail } from '../services/emailService';

const ContactModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    facilityType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (emailError) setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailError('');

    try {
      // Try to send email using EmailJS
      await sendOrganizationContactEmail(formData);
      
      // Show success message
      onSuccess('Thank you for your interest! Our team will contact you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        facilityType: '',
        message: ''
      });
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError('Failed to send email automatically. Opening email client instead...');
      
      // Fallback to mailto link
      setTimeout(() => {
        sendFallbackEmail(formData, 'organization');
        onSuccess('Contact form opened in your email client. Please send the email to complete your inquiry.');
        onClose();
      }, 2000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Contact Us for More Information</h2>
        <p>Interested in bringing smart parking to your facility? Let's discuss how ScaleIoT can help.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="contactName">Full Name</label>
            <input
              type="text"
              id="contactName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactCompany">Company/Organization</label>
            <input
              type="text"
              id="contactCompany"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail">Email Address</label>
            <input
              type="email"
              id="contactEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactPhone">Phone Number</label>
            <input
              type="tel"
              id="contactPhone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactType">Facility Type</label>
            <select
              id="contactType"
              name="facilityType"
              value={formData.facilityType}
              onChange={handleChange}
            >
              <option value="">Select facility type</option>
              <option value="mall">Shopping Mall</option>
              <option value="office">Office Building</option>
              <option value="hospital">Hospital</option>
              <option value="airport">Airport</option>
              <option value="university">University</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="contactMessage">Message</label>
            <textarea
              id="contactMessage"
              name="message"
              rows="4"
              placeholder="Tell us about your parking needs and how we can help..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          {emailError && (
            <div className="form-error">
              <p>{emailError}</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
