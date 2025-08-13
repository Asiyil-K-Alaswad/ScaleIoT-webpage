import { useState, useEffect } from 'react';

const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      
      setScrollProgress(progress);
      
      // Set visible after first scroll
      if (scrollTop > 100) {
        setIsVisible(true);
      }
    };

    // Set initial visibility
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollProgress, isVisible };
};

export default useScrollProgress;
