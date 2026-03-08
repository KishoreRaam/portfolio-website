
---

## 🎬 "RAAM — A Life In Frames" — Figma Design Prompt

---

### CONCEPT CORE
This is not a portfolio. It's a **cinematic experience**. Each phase of Raam's life is a **film genre** with its own visual language, sound metaphor, and interaction style. The visitor doesn't scroll — they **step into a scene**.

---

### LANDING PAGE — "Whom do you want to watch?"

**Visual direction:**
- Pure black background, like a cinema before the film starts
- A single spotlight (radial gradient) slowly expanding from center on load
- 3 circular profile cards float in — each with a **film grain texture overlay**
- Cards are NOT flat. They have a **parallax depth effect** on hover — the avatar pushes forward, background layer shifts back
- Below each card: Phase name in a **vintage movie title font** (like Bebas Neue or Playfair Display)
- Subtle **film strip border** runs across the bottom of the screen
- Cursor: custom **director's clapperboard** cursor on desktop

**Micro-interactions:**
- On hover → card breathes (scale pulse) + a **movie-trailer-style title card** fades in with 2-line teaser text
- On click → **cinematic transition**: screen goes black, a **projector flicker effect** (3 frames), then cuts to the phase

**Avatars per phase:**
- Childhood → illustrated/cartoon style (think Studio Ghibli sketch)
- Teenage → anime/game character (like your screenshot — already perfect)
- Present → high contrast black & white real photo with red accent color

---

### PHASE 1 — CHILDHOOD ("The Wonder Years")
**Genre: Animated Coming-of-Age Film**

- Background: **Warm amber + cream**, subtle paper texture
- Opening scene animation: a **hand-drawn doodle "draws itself"** across the screen (SVG stroke animation)
- Navigation: a **physical notebook** UI — pages turn to go between content sections
- Typography: mix of **handwritten font** (Caveat) + printed serif
- Content cards look like **polaroid photos** with handwritten captions
- Easter egg: clicking a crayon icon triggers a **color splash animation** across the screen
- Exit transition: page **crumples like paper** → goes black

---

### PHASE 2 — TEENAGE ("Static & Signal")
**Genre: Cyberpunk / Indie Coming-of-Age**

- Background: **Deep purple-black**, scanline overlay (CSS repeating linear gradient)
- Opening: **VHS tape "rewind" effect** — static noise, then scene snaps in
- A **CRT monitor frame** wraps around key content sections
- Typography: **glitch font** (use CSS glitch keyframes on headings) + monospace body
- Color palette: neon purple `#b537f2`, cyan `#00f5ff`, dark base `#0d0d0d`
- Project cards look like **old Windows 98 dialog boxes** (title bar, minimize/close buttons)
- Hover states: **RGB split / chromatic aberration** effect on images
- Background has drifting **neon particle system** (canvas or CSS)
- Exit transition: **horizontal static glitch wipe** → black

---

### PHASE 3 — PRESENT ("Production Mode")
**Genre: Sci-Fi Thriller / Tech Noir**

- Background: **Pure dark** `#080808`, subtle grid lines (like a circuit board)
- Opening: **terminal boot sequence** — text types itself line by line:
  ```
  > Loading Raam_v3.0...
  > Mechatronics Engineer. AI Builder. Storyteller.
  > Initializing...
  ```
- After boot: full cinematic layout snaps in with **smooth fade**
- Project cards are **holographic panels** — glassmorphism with a blue/teal glow border
- Tech stack shown as **animated badge chips** that assemble themselves
- A **live "currently building" ticker** at the bottom like a news crawl
- Color palette: `#0d6efd` blue, `#00ffcc` teal, `#080808` base
- Exit / CTA section: **stars slowly pull you forward** (zoom-in starfield animation) into a "The Story Continues..." screen with contact links

---

### GLOBAL DESIGN RULES

| Element | Rule |
|---|---|
| Transitions | Always black frame between phases — no direct cuts |
| Fonts | Max 2 per phase — one display, one body |
| Cursor | Custom per phase (crayon / crosshair / terminal block) |
| Scroll | Horizontal within phases, vertical between sections inside |
| Mobile | Phases stack vertically, transitions simplify to fade |
| Loading | Each phase has a unique "loading" animation (doodle drawing / VHS rewind / terminal boot) |

---

### HIDDEN LAYER — "Future Raam" (Locked Profile)
- A **4th blurred/locked profile card** on landing — grayed out, lock icon
- Hover reveals: `"Chapter 4 — Coming Soon"`
- Click: plays a **10-second cinematic teaser** (black screen + ambient audio visualization or just text reveal)

---

### FIGMA FILE STRUCTURE TO BUILD
```
Page 1 → Landing (Who's Watching)
Page 2 → Phase 1 — Childhood
Page 3 → Phase 2 — Teenage  
Page 4 → Phase 3 — Present
Page 5 → Easter Egg — Future Raam
Page 6 → Component Library (avatars, cards, buttons per theme)
Page 7 → Animation notes + transition specs
```

---

