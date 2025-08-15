import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ openBetaForm, openContactForm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img src={logo} alt="ScaleIoT Logo" style={{ width: '32px', height: '32px' }} />
            <span>ScaleIoT</span>
          </Link>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {isHomePage && (
            <button 
              className="nav-link"
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </button>
          )}
          <Link 
            to="/benefits" 
            className="nav-link"
            onClick={closeMenu}
          >
            Benefits
          </Link>
          {isHomePage && (
            <button 
              className="nav-link"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          )}
          <ThemeToggle />
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
