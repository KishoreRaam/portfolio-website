import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Panel = {
  num: string;
  category: string;
  bg: string;
  textColor: string;
  muted: string;
  titleMain: string;
  titleHighlight: string;
  desc: string;
  tags: string[];
  limeTag: string;
  divider: boolean;
};

const PANELS: Panel[] = [
  {
    num: "01",
    category: "01 — Development",
    bg: "#F0EBE3",
    textColor: "#1A1A1A",
    muted: "#9A9490",
    titleMain: "Software",
    titleHighlight: "builds.",
    desc: "From web apps to PWAs,\nbuilding with modern stacks.",
    tags: ["React", "Next.js", "Appwrite", "Node.js", "PWA", "REST APIs"],
    limeTag: "Next.js",
    divider: true,
  },
  {
    num: "02",
    category: "02 — Intelligence",
    bg: "#1A1A1A",
    textColor: "#F0EBE3",
    muted: "#6A6A6A",
    titleMain: "AI &",
    titleHighlight: "machines.",
    desc: "Where models meet maker culture\nand machines learn to think.",
    tags: ["Prompt Eng.", "Python", "IoT & Arduino", "ML pipelines", "PLC Logic"],
    limeTag: "Prompt Eng.",
    divider: true,
  },
  {
    num: "03",
    category: "03 — Creative",
    bg: "#C8DFE8",
    textColor: "#1A1A1A",
    muted: "#5A7280",
    titleMain: "Eyes &",
    titleHighlight: "frames.",
    desc: "Capturing motion, editing light\nand designing the invisible.",
    tags: ["Photography", "Video Editing", "UI/UX Design", "Figma", "Content"],
    limeTag: "Figma",
    divider: true,
  },
  {
    num: "04",
    category: "04 — Foundation",
    bg: "#F0EBE3",
    textColor: "#1A1A1A",
    muted: "#9A9490",
    titleMain: "Deep",
    titleHighlight: "roots.",
    desc: "Engineering foundations in silicon,\nlogic, and competitive systems.",
    tags: ["Mechatronics", "GATE 2027", "DSA", "C/C++", "Systems"],
    limeTag: "GATE 2027",
    divider: false,
  },
];

// Fixed header height inside the sticky pin container (px).
// Card area = 100vh - HEADER_H - BOTTOM_MARGIN
const HEADER_H    = 138;
const BOTTOM_M    = 20;
const CARD_GAP    = 12; // gap between cards in the column

