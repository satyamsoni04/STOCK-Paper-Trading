import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ALL_STOCKS } from '@/data/stocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/components/AppLayout';
import { Link } from 'react-router-dom';

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
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">Portfolio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total P&L</p>
            <p className={`text-xl font-bold ${totalPL >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
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
                  {holdings.map(h => {
                    const stock = ALL_STOCKS.find(s => s.symbol === h.stock_symbol);
                    const cur = stock?.price ?? h.avg_price;
                    const pl = (cur - h.avg_price) * h.quantity;
                    return (
                      <TableRow key={h.id}>
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
