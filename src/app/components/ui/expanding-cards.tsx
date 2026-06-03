import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
  tag: string;
  year: string;
}

interface ExpandingCardsProps {
  items: CardItem[];
}

export function ExpandingCards({ items }: ExpandingCardsProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const rowRef   = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = React.useState(0);

  const [isDesktop, setIsDesktop] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
      onUpdate(self) {
        const step = Math.min(Math.floor(self.progress * items.length), items.length - 1);
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

  /* ── Mobile: vertical sticky scroll ── */
  React.useEffect(() => {
    if (isDesktop) return;
    const track = trackRef.current;
    const row   = rowRef.current;
    if (!track || !row) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length !== items.length) return;

    const INACTIVE = 52;
    const GAP      = 8;
    const getActiveH = () =>
      row.offsetHeight - (items.length - 1) * (INACTIVE + GAP);

    const initHeights = () => {
      const ah = getActiveH();
      cards.forEach((c, i) => gsap.set(c, { height: i === 0 ? ah : INACTIVE }));
    };
    initHeights();

    const qh = cards.map((c) =>
      gsap.quickTo(c, "height", { duration: 0.65, ease: "power3.inOut" }),
    );

    let prev = 0;
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate(self) {
        const step = Math.min(Math.floor(self.progress * items.length), items.length - 1);
        if (step === prev) return;
        prev = step;
        setActive(step);
        const ah = getActiveH();
        cards.forEach((_, i) => qh[i](i === step ? ah : INACTIVE));
      },
    });

    const onResize = () => { initHeights(); ScrollTrigger.refresh(); };
    window.addEventListener("resize", onResize);
    return () => { st.kill(); window.removeEventListener("resize", onResize); };
  }, [isDesktop, items.length]);

  /* ── Shared card click handler ── */
  const handleCardClick = (i: number) => {
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
        <div style={{ color: "rgba(255,255,255,0.9)" }}>{item.icon}</div>
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
  return (
    <div
      ref={trackRef}
      style={{ height: `${items.length * 100}vh`, backgroundColor: "#0F0F0F" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
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
        {/* Heading */}
        <div style={{ marginBottom: isDesktop ? 40 : 24, flexShrink: 0 }}>
          <p style={{
            fontSize: isDesktop ? 12 : 11, fontWeight: 700, letterSpacing: 3,
            color: "#555", textTransform: "uppercase",
            marginBottom: isDesktop ? 14 : 10, fontFamily: "Inter, sans-serif",
          }}>
            Selected Work
          </p>
          <h2 style={{
            fontFamily: "'Young Serif', serif",
            fontSize: isDesktop ? 72 : 42,
            lineHeight: 0.95, color: "#F0EBE3",
            fontWeight: "normal", margin: 0,
          }}>
            Projects that<br />speak for<br />themselves
          </h2>
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
