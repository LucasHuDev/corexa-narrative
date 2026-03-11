import { useEffect } from "react";
import gsap from "gsap";

export default function Magnetic() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const els = Array.from(document.querySelectorAll("[data-magnetic]"));
    if (!els.length) return;

    const cleanups = [];

    els.forEach((el) => {
      // premium
      const strength = 0.22;
      const max = 10; // px

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);

        const x = Math.max(-max, Math.min(max, mx * strength));
        const y = Math.max(-max, Math.min(max, my * strength));

        gsap.to(el, {
          x,
          y,
          duration: 0.18,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      el.addEventListener("mousemove", onMove, { passive: true });
      el.addEventListener("mouseleave", onLeave, { passive: true });

      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
