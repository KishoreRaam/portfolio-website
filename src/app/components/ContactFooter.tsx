import React, { useRef, useEffect, useState } from "react";

const SOCIALS = [
  {
    index: "01",
    label: "Instagram",
    handle: "@kishoreraam_here",
    tag: "Photos",
    href: "https://www.instagram.com/kishoreraam_here/",
    target: "_blank",
    color: "#C13584",
    rowBgHover: "rgba(193,53,132,0.05)",
    tagBgHover: "rgba(193,53,132,0.10)",
  },
  {
    index: "02",
    label: "LinkedIn",
    handle: "kishoreraam",
    tag: "Work",
    href: "https://www.linkedin.com/in/kishoreraam-m/",
    target: "_blank",
    color: "#0077B5",
    rowBgHover: "rgba(0,119,181,0.05)",
    tagBgHover: "rgba(0,119,181,0.10)",
  },
  {
    index: "03",
    label: "Email",
    handle: "kishoreraammskj@gmail.com",
    tag: "Direct",
    href: "mailto:kishoreraammskj@gmail.com",
    target: "_self",
    color: "#059669",
    rowBgHover: "rgba(5,150,105,0.05)",
    tagBgHover: "rgba(5,150,105,0.10)",
  },
  {
    index: "04",
    label: "X",
    handle: "@kishoreraam3",
    tag: "Thoughts",
    href: "https://x.com/kishoreraam3",
    target: "_blank",
    color: "#1A1A1A",
    rowBgHover: "rgba(26,26,26,0.06)",
    tagBgHover: "rgba(26,26,26,0.12)",
  },
];

