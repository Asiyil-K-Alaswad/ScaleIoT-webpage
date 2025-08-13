import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const SmartParkingBackground = ({
  routeCount = 3,
  routeDuration = 8,
  routeVariance = 0.3,
  opacity = 0.4,
  isPaused = false,
  className = ""
}) => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef(null);
  const routeIdCounter = useRef(0);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ 
          width: Math.max(clientWidth, 800), 
          height: Math.max(clientHeight, 600) 
        });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Generate parking lot geometry
  const parkingLot = useMemo(() => {
    const { width, height } = dimensions;
    const padding = 80;
    const spotWidth = 40;
    const spotHeight = 20;
    const aisleWidth = 60;
    
    // Calculate grid dimensions
    const cols = Math.floor((width - padding * 2) / (spotWidth + aisleWidth));
    const rows = Math.floor((height - padding * 2) / (spotHeight * 2 + aisleWidth));
    
    const spots = [];
    const aisles = [];
    const gates = [];
    
    // Create parking spots and aisles
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = padding + col * (spotWidth + aisleWidth);
        const y = padding + row * (spotHeight * 2 + aisleWidth);
        
        // Top row of spots
        spots.push({
          id: `${row}-${col}-top`,
          x: x + aisleWidth / 2,
          y: y,
          width: spotWidth,
          height: spotHeight,
          aisleConnection: { x: x + aisleWidth / 2 + spotWidth / 2, y: y + spotHeight }
        });
        
        // Bottom row of spots
        spots.push({
          id: `${row}-${col}-bottom`,
          x: x + aisleWidth / 2,
          y: y + spotHeight + aisleWidth,
          width: spotWidth,
          height: spotHeight,
          aisleConnection: { x: x + aisleWidth / 2 + spotWidth / 2, y: y + spotHeight + aisleWidth }
        });
        
        // Aisle segment
        aisles.push({
          id: `aisle-${row}-${col}`,
          x1: x + aisleWidth / 2,
          y1: y + spotHeight,
          x2: x + aisleWidth / 2 + spotWidth,
          y2: y + spotHeight,
          nodes: [
            { x: x + aisleWidth / 2, y: y + spotHeight },
            { x: x + aisleWidth / 2 + spotWidth, y: y + spotHeight }
          ]
        });
      }
    }
    
    // Create main connecting aisles (vertical)
    for (let col = 0; col < cols; col++) {
      const x = padding + col * (spotWidth + aisleWidth) + aisleWidth / 2 + spotWidth / 2;
      aisles.push({
        id: `main-vertical-${col}`,
        x1: x,
        y1: padding,
        x2: x,
        y2: height - padding,
        isMain: true
      });
    }
    
    // Create entrance gates
    gates.push({
      id: 'main-gate',
      x: padding + aisleWidth / 2 + spotWidth / 2,
      y: padding,
      direction: 'south'
    });
    
    // Additional side gate if space allows
    if (cols > 3) {
      gates.push({
        id: 'side-gate',
        x: width - padding,
        y: padding + (rows * (spotHeight * 2 + aisleWidth)) / 2,
        direction: 'west'
      });
    }
    
    return { spots, aisles, gates, cols, rows };
  }, [dimensions]);

  // Path finding utility
  const findPath = (start, end) => {
    const path = [];
    
    // Simple pathfinding: go to end x, then end y
    if (start.x !== end.x) {
      path.push({ x: end.x, y: start.y });
    }
    path.push({ x: end.x, y: end.y });
    
    return [start, ...path];
  };

  // Generate route animation
  const createRoute = () => {
    if (parkingLot.gates.length === 0 || parkingLot.spots.length === 0) return null;
    
    const gate = parkingLot.gates[Math.floor(Math.random() * parkingLot.gates.length)];
    const spot = parkingLot.spots[Math.floor(Math.random() * parkingLot.spots.length)];
    
    const startPoint = { x: gate.x, y: gate.y };
    const endPoint = spot.aisleConnection;
    
    const path = findPath(startPoint, endPoint);
    const pathString = `M ${path.map(p => `${p.x} ${p.y}`).join(' L ')}`;
    
    return {
      id: routeIdCounter.current++,
      path: pathString,
      duration: routeDuration * (1 + (Math.random() - 0.5) * routeVariance),
      delay: Math.random() * 2
    };
  };

  // Route management
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const spawnRoute = () => {
      const route = createRoute();
      if (!route) return;

      setActiveRoutes(prev => {
        // Remove completed routes and add new one
        const filtered = prev.filter(r => Date.now() - r.startTime < r.duration * 1000 + 2000);
        return [...filtered, { ...route, startTime: Date.now() }];
      });
    };

    // Initial routes
    for (let i = 0; i < routeCount; i++) {
      setTimeout(spawnRoute, i * 1000);
    }

    // Continuous spawning
    const interval = setInterval(() => {
      if (activeRoutes.length < routeCount) {
        spawnRoute();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [parkingLot, routeCount, routeDuration, routeVariance, prefersReducedMotion, isPaused]);

  // Pause animation when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Animation pausing is handled by the isPaused prop
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div 
        ref={containerRef}
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{ opacity }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full"
        >
          <defs>
            <filter id="glow-static">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Static parking lot */}
          <g filter="url(#glow-static)">
            {parkingLot.spots.map((spot) => (
              <rect
                key={spot.id}
                x={spot.x}
                y={spot.y}
                width={spot.width}
                height={spot.height}
                fill="none"
                stroke="#FE662E"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            
            {parkingLot.aisles.map((aisle) => (
              <line
                key={aisle.id}
                x1={aisle.x1}
                y1={aisle.y1}
                x2={aisle.x2}
                y2={aisle.y2}
                stroke="#FE662E"
                strokeWidth={aisle.isMain ? "2" : "1"}
                opacity="0.4"
              />
            ))}
            
            {parkingLot.gates.map((gate) => (
              <circle
                key={gate.id}
                cx={gate.x}
                cy={gate.y}
                r="4"
                fill="#FE662E"
                opacity="0.8"
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Static parking infrastructure */}
        <g filter="url(#glow)" opacity="0.3">
          {parkingLot.spots.map((spot) => (
            <rect
              key={spot.id}
              x={spot.x}
              y={spot.y}
              width={spot.width}
              height={spot.height}
              fill="none"
              stroke="#FE662E"
              strokeWidth="1"
            />
          ))}
          
          {parkingLot.aisles.map((aisle) => (
            <line
              key={aisle.id}
              x1={aisle.x1}
              y1={aisle.y1}
              x2={aisle.x2}
              y2={aisle.y2}
              stroke="#FE662E"
              strokeWidth={aisle.isMain ? "2" : "1"}
            />
          ))}
          
          {parkingLot.gates.map((gate) => (
            <circle
              key={gate.id}
              cx={gate.x}
              cy={gate.y}
              r="3"
              fill="#FE662E"
              opacity="0.8"
            />
          ))}
        </g>
        
        {/* Animated routes */}
        <g filter="url(#route-glow)">
          <AnimatePresence>
            {activeRoutes.map((route) => (
              <motion.path
                key={route.id}
                d={route.path}
                fill="none"
                stroke="#FE662E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ 
                  pathLength: 0,
                  opacity: 0
                }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0, 0.8, 0.8, 0]
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.5 }
                }}
                transition={{
                  pathLength: { 
                    duration: route.duration,
                    ease: "easeInOut",
                    delay: route.delay
                  },
                  opacity: {
                    duration: route.duration + 1,
                    times: [0, 0.1, 0.9, 1],
                    delay: route.delay
                  }
                }}
              />
            ))}
          </AnimatePresence>
        </g>
        
        {/* Route end indicators */}
        <AnimatePresence>
          {activeRoutes.map((route) => {
            const pathParts = route.path.split(' ');
            const lastPoint = pathParts[pathParts.length - 1].split(' ');
            const endX = parseFloat(lastPoint[0]);
            const endY = parseFloat(lastPoint[1]);
            
            return (
              <motion.circle
                key={`end-${route.id}`}
                cx={endX}
                cy={endY}
                r="0"
                fill="#FE662E"
                initial={{ r: 0, opacity: 0 }}
                animate={{ 
                  r: [0, 6, 4],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  delay: route.delay + route.duration - 0.5,
                  times: [0, 0.5, 1]
                }}
              />
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default SmartParkingBackground;