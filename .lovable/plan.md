

# Animation Overhaul Plan for WOJAK TRADE'S

This is a significant visual upgrade touching every page. We'll use CSS animations + a lightweight library (Framer Motion) for scroll, page transitions, and interactive effects — no heavy 3D libraries needed.

## New Dependency
- **framer-motion** — for page transitions, scroll animations, staggered reveals, and parallax

## Changes Overview

### 1. Page Transition System
- Create `src/components/PageTransition.tsx` wrapper using `framer-motion`'s `AnimatePresence` and `motion.div` with fade+slide transitions
- Wrap route content in `App.tsx` with `AnimatePresence` keyed by `location.pathname`
- Apply to all routes (Landing, Login, Signup, Dashboard, Market, etc.)

### 2. Loading Animation
- Create `src/components/LoadingScreen.tsx` — a full-screen animated loader with the WOJAK TRADE'S logo pulsing/glowing, shown briefly on app mount
- Animated green glow pulse + scale effect on the brand text

### 3. Landing Page (`Landing.tsx`) — Major Overhaul
- **Animated Typography**: Hero text ("Learn Trading. Risk Nothing.") animates in word-by-word using staggered `motion.span`
- **Glassmorphic Header**: `backdrop-blur-xl bg-white/5 border-white/10` glass effect on the header bar
- **Glassmorphic Feature Cards**: Cards get `backdrop-blur-md bg-white/5 border-white/10` with hover glow (`shadow-[0_0_30px_hsl(142,71%,45%,0.15)]`) and scale-up on hover
- **Parallax Hero**: Hero section content moves at different speeds on scroll using `useScroll` + `useTransform` from framer-motion
- **Scroll-triggered Reveals**: Feature cards animate in from below with stagger as they enter viewport using `whileInView`
- **CTA Button Glow**: Pulsing green glow animation on "Start Trading Free" button
- **Floating Particles/Gradient Orbs**: CSS-animated blurred gradient circles in the background for depth

### 4. Login & Signup Pages
- **Glassmorphic Cards**: Apply `backdrop-blur-xl bg-white/5 border-white/10` to the auth cards
- **Entrance Animation**: Card fades in + slides up on mount
- **Input Focus Glow**: Inputs get a green glow ring on focus via CSS
- **Button Hover**: Scale + glow effect on submit buttons

### 5. Dashboard & Inner Pages
- **Staggered Card Entrance**: Dashboard stat cards animate in one-by-one with `staggerChildren`
- **Hover Effects on Cards**: All cards get `hover:scale-[1.02] hover:shadow-[0_0_20px_hsl(142,71%,45%,0.1)]` with smooth transitions
- **List Item Animations**: Stock rows and trade items slide in from left with stagger

### 6. AppLayout Sidebar
- **Nav Item Hover**: Smooth glow + slight translateX on hover
- **Active Indicator**: Animated green bar slides to active nav item

### 7. Global CSS Additions (`index.css`)
- Keyframe animations: `@keyframes glow-pulse`, `@keyframes float`, `@keyframes fade-in-up`
- Glassmorphic utility classes
- Smooth scroll behavior on `html`
- Green glow utility classes for reuse

### 8. Tailwind Config Updates
- Add custom animations: `glow-pulse`, `float`, `fade-in-up`, `slide-in-left`
- Add corresponding keyframes

## File Changes Summary
| File | Action |
|------|--------|
| `package.json` | Add `framer-motion` |
| `src/components/PageTransition.tsx` | Create — reusable page transition wrapper |
| `src/components/LoadingScreen.tsx` | Create — initial loading animation |
| `src/App.tsx` | Wrap routes with AnimatePresence + add loading state |
| `src/pages/Landing.tsx` | Full rework with glassmorphism, parallax, scroll animations, animated typography |
| `src/pages/Login.tsx` | Glassmorphic card, entrance animation |
| `src/pages/Signup.tsx` | Glassmorphic card, entrance animation |
| `src/pages/Dashboard.tsx` | Staggered card animations, hover effects |
| `src/pages/Market.tsx` | Scroll reveal on stock rows |
| `src/components/AppLayout.tsx` | Animated sidebar nav items |
| `src/index.css` | Global animation keyframes, glassmorphic utilities, smooth scroll |
| `tailwind.config.ts` | Custom animation + keyframe definitions |

