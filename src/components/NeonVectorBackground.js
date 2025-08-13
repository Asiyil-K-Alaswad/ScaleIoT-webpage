import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NeonVectorBackground = ({ scrollProgress = 0, isVisible = false }) => {
  const [activeRoutes, setActiveRoutes] = useState([]);
  const routeIdCounter = useRef(0);

  // Dynamic dimensions for responsive full-screen coverage
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  // Handle responsive sizing for full-screen coverage
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate parking lot geometry - responsive dimensions
  const parkingLot = useMemo(() => {
    const { width, height } = dimensions;
    const padding = Math.min(width, height) * 0.05; // 5% of smaller dimension
    const spotWidth = Math.min(width, height) * 0.02; // 2% of smaller dimension
    const spotHeight = spotWidth * 0.5; // Maintain aspect ratio
    const aisleWidth = spotWidth * 1.4; // Aisle width relative to spot width
    
    // Dynamic grid dimensions based on screen size
    const cols = Math.max(15, Math.floor((width - padding * 2) / (spotWidth + aisleWidth)));
    const rows = Math.max(10, Math.floor((height - padding * 2) / (spotHeight * 2 + aisleWidth)));
    
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
          occupied: Math.random() > 0.7,
          type: Math.random() > 0.8 ? 'premium' : 'standard',
          aisleConnection: { x: x + aisleWidth / 2 + spotWidth / 2, y: y + spotHeight }
        });
        
        // Bottom row of spots
        spots.push({
          id: `${row}-${col}-bottom`,
          x: x + aisleWidth / 2,
          y: y + spotHeight + aisleWidth,
          width: spotWidth,
          height: spotHeight,
          occupied: Math.random() > 0.7,
          type: Math.random() > 0.8 ? 'premium' : 'standard',
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
    
    // Additional side gate
    gates.push({
      id: 'side-gate',
      x: width - padding,
      y: padding + (rows * (spotHeight * 2 + aisleWidth)) / 2,
      direction: 'west'
    });
    
    return { spots, aisles, gates, cols, rows };
  }, []); // No dependencies since dimensions are fixed

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
      duration: 8 * (1 + (Math.random() - 0.5) * 0.3),
      delay: Math.random() * 2
    };
  };

  // Route management
  useEffect(() => {
    if (!isVisible) return;

    const spawnRoute = () => {
      const route = createRoute();
      if (!route) return;

      setActiveRoutes(prev => {
        // Remove completed routes and add new one
        const filtered = prev.filter(r => Date.now() - r.startTime < r.duration * 1000 + 2000);
        return [...filtered, { ...route, startTime: Date.now() }];
      });
    };

    // Cleanup function to remove expired routes
    const cleanupRoutes = () => {
      setActiveRoutes(prev => 
        prev.filter(r => Date.now() - r.startTime < r.duration * 1000 + 2000)
      );
    };

    // Initial routes
    for (let i = 0; i < 3; i++) {
      setTimeout(spawnRoute, i * 1000);
    }

    // Continuous spawning and cleanup
    const spawnInterval = setInterval(() => {
      if (activeRoutes.length < 3) {
        spawnRoute();
      }
    }, 2000);

    // Cleanup interval - remove expired routes every second
    const cleanupInterval = setInterval(cleanupRoutes, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(cleanupInterval);
    };
  }, [parkingLot, isVisible, activeRoutes.length]);

  // Handle scroll-based zoom - but keep background fixed
  const zoomLevel = 1; // Fixed zoom level to prevent scroll-based movement

  if (!isVisible) return null;

  return (
    <div 
      className="fixed pointer-events-none"
              style={{ 
          position: 'fixed',
          zIndex: -9999,
          opacity: 0.5,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          minWidth: '100vw',
          maxWidth: '100vw',
          transform: 'scale(1.3)',
          transformOrigin: 'center center',
          padding: '0',
          margin: '0',
          maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 1) 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 1) 100%)'
        }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100vw',
          height: '100vh',
          minWidth: '100vw',
          maxWidth: '100vw'
        }}
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
        <g filter="url(#glow)" opacity="0.4">
          {parkingLot.spots.map((spot) => (
            <rect
              key={spot.id}
              x={spot.x}
              y={spot.y}
              width={spot.width}
              height={spot.height}
              fill={spot.occupied ? '#666666' : 'none'}
              stroke="#888888"
              strokeWidth="1.5"
              opacity={spot.occupied ? 0.8 : 0.6}
              rx="2"
            />
          ))}
          
          {parkingLot.aisles.map((aisle) => (
            <line
              key={aisle.id}
              x1={aisle.x1}
              y1={aisle.y1}
              x2={aisle.x2}
              y2={aisle.y2}
              stroke="#666666"
              strokeWidth={aisle.isMain ? "2.5" : "1.5"}
              opacity="0.5"
            />
          ))}
          
          {parkingLot.gates.map((gate) => (
            <circle
              key={gate.id}
              cx={gate.x}
              cy={gate.y}
              r="4"
              fill="#888888"
              opacity="0.9"
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
                  opacity: [0, 0.9, 0.9, 0]
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.5 }
                }}
                onAnimationComplete={() => {
                  // Remove route immediately when animation completes
                  setTimeout(() => {
                    setActiveRoutes(prev => 
                      prev.filter(r => r.id !== route.id)
                    );
                  }, 1000); // Small delay to show completion
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
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3 }
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

export default NeonVectorBackground;
