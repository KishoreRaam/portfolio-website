import React, { useRef, useLayoutEffect } from "react";
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

function debounce(fn: () => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
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

  return (
    <section id="skills" ref={sectionRef} style={{ overflow: "hidden" }}>
      <div
        ref={trackRef}
        style={{ display: "flex", width: "400vw", height: "100vh" }}
      >
        {PANELS.map((p, i) => (
          <div
            key={p.num}
            ref={(el) => {
              if (el) panelRefs.current[i] = el;
            }}
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: p.bg,
              flexShrink: 0,
              position: "relative",
              padding: "clamp(32px, 5vw, 72px) clamp(24px, 5vw, 72px)",
              boxSizing: "border-box",
            }}
          >
            {/* Category label */}
            <span
              className="panel-category"
              style={{
                display: "block",
                fontSize: "clamp(10px, 1.2vw, 12px)",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: p.muted,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
              }}
            >
              {p.category}
            </span>

            {/* Title */}
            <h2
              className="panel-title"
              style={{
                fontFamily: '"Averia Serif Libre", serif',
                fontSize: "clamp(36px, 7vw, 120px)",
                lineHeight: 1.05,
                color: p.textColor,
                margin: "clamp(12px, 2vw, 24px) 0 0",
                fontWeight: 700,
              }}
            >
              {p.titleMain}{" "}
              <span style={{ color: "#D5E636" }}>{p.titleHighlight}</span>
            </h2>

            {/* Skill tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "clamp(6px, 1vw, 10px)",
                marginTop: "clamp(20px, 3vw, 44px)",
              }}
            >
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="skill-tag"
                  style={{
                    backgroundColor: tag === p.limeTag ? "#D5E636" : "#C8DFE8",
                    color: "#1A1A1A",
                    padding: "clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 20px)",
                    borderRadius: 100,
                    fontSize: "clamp(11px, 1.2vw, 14px)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description — bottom-left */}
            <p
              className="panel-desc"
              style={{
                position: "absolute",
                bottom: "clamp(28px, 5vw, 60px)",
                left: "clamp(24px, 5vw, 72px)",
                fontSize: "clamp(12px, 1.3vw, 15px)",
                lineHeight: 1.65,
                color: p.muted,
                fontFamily: "Inter, sans-serif",
                whiteSpace: "pre-line",
                margin: 0,
              }}
            >
              {p.desc}
            </p>

            {/* Ghost chapter number — bottom-right */}
            <span
              style={{
                position: "absolute",
                bottom: 0,
                right: "clamp(12px, 3vw, 40px)",
                fontSize: "clamp(72px, 12vw, 140px)",
                fontFamily: '"Averia Serif Libre", serif',
                fontWeight: 700,
                color: p.textColor,
                opacity: 0.07,
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {p.num}
            </span>

            {/* Right-edge divider */}
            {p.divider && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "10%",
                  height: "80%",
                  width: 1,
                  backgroundColor: p.textColor,
                  opacity: 0.15,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
