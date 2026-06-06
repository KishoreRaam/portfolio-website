import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HEADING_GLYPHS, HEADING_VIEWBOX } from "./headingPaths";
import { ProjectCard } from "@/components/ui/project-card";

gsap.registerPlugin(ScrollTrigger);

const HEAD_LINES = ["Projects that", "speak for", "themselves"];

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
  tag: string;
  year: string;
  url?: string;
}

interface ExpandingCardsProps {
  items: CardItem[];
}

export function ExpandingCards({ items }: ExpandingCardsProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const pinRef   = React.useRef<HTMLDivElement>(null);
  const rowRef   = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const headPathRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const headFillRef   = React.useRef<SVGGElement>(null);
  const lensRef       = React.useRef<number[]>([]);
  const totalLenRef   = React.useRef(0);
  const reducedRef    = React.useRef(false);
  const [active, setActive] = React.useState(0);

  const [isDesktop, setIsDesktop] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // The pinned scroll is split: the first slice writes the heading, the rest
  // steps through the cards. So 1 of every (items + 1) viewports is the heading.
  const WRITE_FRACTION = 1 / (items.length + 1);

  // Measure each line-path's outline length and prime it as fully "unwritten"
  // (dash gap covering the whole path). Lengths are in viewBox units, so they're
  // independent of the rendered size — measured once.
  React.useLayoutEffect(() => {
    const paths = headPathRefs.current.filter(Boolean) as SVGPathElement[];
    if (!paths.length) return;
    const lens = paths.map((p) => p.getTotalLength());
    lensRef.current = lens;
    totalLenRef.current = lens.reduce((a, b) => a + b, 0);
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // On mobile or reduced-motion: show heading fully drawn immediately, no animation.
    if (reducedRef.current || !isDesktop) {
      paths.forEach((p, i) => gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: 0 }));
      if (headFillRef.current) gsap.set(headFillRef.current, { opacity: 1 });
      return;
    }
    paths.forEach((p, i) => gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }));
    if (headFillRef.current) gsap.set(headFillRef.current, { opacity: 0 });
  }, [isDesktop]);

  // Drive the heading from the pin's progress (0 → WRITE_FRACTION). The pen
  // traces real glyph outlines via strokeDashoffset, line after line at a
  // constant speed; once written, the fill cross-fades in.
  const drawHeading = React.useCallback((progress: number) => {
    if (reducedRef.current) return;
    const paths = headPathRefs.current;
    const lens  = lensRef.current;
    const total = totalLenRef.current;
    if (!total || paths.length !== lens.length) return;
    const hp    = gsap.utils.clamp(0, 1, progress / WRITE_FRACTION);
    const drawn = hp * total;                                  // length written so far
    let acc = 0;
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i];
      if (!p) continue;
      const local = gsap.utils.clamp(0, lens[i], drawn - acc);
      gsap.set(p, { strokeDashoffset: lens[i] - local });
      acc += lens[i];
    }
    const fillP = gsap.utils.clamp(0, 1, (hp - 0.85) / 0.15); // fill reveal tail
    if (headFillRef.current) gsap.set(headFillRef.current, { opacity: fillP });
  }, [WRITE_FRACTION]);

  /* ── Desktop: horizontal sticky scroll ── */
  React.useEffect(() => {
    if (!isDesktop) return;
    const track = trackRef.current;
    const row   = rowRef.current;
    if (!track || !row) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length !== items.length) return;

    const INACTIVE = 72;
    const GAP      = 12;
    const getActiveW = () =>
      row.offsetWidth - (items.length - 1) * (INACTIVE + GAP);

    const initWidths = () => {
      const aw = getActiveW();
      cards.forEach((c, i) => gsap.set(c, { width: i === 0 ? aw : INACTIVE }));
    };
    initWidths();

    const qw = cards.map((c) =>
      gsap.quickTo(c, "width", { duration: 0.65, ease: "power3.inOut" }),
    );

    let prev = 0;
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      pin: pinRef.current,
      pinSpacing: false,
      pinType: "transform",
      anticipatePin: 1,
      onUpdate(self) {
        drawHeading(self.progress);
        const cardP = (self.progress - WRITE_FRACTION) / (1 - WRITE_FRACTION);
        const step = Math.min(Math.floor(Math.max(cardP, 0) * items.length), items.length - 1);
        if (step === prev) return;
        prev = step;
        setActive(step);
        const aw = getActiveW();
        cards.forEach((_, i) => qw[i](i === step ? aw : INACTIVE));
      },
    });

    const onResize = () => { initWidths(); ScrollTrigger.refresh(); };
    window.addEventListener("resize", onResize);
    return () => { st.kill(); window.removeEventListener("resize", onResize); };
  }, [isDesktop, items.length]);

  /* ── Mobile: no animation ── */

  /* ── Shared card click handler ── */
  const handleCardClick = (i: number) => {
    if (active === i && items[i].url) {
      window.open(items[i].url, "_blank", "noopener,noreferrer");
      return;
    }
    setActive(i);
    const row = rowRef.current;
    if (!row) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    if (isDesktop) {
      const aw = row.offsetWidth - (items.length - 1) * (72 + 12);
      cards.forEach((c, j) =>
        gsap.to(c, { width: j === i ? aw : 72, duration: 0.65, ease: "power3.inOut", overwrite: true }),
      );
    } else {
      const ah = row.offsetHeight - (items.length - 1) * (52 + 8);
      cards.forEach((c, j) =>
        gsap.to(c, { height: j === i ? ah : 52, duration: 0.65, ease: "power3.inOut", overwrite: true }),
      );
    }
  };

  /* ── Shared card content ── */
  const renderCardContent = (item: CardItem, i: number) => (
    <>
      {/* Inactive: rotated label */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: active === i ? 0 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }}>
        <span style={{
          fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700,
          color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
          letterSpacing: 2, whiteSpace: "nowrap",
          transform: isDesktop ? "rotate(90deg)" : "none",
        }}>
          {item.title}
        </span>
      </div>

      {/* Active: full content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: isDesktop ? 24 : 16, gap: isDesktop ? 10 : 6,
        opacity: active === i ? 1 : 0,
        transition: "opacity 0.4s ease 0.15s",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(255,255,255,0.9)" }}>{item.icon}</div>
          {item.url && (
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </div>
          )}
        </div>
        <span style={{
          display: "inline-block", width: "fit-content",
          backgroundColor: "rgba(213,230,54,0.18)", color: "#D5E636",
          border: "1px solid rgba(213,230,54,0.35)", borderRadius: 100,
          padding: "4px 12px", fontSize: 11, fontWeight: 600,
          letterSpacing: 1, textTransform: "uppercase", fontFamily: "Inter, sans-serif",
        }}>
          {item.tag} · {item.year}
        </span>
        <h3 style={{
          fontFamily: "'Young Serif', serif", fontWeight: "normal",
          fontSize: isDesktop ? 28 : 22, color: "#fff", margin: 0, lineHeight: 1.1,
        }}>
          {item.title}
        </h3>
        <p style={{
          color: "rgba(255,255,255,0.72)", fontSize: isDesktop ? 14 : 13,
          lineHeight: 1.65, margin: 0, maxWidth: isDesktop ? 380 : "none",
        }}>
          {item.description}
        </p>
      </div>
    </>
  );

  /* ──────────────────── RENDER ──────────────────── */
  const headStroke = 2.6;

  /* ── Mobile: ProjectCard grid ── */
  if (!isDesktop) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", padding: "56px 20px 72px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: "#555", textTransform: "uppercase", margin: "0 0 14px", fontFamily: "Inter, sans-serif" }}>
          Selected Work
        </p>
        <h2 style={{ fontFamily: "'Young Serif', serif", fontSize: 36, fontWeight: 400, color: "#f0ede6", lineHeight: 1.1, margin: "0 0 36px" }}>
          Projects that speak for themselves
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {items.map((item) => (
            <ProjectCard
              key={item.id}
              imgSrc={item.imgSrc}
              title={item.title}
              description={item.description}
              tag={item.tag}
              year={item.year}
              link={item.url ?? "#"}
            />
          ))}
        </div>
      </div>
    );
  }

  const headW = 560;

  return (
    <div
      ref={trackRef}
      style={{ height: `${(items.length + 1) * 100}vh`, backgroundColor: "#0F0F0F" }}
    >
      <div
        ref={pinRef}
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isDesktop ? "0 48px" : "24px 20px",
          maxWidth: isDesktop ? 1296 : "none",
          margin: isDesktop ? "0 auto" : 0,
          boxSizing: "border-box",
        }}
      >
        {/* Heading — written by the stroke during the first scroll slice (Phase 4) */}
        <div style={{ marginBottom: isDesktop ? 36 : 22, flexShrink: 0 }}>
          <p style={{
            fontSize: isDesktop ? 12 : 11, fontWeight: 700, letterSpacing: 3,
            color: "#555", textTransform: "uppercase",
            margin: "0 0 16px", fontFamily: "Inter, sans-serif",
          }}>
            Selected Work
          </p>
          <svg
            viewBox={HEADING_VIEWBOX}
            preserveAspectRatio="xMinYMid meet"
            style={{ width: headW, height: "auto", maxWidth: "100%", overflow: "visible", display: "block" }}
            role="img"
            aria-label={HEAD_LINES.join(" ")}
          >
            {/* Fill layer — sits under the stroke, faded in once writing finishes */}
            <g ref={headFillRef} fill="#f0ede6" stroke="none" style={{ opacity: 0 }}>
              {HEADING_GLYPHS.map((d, i) => (
                <path key={`f${i}`} d={d} />
              ))}
            </g>
            {/* Stroke (written) layer — the pen traces each glyph outline in order.
                Butt caps: undrawn glyphs render nothing (no stray round-cap dots). */}
            <g fill="none" stroke="#ffffff" strokeWidth={headStroke} strokeLinecap="butt" strokeLinejoin="round">
              {HEADING_GLYPHS.map((d, i) => (
                <path key={`s${i}`} ref={(el) => { headPathRefs.current[i] = el; }} d={d} />
              ))}
            </g>
          </svg>
        </div>

        {/* Cards row (desktop) / column (mobile) */}
        <div
          ref={rowRef}
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: isDesktop ? 12 : 8,
            // Desktop: fixed height; Mobile: fill remaining space
            ...(isDesktop
              ? { height: 440 }
              : { flex: 1, minHeight: 0 }),
            alignItems: "stretch",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              onClick={() => handleCardClick(i)}
              style={{
                flexShrink: 0,
                // Initial sizes overridden by GSAP immediately
                width:  isDesktop ? 72  : "100%",
                height: isDesktop ? "100%" : 52,
                position: "relative",
                overflow: "hidden",
                borderRadius: 14,
                cursor: "pointer",
              }}
            >
              <img
                src={item.imgSrc}
                alt={item.title}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover",
                  filter: active === i ? "none" : "grayscale(1) brightness(0.7)",
                  transition: "filter 0.5s ease",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
              }} />
              {renderCardContent(item, i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
