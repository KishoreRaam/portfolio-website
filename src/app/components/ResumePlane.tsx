import React, { useRef, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import planeUrl from "../../images/Plane/plane.svg";
import { PaperUnfold } from "./PaperUnfold";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const FLIGHT_PATH =
  "M-92 17.713c154.32 237.253 348.7 486.913 585.407 466.93 137.542-17.257 247.733-123.595 279.259-239.307 27.368-100.43-21.323-229.59-140.017-241.76-118.693-12.172-208.268 98.897-231.122 199.803-34.673 151.333 12.324 312.301 125.096 429.074C639.395 749.225 815 700 880 620";

function PlaneButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 56, height: 56, borderRadius: "50%",
        border: `1.5px solid ${hovered ? "#D5E636" : "#1A1A1A"}`,
        backgroundColor: "#F0EBE3", cursor: "pointer",
        fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.2s",
      }}
    >
      ↗
    </button>
  );
}

/* ── Main ── */
export function ResumePlane() {
  const sectionRef  = useRef<HTMLElement>(null);
  const planeRef    = useRef<HTMLDivElement>(null);
  const pathCoreRef = useRef<SVGPathElement>(null);
  const pathTopRef  = useRef<SVGPathElement>(null);
  const pathBotRef  = useRef<SVGPathElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useLayoutEffect(() => {
    const core   = pathCoreRef.current!;
    const top    = pathTopRef.current!;
    const bottom = pathBotRef.current!;
    const isMobile = window.innerWidth < 768;

    const coreLen = core.getTotalLength();
    const topLen  = top.getTotalLength();
    const botLen  = bottom.getTotalLength();

    gsap.set(core,   { strokeDasharray: coreLen,  strokeDashoffset: coreLen  });
    gsap.set(top,    { strokeDasharray: topLen,   strokeDashoffset: topLen   });
    gsap.set(bottom, { strokeDasharray: botLen,   strokeDashoffset: botLen   });

    gsap.set(planeRef.current, {
      motionPath: { path: core, align: core, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 0 },
    });
    gsap.set(textRef.current, { autoAlpha: 0 });

    const motionVars = {
      motionPath: { path: core, align: core, alignOrigin: [0.5, 0.5], autoRotate: true },
    };

    let tl: gsap.core.Timeline;

    if (isMobile) {
      /* ── Mobile: plays once when section scrolls into view ── */
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      tl.to(planeRef.current, { ...motionVars, ease: "power1.inOut", duration: 2.4 }, 0);
      tl.to(core,   { strokeDashoffset: 0, ease: "power1.inOut", duration: 2.4 }, 0);
      tl.to(top,    { strokeDashoffset: 0, ease: "power1.inOut", duration: 2.4 }, 0);
      tl.to(bottom, { strokeDashoffset: 0, ease: "power1.inOut", duration: 2.4 }, 0);
      tl.to(textRef.current, { autoAlpha: 1, ease: "power2.out", duration: 0.5 }, 1.6);
    } else {
      /* ── Desktop: pinned scroll-scrubbed timeline ── */
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(planeRef.current, { ...motionVars, ease: "none", duration: 2 }, 0);
      tl.to(core,   { strokeDashoffset: 0, ease: "none", duration: 2 }, 0);
      tl.to(top,    { strokeDashoffset: 0, ease: "none", duration: 2 }, 0);
      tl.to(bottom, { strokeDashoffset: 0, ease: "none", duration: 2 }, 0);
      tl.to(textRef.current, { autoAlpha: 1, ease: "none", duration: 0.3 }, 1.0);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  function openModal() {
    if (planeRef.current) planeRef.current.classList.add("plane--unfold");
    setTimeout(() => setModalOpen(true), 320);
  }

  function handleHover() {
    if (!planeRef.current) return;
    gsap.killTweensOf(planeRef.current);
    gsap.to(planeRef.current, {
      rotation: 15, duration: 0.2, yoyo: true,
      repeat: 3, ease: "power1.inOut",
      onComplete: () => gsap.set(planeRef.current, { rotation: 0 }),
    });
  }

  return (
    <>
      <section
        id="resume-cta"
        ref={sectionRef}
        style={{
          position: "relative",
          height: "100vh",
          backgroundColor: "#F5F3EF",
          overflow: "hidden",
        }}
      >
        {/* ── Flight-path SVG (fills section, preserveAspectRatio none = stretches on any viewport) ── */}
        <svg
          viewBox="0 0 997 822"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="trail-gradient" x1="722.156" x2="92.39" y1="-228.339" y2="704.889" gradientUnits="userSpaceOnUse">
              <stop offset=".144" stopColor="#FFE9FE" />
              <stop offset="1"    stopColor="#FF96F9" />
            </linearGradient>
          </defs>

          <path ref={pathTopRef}  d={FLIGHT_PATH} stroke="url(#trail-gradient)" strokeWidth={2}   strokeLinecap="round" strokeMiterlimit={10} opacity={0.55} />
          <path ref={pathBotRef}  d={FLIGHT_PATH} stroke="url(#trail-gradient)" strokeWidth={2.5} strokeLinecap="round" strokeMiterlimit={10} opacity={0.7}  />
          <path ref={pathCoreRef} d={FLIGHT_PATH} stroke="url(#trail-gradient)" strokeWidth={4}   strokeLinecap="round" strokeMiterlimit={10} />
        </svg>

        {/* ── Paper plane — GSAP moves the outer div; CSS shakes the inner img ── */}
        <div
          ref={planeRef}
          style={{
            position: "absolute",
            width: "clamp(120px, 18vw, 200px)",
            transformOrigin: "center center",
            cursor: "pointer",
            willChange: "transform",
          }}
          onMouseEnter={handleHover}
          onClick={openModal}
        >
          {/* Label floats above the plane — position:absolute keeps it out of
              GSAP's alignOrigin calculation (doesn't change the div's bbox) */}
          <div style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 10,
            whiteSpace: "nowrap",
            fontFamily: '"DM Sans", sans-serif',
            fontSize: "clamp(9px, 0.85vw, 11px)",
            color: "#1A1A1A",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            backgroundColor: "#F0EBE3",
            padding: "5px 12px",
            borderRadius: 100,
            border: "1px solid rgba(0,0,0,0.12)",
            pointerEvents: "none",
          }}>
            unfold me
          </div>
          <img
            src={planeUrl}
            alt="paper plane"
            className="plane-shake"
            style={{ width: "100%", display: "block" }}
            draggable={false}
          />
        </div>

        {/* ── Text block — fades in at midpoint ── */}
        <div
          ref={textRef}
          style={{
            position: "absolute",
            bottom: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: "clamp(11px, 1.2vw, 14px)",
            color: "#9a9490",
            letterSpacing: "2px",
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}>
            have a look at
          </p>
          <h2 style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: "clamp(28px, 5vw, 52px)",
            color: "#1A1A1A",
            margin: 0,
            lineHeight: 1.1,
          }}>
            my résumé.
          </h2>
        </div>

        {/* ── Landing button ── */}
        <div style={{ position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)" }}>
          <PlaneButton onClick={openModal} />
        </div>
      </section>

      {modalOpen && createPortal(
        <PaperUnfold onClose={() => setModalOpen(false)} />,
        document.body
      )}

      <style>{`
        /* Paper shaking in air — runs on the img so it composes with
           GSAP's MotionPath transform on the parent div */
        @keyframes paperShake {
          0%   { transform: rotate(-2deg) translateY(0px)   scale(1);    }
          20%  { transform: rotate( 2deg) translateY(-4px)  scale(1.02); }
          40%  { transform: rotate(-1deg) translateY(2px)   scale(0.99); }
          60%  { transform: rotate( 1.5deg) translateY(-2px) scale(1.01); }
          80%  { transform: rotate(-0.5deg) translateY(1px) scale(1);    }
          100% { transform: rotate(-2deg) translateY(0px)   scale(1);    }
        }
        .plane-shake {
          animation: paperShake 2.4s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0);    }
        }

        @keyframes unfold {
          0%   { transform: rotateY(0deg)  scale(1);   }
          40%  { transform: rotateY(90deg) scale(0.6); }
          100% { transform: rotateY(0deg)  scale(1.1); opacity: 0; }
        }
        .plane--unfold {
          animation: unfold 0.6s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}