export function ContactFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = -0.05;

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pos = (p: number, W: number, H: number) => ({
      x: p * (W + 120) - 60,
      y:
        H * 0.35 +
        Math.sin(p * Math.PI * 2.2) * (H * 0.25) +
        Math.sin(p * Math.PI * 5.5) * (H * 0.07),
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
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-10, -5);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-10, 5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-1, 0);
      ctx.lineTo(-13, -11);
      ctx.lineTo(-16, -10);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(3, 0);
      ctx.lineTo(-7, 8);
      ctx.lineTo(-10, 8);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const trailStart = Math.max(0, t - 0.55);
      const steps = 100;

      const startPt = pos(trailStart, W, H);
      const endPt = pos(Math.min(t, 1), W, H);
      const grad = ctx.createLinearGradient(startPt.x, startPt.y, endPt.x, endPt.y);
      grad.addColorStop(0, "rgba(26,26,26,0)");
      grad.addColorStop(1, "rgba(26,26,26,0.28)");

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const p = trailStart + (i / steps) * (t - trailStart);
        const { x, y } = pos(p, W, H);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
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

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/kishoreraam_here/", target: "_blank" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kishoreraam-m/", target: "_blank" },
    { label: "X", href: "https://x.com/kishoreraam3", target: "_blank" },
  ];

  return (
    <>
      {/* ── Contact Section ── */}
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
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Section tag */}
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: 28,
            marginTop: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            04 — CONTACT
          </p>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: isMobile ? 42 : 68,
            lineHeight: 0.93,
            fontWeight: "normal",
            color: "#1A1A1A",
            margin: "0 0 28px 0",
          }}>
            Got something worth{" "}
            <em style={{ fontStyle: "italic", color: "#555" }}>building?</em>
          </h2>

          {/* Subtext */}
          <p style={{
            fontSize: 16,
            color: "#666",
            lineHeight: 1.7,
            maxWidth: 420,
            margin: "0 0 56px 0",
          }}>
            I'm open to internships, collabs, and builds that actually matter. Drop a line.
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 80 }}>
            <a
              href="mailto:kishoreraammskj@gmail.com"
              style={{
                background: "#1A1A1A",
                color: "#F5F0E8",
                borderRadius: 100,
                padding: "16px 36px",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
                transition: "background 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#333"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1A1A1A"; }}
            >
              Say Hello
            </a>
            <span style={{
              fontSize: 15,
              color: "#999",
              fontStyle: "italic",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              response in &lt;24h
            </span>
          </div>

          {/* Socials list */}
          <div style={{ borderTop: "1px solid rgba(26,26,26,0.12)" }}>
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: isMobile
                      ? `18px 0 18px ${hovered ? "20px" : "0"}`
                      : `22px 0 22px ${hovered ? "20px" : "0"}`,
                    borderBottom: "1px solid rgba(26,26,26,0.12)",
                    textDecoration: "none",
                    color: "#1A1A1A",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "padding-left 0.25s ease, background-color 0.25s ease",
                    backgroundColor: hovered ? social.rowBgHover : "transparent",
                  }}
                >
                  {/* Brand accent bar */}
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: hovered ? 4 : 0,
                    background: social.color,
                    zIndex: 0,
                    transition: "width 0.3s ease",
                  }} />

                  {/* Left */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18, zIndex: 1 }}>
                    <span style={{
                      fontSize: 11,
                      color: "#bbb",
                      fontWeight: 500,
                      letterSpacing: "1px",
                      minWidth: 20,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {social.index}
                    </span>
                    <span style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: isMobile ? 24 : 32,
                      fontWeight: "normal",
                      lineHeight: 1,
                      color: hovered ? social.color : "#1A1A1A",
                      transition: "color 0.25s ease",
                    }}>
                      {social.label}
                    </span>
                    <span style={{
                      fontSize: 13,
                      color: "#aaa",
                      fontWeight: 400,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {social.handle}
                    </span>
                  </div>

                  {/* Right */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: hovered ? social.color : "#bbb",
                      background: hovered ? social.tagBgHover : "rgba(26,26,26,0.06)",
                      padding: "5px 12px",
                      borderRadius: 100,
                      transition: "all 0.25s ease",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {social.tag}
                    </span>
                    <span style={{
                      fontSize: 20,
                      color: hovered ? social.color : "#1A1A1A",
                      opacity: hovered ? 1 : 0.25,
                      transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
                      transition: "opacity 0.25s ease, transform 0.25s ease, color 0.25s ease",
                      display: "inline-block",
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

      {/* ── Footer ── */}
      <footer>
        {/* Part A — Info grid */}
        <div style={{
          borderTop: "1px solid rgba(26,26,26,0.15)",
          padding: isMobile ? "32px 24px 36px" : "40px 52px 44px",
          backgroundColor: "#F5F0E8",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "120px 1fr 1fr 1fr",
          gap: isMobile ? "24px 16px" : "0",
        }}>
          {/* Col 1 — nav label */}
          <div>
            <p style={{
              fontSize: 11,
              color: "#999",
              letterSpacing: "0.5px",
              marginBottom: 18,
              marginTop: 0,
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase",
            }}>
              (MENU)
            </p>
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#1A1A1A",
                  textDecoration: "none",
                  display: "block",
                  lineHeight: 1.5,
                  transition: "opacity 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Col 2 — socials */}
          <div>
            <p style={{
              fontSize: 11,
              color: "#999",
              letterSpacing: "0.5px",
              marginBottom: 18,
              marginTop: 0,
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase",
            }}>
              (SOCIALS)
            </p>
            {socialLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.target}
                rel="noopener noreferrer"
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#1A1A1A",
                  textDecoration: "none",
                  display: "block",
                  lineHeight: 1.5,
                  transition: "opacity 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Col 3 — empty spacer on desktop, hidden on mobile */}
          {!isMobile && <div />}

          {/* Col 4 — email */}
          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <p style={{
              fontSize: 11,
              color: "#999",
              letterSpacing: "0.5px",
              marginBottom: 18,
              marginTop: 0,
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase",
              textAlign: isMobile ? "left" : "right",
            }}>
              (SAY "HELLO")
            </p>
            <a
              href="mailto:kishoreraammskj@gmail.com"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#1A1A1A",
                textDecoration: "none",
                display: "block",
                textAlign: isMobile ? "left" : "right",
                transition: "opacity 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                wordBreak: "break-all",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              kishoreraammskj@gmail.com
            </a>
          </div>
        </div>

        {/* Part B — Gradient zone */}
        <div style={{
          height: 300,
          background: "linear-gradient(to bottom, #F5F0E8 0%, #f0d4c4 30%, #e8896a 65%, #e05c35 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            bottom: -8,
            left: 0,
            right: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(56px, 9.5vw, 120px)",
            lineHeight: 0.87,
            color: "#1A1A1A",
            letterSpacing: "-4px",
            padding: "0 32px",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
          }}>
            KISHORERAAM
          </div>
        </div>

        {/* Part C — Bottom bar */}
        <div style={{
          backgroundColor: "#1A1A1A",
          padding: isMobile ? "16px 24px" : "16px 52px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}>
          <span style={{
            fontSize: 12,
            color: "rgba(245,240,232,0.45)",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ©2026 Kishoreraam. All rights reserved.
          </span>
          <span style={{
            fontSize: 12,
            color: "rgba(245,240,232,0.45)",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Built from TamilNadu with{" "}
            <span style={{ color: "#D5E636" }}>✦</span>
          </span>
        </div>
      </footer>
    </>
  );
}
