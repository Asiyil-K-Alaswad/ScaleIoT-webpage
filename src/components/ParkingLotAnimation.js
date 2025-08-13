import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Group } from 'react-konva';

const ParkingLotAnimation = ({ scrollProgress = 0, isVisible = false }) => {
  const stageRef = useRef(null);
  const animationRef = useRef(null);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Grid configuration
  const GRID_SIZE = 40;
  const LOT_WIDTH = 20; // grid units
  const LOT_HEIGHT = 15; // grid units
  const SPOT_WIDTH = 3;
  const SPOT_HEIGHT = 2;
  const ROAD_WIDTH = 2;

  // Colors
  const NEON_ORANGE = '#FE662E';
  const NEON_ORANGE_GLOW = 'rgba(254, 102, 46, 0.3)';

  // Generate parking lot grid
  useEffect(() => {
    const spots = [];
    const lotPaths = [];

    // Create main entrance road
    const entranceRoad = [];
    for (let i = 0; i < LOT_WIDTH; i++) {
      entranceRoad.push({ x: i * GRID_SIZE, y: 0 });
    }
    lotPaths.push(entranceRoad);

    // Create horizontal roads
    for (let row = 2; row < LOT_HEIGHT - 2; row += 3) {
      const road = [];
      for (let i = 0; i < LOT_WIDTH; i++) {
        road.push({ x: i * GRID_SIZE, y: row * GRID_SIZE });
      }
      lotPaths.push(road);
    }

    // Create vertical roads
    for (let col = 2; col < LOT_WIDTH - 2; col += 4) {
      const road = [];
      for (let i = 0; i < LOT_HEIGHT; i++) {
        road.push({ x: col * GRID_SIZE, y: i * GRID_SIZE });
      }
      lotPaths.push(road);
    }

    // Generate parking spots
    for (let row = 1; row < LOT_HEIGHT - 1; row++) {
      for (let col = 1; col < LOT_WIDTH - 1; col++) {
        // Skip road areas
        if (row % 3 === 2 || col % 4 === 2) continue;
        
        // Create spot with some randomness
        if (Math.random() > 0.3) {
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
    setPaths(lotPaths);
  }, []);

  // Simple A* pathfinding algorithm
  const findPath = useCallback((start, end) => {
    const openSet = [start];
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    gScore.set(`${start.row}-${start.col}`, 0);
    fScore.set(`${start.row}-${start.col}`, heuristic(start, end));

    while (openSet.length > 0) {
      // Find node with lowest fScore
      let current = openSet.reduce((lowest, node) => {
        const currentF = fScore.get(`${node.row}-${node.col}`) || Infinity;
        const lowestF = fScore.get(`${lowest.row}-${lowest.col}`) || Infinity;
        return currentF < lowestF ? node : lowest;
      });

      if (current.row === end.row && current.col === end.col) {
        // Reconstruct path
        const path = [];
        while (current) {
          path.unshift({
            x: current.col * GRID_SIZE + GRID_SIZE / 2,
            y: current.row * GRID_SIZE + GRID_SIZE / 2
          });
          current = cameFrom.get(`${current.row}-${current.col}`);
        }
        return path;
      }

      openSet.splice(openSet.indexOf(current), 1);
      
      // Check neighbors
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const tentativeG = (gScore.get(`${current.row}-${current.col}`) || Infinity) + 1;
        const neighborKey = `${neighbor.row}-${neighbor.col}`;
        
        if (tentativeG < (gScore.get(neighborKey) || Infinity)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          fScore.set(neighborKey, tentativeG + heuristic(neighbor, end));
          
          if (!openSet.find(n => n.row === neighbor.row && n.col === neighbor.col)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    
    return null; // No path found
  }, []);

  // Heuristic function for A*
  const heuristic = (a, b) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  };

  // Get valid neighbors for pathfinding
  const getNeighbors = (node) => {
    const neighbors = [];
    const directions = [
      { row: -1, col: 0 }, { row: 1, col: 0 },
      { row: 0, col: -1 }, { row: 0, col: 1 }
    ];
    
    for (const dir of directions) {
      const newRow = node.row + dir.row;
      const newCol = node.col + dir.col;
      
      if (newRow >= 0 && newRow < LOT_HEIGHT && newCol >= 0 && newCol < LOT_WIDTH) {
        // Check if it's not a road area
        if (newRow % 3 !== 2 && newCol % 4 !== 2) {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }
    
    return neighbors;
  };

  // Generate random route
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
    if (currentPath.length > 0 && isVisible) {
      const animate = () => {
        setAnimationProgress(prev => {
          const newProgress = prev + 0.02;
          if (newProgress >= 1) {
            // Generate new route when current one completes
            setTimeout(generateRoute, 1000);
            return 0;
          }
          return newProgress;
        });
      };

      animationRef.current = setInterval(animate, 50);
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    }
  }, [currentPath, isVisible, generateRoute]);

  // Generate new route periodically
  useEffect(() => {
    if (isVisible) {
      const routeInterval = setInterval(generateRoute, 8000);
      return () => clearInterval(routeInterval);
    }
  }, [isVisible, generateRoute]);

  // Handle scroll-based zoom
  useEffect(() => {
    if (isVisible) {
      const newZoom = 1 + (scrollProgress * 0.3); // Zoom up to 30% on full scroll
      setZoomLevel(newZoom);
    }
  }, [scrollProgress, isVisible]);

  // Convert polyline to smooth path
  const polylineToPath = (points) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Create smooth curve
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) * 0.5;
      const cp2y = curr.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  // Calculate current path segment for animation
  const getCurrentPathSegment = () => {
    if (currentPath.length < 2) return [];
    
    const progress = animationProgress;
    const totalLength = currentPath.length - 1;
    const currentIndex = Math.floor(progress * totalLength);
    const segmentProgress = (progress * totalLength) % 1;
    
    const segment = currentPath.slice(0, currentIndex + 1);
    
    if (segmentProgress > 0 && currentIndex < totalLength) {
      const current = currentPath[currentIndex];
      const next = currentPath[currentIndex + 1];
      const interpolated = {
        x: current.x + (next.x - current.x) * segmentProgress,
        y: current.y + (next.y - current.y) * segmentProgress
      };
      segment.push(interpolated);
    }
    
    return segment;
  };

  if (!isVisible) return null;

  return (
    <div className="parking-lot-animation" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      opacity: 0.1,
      pointerEvents: 'none'
    }}>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        scale={{ x: zoomLevel, y: zoomLevel }}
        x={(window.innerWidth - LOT_WIDTH * GRID_SIZE * zoomLevel) / 2}
        y={(window.innerHeight - LOT_HEIGHT * GRID_SIZE * zoomLevel) / 2}
      >
        <Layer>
          {/* Static parking lot structure */}
          <Group>
            {/* Parking spots */}
            {parkingSpots.map((spot) => (
              <Rect
                key={spot.id}
                x={spot.x}
                y={spot.y}
                width={spot.width}
                height={spot.height}
                fill={spot.occupied ? NEON_ORANGE : 'transparent'}
                stroke={NEON_ORANGE}
                strokeWidth={1}
                opacity={spot.occupied ? 0.3 : 0.1}
              />
            ))}
            
            {/* Roads */}
            {paths.map((path, index) => (
              <Line
                key={`road-${index}`}
                points={path.flatMap(point => [point.x, point.y])}
                stroke={NEON_ORANGE}
                strokeWidth={ROAD_WIDTH * GRID_SIZE}
                opacity={0.05}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </Group>
          
          {/* Animated route tracing */}
          {currentPath.length > 0 && (
            <Line
              points={getCurrentPathSegment().flatMap(point => [point.x, point.y])}
              stroke={NEON_ORANGE}
              strokeWidth={3}
              opacity={0.8}
              lineCap="round"
              lineJoin="round"
              shadowColor={NEON_ORANGE}
              shadowBlur={10}
              shadowOpacity={0.6}
            />
          )}
          
          {/* Route endpoint indicators */}
          {currentPath.length > 0 && (
            <>
              <Rect
                x={currentPath[0].x - 8}
                y={currentPath[0].y - 8}
                width={16}
                height={16}
                fill={NEON_ORANGE}
                opacity={0.8}
                shadowColor={NEON_ORANGE}
                shadowBlur={15}
                shadowOpacity={0.8}
              />
              <Rect
                x={currentPath[currentPath.length - 1].x - 8}
                y={currentPath[currentPath.length - 1].y - 8}
                width={16}
                height={16}
                fill={NEON_ORANGE}
                opacity={0.8}
                shadowColor={NEON_ORANGE}
                shadowBlur={15}
                shadowOpacity={0.8}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default ParkingLotAnimation;
