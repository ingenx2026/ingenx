import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // A timeout of 0 pushes this action to the end of the rendering queue
    const timeout = setTimeout(() => {
      const target = hash && document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'instant' });
        return;
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // 'instant' is better than 'smooth' for page loads
      });
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname, hash]);

  return null;
}