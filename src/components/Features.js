import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Brain, 
  Navigation, 
  CreditCard, 
  Heart,
  BarChart3,
  Shield,
  Zap,
  Users,
  MapPin
} from 'lucide-react';

const Features = () => {
  const featuresRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState({ features: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Camera,
      title: "ANPR Technology",
      description: "Advanced camera sensors detect and recognize license plates instantly",
      benefit: "Faster entry, no lost tickets",
      gradient: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: Brain,
      title: "Smart Assignment",
      description: "AI engine allocates optimal spots based on real-time data and preferences",
      benefit: "Best spot every time",
      gradient: "from-purple-500 to-purple-600", 
      delay: 0.2
    },
    {
      icon: Navigation,
      title: "Real-Time Navigation",
      description: "Turn-by-turn directions to your spot via app or digital signage",
      benefit: "Zero search time",
      gradient: "from-green-500 to-green-600",
      delay: 0.3
    },
    {
      icon: CreditCard,
      title: "Auto Payment",
      description: "Seamless payment processing on exit with digital receipts",
      benefit: "Cashless, contactless",
      gradient: "from-orange-500 to-orange-600",
      delay: 0.4
    },
    {
      icon: Heart,
      title: "User Preferences",
      description: "Personalized parking based on your habits and requirements",
      benefit: "Tailored experience",
      gradient: "from-pink-500 to-pink-600",
      delay: 0.5
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights for operators on usage, revenue, and efficiency",
      benefit: "Data-driven decisions",
      gradient: "from-indigo-500 to-indigo-600",
      delay: 0.6
    }
  ];

  const stats = [
    { value: "99.9%", label: "Recognition Accuracy", icon: Shield },
    { value: "<2sec", label: "Gate Response Time", icon: Zap },
    { value: "24/7", label: "System Availability", icon: Users },
    { value: "150+", label: "Spots Managed", icon: MapPin }
  ];

  return (
    <section id="features" className="features" ref={featuresRef}>
      <div className="container">
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="badge">
              Technology That Works
            </div>
            <h2>
              Powerful Features, <span className="highlight">Simple Experience</span>
            </h2>
            <p>
              Cutting-edge IoT technology and AI combine to create the smartest parking solution available
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: feature.delay }}
            >
              <div className="feature-card">
                <motion.div 
                  className={`feature-icon-bg ${feature.gradient}`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="feature-icon" />
                </motion.div>
                
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                
                <div className="feature-benefit">
                  ✓ {feature.benefit}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="stats-section"
        >
          <div className="stats-header">
            <h3>Performance You Can Trust</h3>
            <p>Industry-leading reliability and speed</p>
          </div>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible.features ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-icon-bg">
                  <stat.icon className="stat-icon" />
                </div>
                <div className="stat-value">
                  {stat.value}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
