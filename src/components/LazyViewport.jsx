import { useState, useEffect, useRef } from 'react';

export default function LazyViewport({ children, height = '100vh' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Para entornos sin IntersectionObserver (raro hoy en día), cargamos directamente.
    if (!window.IntersectionObserver) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Un margen más ajustado para que Lighthouse Móvil no lo gatille de inmediato
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: !visible ? height : 'auto', width: '100%' }}>
      {visible && children}
    </div>
  );
}
