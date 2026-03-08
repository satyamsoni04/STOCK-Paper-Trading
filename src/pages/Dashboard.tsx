import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ALL_STOCKS } from '@/data/stocks';
import { DollarSign, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: profile } = await supabase.from('profiles').select('balance').eq('user_id', user.id).single();
      if (profile) setBalance(profile.balance);
      const { data: p } = await supabase.from('portfolio').select('*').eq('user_id', user.id);
      if (p) setPortfolio(p);
      const { data: t } = await supabase.from('trades').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
      if (t) setTrades(t);
    };
    load();
  }, [user]);

  const portfolioValue = portfolio.reduce((sum, p) => {
    const stock = ALL_STOCKS.find(s => s.symbol === p.stock_symbol);
    return sum + (stock ? stock.price * p.quantity : p.avg_price * p.quantity);
  }, 0);

  const totalPL = portfolio.reduce((sum, p) => {
    const stock = ALL_STOCKS.find(s => s.symbol === p.stock_symbol);
    const currentPrice = stock?.price ?? p.avg_price;
    return sum + (currentPrice - p.avg_price) * p.quantity;
  }, 0);

  const topMovers = [...ALL_STOCKS].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 6);

  const statCards = [
    { icon: Briefcase, label: 'Portfolio Value', value: `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'bg-primary/10', iconColor: 'text-primary' },
    { icon: DollarSign, label: 'Available Balance', value: `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'bg-primary/10', iconColor: 'text-primary' },
    { icon: totalPL >= 0 ? TrendingUp : TrendingDown, label: 'Total P&L', value: `${totalPL >= 0 ? '+' : ''}$${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: totalPL >= 0 ? 'bg-primary/10' : 'bg-destructive/10', iconColor: totalPL >= 0 ? 'text-profit' : 'text-loss', valueColor: totalPL >= 0 ? 'text-profit' : 'text-loss' },
    { icon: TrendingUp, label: 'Total Stocks', value: `${portfolio.length}`, color: 'bg-primary/10', iconColor: 'text-primary' },
  ];

  return (
    <PageTransition>
      <AppLayout>
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((card, i) => (
            <motion.div key={card.label} variants={fadeUp}>
              <Card className="hover:scale-[1.02] hover:glow-sm transition-all duration-300 cursor-default">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-md ${card.color}`}>
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className={`text-lg font-bold ${card.valueColor || ''}`}>{card.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card>
              <CardHeader><CardTitle className="text-sm">Top Market Movers</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {topMovers.map((stock, i) => (
                    <motion.div
                      key={stock.symbol}
                      variants={slideInLeft}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.4 + i * 0.05 }}
                    >
                      <Link to={`/stock/${stock.symbol}`} className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-all duration-200 hover:pl-5">
                        <div>
                          <p className="font-medium text-sm">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${stock.price.toFixed(2)}</p>
                          <p className={`text-xs ${stock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card>
              <CardHeader><CardTitle className="text-sm">Recent Trades</CardTitle></CardHeader>
              <CardContent className="p-0">
                {trades.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4">No trades yet. Start trading!</p>
                ) : (
                  <div className="divide-y divide-border">
                    {trades.map((trade, i) => (
                      <motion.div
                        key={trade.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-all duration-200"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                      >
                        <div>
                          <p className="font-medium text-sm">{trade.stock_symbol}</p>
                          <p className={`text-xs font-medium ${trade.trade_type === 'BUY' ? 'text-profit' : 'text-loss'}`}>
                            {trade.trade_type} · {trade.quantity} shares
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">${Number(trade.price).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">${Number(trade.total_value).toFixed(2)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AppLayout>
    </PageTransition>
  );
}
