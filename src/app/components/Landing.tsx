import React, { useState, useEffect } from "react";
import cameraImg      from "../../images/camera.png";
import pointingImg    from "../../images/pointing out.png";
import professionalImg from "../../images/professional.jpeg";
import roadSOSImg     from "../../images/roadsos.png";
import studentsHubImg from "../../images/studentshub.png";
import bloodLinkImg   from "../../images/bloodlink.png";
import muleImg        from "../../images/mule.png";
import { ExpandingCards } from "./ui/expanding-cards";
import type { CardItem } from "./ui/expanding-cards";
import { HeroVisual } from "./HeroVisual";
import { TransitionBand } from "./TransitionBand";
import { BookOpen, Heart, AlertTriangle, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SkillsSection } from "./SkillsSection";
import { ResumePlane } from "./ResumePlane";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const NAV_LINKS = ["about", "work", "skills", "contact"];

const FLOATING_PILLS = [
  { label: "Web Design",         x: 0,   y: 32  },
  { label: "Video Editing",      x: 333, y: 5   },
  { label: "Content Creation",   x: 667, y: 20  },
  { label: "IoT & Arduino",      x: 125, y: 105 },
  { label: "Prompt Engineering", x: 513, y: 98  },
  { label: "REST APIs",          x: 0,   y: 188 },
  { label: "PWA Development",    x: 317, y: 165 },
  { label: "Content Creation",   x: 667, y: 182 },
  { label: "Event Marketing",    x: 125, y: 265 },
  { label: "UI/UX Design",       x: 497, y: 270 },
];

/* Mobile pill positions — scattered across ~335px usable width, no overlaps */
const MOBILE_FLOATING_PILLS = [
  { label: "Web Design",         x: 14,  y: 8   },
  { label: "PWA Development",    x: 168, y: 58  },
  { label: "Content Creation",   x: 22,  y: 115 },
  { label: "Video Editing",      x: 175, y: 168 },
  { label: "REST APIs",          x: 18,  y: 228 },
  { label: "IoT & Arduino",      x: 180, y: 282 },
  { label: "Prompt Engineering", x: 12,  y: 342 },
  { label: "Event Marketing",    x: 170, y: 398 },
  { label: "UI/UX Design",       x: 60,  y: 458 },
];

const DESKTOP_PHOTOS = [
  { src: cameraImg,        w: 285, h: 400, top: 0,   left: 50 },
  { src: pointingImg,      w: 305, h: 380, top: 440, left: 20 },
  { src: professionalImg,  w: 285, h: 410, top: 870, left: 55 },
];

const PROJECTS: CardItem[] = [
  {
    id: "roadsos",
    title: "RoadSOS",
    tag: "PWA · Emergency",
    year: "2026",
    description: "One-tap SOS for road accident victims — real-time location sharing to nearby responders. Offline-first PWA, no install required.",
    imgSrc: roadSOSImg,
    url: "https://emergency-response-dashboard-iota.vercel.app/home",
    icon: <AlertTriangle size={26} />,
  },
  {
    id: "studentshub",
    title: "StudentsHub",
    tag: "Web App · React",
    year: "2025",
    description: "Centralized platform for students to discover resources, tools and opportunities. Won PitchFest 2025 — advanced to Smart India Hackathon as Team Learnex.",
    imgSrc: studentsHubImg,
    url: "https://studentperks.in",
    icon: <BookOpen size={26} />,
  },
  {
    id: "bloodlink",
    title: "BloodLink",
    tag: "Full Stack · Appwrite",
    year: "2025",
    description: "Real-time blood donor matching with inventory management and emergency request handling. Reduces manual coordination overhead between donors and recipients.",
    imgSrc: bloodLinkImg,
    url: "https://bloodlink-beryl.vercel.app/",
    icon: <Heart size={26} />,
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection",
    tag: "ML · Python",
    year: "2025",
    description: "End-to-end ML pipeline for flagging fraudulent transactions — risk scoring, classification models, and anomaly detection with a web-accessible result interface.",
    imgSrc: muleImg,
    url: "https://cross-mule.vercel.app/",
    icon: <ShieldCheck size={26} />,
  },
];

