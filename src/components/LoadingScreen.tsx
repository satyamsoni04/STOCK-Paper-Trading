import { motion } from 'framer-motion';

const letterVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function LoadingScreen() {
  const title = "WOJAK TRADE'S";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[120px]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.6, 0.2], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-primary/10 blur-[100px]"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.15, 0.5, 0.15], x: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[150px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* 3D animated title */}
        <div className="flex" style={{ perspective: 600 }}>
          {title.split('').map((letter, i) => (
            <motion.span
              key={i}
              className="text-4xl md:text-5xl font-extrabold tracking-wider text-primary inline-block"
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>

        {/* Pulsing glow ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-primary/30 relative"
          animate={{
            boxShadow: [
              '0 0 0 0 hsl(var(--primary) / 0.4)',
              '0 0 0 20px hsl(var(--primary) / 0)',
              '0 0 0 0 hsl(var(--primary) / 0)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-2 rounded-full bg-primary/20"
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Loading bar */}
        <div className="w-52 h-1.5 rounded-full bg-border/50 overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"
            initial={{ width: '0%', x: '-100%' }}
            animate={{ width: '100%', x: '0%' }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Loading markets...
        </motion.p>
      </div>
    </motion.div>
  );
}
