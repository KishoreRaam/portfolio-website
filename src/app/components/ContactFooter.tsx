import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Instagram, Linkedin, Mail, Twitter,
  Cpu, Pencil, Music, Code2, BookOpen,
  Coffee, Clapperboard, Camera, Monitor, Palette, PersonStanding,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── Social rows ─────────────────────────────────────────── */
const SOCIALS = [
  {
    index: "01", label: "Instagram", handle: "@kishoreraam_here", tag: "Photos",
    href: "https://www.instagram.com/kishoreraam_here/", target: "_blank",
    color: "#C13584", rowBgHover: "rgba(193,53,132,0.05)", tagBgHover: "rgba(193,53,132,0.10)",
    Icon: Instagram,
  },
  {
    index: "02", label: "LinkedIn", handle: "kishoreraam", tag: "Work",
    href: "https://www.linkedin.com/in/kishoreraam-m/", target: "_blank",
    color: "#0077B5", rowBgHover: "rgba(0,119,181,0.05)", tagBgHover: "rgba(0,119,181,0.10)",
    Icon: Linkedin,
  },
  {
    index: "03", label: "Email", handle: "kishoreraammskj@gmail.com", tag: "Direct",
    href: "mailto:kishoreraammskj@gmail.com", target: "_self",
    color: "#059669", rowBgHover: "rgba(5,150,105,0.05)", tagBgHover: "rgba(5,150,105,0.10)",
    Icon: Mail,
  },
  {
    index: "04", label: "X", handle: "@kishoreraam3", tag: "Thoughts",
    href: "https://x.com/kishoreraam3", target: "_blank",
    color: "#1A1A1A", rowBgHover: "rgba(26,26,26,0.06)", tagBgHover: "rgba(26,26,26,0.12)",
    Icon: Twitter,
  },
];

/* ── Interest icons in the gradient zone ─────────────────── */
// Outer div = static rotation · Inner div = float animation
// so neither transform clobbers the other.
const INTEREST_ICONS: {
  Icon: React.ElementType;
  top: string; left: string;
  rotate: number; dur: number; delay: number;
}[] = [
  { Icon: Palette,        top: "9%",  left: "7%",  rotate: -15, dur: 3.7, delay: 0.4 },
  { Icon: Cpu,            top: "8%",  left: "43%", rotate: 8,   dur: 3.8, delay: 0.0 },
  { Icon: Pencil,         top: "7%",  left: "65%", rotate: -12, dur: 4.2, delay: 0.5 },
  { Icon: Music,          top: "14%", left: "78%", rotate: 15,  dur: 3.5, delay: 1.0 },
  { Icon: Code2,          top: "22%", left: "89%", rotate: -6,  dur: 4.5, delay: 0.3 },
  { Icon: PersonStanding, top: "30%", left: "18%", rotate: 5,   dur: 3.9, delay: 0.8 },
  { Icon: BookOpen,       top: "40%", left: "36%", rotate: -4,  dur: 4.1, delay: 0.2 },
  { Icon: Coffee,         top: "34%", left: "70%", rotate: 10,  dur: 3.6, delay: 1.3 },
  { Icon: Clapperboard,   top: "56%", left: "10%", rotate: -8,  dur: 4.3, delay: 0.6 },
  { Icon: Camera,         top: "58%", left: "87%", rotate: -10, dur: 4.0, delay: 1.1 },
  { Icon: Monitor,        top: "65%", left: "77%", rotate: 4,   dur: 3.8, delay: 0.9 },
];

