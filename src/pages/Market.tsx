import { useState } from 'react';
import { Link } from 'react-router-dom';
import { US_STOCKS, IN_STOCKS, StockInfo } from '@/data/stocks';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/AppLayout';
import { Search } from 'lucide-react';

function StockRow({ stock }: { stock: StockInfo }) {
  return (
    <Link to={`/stock/${stock.symbol}`} className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-sm">{stock.symbol}</p>
        <p className="text-xs text-muted-foreground">{stock.name}</p>
      </div>
      <div className="text-right mr-4">
        <p className="text-sm text-muted-foreground">{stock.sector}</p>
      </div>
      <div className="text-right min-w-[100px]">
        <p className="text-sm font-medium">{stock.market === 'IN' ? '₹' : '$'}{stock.price.toFixed(2)}</p>
        <p className={`text-xs ${stock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </p>
      </div>
    </Link>
  );
}

export default function Market() {
  const [search, setSearch] = useState('');

  const filterStocks = (stocks: StockInfo[]) =>
    stocks.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Market Explorer</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search stocks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="us">
        <TabsList className="mb-4">
          <TabsTrigger value="us">🇺🇸 US Stocks</TabsTrigger>
          <TabsTrigger value="in">🇮🇳 Indian Stocks</TabsTrigger>
        </TabsList>
        <TabsContent value="us">
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {filterStocks(US_STOCKS).map(s => <StockRow key={s.symbol} stock={s} />)}
              {filterStocks(US_STOCKS).length === 0 && <p className="p-4 text-sm text-muted-foreground">No stocks found.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="in">
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {filterStocks(IN_STOCKS).map(s => <StockRow key={s.symbol} stock={s} />)}
              {filterStocks(IN_STOCKS).length === 0 && <p className="p-4 text-sm text-muted-foreground">No stocks found.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
