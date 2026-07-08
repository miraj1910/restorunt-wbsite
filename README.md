# Bistro Aurelia

A luxury immersive 3D dining website built with TypeScript, Vite, Three.js, GSAP, and Tailwind CSS.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Three.js** - 3D hero scene with particles, rings, and volumetric lighting
- **GSAP** - Entrance animations and canvas effects
- **Tailwind CSS** - Utility-first styling framework
- **PostCSS** - CSS processing with Autoprefixer

## Project Structure

```
├── index.html              # Home page
├── about.html              # About page
├── menu.html               # Menu page
├── press.html              # Press page
├── reservation.html        # Reservation page
├── src/
│   ├── main.ts             # Entry point
│   ├── styles/
│   │   └── main.css        # Tailwind + custom CSS
│   ├── scripts/
│   │   ├── constants.ts    # Device detection flags
│   │   ├── navigation.ts   # Mobile nav + active page
│   │   ├── hero-scene.ts   # Three.js 3D scene
│   │   ├── tilt-cards.ts   # 3D tilt card effect
│   │   ├── reveal-observer.ts  # Scroll reveal animations
│   │   ├── scroll-effects.ts   # Nav scroll + parallax
│   │   └── gsap-animations.ts  # GSAP entry animations
│   └── types/
│       └── global.d.ts     # TypeScript declarations
├── assets/                 # Original assets (legacy)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── tailwind.config.js
└── .gitignore
```
