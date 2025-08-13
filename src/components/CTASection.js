import React from 'react';

const CTASection = ({ openBetaForm, openContactForm }) => {
  return (
    <section className="cta-section" id="contact">
      <div className="container">
        <div className="cta-content">
          <h2>Get Started with ScaleIoT</h2>
          <p>Ready to transform your parking experience? Join the future of smart parking today.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={openBetaForm}>
              <i className="fas fa-rocket"></i>
              Join the Beta Waitlist
            </button>
            <button className="btn btn-secondary btn-large" onClick={openContactForm}>
              <i className="fas fa-building"></i>
              Contact Us for a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
