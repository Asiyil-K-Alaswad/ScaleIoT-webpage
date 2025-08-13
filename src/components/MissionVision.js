import React, { useEffect, useRef, useState } from 'react';

const MissionVision = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className="mission-vision-section" 
      id="mission-vision"
      ref={sectionRef}
      aria-labelledby="mv-heading"
    >
      <div className="container">
        {/* Section Divider */}
        <div className="section-divider"></div>
        
        {/* Eyebrow */}
        <div className={`eyebrow ${isVisible ? 'fade-in' : ''}`}>
          About ScaleIoT
        </div>

        {/* Main Heading */}
        <h1 id="mv-heading" className={`section-heading ${isVisible ? 'fade-in' : ''}`}>
          Our Mission & Vision
        </h1>

        {/* Mission & Vision Cards Container */}
        <div className="mv-cards-container">
          {/* Mission Card */}
          <div className={`mv-card mission-card ${isVisible ? 'slide-in-left' : ''}`}>
            <div className="card-header">
              <h2 id="mission-heading">Mission</h2>
            </div>
            <div className="card-content">
              <p className="mission-text">
              ScaleIoT removes parking friction and boosts site performance. We digitize entry, guidance, and payment, so drivers save time and organizations gain footfall, satisfaction, utilization, and efficiency. Built for usability, privacy, peak resilience, and loyalty.
              </p>
              
            </div>
          </div>


          {/* Vision Card */}
          <div className={`mv-card vision-card ${isVisible ? 'slide-in-right' : ''}`}>
            <div className="card-header">
              <h2 id="vision-heading">Vision</h2>
            </div>
            <div className="card-content">
              <div className="vision-statement">
                To create a world where finding a parking spot is 
                <span className="highlight-text"> no longer a concern</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;
