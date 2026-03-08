import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/components/AppLayout';
import { format } from 'date-fns';

export default function TradeHistory() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('trades').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setTrades(data); });
  }, [user]);

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">Trade History</h1>
      <Card>
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
                  {trades.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="text-muted-foreground">{format(new Date(t.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell className="font-medium">{t.stock_symbol}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.trade_type === 'BUY' ? 'bg-primary/10 text-profit' : 'bg-destructive/10 text-loss'}`}>
                          {t.trade_type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{t.quantity}</TableCell>
                      <TableCell className="text-right">${Number(t.price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${Number(t.total_value).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
