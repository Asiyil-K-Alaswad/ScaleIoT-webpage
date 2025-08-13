import React, { useEffect, useRef, useState, useCallback } from 'react';

const Hero = ({ openBetaForm, openContactForm }) => {
  const heroRef = useRef(null);
  const animationRef = useRef(null);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Grid configuration for hero animation - larger and more detailed
  const GRID_SIZE = 20;
  const LOT_WIDTH = 24;
  const LOT_HEIGHT = 18;
  const SPOT_WIDTH = 2;
  const SPOT_HEIGHT = 1.5;

  // Generate parking lot grid for hero
  useEffect(() => {
    const spots = [];

    // Generate parking spots
    for (let row = 1; row < LOT_HEIGHT - 1; row++) {
      for (let col = 1; col < LOT_WIDTH - 1; col++) {
        // Skip road areas
        if (row % 3 === 2 || col % 4 === 2) continue;
        
        // Create spot with some randomness
        if (Math.random() > 0.2) {
          spots.push({
            id: `${row}-${col}`,
            x: col * GRID_SIZE + (GRID_SIZE - SPOT_WIDTH * GRID_SIZE) / 2,
            y: row * GRID_SIZE + (GRID_SIZE - SPOT_HEIGHT * GRID_SIZE) / 2,
            width: SPOT_WIDTH * GRID_SIZE,
            height: SPOT_HEIGHT * GRID_SIZE,
            occupied: Math.random() > 0.7,
            row,
            col
          });
        }
      }
    }

    setParkingSpots(spots);
  }, []);

  // Simple pathfinding for hero animation
  const findPath = useCallback((start, end) => {
    const path = [];
    let current = { ...start };
    
    while (current.row !== end.row || current.col !== end.col) {
      path.push({
        x: current.col * GRID_SIZE + GRID_SIZE / 2,
        y: current.row * GRID_SIZE + GRID_SIZE / 2
      });
      
      if (current.row < end.row) current.row++;
      else if (current.row > end.row) current.row--;
      
      if (current.col < end.col) current.col++;
      else if (current.col > end.col) current.col--;
    }
    
    path.push({
      x: end.col * GRID_SIZE + GRID_SIZE / 2,
      y: end.row * GRID_SIZE + GRID_SIZE / 2
    });
    
    return path;
  }, []);

  // Generate random route for hero
  const generateRoute = useCallback(() => {
    if (parkingSpots.length < 2) return;
    
    const start = parkingSpots[Math.floor(Math.random() * parkingSpots.length)];
    const end = parkingSpots[Math.floor(Math.random() * parkingSpots.length)];
    
    if (start.id !== end.id) {
      const path = findPath(start, end);
      if (path) {
        setCurrentPath(path);
        setAnimationProgress(0);
      }
    }
  }, [parkingSpots, findPath]);

  // Animate route tracing
  useEffect(() => {
    if (currentPath.length > 0) {
      const animate = () => {
        setAnimationProgress(prev => {
          const newProgress = prev + 0.02;
          if (newProgress >= 1) {
            // Generate new route when current one completes
            setTimeout(generateRoute, 800);
            return 0;
          }
          return newProgress;
        });
      };

      animationRef.current = setInterval(animate, 60);
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    }
  }, [currentPath, generateRoute]);

  // Generate new route periodically
  useEffect(() => {
    const routeInterval = setInterval(generateRoute, 6000);
    return () => clearInterval(routeInterval);
  }, [generateRoute]);

  // Scroll-based zoom and movement effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
