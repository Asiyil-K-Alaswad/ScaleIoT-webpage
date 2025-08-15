import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route , BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import BenefitsDrivers from './components/BenefitsDrivers';
import MissionVision from './components/MissionVision';
import CredibilityBuilders from './components/CredibilityBuilders';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import BetaModal from './components/BetaModal';
import ContactModal from './components/ContactModal';
import SuccessMessage from './components/SuccessMessage';
import NeonVectorBackground from './components/NeonVectorBackground';
import BenefitsPage from './components/BenefitsPage';

function App() {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccessMessageOpen, setIsSuccessMessageOpen] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const openBetaForm = () => {
    setIsBetaModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBetaForm = () => {
    setIsBetaModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openContactForm = () => {
    setIsContactModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeContactForm = () => {
    setIsContactModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const closeSuccessMessage = () => {
    setIsSuccessMessageOpen(false);
    document.body.style.overflow = 'auto';
  };

  const showSuccessMessage = (text) => {
    setSuccessText(text);
    setIsSuccessMessageOpen(true);
  };

  // Close modals with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeBetaForm();
        closeContactForm();
        closeSuccessMessage();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal')) {
        closeBetaForm();
        closeContactForm();
        closeSuccessMessage();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle scroll progress for background animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="App" style={{ position: 'relative', zIndex: 1 }}>
          <NeonVectorBackground 
            scrollProgress={scrollProgress}
            isVisible={true}
            concurrentPaths={6}
          />
          <Navbar 
            openBetaForm={openBetaForm}
            openContactForm={openContactForm}
          />
          
          <Routes>
            <Route path="/" element={
              <>
                <Hero 
                  openBetaForm={openBetaForm}
                  openContactForm={openContactForm}
                />
                
                <ProblemSolution />
                <HowItWorks />
                <MissionVision />
                <BenefitsDrivers />
                
                <CredibilityBuilders />
                
                <CTASection 
                  openBetaForm={openBetaForm}
                  openContactForm={openContactForm}
                />
                
                <Footer 
                  openBetaForm={openBetaForm}
                  openContactForm={openContactForm}
                />
              </>
            } />
            <Route path="/benefits" element={<BenefitsPage />} />
          </Routes>

          <BetaModal 
            isOpen={isBetaModalOpen}
            onClose={closeBetaForm}
            onSuccess={showSuccessMessage}
          />

          <ContactModal 
            isOpen={isContactModalOpen}
            onClose={closeContactForm}
            onSuccess={showSuccessMessage}
          />

          <SuccessMessage 
            isOpen={isSuccessMessageOpen}
            onClose={closeSuccessMessage}
            text={successText}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
