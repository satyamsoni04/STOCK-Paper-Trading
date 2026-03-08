import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ALL_STOCKS } from '@/data/stocks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AnimatedHeading from '@/components/AnimatedHeading';

export default function Watchlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('watchlist').select('*').eq('user_id', user.id);
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, [user]);

  const remove = async (id: string, symbol: string) => {
    await supabase.from('watchlist').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast({ title: `${symbol} removed from watchlist` });
  };

  return (
    <PageTransition>
      <AppLayout>
        <AnimatedHeading text="Watchlist" className="mb-6" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="glass-card border-border/50 overflow-hidden">
            <CardContent className="p-0">
              {items.length === 0 ? (
                <p className="p-6 text-muted-foreground text-sm">
                  Watchlist is empty. <Link to="/market" className="text-primary hover:underline">Browse stocks</Link> and add them.
                </p>
              ) : (
                <div className="divide-y divide-border/50">
                  <AnimatePresence>
                    {items.map((item, i) => {
                      const stock = ALL_STOCKS.find(s => s.symbol === item.stock_symbol);
                      if (!stock) return null;
                      return (
                        <motion.div
                          key={item.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-all duration-300 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50, scale: 0.9 }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}
                          layout
                        >
                          <Link to={`/stock/${stock.symbol}`} className="flex-1 group-hover:translate-x-1 transition-transform duration-300">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors duration-300">{stock.symbol}</p>
                            <p className="text-xs text-muted-foreground">{stock.name}</p>
                          </Link>
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium">{stock.market === 'IN' ? '₹' : '$'}{stock.price.toFixed(2)}</p>
                            <p className={`text-xs ${stock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </p>
                          </div>
                          <motion.div whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={() => remove(item.id, stock.symbol)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors duration-300" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AppLayout>
    </PageTransition>
  );
}
