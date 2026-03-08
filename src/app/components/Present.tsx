import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import presentImg from "../../assets/eac206a98cdbe6b2e9ca989b84cb6042a0a79cef.png";

const bootLines = [
  "> Loading Raam_v3.0...",
  "> Mechatronics Engineer. AI Builder. Storyteller.",
  "> Systems online.",
  "> Initializing creative protocols...",
  "> Ready.",
];

const techStack = [
  "React", "TypeScript", "Python", "AI/ML", "Figma",
  "Node.js", "Robotics", "IoT", "Three.js", "Blender",
];

const projects = [
  {
    id: 1,
    title: "AI Vision System",
    desc: "Computer vision pipeline for autonomous navigation and object detection in real-time.",
    tags: ["Python", "OpenCV", "TensorFlow"],
    status: "Deployed",
  },
  {
    id: 2,
    title: "Mechatronic Arm Controller",
    desc: "6-DOF robotic arm with inverse kinematics and precision control interface.",
    tags: ["C++", "ROS", "Arduino"],
    status: "Active",
  },
  {
    id: 3,
    title: "Creative Portfolio Engine",
    desc: "A cinematic web experience that tells stories through design and code.",
    tags: ["React", "Motion", "Design"],
    status: "Building",
  },
  {
    id: 4,
    title: "Data Storyteller",
    desc: "Interactive data visualization tool that transforms numbers into narratives.",
    tags: ["D3.js", "Python", "Analytics"],
    status: "Concept",
  },
];

const tickerItems = [
  "Building AI-powered creative tools",
  "Exploring generative design",
  "Mechatronics research ongoing",
  "New photography project in progress",
  "Learning Rust for embedded systems",
  "Designing the future, one frame at a time",
];

