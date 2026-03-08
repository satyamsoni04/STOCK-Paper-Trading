import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-[100px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-primary/10 blur-[80px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-wider text-primary"
          animate={{
            textShadow: [
              '0 0 20px hsl(142 71% 45% / 0.3)',
              '0 0 60px hsl(142 71% 45% / 0.6)',
              '0 0 20px hsl(142 71% 45% / 0.3)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          WOJAK TRADE'S
        </motion.h1>

        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>

        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading markets...
        </motion.p>
      </div>
    </motion.div>
  );
}
