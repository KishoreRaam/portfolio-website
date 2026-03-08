import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Lock } from "lucide-react";
import childhoodImg from "../../assets/76de70acbf6fd92c3be0d7fdb50c8daab19f8c59.png";
import teenageImg from "../../assets/ff3d111587b56189bc0d2970555f20573b7a7584.png";
import presentImg from "../../assets/eac206a98cdbe6b2e9ca989b84cb6042a0a79cef.png";

const phases = [
  {
    id: "childhood",
    title: "The Wonder Years",
    subtitle: "Chapter 1",
    teaser: "Where imagination had no limits.\nA world drawn in crayon and wonder.",
    image: childhoodImg,
    path: "/childhood",
    accent: "#f5a623",
    filter: "none",
  },
  {
    id: "teenage",
    title: "Static & Signal",
    subtitle: "Chapter 2",
    teaser: "Glitches in reality, signals in noise.\nThe age of rebellion and discovery.",
    image: teenageImg,
    path: "/teenage",
    accent: "#b537f2",
    filter: "none",
  },
  {
    id: "present",
    title: "Production Mode",
    subtitle: "Chapter 3",
    teaser: "Engineer. Builder. Storyteller.\nThe future is being compiled.",
    image: presentImg,
    path: "/present",
    accent: "#00ffcc",
    filter: "none",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [spotlightReady, setSpotlightReady] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);
  const [flickerCount, setFlickerCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSpotlightReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (transitioning && flickerCount < 3) {
      const t = setTimeout(() => setFlickerCount((c) => c + 1), 150);
      return () => clearTimeout(t);
    }
    if (transitioning && flickerCount >= 3 && transitionTarget) {
      const t = setTimeout(() => navigate(transitionTarget), 300);
      return () => clearTimeout(t);
    }
  }, [transitioning, flickerCount, transitionTarget, navigate]);

  const handlePhaseClick = (path: string) => {
    setTransitioning(true);
    setTransitionTarget(path);
    setFlickerCount(0);
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "#000",
        fontFamily: "'Bebas Neue', sans-serif",
      }}
    >
      {/* Projector flicker overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{
              opacity: flickerCount % 2 === 0 ? 1 : 0.3,
              backgroundColor: "#000",
            }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>

      {/* Spotlight background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: spotlightReady ? 1 : 0 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Title */}
      <motion.div
        className="text-center mb-12 md:mb-16 z-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: spotlightReady ? 1 : 0, y: spotlightReady ? 0 : -30 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <h1
          className="text-white tracking-[0.3em] mb-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
          }}
        >
          RAAM
        </h1>
        <p
          className="text-white/40 tracking-[0.15em]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.7rem, 1.5vw, 1rem)",
            fontStyle: "italic",
          }}
        >
          A Life In Frames
        </p>
        <div className="mt-6 text-white/20 tracking-[0.2em]" style={{ fontSize: "clamp(0.6rem, 1vw, 0.75rem)" }}>
          WHOM DO YOU WANT TO WATCH?
        </div>
      </motion.div>

      {/* Phase Cards */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: spotlightReady ? 1 : 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {phases.map((phase, i) => (
          <motion.div
            key={phase.id}
            className="relative cursor-pointer group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 + i * 0.3 }}
            onMouseEnter={() => setHoveredCard(phase.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handlePhaseClick(phase.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Glow ring */}
            <div
              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
              style={{ background: phase.accent }}
            />

            {/* Card circle */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-all duration-500">
              {/* Image with parallax */}
              <motion.img
                src={phase.image}
                alt={phase.title}
                className="w-full h-full object-cover"
                style={{ filter: phase.filter }}
                animate={{
                  scale: hoveredCard === phase.id ? 1.15 : 1,
                }}
                transition={{ duration: 0.6 }}
              />

              {/* Film grain on card */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "64px 64px",
                }}
              />
            </div>

            {/* Label */}
            <div className="text-center mt-4">
              <p
                className="text-white/40 tracking-[0.15em]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem" }}
              >
                {phase.subtitle}
              </p>
              <p
                className="text-white tracking-[0.1em] mt-1"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.3rem",
                  color: phase.accent,
                }}
              >
                {phase.title}
              </p>
            </div>

            {/* Hover teaser */}
            <AnimatePresence>
              {hoveredCard === phase.id && (
                <motion.div
                  className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-56 text-center"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="text-white/50 whitespace-pre-line"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.7rem",
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    {phase.teaser}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Future Raam - Locked */}
        <motion.div
          className="relative cursor-not-allowed group"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          onMouseEnter={() => setHoveredCard("future")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/5 bg-white/[0.02] flex items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-sm" />
            <Lock className="w-8 h-8 text-white/20 relative z-10" />
          </div>
          <div className="text-center mt-4">
            <p
              className="text-white/20 tracking-[0.15em]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem" }}
            >
              Chapter 4
            </p>
            <p
              className="text-white/20 tracking-[0.1em] mt-1"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem" }}
            >
              Coming Soon
            </p>
          </div>
          <AnimatePresence>
            {hoveredCard === "future" && (
              <motion.div
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-56 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p
                  className="text-white/30"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.7rem",
                    fontStyle: "italic",
                  }}
                >
                  The next chapter is being written...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Film strip border at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-10 z-20 flex items-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: spotlightReady ? 0.15 : 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="flex w-full">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-8 h-6 mx-1 border border-white/30 rounded-sm" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
