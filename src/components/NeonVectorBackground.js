// NeonVectorBackground.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ORANGE = '#FE662E';
const INFRA_STROKE = '#666666';
const INFRA_STROKE_LIGHT = '#888888';

const NeonVectorBackground = ({
  scrollProgress = 0,
  isVisible = false,
  // NEW: how many traces to keep animating concurrently
  concurrentPaths = 3,
  // NEW: allow starting from a node inside the graph
  allowInternalGates = true,
}) => {
  const [activeRoutes, setActiveRoutes] = useState([]);
  const routeIdCounter = useRef(0);

  // Dynamic dimensions for responsive full-screen coverage
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  /**
   * Generate a synthetic "parking lot" grid of spots and aisles.
   */
  const parkingLot = useMemo(() => {
    const { width, height } = dimensions;
    const padding = Math.min(width, height) * 0.05;
    const spotWidth = Math.min(width, height) * 0.02;
    const spotHeight = spotWidth * 0.5;
    const aisleWidth = spotWidth * 1.4;

    const cols = Math.max(15, Math.floor((width - padding * 2) / (spotWidth + aisleWidth)));
    const rows = Math.max(10, Math.floor((height - padding * 2) / (spotHeight * 2 + aisleWidth)));

    const spots = [];
    const aisles = [];
    const gates = [];

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
          aisleConnection: { x: x + aisleWidth / 2 + spotWidth / 2, y: y + spotHeight },
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
          aisleConnection: { x: x + aisleWidth / 2 + spotWidth / 2, y: y + spotHeight + aisleWidth },
        });

        // Horizontal aisle segment between the two spot bands
        const hx1 = x + aisleWidth / 2;
        const hx2 = x + aisleWidth / 2 + spotWidth;
        const hy = y + spotHeight;

        aisles.push({
          id: `aisle-${row}-${col}`,
          x1: hx1,
          y1: hy,
          x2: hx2,
          y2: hy,
          isMain: false,
        });
      }
    }

    // Vertical mains
    for (let col = 0; col < cols; col++) {
      const x = padding + col * (spotWidth + aisleWidth) + aisleWidth / 2 + spotWidth / 2;
      aisles.push({
        id: `main-vertical-${col}`,
        x1: x,
        y1: padding,
        x2: x,
        y2: height - padding,
        isMain: true,
      });
    }

    // External gates (still supported)
    gates.push({
      id: 'main-gate',
      x: padding + aisleWidth / 2 + spotWidth / 2,
      y: padding,
      direction: 'south',
    });
    gates.push({
      id: 'side-gate',
      x: width - padding,
      y: padding + (rows * (spotHeight * 2 + aisleWidth)) / 2,
      direction: 'west',
    });

    return { spots, aisles, gates, cols, rows, padding, spotWidth, spotHeight, aisleWidth };
  }, [dimensions]);

  /**
   * Build a nav-graph from the aisles.
   */
  const graph = useMemo(() => {
    const nodes = new Map(); // key: "x|y"
    const neighbors = new Map();

    const keyOf = (x, y) => `${x}|${y}`;
    const addNode = (x, y) => {
      const key = keyOf(x, y);
      if (!nodes.has(key)) nodes.set(key, { x, y, key });
      if (!neighbors.has(key)) neighbors.set(key, []);
      return key;
    };
    const addEdge = (a, b, cost) => {
      neighbors.get(a).push({ key: b, cost });
      neighbors.get(b).push({ key: a, cost });
    };

    const horizontals = parkingLot.aisles.filter(a => a.y1 === a.y2);
    const verticals = parkingLot.aisles.filter(a => a.x1 === a.x2);

    const horizontalYs = Array.from(new Set(horizontals.map(h => h.y1))).sort((a, b) => a - b);
    const verticalXs = Array.from(new Set(verticals.map(v => v.x1))).sort((a, b) => a - b);

    horizontals.forEach(h => {
      const y = h.y1;
      const minX = Math.min(h.x1, h.x2);
      const maxX = Math.max(h.x1, h.x2);
      const crossings = verticalXs.filter(x => x >= minX && x <= maxX);
      const xs = Array.from(new Set([minX, ...crossings, maxX])).sort((a, b) => a - b);

      const keys = xs.map(x => addNode(x, y));
      for (let i = 0; i < keys.length - 1; i++) {
        const a = nodes.get(keys[i]);
        const b = nodes.get(keys[i + 1]);
        addEdge(keys[i], keys[i + 1], Math.abs(b.x - a.x));
      }
    });

    verticalXs.forEach(x => {
      const matching = verticals.filter(v => v.x1 === x);
      const minY = Math.min(...matching.map(v => Math.min(v.y1, v.y2)));
      const maxY = Math.max(...matching.map(v => Math.max(v.y1, v.y2)));
      const ys = horizontalYs.filter(y => y >= minY && y <= maxY).sort((a, b) => a - b);
      if (!ys.length) return;
      const keys = ys.map(y => addNode(x, y));
      for (let i = 0; i < keys.length - 1; i++) {
        const a = nodes.get(keys[i]);
        const b = nodes.get(keys[i + 1]);
        addEdge(keys[i], keys[i + 1], Math.abs(b.y - a.y));
      }
    });

    const nodeList = Array.from(nodes.values());
    const nearestNodeKey = (pt) => {
      let best = null;
      let bestD = Infinity;
      for (const n of nodeList) {
        const d = Math.abs(n.x - pt.x) + Math.abs(n.y - pt.y);
        if (d < bestD) { bestD = d; best = n.key; }
      }
      return best;
    };

    return { nodes, neighbors, nearestNodeKey, nodeList };
  }, [parkingLot]);

  /**
   * A* path-finding (Manhattan heuristic).
   */
  const aStar = (startKey, goalKey) => {
    if (!startKey || !goalKey || !graph.nodes.has(startKey) || !graph.nodes.has(goalKey)) return null;

    const h = (k) => {
      const a = graph.nodes.get(k);
      const b = graph.nodes.get(goalKey);
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };

    const open = new Set([startKey]);
    const cameFrom = new Map();

    const gScore = new Map([[startKey, 0]]);
    const fScore = new Map([[startKey, h(startKey)]]);

    const getLowestF = () => {
      let best = null;
      let bestScore = Infinity;
      for (const k of open) {
        const fs = fScore.get(k) ?? Infinity;
        if (fs < bestScore) { bestScore = fs; best = k; }
      }
      return best;
    };

    while (open.size) {
      const current = getLowestF();
      if (current === goalKey) {
        const path = [current];
        let c = current;
        while (cameFrom.has(c)) {
          c = cameFrom.get(c);
          path.push(c);
        }
        path.reverse();
        return path.map(k => graph.nodes.get(k));
      }

      open.delete(current);
      const gCurrent = gScore.get(current) ?? Infinity;

      for (const { key: nbKey, cost } of graph.neighbors.get(current) ?? []) {
        const tentativeG = gCurrent + cost;
        if (tentativeG < (gScore.get(nbKey) ?? Infinity)) {
          cameFrom.set(nbKey, current);
          gScore.set(nbKey, tentativeG);
          fScore.set(nbKey, tentativeG + h(nbKey));
          if (!open.has(nbKey)) open.add(nbKey);
        }
      }
    }

    return null;
  };

  const pathToD = (pts) => {
    if (!pts || pts.length === 0) return '';
    const head = `M ${pts[0].x} ${pts[0].y}`;
    const rest = pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    return `${head} ${rest}`;
  };

  const totalPathLength = (pts) => {
    let len = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      len += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    }
    return len;
  };

  // Helper to choose a start node: internal or from external gates
  const chooseStartKey = () => {
    // If internal gates allowed, often start somewhere inside the graph
    if (allowInternalGates && graph.nodeList.length && Math.random() < 0.7) {
      const n = graph.nodeList[Math.floor(Math.random() * graph.nodeList.length)];
      return n.key;
    }
    // Fallback to external gates (snapped)
    if (parkingLot.gates.length) {
      const gate = parkingLot.gates[Math.floor(Math.random() * parkingLot.gates.length)];
      return graph.nearestNodeKey({ x: gate.x, y: gate.y });
    }
    // As a final fallback: just pick any node
    if (graph.nodeList.length) return graph.nodeList[0].key;
    return null;
  };

  /**
   * Create a route: start could be internal; goal is a spot aisle-connection (snapped).
   */
  const createRoute = () => {
    if (!graph.nodeList.length || parkingLot.spots.length === 0) return null;

    const startKey = chooseStartKey();
    const spot = parkingLot.spots[Math.floor(Math.random() * parkingLot.spots.length)];
    const goalKey = graph.nearestNodeKey(spot.aisleConnection);

    let nodesPath = aStar(startKey, goalKey);
    if (!nodesPath || nodesPath.length < 2) {
      const start = graph.nodes.get(startKey);
      const goal = graph.nodes.get(goalKey);
      nodesPath = [start, { x: goal.x, y: start.y }, goal];
    }

    const d = pathToD(nodesPath);
    const length = totalPathLength(nodesPath);
    const duration = 1;//Math.max(3, Math.min(11, length / 130)); // slightly brisker

    return {
      id: routeIdCounter.current++,
      nodesPath,
      d,
      length,
      duration,
      delay: 0.05 + Math.random() , // small jitter so starts feel organic
    };
  };

  /**
   * Route manager: maintain up to `concurrentPaths` active routes.
   */
  useEffect(() => {
    if (!isVisible) return;

    const target = Math.max(1, Math.min(20, Math.floor(concurrentPaths)));

    const prune = (now, list) =>
      list.filter(r => now - r.startTime < (r.duration + 1.2) * 1000);

    const topUp = () => {
      const now = Date.now();
      setActiveRoutes(prev => {
        const filtered = prune(now, prev);
        const deficit = target - filtered.length;
        if (deficit <= 0) return filtered;

        const additions = [];
        for (let i = 0; i < deficit; i++) {
          const route = createRoute();
          if (route) {
            additions.push({
              ...route,
              // stagger tiny delays so they don't all start on the same frame
              delay: route.delay + i * 0.12,
              startTime: now + i * 100,
            });
          }
        }
        return [...filtered, ...additions];
      });
    };

    // Fill immediately up to target
    topUp();

    // Check often and top up as routes complete
    const tick = setInterval(topUp, 450);

    // Periodic prune (safety)
    const cleanup = setInterval(() => {
      const now = Date.now();
      setActiveRoutes(prev => prune(now, prev));
    }, 800);

    return () => {
      clearInterval(tick);
      clearInterval(cleanup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, parkingLot, graph.nearestNodeKey, concurrentPaths, allowInternalGates]);

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
        maskImage:
          'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 1) 100%)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 1) 100%)',
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
          maxWidth: '100vw',
        }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static parking infrastructure */}
        <g filter="url(#glow)" opacity="0.45">
          {parkingLot.spots.map((spot) => (
            <rect
              key={spot.id}
              x={spot.x}
              y={spot.y}
              width={spot.width}
              height={spot.height}
              fill={spot.occupied ? INFRA_STROKE : 'none'}
              stroke={INFRA_STROKE_LIGHT}
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
              stroke={INFRA_STROKE}
              strokeWidth={aisle.isMain ? '2.5' : '1.5'}
              opacity={aisle.isMain ? 0.65 : 0.5}
            />
          ))}

          {/* External gates (visual) */}
          {parkingLot.gates.map((gate) => (
            <circle key={gate.id} cx={gate.x} cy={gate.y} r="4" fill={INFRA_STROKE_LIGHT} opacity="0.9" />
          ))}
        </g>

        {/* Path-finding traces */}
        <g filter="url(#route-glow)">
          <AnimatePresence>
            {activeRoutes.map((route) => (
              <g key={route.id}>
                {/* Base neon grow (trace reveal) */}
                <motion.path
                  d={route.d}
                  fill="none"
                  stroke={ORANGE}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.95, 0.9, 0.0] }}
                  transition={{
                    pathLength: { duration: route.duration, ease: 'easeInOut', delay: route.delay },
                    opacity: { duration: route.duration + 1, times: [0, 0.08, 0.9, 1], delay: route.delay },
                  }}
                  onAnimationComplete={() => {
                    setTimeout(() => {
                      setActiveRoutes(prev => prev.filter(r => r.id !== route.id));
                    }, 800);
                  }}
                />

                {/* Marching dashes overlay */}
                <motion.path
                  d={route.d}
                  fill="none"
                  stroke={ORANGE}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.7"
                  strokeDasharray="6 10"
                  initial={{ strokeDashoffset: 0, opacity: 0 }}
                  animate={{ strokeDashoffset: [-0, -40], opacity: [0, 0.9, 0.7, 0] }}
                  transition={{
                    strokeDashoffset: {
                      duration: 1.2,
                      repeat: Math.ceil(route.duration / 1.2),
                      ease: 'linear',
                      delay: route.delay + 0.2,
                    },
                    opacity: {
                      duration: route.duration,
                      times: [0, 0.15, 0.85, 1],
                      delay: route.delay,
                    },
                  }}
                />

                {/* Breadcrumb pulses */}
                {route.nodesPath.map((p, i) => {
                  const t = route.delay + (route.duration * (i / Math.max(1, route.nodesPath.length - 1)));
                  return (
                    <motion.circle
                      key={`${route.id}-crumb-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r="0"
                      fill={ORANGE}
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: [0, 3.2, 2.2, 0], opacity: [0, 1, 0.9, 0] }}
                      transition={{ duration: 0.75, times: [0, 0.4, 0.8, 1], delay: t, ease: 'easeOut' }}
                    />
                  );
                })}

                {/* Start & end blips */}
                {route.nodesPath.length > 1 && (
                  <>
                    <motion.circle
                      cx={route.nodesPath[0].x}
                      cy={route.nodesPath[0].y}
                      r="0"
                      fill={ORANGE}
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: [0, 5, 3], opacity: [0, 1, 0.6] }}
                      transition={{ duration: 0.6, delay: route.delay }}
                    />
                    <motion.circle
                      cx={route.nodesPath[route.nodesPath.length - 1].x}
                      cy={route.nodesPath[route.nodesPath.length - 1].y}
                      r="0"
                      fill={ORANGE}
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: [0, 6, 4], opacity: [0, 1, 0] }}
                      transition={{ duration: 1, delay: route.delay + route.duration - 0.4 }}
                    />
                  </>
                )}
              </g>
            ))}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  );
};

export default NeonVectorBackground;
