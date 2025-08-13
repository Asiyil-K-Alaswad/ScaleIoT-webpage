import React, { useEffect, useRef, useState } from 'react';

const HowItWorks = () => {
  const timelineRef = useRef(null);
  const stepRefs = useRef([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the timeline section is visible
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Calculate scroll progress through the section (0 to 1)
        let progress = 0;
        
        if (sectionTop < windowHeight) {
          // Section is entering or in view
          if (sectionTop <= 0) {
            // Section is fully in view or scrolled past
            progress = Math.min(1, Math.abs(sectionTop) / (sectionHeight - windowHeight));
          } else {
            // Section is entering view - start progress
            progress = Math.max(0, (windowHeight - sectionTop) / windowHeight);
          }
        }
        
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      number: 1,
      icon: 'fas fa-mobile-alt',
      title: 'Download & Register',
      description: 'Sign up on the ScaleIoT mobile app and register your vehicle license plate.',
      color: '#FE662E'
    },
    {
      number: 2,
      icon: 'fas fa-camera',
      title: 'Arrive & Enter',
      description: 'Camera automatically recognizes your license plate and opens the gate instantly.',
      color: '#77869E'
    },
    {
      number: 3,
      icon: 'fas fa-map-marker-alt',
      title: 'Smart Spot Assignment',
      description: 'System assigns the optimal parking spot based on your preferences and real-time occupancy.',
      color: '#BCC3CF'
    },
    {
      number: 4,
      icon: 'fas fa-route',
      title: 'Navigation to Spot',
      description: 'Get turn-by-turn directions to your spot via the app or guided signage.',
      color: '#4A5568'
    },
    {
      number: 5,
      icon: 'fas fa-credit-card',
      title: 'Seamless Exit & Payment',
      description: 'Drive out - gate opens automatically and payment is charged to your account.',
      color: '#2D3748'
    }
  ];

  // Calculate which steps should be illuminated based on scroll progress
  // Each step gets its own illumination threshold
  const getStepIllumination = (index) => {
    // Make illumination much more responsive
    // Each step takes up a smaller portion of the scroll progress
    const stepStart = index * 0.1; // Start each step much earlier
    const stepEnd = (index + 1) * 0.1; // End each step much earlier
    
    // Step is illuminated when scroll progress is within its range
    const isIlluminated = scrollProgress >= stepStart;
    
    // Calculate how much of this step is illuminated (0 to 1)
    let illuminationIntensity = 0;
    if (scrollProgress >= stepStart) {
      if (scrollProgress >= stepEnd) {
        // Step is fully illuminated
        illuminationIntensity = 1;
      } else {
        // Step is partially illuminated
        illuminationIntensity = (scrollProgress - stepStart) / (stepEnd - stepStart);
      }
    }
    
    return {
      isIlluminated,
      intensity: illuminationIntensity
    };
  };

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Your journey to seamless parking in 5 simple steps</p>
        </div>
        
        <div className="timeline-container" ref={timelineRef}>
          <div className="timeline-line">
            <div 
              className="timeline-progress" 
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
          
          {steps.map((step, index) => {
            const illumination = getStepIllumination(index);
            
            return (
              <div 
                key={index} 
                className={`timeline-step ${illumination.isIlluminated ? 'illuminated' : ''}`}
                ref={(el) => (stepRefs.current[index] = el)}
                style={{ 
                  '--step-color': step.color,
                  '--illumination-intensity': illumination.intensity
                }}
              >
                <div className="step-connector">
                  <div className={`step-dot ${illumination.isIlluminated ? 'illuminated' : ''}`}></div>
                  {index < steps.length - 1 && (
                    <div className={`step-line ${illumination.isIlluminated ? 'illuminated' : ''}`}></div>
                  )}
                </div>
                
                <div className={`step-content ${illumination.isIlluminated ? 'illuminated' : ''}`}>
                  <div className={`step-number ${illumination.isIlluminated ? 'illuminated' : ''}`}>
                    {step.number}
                  </div>
                  <div className={`step-icon ${illumination.isIlluminated ? 'illuminated' : ''}`}>
                    <i className={step.icon}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
