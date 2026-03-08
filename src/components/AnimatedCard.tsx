import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover3D?: boolean;
  glow?: boolean;
}

export default function AnimatedCard({ children, className = '', delay = 0, hover3D = true, glow = false }: AnimatedCardProps) {
  return (
    <motion.div
      className={`group ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover3D ? {
        scale: 1.02,
        y: -4,
        rotateX: 2,
        rotateY: -2,
        transition: { duration: 0.3, ease: 'easeOut' }
      } : { scale: 1.02 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      <div className={`relative transition-shadow duration-500 ${glow ? 'group-hover:shadow-[0_0_30px_hsl(var(--glow-primary)/0.25)]' : 'group-hover:shadow-[0_8px_30px_hsl(var(--foreground)/0.08)]'}`}>
        {children}
      </div>
    </motion.div>
  );
}
