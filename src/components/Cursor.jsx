import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");

    setDotX(x);
    setDotY(y);
    setRingX(x);
    setRingY(y);

    document.documentElement.classList.add("has-custom-cursor");

    const ringPos = { x, y };

    // ✅ Estela: más bajo = más trail (más lento siguiendo al mouse)
    // Valores recomendados: 0.06 (mucha estela), 0.08 (medio), 0.10 (más preciso)
    const RING_FOLLOW = reduce ? 0.18 : 0.06;

    const scaleTo = (target, s) =>
      gsap.to(target, {
        scale: s,
        duration: reduce ? 0 : 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });

    const setMode = (mode) => {
      ring.classList.remove("is-hover", "is-link", "is-cta");
      if (mode) ring.classList.add(mode);

      if (mode === "is-cta") scaleTo(ring, 1.7);
      else if (mode === "is-link") scaleTo(ring, 1.35);
      else if (mode === "is-hover") scaleTo(ring, 1.18);
      else scaleTo(ring, 1);

      scaleTo(dot, mode ? 1.05 : 1);
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;

      // Dot: súper preciso
      setDotX(x);
      setDotY(y);
    };

    const onOver = (e) => {
      const t = e.target;
      if (!t) return;

      const cta = t.closest(
        '[data-cursor="cta"], .btn--primary, button[type="submit"]',
      );
      if (cta) return setMode("is-cta");

      const link = t.closest("a");
      if (link) return setMode("is-link");

      const hover = t.closest(
        'button, input, textarea, select, [role="button"], [data-cursor="hover"]',
      );
      setMode(hover ? "is-hover" : "");
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });

    let raf = 0;
    const loop = () => {
      ringPos.x += (x - ringPos.x) * RING_FOLLOW;
      ringPos.y += (y - ringPos.y) * RING_FOLLOW;

      setRingX(ringPos.x);
      setRingY(ringPos.y);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring" />
      <div ref={dotRef} className="cursor__dot" />
    </div>,
    document.body,
  );
}
