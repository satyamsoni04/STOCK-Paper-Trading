import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export default function ScrollReveal({ children, className = '', direction = 'up', delay = 0 }: ScrollRevealProps) {
  const offset = directionMap[direction];
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
