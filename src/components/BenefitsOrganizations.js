import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  Target,
  Zap,
  Building2,
  Heart,
  Gauge
} from 'lucide-react';

const BenefitsOrganizations = () => {
  const benefitsRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState({ 'business-benefits': false });

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
      icon: Heart,
      title: "Boost Customer Satisfaction",
      description: "Happy parking = happy customers. When visitors arrive stress-free, they stay longer and spend more.",
      metric: "+35% retention",
      impact: "Proven customer loyalty increase",
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100"
    },
    {
      icon: TrendingUp,
      title: "Increase Footfall & Revenue",
      description: "Remove parking friction to attract more visitors. Easy parking means more frequent visits and higher spending.",
      metric: "+40% visits",
      impact: "More customers choose your venue",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      icon: Gauge,
      title: "Optimize Space Utilization",
      description: "Smart allocation and real-time monitoring maximize capacity without new construction.",
      metric: "+25% efficiency",
      impact: "Serve more cars, same space",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: DollarSign,
      title: "Reduce Operating Costs",
      description: "Automation cuts staffing needs and eliminates ticket-related expenses and maintenance.",
      metric: "-60% costs",
      impact: "Significant OPEX savings",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: BarChart3,
      title: "Enhanced Revenue Tracking",
      description: "Digital payments prevent revenue leakage. Enable premium services and dynamic pricing.",
      metric: "Zero leakage",
      impact: "Complete financial transparency",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100"
    },
    {
      icon: Target,
      title: "Data-Driven Insights",
      description: "Rich analytics on usage patterns, peak times, and customer behavior for smarter decisions.",
      metric: "Real-time data",
      impact: "Strategic decision making",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    }
  ];

  const caseStudy = {
    title: "UAE Mall Case Study",
    results: [
      { value: "35%", label: "Customer Retention Increase" },
      { value: "47%", label: "Reduced Search Time" },
      { value: "23%", label: "Revenue Growth" },
      { value: "90%", label: "Customer Satisfaction" }
    ]
  };

  return (
    <section id="business-benefits" className="benefits-organizations" ref={benefitsRef}>
      <div className="container">
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible['business-benefits'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="badge">
              <Building2 className="badge-icon" />
              <span>Smart Business Benefits</span>
            </div>
            <h2>
              Transform Parking into a <span className="highlight">Competitive Advantage</span>
            </h2>
            <p>
              ScaleIoT doesn't just solve parking problems – it drives customer loyalty, 
              operational efficiency, and revenue growth for your business
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible['business-benefits'] ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <div className="benefit-card">
                <div className={`benefit-accent ${benefit.gradient}`}></div>
                <div className="benefit-content">
                  <div className="benefit-header">
                    <div className={`benefit-icon-bg ${benefit.bgGradient}`}>
                      <benefit.icon className="benefit-icon" />
                    </div>
                    <div className="benefit-metric">
                      {benefit.metric}
                    </div>
                  </div>
                  
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                  <div className="benefit-impact">
                    ✓ {benefit.impact}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BenefitsOrganizations;
