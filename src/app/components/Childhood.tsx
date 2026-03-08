import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Palette } from "lucide-react";
import childhoodImg from "../../assets/76de70acbf6fd92c3be0d7fdb50c8daab19f8c59.png";

const memories = [
  {
    id: 1,
    title: "First Day of School",
    caption: "Nervous but excited — the world felt so big",
    rotation: -3,
  },
  {
    id: 2,
    title: "Summer Adventures",
    caption: "Every day was an expedition into the unknown",
    rotation: 2,
  },
  {
    id: 3,
    title: "Drawing Dreams",
    caption: "When a crayon was all you needed to build worlds",
    rotation: -1,
  },
  {
    id: 4,
    title: "Rooftop Evenings",
    caption: "Watching the sky turn colors from above the world",
    rotation: 4,
  },
  {
    id: 5,
    title: "Birthday Celebrations",
    caption: "Cake, chaos, and the purest kind of joy",
    rotation: -2,
  },
  {
    id: 6,
    title: "Friendship Bonds",
    caption: "Some ties were forged before we understood the word",
    rotation: 1,
  },
];

const doodlePaths = [
  "M20,50 Q40,10 60,50 T100,50",
  "M10,80 C30,20 70,20 90,80",
  "M50,10 L30,90 L90,40 L10,40 L70,90 Z",
];

const splashColors = ["#f5a623", "#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#e91e63"];

export default function Childhood() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [doodleProgress, setDoodleProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [splashPosition, setSplashPosition] = useState({ x: 50, y: 50 });
  const [splashColor, setSplashColor] = useState("#f5a623");

  useEffect(() => {
    const t1 = setTimeout(() => setDoodleProgress(1), 300);
    const t2 = setTimeout(() => setLoaded(true), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleCrayonClick = () => {
    setSplashPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
    setSplashColor(splashColors[Math.floor(Math.random() * splashColors.length)]);
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 1500);
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #fef3e2 0%, #fde8c8 50%, #fef9f0 100%)",
        fontFamily: "'Caveat', cursive",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' type='fractalNoise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Color splash easter egg */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                left: `${splashPosition.x}%`,
                top: `${splashPosition.y}%`,
                background: `radial-gradient(circle, ${splashColor}80 0%, transparent 70%)`,
              }}
              initial={{ width: 0, height: 0, x: "-50%", y: "-50%" }}
              animate={{ width: 600, height: 600, x: "-50%", y: "-50%" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Doodle drawing animation */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: "#fef3e2" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <svg width="300" height="200" viewBox="0 0 300 200" className="overflow-visible">
              {doodlePaths.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#d4a574"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: doodleProgress }}
                  transition={{ duration: 1.2, delay: i * 0.3, ease: "easeInOut" }}
                  style={{
                    transform: `translate(${i * 80}px, ${i * 20}px)`,
                  }}
                />
              ))}
            </svg>
            <motion.p
              className="absolute bottom-1/3 text-amber-800/50"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "1.3rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Turning the pages back...
            </motion.p>
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
          className="flex items-center gap-2 text-amber-800/60 hover:text-amber-800 transition-colors"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lobby
        </button>
        <button
          onClick={handleCrayonClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-200/50 hover:bg-amber-300/50 text-amber-800 transition-colors"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem" }}
        >
          <Palette className="w-4 h-4" />
          Color Splash!
        </button>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative pt-24 pb-16 px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Notebook spiral decoration */}
        <div className="absolute left-8 top-20 bottom-0 w-8 hidden md:flex flex-col items-center gap-4 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full border-2 border-amber-800" />
          ))}
        </div>

        <div className="max-w-2xl text-center">
          <motion.div
            className="w-48 h-48 mx-auto mb-8 rounded-lg overflow-hidden shadow-xl"
            style={{
              transform: "rotate(-3deg)",
              background: "white",
              padding: "8px",
            }}
            whileHover={{ rotate: 0, scale: 1.05 }}
          >
            <img
              src={childhoodImg}
              alt="Young Raam"
              className="w-full h-full object-cover rounded"
            />
          </motion.div>

          <h1
            className="text-amber-900 mb-4"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "0.05em",
            }}
          >
            The Wonder Years
          </h1>
          <p
            className="text-amber-800/60 max-w-lg mx-auto"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1rem",
              fontStyle: "italic",
              lineHeight: 1.8,
            }}
          >
            Before the world taught rules, there was only curiosity.
            Every corner held a secret. Every day was an adventure.
          </p>
        </div>
      </motion.section>

      {/* Polaroid Memories Grid */}
      <motion.section
        className="px-6 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2
          className="text-center text-amber-800/40 mb-12 tracking-[0.2em]"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem" }}
        >
          MEMORIES
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {memories.map((memory, i) => (
            <motion.div
              key={memory.id}
              className="relative mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              whileHover={{ scale: 1.05, rotate: 0, y: -8 }}
              style={{ transform: `rotate(${memory.rotation}deg)` }}
            >
              {/* Polaroid card */}
              <div
                className="bg-white p-3 pb-16 shadow-lg rounded-sm w-56"
                style={{
                  boxShadow: "4px 6px 20px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div className="w-full h-48 bg-amber-100/50 rounded-sm overflow-hidden">
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${30 + i * 15}, 70%, ${75 + (i % 3) * 5}%) 0%, 
                        hsl(${40 + i * 10}, 60%, ${80 + (i % 2) * 5}%) 100%)`,
                    }}
                  />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p
                    className="text-amber-900"
                    style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem" }}
                  >
                    {memory.title}
                  </p>
                  <p
                    className="text-amber-700/50 mt-1"
                    style={{ fontFamily: "'Caveat', cursive", fontSize: "0.85rem" }}
                  >
                    {memory.caption}
                  </p>
                </div>
              </div>

              {/* Tape decoration */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-200/60 opacity-80"
                style={{ transform: `translateX(-50%) rotate(${memory.rotation > 0 ? -5 : 5}deg)` }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quote section */}
      <motion.section
        className="py-20 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="max-w-xl mx-auto border-t border-b border-amber-300/30 py-12">
          <p
            className="text-amber-800/70"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontStyle: "italic",
              lineHeight: 2,
            }}
          >
            "Every artist was first an amateur."
          </p>
          <p
            className="text-amber-600/40 mt-4"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem" }}
          >
            — The Foundation Years
          </p>
        </div>
      </motion.section>
    </div>
  );
}
