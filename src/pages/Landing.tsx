import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useRef } from 'react';

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const features = [
  { icon: TrendingUp, title: 'Real-Time Prices', desc: '40+ US & Indian stocks with live simulated pricing' },
  { icon: Shield, title: 'Zero Risk', desc: 'Trade with virtual money — no real funds needed' },
  { icon: BarChart3, title: 'Track Performance', desc: 'Portfolio analytics, P&L tracking, and trade history' },
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroWords1 = 'Learn Trading.'.split(' ');
  const heroWords2 = 'Risk Nothing.'.split(' ');

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-primary/5 blur-[100px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-32 left-1/3 w-64 h-64 rounded-full bg-primary/8 blur-[80px]"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Header */}
        <motion.header
          className="flex items-center justify-between px-6 py-4 border-b border-border/50 relative glass sticky top-0 z-50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-extrabold tracking-wider bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent drop-shadow-[0_0_8px_hsl(142,71%,45%,0.4)] hover:drop-shadow-[0_0_16px_hsl(142,71%,45%,0.7)] hover:scale-105 transition-all duration-300 cursor-default">
            WOJAK TRADE'S
          </h1>
          <div className="flex gap-2 ml-auto">
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="hover:glow-sm">Login</Button>
              </motion.div>
            </Link>
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button>Sign Up</Button>
              </motion.div>
            </Link>
          </div>
        </motion.header>

        {/* Hero with parallax */}
        <main ref={heroRef} className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center">
            {/* Animated hero text */}
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {heroWords1.map((word, i) => (
                <motion.span
                  key={`w1-${i}`}
                  className="inline-block mr-3"
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {heroWords2.map((word, i) => (
                <motion.span
                  key={`w2-${i}`}
                  className="inline-block mr-3 text-primary"
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i + heroWords1.length}
                >
                  {word}
                </motion.span>
              ))}
            </h2>

            <motion.p
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Practice stock trading with <span className="font-bold text-primary">$100,000</span> virtual money. Track <span className="font-bold text-primary">US &amp; Indian markets</span>, build your <span className="font-bold text-foreground">portfolio</span>, and master <span className="font-bold text-foreground">trading strategies</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="text-lg px-8 py-6 glow-pulse" onClick={() => setShowAuthOptions(v => !v)}>
                  Start Trading Free
                </Button>
              </motion.div>

              <AnimatePresence>
                {showAuthOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3"
                  >
                    <Link to="/login">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="lg" className="glass-card px-6">
                          Login
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/signup">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="px-6">
                          Sign Up
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Feature cards with scroll reveal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full pb-16">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card p-6 text-left group cursor-default hover:glow-md transition-shadow duration-500"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <f.icon className="h-8 w-8 text-primary mb-3" />
                </motion.div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </main>

        <motion.footer
          className="text-center py-4 text-sm text-muted-foreground border-t border-border/50 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          WOJAK TRADE'S — A Paper Trading Simulator
        </motion.footer>
      </div>
    </PageTransition>
  );
}
