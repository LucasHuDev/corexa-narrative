import { useId } from "react";

export default function SystemBackground() {
  // ✅ IDs únicos para evitar colisiones entre SVGs / StrictMode
  const uid = useId().replace(/:/g, ""); // por si el browser mete ":" en el id

  const GRID_ID = `grid-${uid}`;
  const HAZE1_ID = `haze1-${uid}`;
  const HAZE2_ID = `haze2-${uid}`;
  const VIGNETTE_ID = `vignette-${uid}`;

  return (
    <div
      className="sysbg"
      aria-hidden="true"
      // ✅ hardening: siempre fixed atrás, nunca intercepta mouse
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        className="sysbg__svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        // ✅ hardening render
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <defs>
          {/* GRID PATTERN (principal + subdivisiones) */}
          <pattern
            id={GRID_ID}
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Sub-grid fino */}
            <path
              d="
                M 30 0 V 120
                M 60 0 V 120
                M 90 0 V 120
                M 0 30 H 120
                M 0 60 H 120
                M 0 90 H 120
              "
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
              shapeRendering="crispEdges"
              vectorEffect="non-scaling-stroke"
            />

            {/* Grid principal */}
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
              shapeRendering="crispEdges"
              vectorEffect="non-scaling-stroke"
            />
          </pattern>

          {/* Haze */}
          <radialGradient id={HAZE1_ID} cx="18%" cy="55%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.00)" />
          </radialGradient>

          <radialGradient id={HAZE2_ID} cx="86%" cy="42%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.045)" />
            <stop offset="62%" stopColor="rgba(255,255,255,0.00)" />
          </radialGradient>

          {/* Vignette */}
          <radialGradient id={VIGNETTE_ID} cx="50%" cy="50%" r="75%">
            <stop offset="46%" stopColor="rgba(0,0,0,0.00)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.62)" />
          </radialGradient>
        </defs>

        {/* Base */}
        <rect width="1200" height="800" fill="transparent" />

        {/* Haze layers */}
        <rect width="1200" height="800" fill={`url(#${HAZE1_ID})`} />
        <rect width="1200" height="800" fill={`url(#${HAZE2_ID})`} />

        {/* Grid */}
        <rect
          width="1200"
          height="800"
          fill={`url(#${GRID_ID})`}
          opacity="0.85"
        />

        {/* Vignette */}
        <rect width="1200" height="800" fill={`url(#${VIGNETTE_ID})`} />
      </svg>
    </div>
  );
}
