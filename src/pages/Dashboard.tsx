import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ALL_STOCKS, getSimulatedPrice } from '@/data/stocks';
import { DollarSign, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Link } from 'react-router-dom';

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

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10"><Briefcase className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Portfolio Value</p>
              <p className="text-lg font-bold">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-lg font-bold">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-md ${totalPL >= 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
              {totalPL >= 0 ? <TrendingUp className="h-5 w-5 text-profit" /> : <TrendingDown className="h-5 w-5 text-loss" />}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total P&L</p>
              <p className={`text-lg font-bold ${totalPL >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Stocks</p>
              <p className="text-lg font-bold">{portfolio.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movers */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Top Market Movers</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {topMovers.map(stock => (
                <Link to={`/stock/${stock.symbol}`} key={stock.symbol} className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors">
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Trades</CardTitle></CardHeader>
          <CardContent className="p-0">
            {trades.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">No trades yet. Start trading!</p>
            ) : (
              <div className="divide-y divide-border">
                {trades.map(trade => (
                  <div key={trade.id} className="flex items-center justify-between px-4 py-3">
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
