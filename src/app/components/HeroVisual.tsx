import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import strokeUrl from "../../images/stroke.svg";

gsap.registerPlugin(ScrollTrigger);

export interface HeroPhoto {
  src: string;
  w: number;
  h: number;
  top: number;
  left: number;
}

const COL_W = 380;
const COL_H = 1340;

// The stroke spans the full column height and overhangs to the left so it can
// weave across the photos like the reference.
const STROKE_LEFT = -70;
const STROKE_W = 500;

/**
 * Desktop hero right column. The hand-drawn spiral (stroke.svg) weaves down
 * through the three photos: a back copy sits behind every photo, and a front
 * copy is clipped to the upper part of the 2nd photo so the line appears to
 * come *over* it and then dip *behind* — an over/under weave. Both the stroke
 * and the photos reveal as the user scrolls (the stroke via a top→bottom mask).
 */
export function HeroVisual({ photos }: { photos: HeroPhoto[] }) {
  const rootRef       = React.useRef<HTMLDivElement>(null);
  const strokeBackRef = React.useRef<HTMLImageElement>(null);
  const strokeFrontRef= React.useRef<HTMLImageElement>(null);
  const photoRefs     = React.useRef<(HTMLImageElement | null)[]>([]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [strokeBackRef.current, strokeFrontRef.current].forEach((el) => {
        if (el) { el.style.maskSize = "100% 100%"; el.style.webkitMaskSize = "100% 100%"; }
      });
      return;
    }

    const strokes = [strokeBackRef.current, strokeFrontRef.current].filter(Boolean) as HTMLImageElement[];
    const pics    = photoRefs.current.filter(Boolean) as HTMLImageElement[];

    const ctx = gsap.context(() => {
      // Stroke "flows" down: a top→bottom mask is scrubbed to scroll position.
      const setReveal = (p: number) => {
        const size = `100% ${(p * 100).toFixed(2)}%`;
        strokes.forEach((el) => { el.style.maskSize = size; el.style.webkitMaskSize = size; });
      };
      setReveal(0);
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom 30%",
        scrub: 1.2,
        onUpdate: (self) => setReveal(self.progress),
      });

      // Each photo reveals as it scrolls into view (scrubbed, in-view).
      pics.forEach((img) => {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 0.93, y: 24 },
          {
            opacity: 1, scale: 1, y: 0, ease: "none",
            scrollTrigger: { trigger: img, start: "top 88%", end: "top 52%", scrub: 1 },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [photos.length]);

  // Front copy is clipped to the upper part of photo 2 → "over then behind".
  const p2 = photos[1];
  const frontTop    = p2 ? p2.top - 40 : 0;
  const frontBottom = p2 ? COL_H - (p2.top + p2.h * 0.5) : COL_H;

  const maskStyle: React.CSSProperties = {
    maskImage: "linear-gradient(#000, #000)",
    WebkitMaskImage: "linear-gradient(#000, #000)",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "0 0",
    WebkitMaskPosition: "0 0",
    maskSize: "100% 0%",
    WebkitMaskSize: "100% 0%",
  };

  const strokeBase: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: STROKE_LEFT,
    width: STROKE_W,
    height: COL_H,
    objectFit: "fill",
    pointerEvents: "none",
    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.18))",
    ...maskStyle,
  };

  return (
    <div
      ref={rootRef}
      style={{ width: COL_W, flexShrink: 0, position: "relative", height: COL_H, overflow: "visible" }}
    >
      {/* Stroke — back copy, behind every photo */}
      <img ref={strokeBackRef} src={strokeUrl} alt="" aria-hidden="true"
        style={{ ...strokeBase, zIndex: 5 }} />

      {photos.map((photo, i) => (
        <img
          key={i}
          ref={(el) => { photoRefs.current[i] = el; }}
          src={photo.src}
          alt={`Portfolio ${i + 1}`}
          style={{
            position: "absolute", width: photo.w, height: photo.h,
            top: photo.top, left: photo.left, borderRadius: 20,
            objectFit: "cover", zIndex: 10, willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Stroke — front copy, clipped to the upper part of photo 2 (weaves over it) */}
      <img ref={strokeFrontRef} src={strokeUrl} alt="" aria-hidden="true"
        style={{
          ...strokeBase, zIndex: 15,
          clipPath: `inset(${frontTop}px 0 ${frontBottom}px 0)`,
        }} />
    </div>
  );
}
