import React, { useEffect, useRef, useState } from 'react';
import { teamMembers, associations, contentConfig } from '../data/teamData';
import Picture1 from '../assets/Picture1.png';
import Picture2 from '../assets/Picture2.png';
import uhubLogo from '../assets/uhub.webp';
import uniLogo from '../assets/uni.png';

const CredibilityBuilders = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedBios, setExpandedBios] = useState({});
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

  const toggleBio = (memberId) => {
    setExpandedBios(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Image mapping for imported assets
  const imageMap = {
    './ScaleIoT-webpage/Picture1.png': Picture1,
    './ScaleIoT-webpage/Picture2.png': Picture2,
    './ScaleIoT-webpage/uhub.webp': uhubLogo,
    './ScaleIoT-webpage/uni.png': uniLogo,
  };

  return (
    <section 
      className="credibility-builders-section" 
      id="credibility-builders"
      ref={sectionRef}
      aria-labelledby="cb-heading"
    >
      <div className="container">
        {/* Section Divider */}
        <div className="section-divider"></div>
        
        {/* Eyebrow */}
        <div className={`eyebrow ${isVisible ? 'fade-in' : ''}`}>
          {contentConfig.sectionEyebrow}
        </div>

        {/* Main Heading */}
        <h2 id="cb-heading" className={`section-heading ${isVisible ? 'fade-in' : ''}`}>
          {contentConfig.mainHeading}
        </h2>

        {/* Subheading */}
        <p className={`section-subheading ${isVisible ? 'fade-in' : ''}`}>
          {contentConfig.subheading}
        </p>

        {/* Team Grid */}
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className={`team-card ${isVisible ? 'stagger-fade-in' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Profile Photo/Avatar */}
              <div className="profile-photo-container">
                {member.showPhoto && member.photoUrl ? (
                  <img 
                    src={imageMap[member.photoUrl] || member.photoUrl} 
                    alt={`Portrait of ${member.name}`}
                    className="profile-photo"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div 
                    className="initials-avatar"
                    aria-label={`Photo not displayed by request; initials avatar for ${member.name}`}
                  >
                    {getInitials(member.name)}
                  </div>
                )}
                <div className="photo-ring"></div>
              </div>

              {/* Member Info */}
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">
                  {member.role}
                </p>
              

                {/* Bio (collapsible on mobile) */}
                {member.bio && (
                  <div className="member-bio">
                    <p className={`bio-text ${expandedBios[member.id] ? 'expanded' : ''}`}>
                      {member.bio}
                    </p>
                  </div>
                )}

                {/* LinkedIn Link */}
                <a 
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link"
                  aria-label={`LinkedIn profile of ${member.name}`}
                >
                  <svg 
                    className="linkedin-icon" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <path 
                      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <rect 
                      x="2" 
                      y="9" 
                      width="4" 
                      height="12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="linkedin-text">{contentConfig.linkedinText}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Associations Row */}
        <div className={`associations-section ${isVisible ? 'fade-in-delayed' : ''}`}>
          <h3 className="associations-heading">{contentConfig.associationsHeading}</h3>
          
          <div className="associations-logos">
            {associations.map((association, index) => (
              <a 
                key={association.name}
                href={association.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="association-logo-link"
                aria-label={`Visit ${association.name} website`}
              >
                <img 
                  src={imageMap[association.logoSvg] || association.logoSvg}
                  alt={association.alt}
                  className="association-logo"
                  loading="lazy"
                />
              </a>
            ))}
          </div>

          <p className="associations-disclaimer">
            {contentConfig.associationsDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CredibilityBuilders;
