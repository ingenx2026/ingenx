import React, { useState, useEffect, useRef } from 'react';

export function ScrollReveal({ children, direction = "up", delay = 0, width = "100%", className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  let dirClass = "";
  if (!isVisible) {
    if (direction === "up") dirClass = "translate-y-16 opacity-0";
    if (direction === "down") dirClass = "-translate-y-16 opacity-0";
    if (direction === "left") dirClass = "-translate-x-16 opacity-0";
    if (direction === "right") dirClass = "translate-x-16 opacity-0";
    if (direction === "scale") dirClass = "scale-90 opacity-0";
  } else {
    dirClass = "translate-y-0 translate-x-0 scale-100 opacity-100";
  }

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${dirClass} ${className}`} style={{ transitionDelay: `${delay}ms`, width }}>
      {children}
    </div>
  );
}