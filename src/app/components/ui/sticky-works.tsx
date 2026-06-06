import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import sh1 from "../../../images/studentshub/studentshub-1.png";
import sh2 from "../../../images/studentshub/studentshub-2.png";
import sh3 from "../../../images/studentshub/studentshub-3.png";
import bl1 from "../../../images/bloodlink/bloodlink-1.png";
import bl2 from "../../../images/bloodlink/bloodlink-2.png";
import bl3 from "../../../images/bloodlink/bloodlink-3.png";
import rs1 from "../../../images/roadsos/roadsos-1.png";
import rs2 from "../../../images/roadsos/roadsos-2.png";
import rs3 from "../../../images/roadsos/roadsos-3.png";
import ml1 from "../../../images/mule/mule-1.png";
import ml2 from "../../../images/mule/mule-2.png";
import ml3 from "../../../images/mule/mule-3.png";

gsap.registerPlugin(ScrollTrigger);

type Work = {
  id: string;
  title: string;
  number: string;
  label: string;
  tags: string[];
  description: string;
  url: string;
  photos: string[];
};

const WORKS: Work[] = [
  {
    id: "studentshub",
    title: "STUDENTSHUB",
    number: "01",
    label: "WHAT BUILDING FOR STUDENTS LOOKS LIKE",
    tags: ["React", "Appwrite", "SIH PitchFest Winner"],
    description:
      "CENTRALIZED PLATFORM FOR STUDENTS TO DISCOVER RESOURCES, TOOLS AND OPPORTUNITIES. WON PITCHFEST 2025.",
    url: "https://studentperks.in",
    photos: [sh1, sh2, sh3],
  },
  {
    id: "bloodlink",
    title: "BLOODLINK",
    number: "02",
    label: "WHAT SAVING LIVES LOOKS LIKE",
    tags: ["Full Stack", "Appwrite", "Real-time"],
    description:
      "REAL-TIME BLOOD DONOR MATCHING WITH INVENTORY MANAGEMENT AND EMERGENCY REQUEST HANDLING.",
    url: "https://bloodlink-beryl.vercel.app/",
    photos: [bl1, bl2, bl3],
  },
  {
    id: "roadsos",
    title: "ROADSOS",
    number: "03",
    label: "WHAT ONE TAP RESCUE LOOKS LIKE",
    tags: ["PWA", "Emergency", "Offline-first"],
    description:
      "ONE-TAP SOS FOR ROAD ACCIDENT VICTIMS. REAL-TIME LOCATION SHARING TO NEARBY RESPONDERS.",
    url: "https://emergency-response-dashboard-iota.vercel.app/home",
    photos: [rs1, rs2, rs3],
  },
  {
    id: "plc-generator",
    title: "PLC GENERATOR",
    number: "04",
    label: "WHAT AI MEETS INDUSTRY LOOKS LIKE",
    tags: ["Python", "AI", "Industrial IoT"],
    description:
      "AI-POWERED PLC LADDER LOGIC GENERATOR FROM NATURAL LANGUAGE PROMPTS. PYTHON-BASED TOOL.",
    url: "#",
    photos: [ml1, ml2, ml3],
  },
];

// Entrance vectors for each photo slot: [x, y]
const PHOTO_FROM: [number, number][] = [
  [-620, 0],  // Photo 0 → from left
  [620, 0],   // Photo 1 → from right
  [0, 620],   // Photo 2 → from bottom
];

// Three fixed absolute slots shared by all projects
const PHOTO_SLOTS: React.CSSProperties[] = [
  {
    position: "absolute",
    left: 28,
    top: "calc(50% - 200px)",
    width: "22vw",
    height: "50vh",
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 3,
    // CSS initial state: hidden before GSAP takes over
    opacity: 0,
    visibility: "hidden",
  },
  {
    position: "absolute",
    right: 28,
    top: "7%",
    width: "22vw",
    height: "33vh",
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 3,
    opacity: 0,
    visibility: "hidden",
  },
  {
    position: "absolute",
    left: "calc(50% - 19vw)",
    bottom: 0,
    width: "38vw",
    height: "50vh",
    borderRadius: "8px 8px 0 0",
    overflow: "hidden",
    zIndex: 3,
    opacity: 0,
    visibility: "hidden",
  },
];

