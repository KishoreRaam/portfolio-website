import React, { useRef, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { gsap } from "gsap";
import resumeUrl from "../../Kishoreraam_Resume.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function calcPageWidth() {
  return Math.min(
    Math.floor(window.innerHeight * 0.82 * (595 / 842)),
    Math.floor(window.innerWidth * 0.88),
    600,
  );
}

const QUADRANTS = [
  { id: "tl", originX: "100%", innerTop: 0,  innerLeft: 0  },
  { id: "tr", originX: "0%",   innerTop: 0,  innerLeft: -1 },
  { id: "bl", originX: "100%", innerTop: -1, innerLeft: 0  },
  { id: "br", originX: "0%",   innerTop: -1, innerLeft: -1 },
] as const;

interface Props { onClose: () => void; }

export function PaperUnfold({ onClose }: Props) {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef     = useRef<gsap.core.Timeline | null>(null);
  const [loaded, setLoaded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const PAGE_W = calcPageWidth();
  const PAGE_H = Math.floor(PAGE_W * 842 / 595);
  const HALF_W = PAGE_W / 2;
  const HALF_H = PAGE_H / 2;

  const renderedCount = useRef(0);
  function onPageRender() {
    renderedCount.current += 1;
    if (renderedCount.current === 4) setLoaded(true);
  }

  useEffect(() => {
    if (!loaded) return;
    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];

    gsap.set(panels[0], { rotateY: -90 });
    gsap.set(panels[1], { rotateY:  90 });
    gsap.set(panels[2], { rotateY: -90 });
    gsap.set(panels[3], { rotateY:  90 });
    gsap.set(panels, { autoAlpha: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" });

    const tl = gsap.timeline();
    panels.forEach((panel, i) => {
      tl.to(panel, {
        rotateY:   0,
        boxShadow: "4px 6px 32px rgba(0,0,0,0.22)",
        duration:  0.55,
        ease:      "power2.out",
      }, i * 0.13);
    });

    tlRef.current = tl;
    tl.eventCallback("onReverseComplete", onClose);
  }, [loaded, onClose]);

  function handleClose() {
    if (tlRef.current) tlRef.current.reverse();
    else onClose();
  }

  function innerStyle(q: typeof QUADRANTS[number]): React.CSSProperties {
    return {
      position: "absolute",
      top:  q.innerTop  === -1 ? -HALF_H : 0,
      left: q.innerLeft === -1 ? -HALF_W : 0,
      width: PAGE_W,
      height: PAGE_H,
      pointerEvents: "none",
    };
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.65)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Perspective wrapper — the single flex item, sized by the grid container */}
      <div style={{ position: "relative", perspective: "1200px" }}>

        {/* Top bar — absolutely positioned above the grid, no layout effect */}
        <div style={{
          position: "absolute", top: -48, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Kishoreraam_Resume.pdf
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a
              href={resumeUrl}
              download="Kishoreraam_Resume.pdf"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
                backgroundColor: hovered ? "#D5E636" : "#1A1A1A",
                color: hovered ? "#1A1A1A" : "#F0EBE3",
                padding: "8px 18px", borderRadius: 100,
                textDecoration: "none",
                transition: "background-color 0.2s, color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Download
            </a>
            <button
              onClick={handleClose}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.35)",
                backgroundColor: "transparent", cursor: "pointer",
                fontSize: 20, color: "rgba(255,255,255,0.8)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>
          </div>
        </div>

        {/*
          Grid container — always in the DOM at full PAGE_W × PAGE_H so that
          the <canvas> elements inside can render even before we reveal them.
          The loading overlay sits on top (position:absolute, zIndex:2) and
          disappears once all 4 pages have rendered.
        */}
        <div style={{ position: "relative", width: PAGE_W, height: PAGE_H }}>

          {/* Loading overlay: covers hidden panels while PDF renders */}
          {!loaded && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 2,
              backgroundColor: "#F0EBE3",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Inter, sans-serif", fontSize: 14, color: "#9A9490",
              letterSpacing: "1px",
            }}>
              unfolding…
            </div>
          )}

          {/* 4 quadrant panels */}
          {QUADRANTS.map((q, i) => (
            <div
              key={q.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              style={{
                position: "absolute",
                top:  i < 2  ? 0      : HALF_H,
                left: i % 2 === 0 ? 0 : HALF_W,
                width: HALF_W, height: HALF_H,
                overflow: "hidden",
                transformOrigin: `${q.originX} 50%`,
                willChange: "transform",
                /* panels invisible until GSAP sets autoAlpha:1 */
                visibility: "hidden", opacity: 0,
              }}
            >
              <div style={innerStyle(q)}>
                <Document file={resumeUrl} loading={null} error={null}>
                  <Page
                    pageNumber={1}
                    width={PAGE_W}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderSuccess={onPageRender}
                  />
                </Document>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