function debounce(fn: () => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

export function SkillsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const panelRefs   = useRef<HTMLDivElement[]>([]);

  // Mobile refs
  const mobileTrackRef     = useRef<HTMLDivElement>(null);
  const mobilePinRef       = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null); // overflow:hidden clip window
  const mobileColumnRef    = useRef<HTMLDivElement>(null); // sliding column of cards

  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Desktop: pinned horizontal scroll ── */
  useLayoutEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;

      const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panelRefs.current.forEach((panel) => {
        if (!panel) return;
        gsap.from(
          panel.querySelectorAll(
            ".skill-tag, .panel-title, .panel-category, .panel-desc"
          ),
          {
            autoAlpha: 0,
            yPercent: 40,
            stagger: 0.08,
            ease: "power3.out",
            duration: 0.6,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "left 70%",
              horizontal: true,
            },
          }
        );
      });
    }, sectionRef);

    setTimeout(() => ScrollTrigger.refresh(), 100);

    const handleResize = debounce(() => ScrollTrigger.refresh(), 200);
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* ── Mobile: CSS sticky + column slide ──
     ScrollSmoother is disabled on mobile (see Landing.tsx), so CSS sticky
     works normally. The card column slides up as the user scrolls through the
     track — both the exiting and entering card are visible mid-transition,
     matching the reference "stacked card reveal" look.                        */
  useEffect(() => {
    if (isDesktop) return;
    const track  = mobileTrackRef.current;
    const container = mobileContainerRef.current;
    const column    = mobileColumnRef.current;
    if (!track || !container || !column) return;

    const N = PANELS.length;

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate(self) {
        const containerH = container.offsetHeight;
        const totalShift = (N - 1) * (containerH + CARD_GAP);
        gsap.set(column, { y: -self.progress * totalShift });
      },
    });

    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => { st.kill(); };
  }, [isDesktop]);

  /* ──────────────────── RENDER ──────────────────── */
  return (
    <section id="skills" ref={sectionRef}>

      {/* ── Desktop: overflow wrapper + pinned horizontal scroll ── */}
      {/*   display:none on mobile — never an overflow:hidden ancestor
            for the mobile sticky element.                           */}
      <div className="hidden md:block" style={{ overflow: "hidden" }}>
        <div
          ref={trackRef}
          style={{ display: "flex", width: "400vw", height: "100vh" }}
        >
          {PANELS.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => { if (el) panelRefs.current[i] = el; }}
              style={{
                width: "100vw", height: "100vh", backgroundColor: p.bg,
                flexShrink: 0, position: "relative",
                padding: "clamp(32px, 5vw, 72px) clamp(24px, 5vw, 72px)",
                boxSizing: "border-box",
              }}
            >
              <span className="panel-category" style={{ display: "block", fontSize: "clamp(10px, 1.2vw, 12px)", letterSpacing: "2.5px", textTransform: "uppercase", color: p.muted, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                {p.category}
              </span>
              <h2 className="panel-title" style={{ fontFamily: '"Averia Serif Libre", serif', fontSize: "clamp(36px, 7vw, 120px)", lineHeight: 1.05, color: p.textColor, margin: "clamp(12px, 2vw, 24px) 0 0", fontWeight: 700 }}>
                {p.titleMain} <span style={{ color: "#D5E636" }}>{p.titleHighlight}</span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(6px, 1vw, 10px)", marginTop: "clamp(20px, 3vw, 44px)" }}>
                {p.tags.map((tag) => (
                  <span key={tag} className="skill-tag" style={{ backgroundColor: tag === p.limeTag ? "#D5E636" : "#C8DFE8", color: "#1A1A1A", padding: "clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 20px)", borderRadius: 100, fontSize: "clamp(11px, 1.2vw, 14px)", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="panel-desc" style={{ position: "absolute", bottom: "clamp(28px, 5vw, 60px)", left: "clamp(24px, 5vw, 72px)", fontSize: "clamp(12px, 1.3vw, 15px)", lineHeight: 1.65, color: p.muted, fontFamily: "Inter, sans-serif", whiteSpace: "pre-line", margin: 0 }}>
                {p.desc}
              </p>
              <span style={{ position: "absolute", bottom: 0, right: "clamp(12px, 3vw, 40px)", fontSize: "clamp(72px, 12vw, 140px)", fontFamily: '"Averia Serif Libre", serif', fontWeight: 700, color: p.textColor, opacity: 0.07, lineHeight: 1, userSelect: "none" }}>
                {p.num}
              </span>
              {p.divider && <div style={{ position: "absolute", right: 0, top: "10%", height: "80%", width: 1, backgroundColor: p.textColor, opacity: 0.15 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: CSS-sticky panel + column slide ── */}
      <div className="md:hidden">
        {/* Track: provides 4×100vh of scroll space */}
        <div ref={mobileTrackRef} style={{ height: `${PANELS.length * 100}vh` }}>

          {/* Sticky viewport — locked to top while scrolling through the track.
              Uses CSS sticky (works because ScrollSmoother is off on mobile). */}
          <div
            ref={mobilePinRef}
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              backgroundColor: "#111",
            }}
          >
            {/* Fixed-height header */}
            <div style={{
              height: HEADER_H,
              padding: "42px 20px 0",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}>
              <span style={{
                fontSize: 10, letterSpacing: "3px", textTransform: "uppercase",
                color: "#555", fontFamily: "Inter, sans-serif", fontWeight: 500,
                marginBottom: 8, display: "block",
              }}>
                Skills
              </span>
              <h2 style={{
                fontFamily: '"Averia Serif Libre", serif',
                fontSize: 36, lineHeight: 1.05, fontWeight: 700,
                color: "#F0EBE3", margin: 0,
              }}>
                What I <span style={{ color: "#D5E636" }}>build.</span>
              </h2>
            </div>

            {/* Clipping window — overflow:hidden clips the column as it slides */}
            <div
              ref={mobileContainerRef}
              style={{
                position: "absolute",
                top: HEADER_H,
                left: 14,
                right: 14,
                bottom: BOTTOM_M,
                overflow: "hidden",
                borderRadius: 18,
              }}
            >
              {/* Sliding column: card 0 at top, card 1 below by (cardH + gap), etc.
                  GSAP translates this column upward; the clip window reveals one
                  card at a time, showing both during the slide transition. */}
              <div ref={mobileColumnRef}>
                {PANELS.map((p, i) => {
                  const isDark = p.bg === "#1A1A1A";
                  const cardH  = `calc(100vh - ${HEADER_H + BOTTOM_M}px)`;
                  return (
                    <div
                      key={p.num}
                      style={{
                        height: cardH,
                        marginBottom: i < PANELS.length - 1 ? CARD_GAP : 0,
                        backgroundColor: p.bg,
                        borderRadius: 18,
                        padding: "24px 18px 28px",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {/* Card header row */}
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}>
                        <span style={{
                          fontSize: 10, letterSpacing: "2.5px",
                          textTransform: "uppercase", color: p.muted,
                          fontFamily: "Inter, sans-serif", fontWeight: 500,
                        }}>
                          {p.category}
                        </span>
                        <span style={{
                          fontFamily: '"Averia Serif Libre", serif',
                          fontSize: 36, fontWeight: 700,
                          color: p.textColor, opacity: 0.08,
                          lineHeight: 1, marginTop: -4,
                          userSelect: "none" as React.CSSProperties["userSelect"],
                        }}>
                          {p.num}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontFamily: '"Averia Serif Libre", serif',
                        fontSize: 32, lineHeight: 1.05, fontWeight: 700,
                        color: p.textColor, margin: "0 0 16px",
                      }}>
                        {p.titleMain}{" "}
                        <span style={{ color: "#D5E636" }}>{p.titleHighlight}</span>
                      </h3>

                      {/* Tags */}
                      <div style={{
                        display: "flex", flexWrap: "wrap",
                        gap: 7, marginBottom: 18,
                      }}>
                        {p.tags.map((tag) => (
                          <span key={tag} style={{
                            backgroundColor: tag === p.limeTag
                              ? "#D5E636"
                              : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                            color: tag === p.limeTag ? "#1A1A1A" : p.textColor,
                            padding: "5px 12px",
                            borderRadius: 100,
                            fontSize: 12,
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p style={{
                        fontSize: 13, lineHeight: 1.7, color: p.muted,
                        fontFamily: "Inter, sans-serif",
                        whiteSpace: "pre-line", margin: 0,
                      }}>
                        {p.desc}
                      </p>

                      {/* Large watermark number */}
                      <span style={{
                        position: "absolute",
                        bottom: 0, right: 16,
                        fontFamily: '"Averia Serif Libre", serif',
                        fontSize: 100, fontWeight: 700,
                        color: p.textColor, opacity: 0.05,
                        lineHeight: 1,
                        userSelect: "none" as React.CSSProperties["userSelect"],
                      }}>
                        {p.num}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
