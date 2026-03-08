import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, X, Minus, Square } from "lucide-react";
import teenageImg from "../../assets/ff3d111587b56189bc0d2970555f20573b7a7584.png";

const projects = [
  {
    id: 1,
    title: "first_website.exe",
    desc: "The first lines of HTML that changed everything. A geocities-era masterpiece.",
    tags: ["HTML", "CSS", "Passion"],
  },
  {
    id: 2,
    title: "gaming_mods.bat",
    desc: "Modding games taught problem-solving before any textbook could.",
    tags: ["Modding", "Creativity", "C++"],
  },
  {
    id: 3,
    title: "art_experiments.psd",
    desc: "Digital art, photo edits, and the birth of a visual storyteller.",
    tags: ["Photoshop", "Design", "Vision"],
  },
  {
    id: 4,
    title: "music_production.wav",
    desc: "Beats, melodies, and late-night sessions that fueled the soul.",
    tags: ["FL Studio", "Audio", "Expression"],
  },
];

export default function Teenage() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showStatic, setShowStatic] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // VHS rewind effect
    const t1 = setTimeout(() => setShowStatic(false), 1500);
    const t2 = setTimeout(() => setLoaded(true), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Neon particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ["#b537f2", "#00f5ff", "#ff00aa"];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: "#0d0d0d",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* Neon particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.03) 2px, rgba(0,245,255,0.03) 4px)",
        }}
      />

      {/* VHS Static loading */}
      <AnimatePresence>
        {showStatic && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "#0d0d0d" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* Static noise simulation */}
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px 200px",
                  filter: "contrast(2) brightness(1.5)",
                }}
              />
              {/* VHS text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={{ opacity: [0.3, 1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <p className="text-[#00f5ff] tracking-[0.3em]" style={{ fontSize: "0.8rem" }}>
                    ▶ REWINDING...
                  </p>
                  <div className="mt-2 flex gap-1 justify-center">
                    <span className="text-[#b537f2]">◀◀</span>
                    <span className="text-white/30">REC</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#b537f2]/60 hover:text-[#b537f2] transition-colors"
          style={{ fontSize: "0.8rem" }}
        >
          <ArrowLeft className="w-4 h-4" />
          {"<< BACK_TO_LOBBY"}
        </button>
        <div className="text-[#00f5ff]/30" style={{ fontSize: "0.7rem" }}>
          PHASE_02 // STATIC & SIGNAL
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        className="relative pt-24 pb-16 px-6 flex flex-col items-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* CRT Monitor frame */}
        <div
          className="relative rounded-lg p-1 max-w-xl w-full"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            boxShadow: "0 0 30px rgba(181,55,242,0.15), 0 0 60px rgba(0,245,255,0.05)",
          }}
        >
          <div className="bg-[#0a0a0a] rounded p-6 md:p-8">
            {/* CRT top bar */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#b537f2]" />
                <span className="text-white/20" style={{ fontSize: "0.65rem" }}>
                  raam_phase2.exe
                </span>
              </div>
              <div className="flex gap-2">
                <Minus className="w-3 h-3 text-white/20" />
                <Square className="w-3 h-3 text-white/20" />
                <X className="w-3 h-3 text-white/20" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar with chromatic aberration on hover */}
              <motion.div
                className="relative w-40 h-40 rounded-lg overflow-hidden flex-shrink-0 group"
                whileHover="hover"
              >
                <img
                  src={teenageImg}
                  alt="Teenage Raam"
                  className="w-full h-full object-cover"
                />
                {/* RGB split effect layers */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{ mixBlendMode: "screen" }}
                >
                  <img
                    src={teenageImg}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{
                      filter: "hue-rotate(90deg) saturate(3)",
                      transform: "translate(3px, -2px)",
                    }}
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                  style={{ mixBlendMode: "screen" }}
                >
                  <img
                    src={teenageImg}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{
                      filter: "hue-rotate(200deg) saturate(3)",
                      transform: "translate(-3px, 2px)",
                    }}
                  />
                </motion.div>
                {/* Scanlines on image */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
                  }}
                />
              </motion.div>

              <div>
                <motion.h1
                  className="text-[#b537f2] mb-2 relative"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {/* Glitch text */}
                  <span className="relative inline-block">
                    Static & Signal
                    <span
                      className="absolute top-0 left-0 text-[#00f5ff] opacity-0 hover:opacity-70 transition-opacity"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                        transform: "translate(2px, -1px)",
                      }}
                      aria-hidden
                    >
                      Static & Signal
                    </span>
                    <span
                      className="absolute top-0 left-0 text-[#ff0066] opacity-0 hover:opacity-70 transition-opacity"
                      style={{
                        clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
                        transform: "translate(-2px, 1px)",
                      }}
                      aria-hidden
                    >
                      Static & Signal
                    </span>
                  </span>
                </motion.h1>
                <p className="text-white/30 mb-4" style={{ fontSize: "0.8rem", lineHeight: 1.8 }}>
                  The years of breaking things to understand them.
                  <br />
                  Code, art, music — everything was an experiment.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Rebel", "Creator", "Dreamer", "Explorer"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-sm border text-[#00f5ff]/60"
                      style={{
                        borderColor: "rgba(0,245,255,0.15)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Windows 98 style project cards */}
      <motion.section
        className="px-6 pb-24 z-20 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2
          className="text-center text-[#b537f2]/30 mb-12 tracking-[0.3em]"
          style={{ fontSize: "0.8rem" }}
        >
          {"// PROJECTS & EXPERIMENTS"}
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group"
            >
              {/* Win98 dialog box */}
              <div className="border border-white/10 rounded-sm overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-sm">
                {/* Title bar */}
                <div
                  className="flex items-center justify-between px-3 py-1.5"
                  style={{
                    background: "linear-gradient(90deg, #1a1a3e 0%, #2d1b69 100%)",
                  }}
                >
                  <span className="text-white/60" style={{ fontSize: "0.7rem" }}>
                    {project.title}
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 border border-white/20 flex items-center justify-center">
                      <Minus className="w-2 h-2 text-white/40" />
                    </div>
                    <div className="w-3 h-3 border border-white/20 flex items-center justify-center">
                      <Square className="w-2 h-2 text-white/40" />
                    </div>
                    <div className="w-3 h-3 border border-white/20 flex items-center justify-center">
                      <X className="w-2 h-2 text-white/40" />
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <p
                    className="text-white/40 mb-4"
                    style={{ fontSize: "0.75rem", lineHeight: 1.8 }}
                  >
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[#b537f2]/10 text-[#b537f2]/60 rounded-sm"
                        style={{ fontSize: "0.6rem", letterSpacing: "0.05em" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quote */}
      <motion.section
        className="py-20 px-6 text-center z-20 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="max-w-xl mx-auto border-t border-b border-[#b537f2]/10 py-12">
          <p
            className="text-[#00f5ff]/40"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
              fontStyle: "italic",
              lineHeight: 2,
            }}
          >
            "We are the ones who break things to see how they work."
          </p>
          <p className="text-[#b537f2]/20 mt-4" style={{ fontSize: "0.7rem", letterSpacing: "0.2em" }}>
            — THE STATIC YEARS
          </p>
        </div>
      </motion.section>
    </div>
  );
}
