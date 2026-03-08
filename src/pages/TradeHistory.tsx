import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/components/AppLayout';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AnimatedHeading from '@/components/AnimatedHeading';
import ScrollReveal from '@/components/ScrollReveal';

export default function TradeHistory() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('trades').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setTrades(data); });
  }, [user]);

  return (
    <PageTransition>
      <AppLayout>
        <AnimatedHeading text="Trade History" className="mb-6" />
        <ScrollReveal delay={0.2}>
          <Card className="glass-card border-border/50 overflow-hidden">
            <CardContent className="p-0">
              {trades.length === 0 ? (
                <p className="p-6 text-muted-foreground text-sm">No trades recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trades.map((t, i) => (
                        <motion.tr
                          key={t.id}
                          className="border-b border-border/50 hover:bg-accent/50 transition-all duration-300"
                          initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                          transition={{ delay: 0.1 + i * 0.04 }}
                        >
                          <TableCell className="text-muted-foreground">{format(new Date(t.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                          <TableCell className="font-medium">{t.stock_symbol}</TableCell>
                          <TableCell>
                            <motion.span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${t.trade_type === 'BUY' ? 'bg-primary/10 text-profit' : 'bg-destructive/10 text-loss'}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {t.trade_type}
                            </motion.span>
                          </TableCell>
                          <TableCell className="text-right">{t.quantity}</TableCell>
                          <TableCell className="text-right">${Number(t.price).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${Number(t.total_value).toFixed(2)}</TableCell>
                        </motion.tr>
                      ))}
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
