import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global h2 reveal — auto-selects every <h2> on the page and gives it
 * a cinematic clip-path horizontal wipe on scroll.
 *
 *   clipPath: inset(0 100% 0 0)  →  inset(0 0% 0 0)
 *   duration: 1s, ease: expo.out, fires once at top 85%
 *
 * Opt out by setting data-no-reveal on an h2.
 * Honors prefers-reduced-motion.
 */
export default function useH2Reveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(document.querySelectorAll("h2")).filter(
      (el) => !el.hasAttribute("data-no-reveal"),
    );

    if (!els.length) return;

    if (reduce) {
      els.forEach((el) => {
        el.style.clipPath = "inset(0 0% 0 -0.15em)";
      });
      return;
    }

    const tweens = els.map((el) => {
      gsap.set(el, { clipPath: "inset(0 100% 0 -0.15em)", willChange: "clip-path" });
      return gsap.to(el, {
        clipPath: "inset(0 0% 0 -0.15em)",
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });

    // Refresh once after all effects have mounted
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);
}