/* ─── Shared glass pill style helper ─── */
function glassNavStyle(scrolled: boolean) {
  return {
    background: scrolled ? "rgba(255,255,255,0.72)" : "rgba(240,235,227,0.97)",
    backdropFilter: scrolled ? "blur(14px) saturate(1.6)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.6)" : "none",
    boxShadow: scrolled
      ? "0 2px 28px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(255,255,255,0.55)"
      : "none",
    transition: "background 0.45s, box-shadow 0.45s",
  } as React.CSSProperties;
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Desktop ── */}
      <div
        className="hidden md:block"
        style={{
          position: "fixed",
          top: scrolled ? 14 : 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: scrolled ? 480 : "calc(100% - 48px)",
          maxWidth: scrolled ? 480 : 1392,
          zIndex: 200,
          transition: "top 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), max-width 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            borderRadius: 100,
            height: scrolled ? 50 : 60,
            padding: "0 8px 0 28px",
            ...glassNavStyle(scrolled),
            transition: "height 0.45s cubic-bezier(0.4,0,0.2,1), background 0.45s, backdrop-filter 0.45s, box-shadow 0.45s",
          }}
        >
          {/* RAAM — collapses on scroll */}
          <div style={{
            overflow: "hidden", flexShrink: 0,
            maxWidth: scrolled ? 0 : 100,
            opacity: scrolled ? 0 : 1,
            marginRight: scrolled ? 0 : 8,
            transition: "max-width 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.25s, margin-right 0.4s",
          }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 800, color: "#000", whiteSpace: "nowrap", display: "block" }}>
              RAAM
            </span>
          </div>

          {/* Links — always centered */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link}`}
                style={{ color: "#4A4A4A", fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#000")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#4A4A4A")}
              >
                {link}
              </a>
            ))}
          </div>

          {/* LET'S TALK — collapses on scroll */}
          <div style={{
            overflow: "hidden", flexShrink: 0,
            maxWidth: scrolled ? 0 : 160,
            opacity: scrolled ? 0 : 1,
            transition: "max-width 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.25s",
          }}>
            <button style={{
              background: "#1A1A1A", color: "#D5E636", border: "none", borderRadius: 100,
              padding: "12px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
              cursor: "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
            }}>
              LET'S TALK
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div
        className="md:hidden"
        style={{ position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 420, zIndex: 200 }}
      >
        {/* Pill bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: 100, height: 52, padding: "0 8px 0 22px",
          ...glassNavStyle(scrolled),
        }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 800, color: "#000" }}>RAAM</span>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ display: "flex", flexDirection: "column", gap: 5, padding: "10px 14px", background: "none", border: "none", cursor: "pointer" }}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 20, height: 2, borderRadius: 1,
                background: "#000",
                transition: "transform 0.25s, opacity 0.25s",
                transform: menuOpen
                  ? i === 0 ? "translateY(7px) rotate(45deg)"
                  : i === 2 ? "translateY(-7px) rotate(-45deg)"
                  : "scaleX(0)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Dropdown */}
        {menuOpen && (
          <div style={{
            marginTop: 8, borderRadius: 20,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            overflow: "hidden",
          }}>
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link}`} onClick={() => setMenuOpen(false)}
                style={{ display: "block", padding: "14px 24px", color: "#1A1A1A", fontSize: 15, fontWeight: 500, textDecoration: "none", fontFamily: "Inter, sans-serif" }}
              >
                {link}
              </a>
            ))}
            <div style={{ padding: "12px 16px 16px" }}>
              <button style={{
                width: "100%", background: "#1A1A1A", color: "#D5E636", border: "none",
                borderRadius: 100, padding: "14px 24px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Inter, sans-serif",
              }}>
                LET'S TALK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Service Pill (desktop) ─── */
