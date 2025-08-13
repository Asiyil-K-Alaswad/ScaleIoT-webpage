import React, { useRef } from 'react';

const Hero = ({ openBetaForm, openContactForm }) => {
  const heroRef = useRef(null);









  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Seamless Smart Parking with <span className="highlight">ScaleIoT</span>
          </h1>
          <p className="hero-subtitle">
            Drive in, park, and go – no tickets, no hassle.
          </p>
          <p className="hero-description">
            Experience a fully automated parking system that recognizes your car, guides you to an optimal spot, and charges you automatically – for a truly seamless visit.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-large" onClick={openBetaForm}>
              <i className="fas fa-rocket"></i>
              Join Beta Waitlist
            </button>
            <button className="btn btn-secondary btn-large" onClick={openContactForm}>
              <i className="fas fa-building"></i>
              Contact Us (For Organizations)
            </button>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
