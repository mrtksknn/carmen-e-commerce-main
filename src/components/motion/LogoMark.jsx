import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// The studio's B-and-C mark, drawn stroke by stroke. Same paths as the header
// logo (ui/Logo.jsx), without the looping shimmer, so it can play once on cue.
const B_PATH = 'M 30 20 L 30 80 M 30 20 L 60 20 C 75 20, 75 45, 60 50 L 30 50 M 60 50 C 75 50, 75 80, 60 80 L 30 80';
const C_PATH = 'M 70 30 A 30 30 0 1 0 70 70';

const LogoMark = ({ size = 56, className = '', delay = 0 }) => {
  const reduce = useReducedMotion();
  const draw = (delay) => ({
    initial: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.2, delay } },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      <motion.path d={C_PATH} stroke="rgba(255,255,255,0.75)" strokeWidth="5" strokeLinecap="round" {...draw(delay)} />
      <motion.path d={B_PATH} stroke="#f26868" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" {...draw(delay + 0.15)} />
      <motion.circle
        cx="30" cy="50" r="4" fill="#fff"
        initial={{ scale: reduce ? 1 : 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: reduce ? 0 : delay + 0.95, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};

export default LogoMark;
