import { useEffect, useRef } from "react";
import * as THREE from "three";

const R = 1.2;

// Module-level cache — survives unmount/remount across navigations
let cachedPositions = null;

async function getGlobePositions() {
  if (cachedPositions) return cachedPositions;
  const res = await fetch("/globe-positions.json");
  const data = await res.json();
  cachedPositions = new Float32Array(data);
  return cachedPositions;
}

export default function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;

    let disposed = false;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    function updateSize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;

      const mobile = w < 768;
      camera.position.set(
        mobile ? 0 : -0.3,
        mobile ? 0 : 0.1,
        mobile ? 4.0 : 2.9,
      );
      grp.position.y = 0;

      camera.updateProjectionMatrix();
    }

    // Atmosphere halo
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.07, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.025,
        side: THREE.BackSide, blending: THREE.AdditiveBlending,
      }),
    ));

    // Group for rotation
    const grp = new THREE.Group();
    while (scene.children.length) grp.add(scene.children[0]);
    scene.add(grp);

    // Initial sizing
    updateSize();

    // Materials
    const matGlow = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.022,
      sizeAttenuation: true, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const matCrisp = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.009,
      sizeAttenuation: true, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    let geo = null;

    function buildGlobe(positions) {
      if (disposed) return;

      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const glowPts = new THREE.Points(geo, matGlow);
      const crispPts = new THREE.Points(geo, matCrisp);

      matGlow.opacity = 0;
      matCrisp.opacity = 0;
      grp.add(glowPts);
      grp.add(crispPts);

      let fade = 0;
      const fadeIn = () => {
        if (disposed) return;
        fade += 0.02;
        matGlow.opacity = Math.min(0.12, fade * 0.12);
        matCrisp.opacity = Math.min(0.85, fade * 0.85);
        if (fade < 1) requestAnimationFrame(fadeIn);
      };
      requestAnimationFrame(fadeIn);
    }

    getGlobePositions().then(buildGlobe);

    // Mouse parallax
    let mx = 0, my = 0;
    const onMouseMove = (e) => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      mx = (e.clientX / w - 0.5) * 0.35;
      my = (e.clientY / h - 0.5) * -0.12;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Auto-rotation
    let auto = 0;
    let frameId;
    function tick() {
      frameId = requestAnimationFrame(tick);
      auto += 0.0018;
      grp.rotation.y += (mx + auto - grp.rotation.y) * 0.011;
      grp.rotation.x += (my + 0.12 - grp.rotation.x) * 0.011;
      renderer.render(scene, camera);
    }
    tick();

    window.addEventListener("resize", updateSize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateSize);
      renderer.dispose();
      if (geo) geo.dispose();
      matGlow.dispose();
      matCrisp.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="globe-canvas" />;
}
