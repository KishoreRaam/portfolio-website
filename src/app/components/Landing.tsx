import React, { useState, useEffect } from "react";
import cameraImg      from "../../images/camera.png";
import pointingImg    from "../../images/pointing out.png";
import professionalImg from "../../images/professional.jpeg";
import { ExpandingCards } from "./ui/expanding-cards";
import type { CardItem } from "./ui/expanding-cards";
import { BookOpen, Heart, AlertTriangle, ShieldCheck } from "lucide-react";

const NAV_LINKS = ["about", "work", "skills", "contact"];

const FLOATING_PILLS = [
  { label: "Web Design",         x: 0,   y: 32  },
  { label: "Video Editing",      x: 333, y: 5   },
  { label: "Content Creation",   x: 667, y: 20  },
  { label: "Podcast Production", x: 125, y: 105 },
  { label: "Email Marketing",    x: 513, y: 98  },
  { label: "Public Relations",   x: 0,   y: 188 },
  { label: "Social Media",       x: 317, y: 165 },
  { label: "Content Creation",   x: 667, y: 182 },
  { label: "Event Marketing",    x: 125, y: 265 },
  { label: "Branding",           x: 497, y: 270 },
];

/* Staggered mobile pill positions — alternating left / right-offset rows */
const MOBILE_FLOATING_PILLS = [
  { label: "Web Design",         x: 0,  y: 0   },
  { label: "Social Media",       x: 65, y: 58  },
  { label: "Content Creation",   x: 0,  y: 116 },
  { label: "Video Editing",      x: 65, y: 174 },
  { label: "Public Relations",   x: 0,  y: 232 },
  { label: "Podcast Production", x: 65, y: 290 },
  { label: "Content Creation",   x: 0,  y: 348 },
  { label: "Email Marketing",    x: 65, y: 406 },
  { label: "Event Marketing",    x: 0,  y: 464 },
  { label: "Branding",           x: 65, y: 522 },
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
    imgSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d00'/%3E%3Cstop offset='1' stop-color='%23c44b00'/%3E%3C%2FlinearGradient%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E",
    icon: <AlertTriangle size={26} />,
  },
  {
    id: "studentshub",
    title: "StudentsHub",
    tag: "Web App · React",
    year: "2025",
    description: "Centralized platform for students to discover resources, tools and opportunities. Won PitchFest 2025 — advanced to Smart India Hackathon as Team Learnex.",
    imgSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f2d5f'/%3E%3Cstop offset='1' stop-color='%231a5fa0'/%3E%3C%2FlinearGradient%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E",
    icon: <BookOpen size={26} />,
  },
  {
    id: "bloodlink",
    title: "BloodLink",
    tag: "Full Stack · Appwrite",
    year: "2025",
    description: "Real-time blood donor matching with inventory management and emergency request handling. Reduces manual coordination overhead between donors and recipients.",
    imgSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c0a0a'/%3E%3Cstop offset='1' stop-color='%23b52020'/%3E%3C%2FlinearGradient%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E",
    icon: <Heart size={26} />,
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection",
    tag: "ML · Python",
    year: "2025",
    description: "End-to-end ML pipeline for flagging fraudulent transactions — risk scoring, classification models, and anomaly detection with a web-accessible result interface.",
    imgSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230a2d2d'/%3E%3Cstop offset='1' stop-color='%23146060'/%3E%3C%2FlinearGradient%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E",
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

/* ─── Swirl SVG ─── */
function SwirlDecoration() {
  return (
    <>
      <svg style={{ position: "absolute", top: 50, left: -30, width: 460, height: 1100, pointerEvents: "none", zIndex: 5 }} viewBox="0 0 460 1100" fill="none">
        <path d="M400 30 C360 120, 40 160, 70 320 C100 480, 400 420, 370 600 C340 780, 40 760, 100 920 C160 1080, 390 1030, 370 1080" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
      <svg style={{ position: "absolute", top: 90, left: -50, width: 500, height: 1050, pointerEvents: "none", zIndex: 5 }} viewBox="0 0 500 1050" fill="none">
        <path d="M450 60 C410 150, 80 200, 110 360 C140 520, 440 470, 410 650 C380 830, 80 810, 150 970 C200 1070, 420 1010, 400 1040" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    </>
  );
}

/* ─── Page ─── */
export default function Landing() {
  return (
    <div style={{ backgroundColor: "#F0EBE3", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>

      <Navbar />

      {/* ════ DESKTOP ════ */}
      <div className="hidden md:block" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 100 }}>
        <div style={{ display: "flex" }}>

          {/* Left column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 48, padding: "20px 40px 60px 48px", minWidth: 0 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              <h1 className="averia-serif-libre-bold" style={{ fontSize: 128, lineHeight: 0.95, color: "#000", fontWeight: "normal", margin: 0 }}>
                We're a<br />megaphone<br />for your<br />business
              </h1>
              <p style={{ color: "#4A4A4A", fontSize: 17, lineHeight: 1.6, maxWidth: 660, margin: 0 }}>
                Whatever you're doing, we turn the volume up. Your brand's unique story, voice and
                what sets you apart won't be drowned out. You get to engage the right audience and
                drive growth. Partner with us to create a captivating online presence. We can help with...
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

          {/* Right column — photos */}
          <div style={{ width: 380, flexShrink: 0, position: "relative", height: 1340, overflow: "visible" }}>
            {DESKTOP_PHOTOS.map((photo, i) => (
              <img key={i} src={photo.src} alt={`Portfolio ${i + 1}`}
                style={{ position: "absolute", width: photo.w, height: photo.h, top: photo.top, left: photo.left, borderRadius: 20, objectFit: "cover", zIndex: 10 }}
              />
            ))}
            <SwirlDecoration />
          </div>

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
            <path d="M-10 110 C50 10, 140 120, 220 40 C300 -40, 370 90, 400 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M-10 80 C60 -20, 160 100, 245 20 C330 -60, 385 60, 410 5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* Heading */}
        <div style={{ padding: "28px 20px 20px" }}>
          <h1 className="averia-serif-libre-bold" style={{ fontSize: 54, lineHeight: 0.95, color: "#000", fontWeight: "normal", margin: 0 }}>
            We're a<br />megaphone<br />for your<br />business
          </h1>
        </div>

        {/* Subtitle */}
        <div style={{ padding: "0 20px 28px" }}>
          <p style={{ color: "#4A4A4A", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Whatever you're doing, we turn the volume up. Your brand's unique story, voice and
            what sets you apart won't be drowned out. You get to engage the right audience and
            drive growth. Partner with us to create a captivating online presence. We can help with...
          </p>
        </div>

        {/* Pills — staggered absolute, with float animation */}
        <div style={{ position: "relative", height: 580, marginLeft: 20 }}>
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
      {/* ════ WORK SECTION ════ */}
      <section id="work">
        <ExpandingCards items={PROJECTS} />
      </section>

    </div>
  );
}
