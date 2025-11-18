# Lyghtlyn Games

A React + Tailwind CSS gaming website matching the layout of https://lyghtlyn-games.lovable.app/

## Features

- Dark theme with modern UI
- Responsive navigation bar with search functionality
- Game sidebar navigation
- Featured content section
- News section with featured articles

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- React 18
- TypeScript 5
- Vite
- Tailwind CSS 3
- PostCSS
- Autoprefixer

## Project Structure

```
├── src/
│   ├── assets/          # Images, icons, and game assets
│   │   ├── icons/       # Game icons
│   │   ├── poe/         # Path of Exile specific assets
│   │   └── lyghtlyn-logo.png
│   ├── utils/           # Utility functions
│   │   └── assets.ts    # Asset helper functions for CDN/subdomain
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles with Tailwind
│   └── vite-env.d.ts    # Vite environment types
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript config for Node.js files
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── ASSETS_DEPLOYMENT.md # Hướng dẫn deploy assets lên subdomain/CDN
```

## Assets Management

Assets được lưu trong `src/assets/` và được import trực tiếp trong code. 

Khi cần deploy lên CDN hoặc subdomain, xem file `ASSETS_DEPLOYMENT.md` để biết chi tiết.

