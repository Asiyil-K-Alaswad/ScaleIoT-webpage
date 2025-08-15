import React, { useState } from 'react';
import { sendBetaSignupEmail, sendFallbackEmail } from '../services/emailService';

const BetaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: ''
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
      await sendBetaSignupEmail(formData);
      
      // Show success message
      onSuccess('Welcome to the ScaleIoT beta! We\'ll notify you when we\'re ready to launch.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        vehicle: ''
      });
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError('Failed to send email automatically. Opening email client instead...');
      
      // Fallback to mailto link
      setTimeout(() => {
        sendFallbackEmail(formData, 'beta');
        onSuccess('Beta signup form opened in your email client. Please send the email to complete your registration.');
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
        <h2>Join the Beta Waitlist</h2>
        <p>Be among the first to experience seamless smart parking!</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="betaName">Full Name</label>
            <input
              type="text"
              id="betaName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="betaEmail">Email Address</label>
            <input
              type="email"
              id="betaEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="betaPhone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="betaPhone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
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
                Joining...
              </>
            ) : (
              'Join Beta Waitlist'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BetaModal;