function Pill({ children }: { children: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "#C8DFE8", color: "#1A1A1A", borderRadius: 100,
      padding: "18px 44px", fontSize: 22, fontWeight: 500,
      fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Service Pill (mobile) ─── */
function MobilePill({ children }: { children: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "#C8DFE8", color: "#1A1A1A", borderRadius: 100,
      padding: "13px 28px", fontSize: 17, fontWeight: 500,
      fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── Page ─── */
export default function Landing() {
  const mobileSwirlRefs = React.useRef<(SVGPathElement | null)[]>([]);

  // Smooth scrolling — the scroll position eases toward the user's input,
  // and all ScrollTrigger animations stay in sync. Skipped for reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.8,
      effects: true,
    });
    return () => { smoother.kill(); };
  }, []);

  // Mobile hero swirls draw themselves as the photo strip scrolls in.
  useEffect(() => {
    if (window.innerWidth >= 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const paths = mobileSwirlRefs.current.filter(Boolean) as SVGPathElement[];
    const ctx = gsap.context(() => {
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: p, start: "top 95%", end: "top 45%", scrub: 1 },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Navbar lives outside #smooth-content so position:fixed stays anchored to the viewport */}
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div style={{ backgroundColor: "#EDEDE5", fontFamily: "Inter, sans-serif" }}>

      {/* ════ DESKTOP ════ */}
      <div className="hidden md:block" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 100 }}>
        <div style={{ display: "flex" }}>

          {/* Left column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 48, padding: "20px 40px 60px 48px", minWidth: 0 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              <h1 className="averia-serif-libre-bold" style={{ fontSize: 128, lineHeight: 0.95, color: "#000", fontWeight: "normal", margin: 0 }}>
                I make things.<br />Sometimes code.<br />Sometimes art.
              </h1>
              <p style={{ color: "#4A4A4A", fontSize: 17, lineHeight: 1.6, maxWidth: 660, margin: 0 }}>
                I'm Raam. By day I'm writing code, shipping products, and debugging things that shouldn't 
                have broken. By evening I'm behind a camera or in an edit timeline. I've always believed 
                the people who build things should also know how to make them beautiful — so I never stopped doing both..
              </p>
            </div>

            {/* Floating pills */}
            <div style={{ position: "relative", height: 340 }}>
              {FLOATING_PILLS.map((pill, i) => (
                <div key={i} style={{
                  position: "absolute", left: pill.x, top: pill.y,
                  animation: `pillFloat ${3.0 + (i % 5) * 0.45}s ease-in-out ${(i % 4) * 0.55}s infinite`,
                }}>
                  <Pill>{pill.label}</Pill>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <button style={{
                backgroundColor: "#D5E636", color: "#1A1A1A", borderRadius: 100,
                padding: "18px 40px", fontSize: 16, fontWeight: 700, letterSpacing: 0.5,
                border: "none", cursor: "pointer", whiteSpace: "nowrap",
              }}>
                START WITH A CALL
              </button>
              <span style={{ color: "#4A4A4A", fontSize: 16 }}>let's make sure you get heard...</span>
            </div>
          </div>

          {/* Right column — photos + scroll-drawn river (Phase 1 & 2) */}
          <HeroVisual photos={DESKTOP_PHOTOS} />

        </div>
      </div>

      {/* ════ MOBILE ════ */}
      <div className="flex flex-col md:hidden" style={{ paddingTop: 80 }}>

        {/* Photo strip — 3 images side by side with swirl overlay */}
        <div style={{ position: "relative", display: "flex", width: "100%", height: 135, overflow: "hidden" }}>
          {[cameraImg, pointingImg, professionalImg].map((src, i) => (
            <img key={i} src={src} alt="" style={{ flex: 1, height: "100%", objectFit: "cover" }} />
          ))}
          {/* Swirl over photos */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 375 135" fill="none" preserveAspectRatio="none">
            <path ref={(el) => { mobileSwirlRefs.current[0] = el; }} d="M-10 110 C50 10, 140 120, 220 40 C300 -40, 370 90, 400 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path ref={(el) => { mobileSwirlRefs.current[1] = el; }} d="M-10 80 C60 -20, 160 100, 245 20 C330 -60, 385 60, 410 5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* Heading */}
        <div style={{ padding: "28px 20px 20px" }}>
          <h1 className="averia-serif-libre-bold" style={{ fontSize: 54, lineHeight: 0.95, color: "#000", fontWeight: "normal", margin: 0 }}>
            I make things.<br />Sometimes code.<br />Sometimes art.
          </h1>
        </div>

        {/* Subtitle */}
        <div style={{ padding: "0 20px 28px" }}>
          <p style={{ color: "#4A4A4A", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            I'm Raam — I build software, shoot photos, cut videos, and write things worth reading. Whatever the medium,
            the obsession is the same.
          </p>
        </div>

        {/* Pills — scattered absolute, matching desktop free-form style */}
        <div style={{ position: "relative", height: 510 }}>
          {MOBILE_FLOATING_PILLS.map((pill, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pill.x,
                top: pill.y,
                animation: `pillFloat ${3.0 + (i % 5) * 0.45}s ease-in-out ${(i % 4) * 0.55}s infinite`,
              }}
            >
              <MobilePill>{pill.label}</MobilePill>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: "8px 20px 52px", display: "flex", flexDirection: "column", gap: 16 }}>
          <button style={{
            backgroundColor: "#D5E636", color: "#1A1A1A", borderRadius: 100,
            padding: "16px 32px", fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
            border: "none", cursor: "pointer",
          }}>
            LET'S TALK
          </button>
          <span style={{ color: "#4A4A4A", fontSize: 14 }}>let's make sure you get heard...</span>
        </div>

      </div>
      {/* ════ DARK REGION — transition + work share one backdrop (no seam) ════ */}
      <div style={{ backgroundColor: "#0F0F0F" }}>
        {/* Cream → dark colour transition */}
        <TransitionBand />

        {/* Work section — heading signs, then the cards reveal */}
        <section id="work">
          <ExpandingCards items={PROJECTS} />
        </section>
      </div>

      {/* Skills horizontal scroll */}
      <SkillsSection />

      {/* Resume plane CTA */}
      <ResumePlane />

          </div>
        </div>
      </div>
    </>
  );
}
