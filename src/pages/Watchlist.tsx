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
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">Watchlist</h1>
      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">
              Watchlist is empty. <Link to="/market" className="text-primary hover:underline">Browse stocks</Link> and add them.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {items.map(item => {
                const stock = ALL_STOCKS.find(s => s.symbol === item.stock_symbol);
                if (!stock) return null;
                return (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3">
                    <Link to={`/stock/${stock.symbol}`} className="flex-1">
                      <p className="font-medium text-sm">{stock.symbol}</p>
                      <p className="text-xs text-muted-foreground">{stock.name}</p>
                    </Link>
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium">{stock.market === 'IN' ? '₹' : '$'}{stock.price.toFixed(2)}</p>
                      <p className={`text-xs ${stock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => remove(item.id, stock.symbol)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
