import React, { useState } from 'react';

const BetaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
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
