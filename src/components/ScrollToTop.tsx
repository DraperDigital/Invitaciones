import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset inmediato
    window.scrollTo(0, 0);
    
    // Respaldo por si el contenido tarda en renderizar
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