/* ── Component ───────────────────────────────────────────── */
export function ContactFooter() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const sectionRef     = useRef<HTMLDivElement>(null);
  const headTagRef     = useRef<HTMLParagraphElement>(null);
  const headlineRef    = useRef<HTMLHeadingElement>(null);
  const subtextRef     = useRef<HTMLParagraphElement>(null);
  const ctaRowRef      = useRef<HTMLDivElement>(null);
  const socialsListRef = useRef<HTMLDivElement>(null);
  const footerRef      = useRef<HTMLElement>(null);

  const [isMobile,    setIsMobile]    = useState(false);
  const [hoveredRow,  setHoveredRow]  = useState<number | null>(null);

  /* responsive breakpoint */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── paper-plane canvas ── */
  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = -0.05;

    const resize = () => {
      canvas.width  = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pos = (p: number, W: number, H: number) => ({
      x: p * (W + 120) - 60,
      y: H * 0.35
        + Math.sin(p * Math.PI * 2.2) * (H * 0.25)
        + Math.sin(p * Math.PI * 5.5) * (H * 0.07),
    });

    const getAngle = (p: number, W: number, H: number) => {
      const a = pos(p - 0.004, W, H);
      const b = pos(p + 0.004, W, H);
      return Math.atan2(b.y - a.y, b.x - a.x);
    };

    const drawPlane = (x: number, y: number, ang: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.fillStyle = "#1A1A1A";
      ctx.beginPath(); ctx.moveTo(20,0); ctx.lineTo(-10,-5); ctx.lineTo(-8,0); ctx.lineTo(-10,5); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-1,0); ctx.lineTo(-13,-11); ctx.lineTo(-16,-10); ctx.lineTo(-10,0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(3,0);  ctx.lineTo(-7,8);   ctx.lineTo(-10,8);  ctx.lineTo(-6,0);  ctx.closePath(); ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const trailStart = Math.max(0, t - 0.55);
      const startPt = pos(trailStart, W, H);
      const endPt   = pos(Math.min(t, 1), W, H);
      const grad = ctx.createLinearGradient(startPt.x, startPt.y, endPt.x, endPt.y);
      grad.addColorStop(0, "rgba(26,26,26,0)");
      grad.addColorStop(1, "rgba(26,26,26,0.28)");

      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const p = trailStart + (i / 100) * (t - trailStart);
        const { x, y } = pos(p, W, H);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      const { x, y } = pos(t, W, H);
      drawPlane(x, y, getAngle(t, W, H));

      t += 0.001;
      if (t > 1.12) t = -0.05;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  /* ── scroll entrance animations ── */
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const headerItems = [
      headTagRef.current, headlineRef.current,
      subtextRef.current, ctaRowRef.current,
    ].filter((el): el is HTMLElement => el !== null);

    if (headerItems.length && sectionRef.current) {
      gsap.set(headerItems, { y: 48, opacity: 0 });
      triggers.push(ScrollTrigger.create({
        trigger: sectionRef.current, start: "top 78%", once: true,
        onEnter: () => gsap.to(headerItems, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out" }),
      }));
    }

    if (socialsListRef.current) {
      const rows = Array.from(socialsListRef.current.querySelectorAll<HTMLElement>("a"));
      gsap.set(rows, { y: 32, opacity: 0 });
      triggers.push(ScrollTrigger.create({
        trigger: socialsListRef.current, start: "top 82%", once: true,
        onEnter: () => gsap.to(rows, { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out" }),
      }));
    }

    if (footerRef.current) {
      gsap.set(footerRef.current, { y: 60, opacity: 0 });
      triggers.push(ScrollTrigger.create({
        trigger: footerRef.current, start: "top 90%", once: true,
        onEnter: () => gsap.to(footerRef.current, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }),
      }));
    }

    return () => { triggers.forEach(t => t.kill()); };
  }, []);

  /* ── footer nav/social links ── */
  const navLinks = [
    { label: "About",   href: "#about"   },
    { label: "Work",    href: "#work"    },
    { label: "Skills",  href: "#skills"  },
    { label: "Contact", href: "#contact" },
  ];
  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/kishoreraam_here/", target: "_blank" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/in/kishoreraam-m/",  target: "_blank" },
    { label: "X",         href: "https://x.com/kishoreraam3",                  target: "_blank" },
  ];

  /* ── shared link hover helpers ── */
  const fadeOut = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; };
  const fadeIn  = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.opacity = "1"; };

  return (
    <>
      {/* ════ CONTACT SECTION ════ */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          backgroundColor: "#F5F0E8",
          padding: isMobile ? "52px 24px 60px" : "80px 52px 72px",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          id="contactPlaneCanvas"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>

          <p ref={headTagRef} style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "3px",
            textTransform: "uppercase", color: "#999",
            margin: "0 0 28px 0", fontFamily: "'DM Sans', sans-serif",
          }}>
            04 — CONTACT
          </p>

          <h2 ref={headlineRef} style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: isMobile ? 42 : 68, lineHeight: 0.93,
            fontWeight: "normal", color: "#1A1A1A", margin: "0 0 28px 0",
          }}>
            Got something worth{" "}
            <em style={{ fontStyle: "italic", color: "#555" }}>building?</em>
          </h2>

          <p ref={subtextRef} style={{
            fontSize: 16, color: "#666", lineHeight: 1.7,
            maxWidth: 420, margin: "0 0 56px 0",
          }}>
            I'm open to internships, collabs, and builds that actually matter. Drop a line.
          </p>

          <div ref={ctaRowRef} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 80 }}>
            <a
              href="mailto:kishoreraammskj@gmail.com"
              style={{
                background: "#1A1A1A", color: "#F5F0E8", borderRadius: 100,
                padding: "16px 36px", fontSize: 13, fontWeight: 700,
                letterSpacing: "1.5px", textTransform: "uppercase",
                textDecoration: "none", display: "inline-block",
                transition: "background 0.2s", fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#333"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1A1A1A"; }}
            >
              Say Hello
            </a>
            <span style={{ fontSize: 15, color: "#999", fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>
              response in &lt;24h
            </span>
          </div>

          {/* Social rows */}
          <div ref={socialsListRef} style={{ borderTop: "1px solid rgba(26,26,26,0.12)" }}>
            {SOCIALS.map((social, i) => {
              const hovered = hoveredRow === i;
              return (
                <a
                  key={i}
                  href={social.href}
                  target={social.target}
                  rel={social.target === "_blank" ? "noopener noreferrer" : undefined}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: isMobile
                      ? `18px 0 18px ${hovered ? "20px" : "0"}`
                      : `22px 0 22px ${hovered ? "20px" : "0"}`,
                    borderBottom: "1px solid rgba(26,26,26,0.12)",
                    textDecoration: "none", color: "#1A1A1A",
                    position: "relative", overflow: "hidden",
                    transition: "padding-left 0.25s ease, background-color 0.25s ease",
                    backgroundColor: hovered ? social.rowBgHover : "transparent",
                  }}
                >
                  {/* Brand accent bar */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: hovered ? 4 : 0, background: social.color,
                    zIndex: 0, transition: "width 0.3s ease",
                  }} />

                  {/* Left: index + icon badge + name + handle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 18, zIndex: 1 }}>
                    <span style={{
                      fontSize: 11, color: "#bbb", fontWeight: 500,
                      letterSpacing: "1px", minWidth: 20,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {social.index}
                    </span>

                    {/* Platform icon badge */}
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: hovered ? social.tagBgHover : "rgba(26,26,26,0.07)",
                      transition: "background 0.25s ease",
                    }}>
                      <social.Icon
                        size={17}
                        strokeWidth={1.8}
                        style={{ color: hovered ? social.color : "#555", transition: "color 0.25s ease" }}
                      />
                    </span>

                    <span style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: isMobile ? 24 : 32, fontWeight: "normal", lineHeight: 1,
                      color: hovered ? social.color : "#1A1A1A",
                      transition: "color 0.25s ease",
                    }}>
                      {social.label}
                    </span>
                    <span style={{ fontSize: 13, color: "#aaa", fontWeight: 400, fontFamily: "'DM Sans', sans-serif" }}>
                      {social.handle}
                    </span>
                  </div>

                  {/* Right: tag pill + arrow */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: hovered ? social.color : "#bbb",
                      background: hovered ? social.tagBgHover : "rgba(26,26,26,0.06)",
                      padding: "5px 12px", borderRadius: 100,
                      transition: "all 0.25s ease", fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {social.tag}
                    </span>
                    <span style={{
                      fontSize: 20, display: "inline-block",
                      color: hovered ? social.color : "#1A1A1A",
                      opacity: hovered ? 1 : 0.25,
                      transform: hovered ? "translate(2px,-2px)" : "translate(0,0)",
                      transition: "opacity 0.25s ease, transform 0.25s ease, color 0.25s ease",
                    }}>
                      ↗
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════ FOOTER ════ */}
      <footer ref={footerRef}>

        {/* Part A — Info grid */}
        <div style={{
          borderTop: "1px solid rgba(26,26,26,0.15)",
          padding: isMobile ? "32px 24px 36px" : "40px 52px 44px",
          backgroundColor: "#F5F0E8",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "120px 1fr 1fr 1fr",
          gap: isMobile ? "24px 16px" : "0",
        }}>
          {/* Menu */}
          <div>
            <p style={{ fontSize: 11, color: "#999", letterSpacing: "0.5px", margin: "0 0 18px", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>(MENU)</p>
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                style={{ fontSize: 20, fontWeight: 400, color: "#1A1A1A", textDecoration: "none", display: "block", lineHeight: 1.5, transition: "opacity 0.2s", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={fadeOut} onMouseLeave={fadeIn}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div>
            <p style={{ fontSize: 11, color: "#999", letterSpacing: "0.5px", margin: "0 0 18px", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>(SOCIALS)</p>
            {socialLinks.map(l => (
              <a key={l.label} href={l.href} target={l.target} rel="noopener noreferrer"
                style={{ fontSize: 20, fontWeight: 400, color: "#1A1A1A", textDecoration: "none", display: "block", lineHeight: 1.5, transition: "opacity 0.2s", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={fadeOut} onMouseLeave={fadeIn}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Spacer (desktop only) */}
          {!isMobile && <div />}

          {/* Email */}
          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <p style={{ fontSize: 11, color: "#999", letterSpacing: "0.5px", margin: "0 0 18px", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", textAlign: isMobile ? "left" : "right" }}>(SAY "HELLO")</p>
            <a href="mailto:kishoreraammskj@gmail.com"
              style={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", textDecoration: "none", display: "block", textAlign: isMobile ? "left" : "right", transition: "opacity 0.2s", fontFamily: "'DM Sans', sans-serif", wordBreak: "break-all" }}
              onMouseEnter={fadeOut} onMouseLeave={fadeIn}>
              kishoreraammskj@gmail.com
            </a>
          </div>
        </div>

        {/* Part B — Gradient zone with scattered interest icons */}
        <div style={{
          height: 300,
          background: "linear-gradient(to bottom, #F5F0E8 0%, #f0d4c4 30%, #e8896a 65%, #e05c35 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Scattered interest icons */}
          {INTEREST_ICONS.map(({ Icon, top, left, rotate, dur, delay }, i) => (
            <div key={i} style={{
              position: "absolute", top, left,
              transform: `rotate(${rotate}deg)`,
              pointerEvents: "none",
            }}>
              <div style={{ animation: `iconDrift ${dur}s ease-in-out ${delay}s infinite` }}>
                <Icon size={20} strokeWidth={1.6} style={{ color: "rgba(26,14,8,0.65)", display: "block" }} />
              </div>
            </div>
          ))}

          {/* Name stamp */}
          <div style={{
            position: "absolute", bottom: -8, left: 0, right: 0,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
            fontSize: "clamp(56px, 9.5vw, 120px)",
            lineHeight: 0.87, color: "#1A1A1A",
            letterSpacing: "-4px", padding: "0 32px",
            whiteSpace: "nowrap", textTransform: "uppercase",
          }}>
            KISHORERAAM
          </div>
        </div>

        {/* Part C — Bottom bar */}
        <div style={{
          backgroundColor: "#1A1A1A",
          padding: isMobile ? "16px 24px" : "16px 52px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 8,
        }}>
          <span style={{ fontSize: 12, color: "rgba(245,240,232,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
            ©2026 Kishoreraam. All rights reserved.
          </span>
          <span style={{ fontSize: 12, color: "rgba(245,240,232,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
            Built from Coimbatore with <span style={{ color: "#D5E636" }}>✦</span>
          </span>
        </div>
      </footer>
    </>
  );
}
