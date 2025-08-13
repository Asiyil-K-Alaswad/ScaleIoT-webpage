import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Smile, 
  CreditCard, 
  Heart,
  Shield,
  MapPin
} from 'lucide-react';

const BenefitsDrivers = () => {
  const benefitsRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState({ 'driver-benefits': false });

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

    if (benefitsRef.current) {
      observer.observe(benefitsRef.current);
    }

    return () => {
      if (benefitsRef.current) {
        observer.unobserve(benefitsRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      icon: Clock,
      title: "Save Time, Park Faster",
      description: "Skip the search and go straight to your reserved spot. Studies show drivers save 15+ minutes per visit.",
      stat: "15min saved",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Smile,
      title: "Zero Stress Experience",
      description: "No tickets to lose, no queues to wait in. Start your visit relaxed and focused on what matters.",
      stat: "99% satisfaction",
      color: "text-green-600", 
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: CreditCard,
      title: "Seamless Digital Payments",
      description: "Automatic, cashless transactions with instant receipts. Never fumble for change again.",
      stat: "100% contactless",
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-200"
    },
    {
      icon: Heart,
      title: "Personalized Just for You",
      description: "Set preferences for covered spots, proximity to entrances, or accessibility needs. ScaleIoT remembers.",
      stat: "Custom preferences",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      icon: Shield,
      title: "Safe & Secure Parking",
      description: "Enhanced security with monitored entry/exit. Plus, no touching dirty surfaces or handling cash.",
      stat: "24/7 monitoring",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      icon: MapPin,
      title: "Never Lose Your Car",
      description: "The app remembers exactly where you parked. Real-time updates and navigation back to your vehicle.",
      stat: "GPS tracking",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <section id="driver-benefits" className="benefits-drivers" ref={benefitsRef}>
      <div className="container">
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible['driver-benefits'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="driver-badge">
              <Smile className="driver-badge-icon" />
              <span>Made for Drivers</span>
            </div>
            <h2>
              Why Drivers <span className="highlight">Love</span> ScaleIoT
            </h2>
            <p>
              Every feature is designed to eliminate parking stress and give you more time 
              for what you actually came to do
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="driver-benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible['driver-benefits'] ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`driver-benefit-card ${benefit.bgColor} ${benefit.borderColor}`}>
                <div className="driver-benefit-header">
                  <div className={`driver-benefit-icon-bg ${benefit.bgColor} ${benefit.borderColor}`}>
                    <benefit.icon className={`driver-benefit-icon ${benefit.color}`} />
                  </div>
                  <div className={`driver-benefit-stat ${benefit.color} ${benefit.bgColor} ${benefit.borderColor}`}>
                    {benefit.stat}
                  </div>
                </div>
                
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BenefitsDrivers;
