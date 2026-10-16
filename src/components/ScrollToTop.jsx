import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // A timeout of 0 pushes this action to the end of the rendering queue
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // 'instant' is better than 'smooth' for page loads
      });
    }, 0);
  }, [pathname]);

  return null;
}