import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, TrendingUp, Briefcase, Star, History, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import GlowOrbs from '@/components/GlowOrbs';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/market', label: 'Market', icon: TrendingUp },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/watchlist', label: 'Watchlist', icon: Star },
  { path: '/history', label: 'History', icon: History },
];

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      <GlowOrbs />

      {/* Sidebar - Desktop */}
      <motion.aside
        className="hidden md:flex w-64 flex-col border-r border-border bg-card/80 backdrop-blur-xl p-4 relative z-10"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <Link to="/dashboard" className="text-xl font-bold text-primary mb-8 px-2 group">
          <motion.span
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            animate={{
              textShadow: [
                '0 0 8px hsl(var(--primary) / 0.3)',
                '0 0 20px hsl(var(--primary) / 0.5)',
                '0 0 8px hsl(var(--primary) / 0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            WOJAK TRADE'S
          </motion.span>
        </Link>
        <motion.nav
          className="flex-1 space-y-1"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div key={item.path} variants={navItemVariants}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-300 group/item relative overflow-hidden ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-[inset_3px_0_0_hsl(var(--primary)),0_0_15px_hsl(var(--primary)/0.1)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:translate-x-1 hover:shadow-[0_0_10px_hsl(var(--primary)/0.08)]'
                  }`}
                >
                  <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                    <item.icon className="h-4 w-4" />
                  </motion.div>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-primary/5 rounded-md"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="ghost" onClick={handleSignOut} className="justify-start gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-card/80 backdrop-blur-xl border-b border-border">
        <Link to="/dashboard" className="text-lg font-bold text-primary">WOJAK TRADE'S</Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-14"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path ? 'bg-primary/10 text-primary glow-sm' : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-3 text-muted-foreground mt-4">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:p-6 p-4 pt-18 md:pt-6 overflow-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
