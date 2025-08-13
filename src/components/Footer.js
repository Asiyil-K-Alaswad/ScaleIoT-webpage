import React from 'react';

const Footer = ({ openBetaForm, openContactForm }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="ScaleIoT Logo" style={{ width: '32px', height: '32px' }} />
              <span>ScaleIoT</span>
            </div>
            <p>Innovating Smart Cities with IoT-powered parking solutions that make urban mobility seamless and efficient.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#how-it-works" onClick={() => scrollToSection('how-it-works')}>How It Works</a></li>
              <li><a href="#features" onClick={() => scrollToSection('features')}>Features</a></li>
              <li><a href="#benefits" onClick={() => scrollToSection('benefits')}>Benefits</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Get Started</h3>
            <ul>
              <li><a href="#" onClick={openBetaForm}>Join Beta</a></li>
              <li><a href="#" onClick={openContactForm}>Request Demo</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <ul>
              <li><i className="fas fa-envelope"></i> <span className="email-text">contact@scaleiot.org</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 ScaleIoT. All rights reserved.</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
