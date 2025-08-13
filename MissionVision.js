
import React from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Clock, 
  BarChart3, 
  Users, 
  Shield,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MissionVision({ isVisible }) {
  const pillars = [
    {
      icon: Clock,
      title: "Time Well Spent",
      description: "Shorten search and queue time; reduce peak-hour frustration"
    },
    {
      icon: BarChart3,
      title: "Smarter Operations", 
      description: "Higher utilization, clearer analytics, lower labor & leakage"
    },
    {
      icon: Users,
      title: "Happier Visitors",
      description: "Smoother arrivals increase dwell time & propensity to spend"
    },
    {
      icon: Shield,
      title: "Trust by Design",
      description: "Privacy-first data handling, accessible UX, transparent billing"
    }
  ];

  const metrics = [
    { value: "85%", label: "Search Time Reduction" },
    { value: "35%", label: "Customer Retention" },
    { value: "25%", label: "Utilization Increase" }
  ];

  return (
    <div id="mission-vision" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FE662E 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Section Divider */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible['mission-vision'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-4 border-orange-200 text-orange-300 bg-orange-500/10 px-4 py-2">
              About ScaleIoT
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Mission & <span className="text-orange-500">Vision</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Mission Card - Left Side */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible['mission-vision'] ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Mission</h3>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  ScaleIoT's mission is to <span className="text-orange-400 font-medium">remove parking friction for people</span> and <span className="text-orange-400 font-medium">unlock performance for places</span>. 
                  We digitize the end-to-end journey—automatic entry via license-plate recognition, congestion-aware guidance to the most suitable spot, and seamless, cashless exit—so drivers spend less time parking and more time at their destination, while organizations increase footfall, tenant satisfaction, parking utilization, and operational efficiency.
                </p>

                <div className="space-y-4">
                  <p className="text-gray-400 text-sm mb-4">What this enables:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pillars.map((pillar, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 group/pillar cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible['mission-vision'] ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/pillar:bg-orange-500/20 transition-colors duration-300">
                          <pillar.icon className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1 group-hover/pillar:text-orange-300 transition-colors duration-300">
                            {pillar.title}
                          </h4>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision Card - Right Side */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible['mission-vision'] ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group h-full">
              <CardContent className="p-8 lg:p-10 flex flex-col justify-center h-full text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6">Vision</h3>
                </div>
                
                <div className="relative">
                  <motion.h4 
                    className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    To create a world where finding a parking spot is{" "}
                    <motion.span 
                      className="text-orange-400 relative"
                      whileHover={{ color: "#FE662E" }}
                    >
                      no more a concern
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500"
                        initial={{ width: "0%" }}
                        animate={isVisible['mission-vision'] ? { width: "100%" } : {}}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </motion.span>
                  </motion.h4>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-4 opacity-20">
                    <Sparkles className="w-8 h-8 text-orange-400" />
                  </div>
                </div>

                <p className="text-gray-400 italic text-lg mt-6">
                  "From the first scan to the last mile, ScaleIoT turns parking into a quiet, invisible service."
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Connector Line Animation */}
        <motion.div
          className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={isVisible['mission-vision'] ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <svg width="120" height="4" viewBox="0 0 120 4" className="overflow-visible">
            <defs>
              <linearGradient id="connector-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FE662E" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FE662E" stopOpacity="1" />
                <stop offset="100%" stopColor="#FE662E" stopOpacity="0.6" />
              </linearGradient>
              <filter id="connector-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d="M 0 2 L 120 2"
              stroke="url(#connector-gradient)"
              strokeWidth="2"
              fill="none"
              filter="url(#connector-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isVisible['mission-vision'] ? { pathLength: 1, opacity: 0.7 } : {}}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
            />
            <motion.circle
              cx="0"
              cy="2"
              r="3"
              fill="#FE662E"
              initial={{ opacity: 0 }}
              animate={isVisible['mission-vision'] ? { 
                opacity: [0, 1, 0.7],
                cx: [0, 120]
              } : {}}
              transition={{ 
                opacity: { duration: 0.3, delay: 1.4 },
                cx: { duration: 1.2, delay: 0.8, ease: "easeInOut" }
              }}
            />
          </svg>
        </motion.div>

        {/* Metrics Row */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible['mission-vision'] ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors duration-300">
                {metric.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible['mission-vision'] ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-8"></div>
            <p className="text-gray-300 text-lg italic leading-relaxed">
              We build for usability, privacy, and peak-hour resilience, and we reward loyalty to retain satisfied users.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
