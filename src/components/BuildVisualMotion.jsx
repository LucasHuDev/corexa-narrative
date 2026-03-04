import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function BuildVisualMotion({ children, variant = "premium" }) {
  const wrapRef = useRef(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray(".v-bar");
      const rings = gsap.utils.toArray(".v-ring");
      const dot = el.querySelector(".v-dot");
      const orb = el.querySelector(".v-orbGlow");
      const lines = gsap.utils.toArray(".v-line");
      const highlight = el.querySelector(".v-highlight");

      // timeline maestro (LOOP infinito)
      const tl = gsap.timeline({ repeat: -1 });

      // 1) micro “breathing” general (muy sutil)
      tl.to(
        el,
        {
          duration: 2.8,
          filter: "saturate(1.06) contrast(1.04)",
          ease: "sine.inOut",
        },
        0,
      ).to(
        el,
        {
          duration: 2.8,
          filter: "saturate(1.02) contrast(1.02)",
          ease: "sine.inOut",
        },
        2.8,
      );

      // 2) barras (scan) - wave infinita
      if (bars.length) {
        gsap.to(bars, {
          opacity: (i) => 0.55 + (i % 3) * 0.08,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.12, from: "start" },
        });

        gsap.to(bars, {
          x: (i) => (i % 2 ? 1.4 : -1.2),
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.08 },
        });
      }

      // 3) rings orbitando + pulso
      if (rings.length) {
        gsap.to(rings, {
          rotation: (i) => (i % 2 ? 360 : -360),
          transformOrigin: "50% 50%",
          duration: 14,
          ease: "none",
          repeat: -1,
        });
      }

      if (dot) {
        gsap.to(dot, {
          scale: 1.12,
          duration: 1.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      if (orb) {
        gsap.to(orb, {
          scale: 1.03,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 4) líneas “tipo texto” (Launch/Custom)
      if (lines.length) {
        gsap.to(lines, {
          x: (i) => (i % 2 ? 2 : -2),
          opacity: (i) => 0.55 + (i % 4) * 0.08,
          duration: 2.0,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.06,
        });
      }

      // 5) highlight block “sweep”
      if (highlight) {
        gsap.to(highlight, {
          x: 14,
          duration: 1.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Importantísimo: nada de ScrollTrigger acá. Esto es loop puro.
    }, wrapRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <div ref={wrapRef} className="build__visualWrap">
      {children}
    </div>
  );
}
