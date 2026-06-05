import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cream → dark transition. A free-flowing connector curve picks up where the
 * hero spiral ends (top-right) and sweeps down-left toward the work heading,
 * drawing itself on scroll (strokeDashoffset). It is a real stroked path, so it
 * reads as one continuous line carrying on into the next section — not a second
 * centered squiggle.
 */
export function TransitionBand() {
  const bandRef = React.useRef<HTMLDivElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const band = bandRef.current;
    const path = pathRef.current;
    if (!band || !path) return;

    const len = path.getTotalLength();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
    if (reduced) return;

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: { trigger: band, start: "top bottom", end: "bottom 45%", scrub: 1.2 },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <section
      id="transition-band"
      ref={bandRef}
      style={{
        position: "relative",
        height: "42vh",
        background: "linear-gradient(180deg, #EDEDE5 0%, #1a1a1a 66%, rgba(15,15,15,0) 100%)",
        overflow: "visible",
      }}
    >
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Continues from the hero stroke (top-right) → flows down toward the heading (left) */}
        <path
          ref={pathRef}
          d="M1180 -80 C1050 130, 560 110, 470 320 C420 470, 360 560, 330 720"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          opacity={0.85}
        />
      </svg>
    </section>
  );
}
