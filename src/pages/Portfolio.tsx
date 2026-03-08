import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ALL_STOCKS } from '@/data/stocks';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/components/AppLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AnimatedHeading from '@/components/AnimatedHeading';
import AnimatedCard from '@/components/AnimatedCard';
import ScrollReveal from '@/components/ScrollReveal';

export default function Portfolio() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('portfolio').select('*').eq('user_id', user.id).then(({ data }) => {
      if (data) setHoldings(data);
    });
  }, [user]);

  const totalValue = holdings.reduce((sum, h) => {
    const stock = ALL_STOCKS.find(s => s.symbol === h.stock_symbol);
    return sum + (stock?.price ?? h.avg_price) * h.quantity;
  }, 0);

  const totalPL = holdings.reduce((sum, h) => {
    const stock = ALL_STOCKS.find(s => s.symbol === h.stock_symbol);
    return sum + ((stock?.price ?? h.avg_price) - h.avg_price) * h.quantity;
  }, 0);

  return (
    <PageTransition>
      <AppLayout>
        <AnimatedHeading text="Portfolio" className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <AnimatedCard delay={0.1} glow>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Value</p>
                <motion.p
                  className="text-xl font-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.p>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard delay={0.2} glow>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total P&L</p>
                <motion.p
                  className={`text-xl font-bold ${totalPL >= 0 ? 'text-profit' : 'text-loss'}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                >
                  {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        <ScrollReveal delay={0.3}>
          <Card className="glass-card border-border/50 overflow-hidden">
            <CardContent className="p-0">
              {holdings.length === 0 ? (
                <p className="p-6 text-muted-foreground text-sm">No holdings yet. <Link to="/market" className="text-primary hover:underline">Browse the market</Link> to start trading.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Avg Price</TableHead>
                        <TableHead className="text-right">Current</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holdings.map((h, i) => {
                        const stock = ALL_STOCKS.find(s => s.symbol === h.stock_symbol);
                        const cur = stock?.price ?? h.avg_price;
                        const pl = (cur - h.avg_price) * h.quantity;
                        return (
                          <motion.tr
                            key={h.id}
                            className="border-b border-border/50 hover:bg-accent/50 transition-all duration-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.06 }}
                          >
                            <TableCell>
                              <Link to={`/stock/${h.stock_symbol}`} className="text-primary hover:underline font-medium">{h.stock_symbol}</Link>
                            </TableCell>
                            <TableCell className="text-right">{h.quantity}</TableCell>
                            <TableCell className="text-right">${Number(h.avg_price).toFixed(2)}</TableCell>
                            <TableCell className="text-right">${cur.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(cur * h.quantity).toFixed(2)}</TableCell>
                            <TableCell className={`text-right font-medium ${pl >= 0 ? 'text-profit' : 'text-loss'}`}>
                              {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      </AppLayout>
    </PageTransition>
  );
}
