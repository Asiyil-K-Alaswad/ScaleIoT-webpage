import React from 'react';

const SuccessMessage = ({ isOpen, onClose, text }) => {
  if (!isOpen) return null;

  return (
    <div className="success-message show">
      <div className="success-content">
        <i className="fas fa-check-circle"></i>
        <h3>Thank You!</h3>
        <p>{text}</p>
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
