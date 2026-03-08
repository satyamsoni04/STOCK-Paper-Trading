import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getStock, getSimulatedPrice, ALL_STOCKS } from '@/data/stocks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import { ArrowLeft, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const stock = getStock(symbol || '');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [holding, setHolding] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!stock) return;
    // Generate fake chart data
    const data = [];
    let price = stock.price * 0.95;
    for (let i = 30; i >= 0; i--) {
      price = getSimulatedPrice(price);
      data.push({ day: `D-${i}`, price: Math.round(price * 100) / 100 });
    }
    data[data.length - 1].price = stock.price;
    setChartData(data);
  }, [stock]);

  useEffect(() => {
    if (!user || !symbol) return;
    supabase.from('watchlist').select('id').eq('user_id', user.id).eq('stock_symbol', symbol).single()
      .then(({ data }) => setInWatchlist(!!data));
    supabase.from('portfolio').select('*').eq('user_id', user.id).eq('stock_symbol', symbol).single()
      .then(({ data }) => setHolding(data));
  }, [user, symbol]);

  if (!stock) return <AppLayout><p className="text-muted-foreground">Stock not found.</p></AppLayout>;

  const currency = stock.market === 'IN' ? '₹' : '$';

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!user || quantity < 1) return;
    setLoading(true);
    try {
      const totalCost = stock.price * quantity;
      const { data: profile } = await supabase.from('profiles').select('balance').eq('user_id', user.id).single();
      if (!profile) throw new Error('Profile not found');

      if (type === 'BUY') {
        if (profile.balance < totalCost) throw new Error('Insufficient balance');
        // Update balance
        await supabase.from('profiles').update({ balance: profile.balance - totalCost }).eq('user_id', user.id);
        // Upsert portfolio
        if (holding) {
          const newQty = holding.quantity + quantity;
          const newAvg = ((holding.avg_price * holding.quantity) + totalCost) / newQty;
          await supabase.from('portfolio').update({ quantity: newQty, avg_price: newAvg }).eq('id', holding.id);
        } else {
          await supabase.from('portfolio').insert({ user_id: user.id, stock_symbol: stock.symbol, quantity, avg_price: stock.price });
        }
      } else {
        if (!holding || holding.quantity < quantity) throw new Error('Not enough shares to sell');
        const newQty = holding.quantity - quantity;
        await supabase.from('profiles').update({ balance: profile.balance + totalCost }).eq('user_id', user.id);
        if (newQty === 0) {
          await supabase.from('portfolio').delete().eq('id', holding.id);
        } else {
          await supabase.from('portfolio').update({ quantity: newQty }).eq('id', holding.id);
        }
      }
      // Record trade
      await supabase.from('trades').insert({
        user_id: user.id, stock_symbol: stock.symbol, trade_type: type,
        quantity, price: stock.price, total_value: totalCost,
      });

      toast({ title: `${type} successful`, description: `${type === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol}` });
      // Refresh holding
      const { data: h } = await supabase.from('portfolio').select('*').eq('user_id', user.id).eq('stock_symbol', stock.symbol).single();
      setHolding(h);
    } catch (err: any) {
      toast({ title: 'Trade failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) return;
    if (inWatchlist) {
      await supabase.from('watchlist').delete().eq('user_id', user.id).eq('stock_symbol', stock.symbol);
      setInWatchlist(false);
      toast({ title: 'Removed from watchlist' });
    } else {
      await supabase.from('watchlist').insert({ user_id: user.id, stock_symbol: stock.symbol });
      setInWatchlist(true);
      toast({ title: 'Added to watchlist' });
    }
  };

  return (
    <AppLayout>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 gap-1">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Stock Info + Chart */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{stock.symbol}</h1>
                  <p className="text-muted-foreground">{stock.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleWatchlist}>
                  <Star className={`h-5 w-5 ${inWatchlist ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                </Button>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{currency}{stock.price.toFixed(2)}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${stock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Market: {stock.market === 'US' ? '🇺🇸 US' : '🇮🇳 India'} · Sector: {stock.sector}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Price Chart (30 Days Simulated)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trade Panel */}
        <div className="w-full lg:w-80 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Trade {stock.symbol}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Quantity</label>
                <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-medium">{currency}{(stock.price * quantity).toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleTrade('BUY')} disabled={loading}>Buy</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleTrade('SELL')} disabled={loading || !holding}>Sell</Button>
              </div>
            </CardContent>
          </Card>

          {holding && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Your Position</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shares</span>
                  <span>{holding.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Price</span>
                  <span>{currency}{Number(holding.avg_price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Value</span>
                  <span>{currency}{(stock.price * holding.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">P&L</span>
                  <span className={`font-medium ${(stock.price - holding.avg_price) >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {(stock.price - holding.avg_price) >= 0 ? '+' : ''}{currency}{((stock.price - holding.avg_price) * holding.quantity).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
