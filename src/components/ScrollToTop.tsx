import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset inmediato
    window.scrollTo(0, 0);
    
    // Respaldo por si el contenido tarda en renderizar
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);

    // Track SPA route navigation in GA4 and Meta Pixel
    trackPageView(pathname);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
