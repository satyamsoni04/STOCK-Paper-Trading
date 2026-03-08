import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ThemeToggle from '@/components/ThemeToggle';
import GlowOrbs from '@/components/GlowOrbs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <GlowOrbs />
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md relative z-10"
          style={{ perspective: 800 }}
        >
          <Card className="glass-card border-border/50 shadow-[0_20px_60px_hsl(var(--primary)/0.1)]">
            <CardHeader className="text-center">
              <motion.div
                animate={{
                  textShadow: [
                    '0 0 10px hsl(var(--primary) / 0.3)',
                    '0 0 30px hsl(var(--primary) / 0.5)',
                    '0 0 10px hsl(var(--primary) / 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <CardTitle className="text-2xl">
                  <span className="text-primary">WOJAK TRADE'S</span>
                </CardTitle>
              </motion.div>
              <p className="text-muted-foreground text-sm">Sign in to your account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div className="space-y-2" initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="transition-all duration-300 focus:shadow-[0_0_20px_hsl(var(--primary)/0.2)] focus:scale-[1.01]" />
                </motion.div>
                <motion.div className="space-y-2" initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ delay: 0.3, duration: 0.5 }}>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="transition-all duration-300 focus:shadow-[0_0_20px_hsl(var(--primary)/0.2)] focus:scale-[1.01]" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" className="w-full glow-pulse" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
              <motion.p
                className="text-center text-sm text-muted-foreground mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
