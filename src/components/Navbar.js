import React, { useState, useEffect } from 'react';

const Navbar = ({ openBetaForm, openContactForm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    closeMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/logo.png" alt="ScaleIoT Logo" style={{ width: '32px', height: '32px' }} />
          <span>ScaleIoT</span>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a 
            href="#how-it-works" 
            className="nav-link"
            onClick={() => scrollToSection('how-it-works')}
          >
            How It Works
          </a>
          <a 
            href="#features" 
            className="nav-link"
            onClick={() => scrollToSection('features')}
          >
            Features
          </a>
          <a 
            href="#benefits" 
            className="nav-link"
            onClick={() => scrollToSection('benefits')}
          >
            Benefits
          </a>
          <a 
            href="#contact" 
            className="nav-link"
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </a>
          <button className="btn btn-primary nav-cta" onClick={openBetaForm}>
            Join Beta
          </button>
        </div>
        
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