// Decorative tick marks at section top
const TICKS: { style: React.CSSProperties; h: number }[] = [
  { style: { left: "4%" },  h: 78 },
  { style: { left: "10%" }, h: 48 },
  { style: { left: "17%" }, h: 64 },
  { style: { left: "24%" }, h: 44 },
  { style: { right: "5%" },  h: 72 },
  { style: { right: "13%" }, h: 50 },
  { style: { right: "21%" }, h: 42 },
];

function SeeProjectButton({ url }: { url: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-block",
        border: "1px solid rgba(255,255,255,0.65)",
        color: "#fff",
        padding: "13px 40px",
        fontFamily: "DM Sans, sans-serif",
        fontSize: 12,
        letterSpacing: "0.22em",
        textDecoration: "none",
        background: hov ? "rgba(255,255,255,0.08)" : "transparent",
        transition: "background 0.25s",
        marginTop: 32,
      }}
    >
      SEE PROJECT
    </a>
  );
}

export function StickyWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs   = useRef<(HTMLDivElement | null)[]>(WORKS.map(() => null));
  const photoRefs  = useRef<(HTMLDivElement | null)[][]>(WORKS.map(() => [null, null, null]));

  // Set GSAP initial states before first paint (belt-and-suspenders on top of CSS defaults)
  useLayoutEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    WORKS.forEach((_, wi) => {
      const textEl = textRefs.current[wi];
      if (textEl) {
        gsap.set(textEl, { autoAlpha: wi === 0 ? 1 : 0, y: wi === 0 ? 0 : 500 });
      }
      photoRefs.current[wi].forEach((photoEl, pi) => {
        const [fromX, fromY] = PHOTO_FROM[pi];
        if (photoEl) gsap.set(photoEl, { x: fromX, y: fromY, autoAlpha: 0 });
      });
    });
  }, []);

  // Build the pinned scroll-driven timeline
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        start: "top top",
        end: "+=5400",
      },
    });

    WORKS.forEach((_, wi) => {
      const s = wi * 4.5;

      PHOTO_FROM.forEach(([fromX, fromY], pi) => {
        const photoEl = photoRefs.current[wi][pi];
        if (!photoEl) return;
        tl.fromTo(
          photoEl,
          { x: fromX, y: fromY, autoAlpha: 0 },
          { x: 0, y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          s + pi * 1.0,
        );
      });

      if (wi < WORKS.length - 1) {
        const exitT = s + 3.5;

        PHOTO_FROM.forEach(([fromX, fromY], pi) => {
          const photoEl = photoRefs.current[wi][pi];
          if (!photoEl) return;
          tl.to(photoEl, { x: fromX, y: fromY, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, exitT);
        });

        const textEl = textRefs.current[wi];
        if (textEl) {
          tl.to(textEl, { autoAlpha: 0, y: -500, duration: 0.45, ease: "power2.in" }, exitT);
        }

        const nextText = textRefs.current[wi + 1];
        if (nextText) {
          tl.fromTo(
            nextText,
            { y: 500, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" },
            exitT + 0.5,
          );
        }
      }
    });

    return () => {
      tl.kill();
      tl.scrollTrigger?.kill();
    };
  }, []);

  /* ════ DESKTOP ════ */
  const desktop = (
    <div
      className="hidden md:block"
      style={{ position: "relative", height: "100svh", overflow: "hidden" }}
    >
      {/* Decorative tick marks */}
      {TICKS.map((tick, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            width: 1,
            height: tick.h,
            backgroundColor: "rgba(255,255,255,0.18)",
            pointerEvents: "none",
            ...tick.style,
          }}
        />
      ))}

      {/* Centered text — all 4 project blocks in same CSS-grid cell */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            padding: "0 24px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <div style={{ display: "grid" }}>
            {WORKS.map((work, i) => (
              <div
                key={work.id}
                ref={(el) => { textRefs.current[i] = el; }}
                style={{
                  gridRow: 1,
                  gridColumn: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  // CSS initial state: only first project visible
                  opacity: i === 0 ? 1 : 0,
                  visibility: (i === 0 ? "visible" : "hidden") as React.CSSProperties["visibility"],
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    color: "rgba(255,255,255,0.38)",
                    textTransform: "uppercase",
                    margin: "0 0 20px",
                  }}
                >
                  {work.label}
                </p>

                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(64px, 9.5vw, 132px)",
                    lineHeight: 0.92,
                    color: "#fff",
                    margin: "0 0 22px",
                    fontWeight: "normal",
                    letterSpacing: "0.02em",
                  }}
                >
                  {work.title}
                  <span
                    style={{
                      fontSize: "0.28em",
                      color: "#E44332",
                      fontFamily: "'DM Serif Display', serif",
                      fontStyle: "italic",
                      verticalAlign: "super",
                      marginLeft: "0.1em",
                    }}
                  >
                    ({work.number})
                  </span>
                </h2>

                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 12.5,
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.65,
                    textTransform: "uppercase",
                    margin: 0,
                    maxWidth: 480,
                  }}
                >
                  {work.description}
                </p>

                {work.url !== "#" && <SeeProjectButton url={work.url} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All project photos — GSAP drives entry and exit */}
      {WORKS.map((work, wi) =>
        work.photos.map((src, pi) => (
          <div
            key={`${wi}-${pi}`}
            ref={(el) => { photoRefs.current[wi][pi] = el; }}
            style={{ ...PHOTO_SLOTS[pi] }}
          >
            <img
              src={src}
              alt={`${work.title} ${pi + 1}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )),
      )}
    </div>
  );

  /* ════ MOBILE — static stacked list ════ */
  const mobile = (
    <div
      className="flex md:hidden"
      style={{ flexDirection: "column", padding: "52px 20px 72px" }}
    >
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: 11,
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          margin: "0 0 40px",
        }}
      >
        Selected Works
      </p>

      {WORKS.map((work, i) => (
        <div
          key={work.id}
          style={{
            marginBottom: 64,
            paddingBottom: 64,
            borderBottom: i < WORKS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.38)",
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            {work.label}
          </p>

          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 48,
              lineHeight: 0.95,
              color: "#fff",
              margin: "0 0 14px",
              fontWeight: "normal",
            }}
          >
            {work.title}
            <span
              style={{
                fontSize: "0.3em",
                color: "#E44332",
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                verticalAlign: "super",
                marginLeft: "0.08em",
              }}
            >
              ({work.number})
            </span>
          </h2>

          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 13,
              letterSpacing: "0.07em",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              margin: "0 0 18px",
              textTransform: "uppercase",
            }}
          >
            {work.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {work.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "rgba(255,255,255,0.55)",
                  borderRadius: 100,
                  padding: "4px 14px",
                  fontSize: 11,
                  fontFamily: "DM Sans, sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {work.url !== "#" && (
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "#fff",
                padding: "11px 26px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: 12,
                letterSpacing: "0.18em",
                textDecoration: "none",
                marginBottom: 28,
              }}
            >
              SEE PROJECT
            </a>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {work.photos.map((src, j) => (
              <div key={j} style={{ borderRadius: 8, overflow: "hidden", height: 220 }}>
                <img
                  src={src}
                  alt={`${work.title} ${j + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div ref={sectionRef} style={{ backgroundColor: "#1A1A1A" }}>
      {desktop}
      {mobile}
    </div>
  );
}