export default function Present() {
  const navigate = useNavigate();
  const [bootPhase, setBootPhase] = useState(0);
  const [booted, setBooted] = useState(false);
  const [showStarfield, setShowStarfield] = useState(false);
  const starfieldRef = useRef<HTMLCanvasElement>(null);

  // Terminal boot sequence
  useEffect(() => {
    if (bootPhase < bootLines.length) {
      const t = setTimeout(
        () => setBootPhase((p) => p + 1),
        bootPhase === 0 ? 600 : 400 + Math.random() * 300
      );
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setBooted(true), 500);
      return () => clearTimeout(t);
    }
  }, [bootPhase]);

  // Starfield animation
  useEffect(() => {
    const canvas = starfieldRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{ x: number; y: number; z: number; pz: number }> = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        pz: 0,
      });
    }

    let animId: number;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const animate = () => {
      ctx.fillStyle = "rgba(8,8,8,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.pz = star.z;
        star.z -= 2;
        if (star.z < 1) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - cx;
          star.y = Math.random() * canvas.height - cy;
          star.pz = star.z;
        }

        const sx = (star.x / star.z) * canvas.width + cx;
        const sy = (star.y / star.z) * canvas.height + cy;
        const r = Math.max(0, (1 - star.z / canvas.width) * 2);

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 204, ${0.3 + (1 - star.z / canvas.width) * 0.7})`;
        ctx.fill();
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
        background: "#080808",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* Starfield canvas */}
      <canvas ref={starfieldRef} className="fixed inset-0 z-0 pointer-events-none opacity-30" />

      {/* Circuit board grid */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,204,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Terminal boot sequence */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "#080808" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-lg w-full px-6">
              <div className="border border-[#0d6efd]/20 rounded-sm p-6 bg-[#080808]">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                  <div className="w-2 h-2 rounded-full bg-[#00ffcc]" />
                  <span className="text-white/20" style={{ fontSize: "0.65rem" }}>
                    terminal@raam
                  </span>
                </div>
                {bootLines.slice(0, bootPhase).map((line, i) => (
                  <motion.p
                    key={i}
                    className="text-[#00ffcc]/70 mb-1"
                    style={{ fontSize: "0.8rem" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {line}
                  </motion.p>
                ))}
                {bootPhase < bootLines.length && (
                  <span className="inline-block w-2 h-4 bg-[#00ffcc] animate-pulse" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-[#080808]/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#0d6efd]/60 hover:text-[#0d6efd] transition-colors"
          style={{ fontSize: "0.8rem" }}
        >
          <ArrowLeft className="w-4 h-4" />
          {"// BACK_TO_LOBBY"}
        </button>
        <div className="text-[#00ffcc]/30" style={{ fontSize: "0.7rem" }}>
          v3.0 // PRODUCTION MODE
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        className="relative pt-28 pb-16 px-6 flex flex-col items-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="max-w-3xl w-full flex flex-col md:flex-row items-center gap-10">
          {/* Holographic avatar */}
          <motion.div
            className="relative w-56 h-56 md:w-64 md:h-64 flex-shrink-0 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.03 }}
            style={{
              boxShadow:
                "0 0 40px rgba(0,255,204,0.1), 0 0 80px rgba(13,110,253,0.05), inset 0 0 30px rgba(0,0,0,0.5)",
              border: "1px solid rgba(0,255,204,0.15)",
            }}
          >
            <img
              src={presentImg}
              alt="Present Raam"
              className="w-full h-full object-cover"
            />
            {/* Holographic overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,255,204,0.05) 0%, transparent 50%, rgba(13,110,253,0.05) 100%)",
              }}
            />
          </motion.div>

          <div>
            <motion.h1
              className="text-white mb-2"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "0.05em",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-[#00ffcc]">Raam</span>{" "}
              <span className="text-white/30">v3.0</span>
            </motion.h1>
            <motion.p
              className="text-white/30 mb-6"
              style={{ fontSize: "0.85rem", lineHeight: 1.8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Mechatronics Engineer. AI Builder. Visual Storyteller.
              <br />
              Building at the intersection of code, machines, and art.
            </motion.p>

            {/* Tech stack badges */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1 rounded-sm text-[#00ffcc]/60 border border-[#00ffcc]/10 bg-[#00ffcc]/[0.03]"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.08 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Project cards - holographic panels */}
      <motion.section
        className="px-6 pb-16 z-20 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2
          className="text-center text-[#0d6efd]/30 mb-12 tracking-[0.3em]"
          style={{ fontSize: "0.8rem" }}
        >
          {"// ACTIVE PROJECTS"}
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div
                className="relative rounded-lg p-[1px] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,255,204,0.2) 0%, rgba(13,110,253,0.1) 50%, rgba(0,255,204,0.05) 100%)",
                }}
              >
                <div
                  className="bg-[#0c0c0c]/90 backdrop-blur-md rounded-lg p-5"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-white/80 group-hover:text-[#00ffcc] transition-colors"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: "0.9rem",
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-sm text-[#00ffcc]/50 bg-[#00ffcc]/5 flex-shrink-0"
                      style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p
                    className="text-white/30 mb-4"
                    style={{ fontSize: "0.75rem", lineHeight: 1.8 }}
                  >
                    {project.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#0d6efd]/10 text-[#0d6efd]/50 rounded-sm"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/10 group-hover:text-[#00ffcc]/40 transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* The Story Continues section */}
      <motion.section
        className="py-24 px-6 text-center z-20 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="max-w-xl mx-auto">
          <h2
            className="text-[#00ffcc]/40 mb-6 tracking-[0.2em]"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "1.5rem",
            }}
          >
            The Story Continues...
          </h2>
          <p className="text-white/20 mb-10" style={{ fontSize: "0.8rem", lineHeight: 2 }}>
            Every line of code is a new scene. Every project is a new chapter.
            <br />
            The best parts haven't been written yet.
          </p>
          <div className="flex items-center justify-center gap-6">
            {["GitHub", "LinkedIn", "Instagram", "Email"].map((link) => (
              <button
                key={link}
                className="px-4 py-2 text-[#00ffcc]/30 border border-[#00ffcc]/10 rounded-sm hover:text-[#00ffcc] hover:border-[#00ffcc]/30 transition-all"
                style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* News ticker at bottom */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-30 bg-[#080808]/90 border-t border-[#0d6efd]/10 py-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -1500] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="text-[#00ffcc]/20 flex-shrink-0"
              style={{ fontSize: "0.65rem", letterSpacing: "0.1em" }}
            >
              ◆ {item}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
