import { useState } from 'react';
import { Link } from 'react-router-dom';
import { US_STOCKS, IN_STOCKS, StockInfo } from '@/data/stocks';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/AppLayout';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AnimatedHeading from '@/components/AnimatedHeading';

function StockRow({ stock, index }: { stock: StockInfo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
    >
      <Link
        to={`/stock/${stock.symbol}`}
        className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-all duration-300 hover:pl-6 hover:shadow-[inset_3px_0_0_hsl(var(--primary))] group"
      >
        <div className="flex-1">
          <p className="font-medium text-sm group-hover:text-primary transition-colors duration-300">{stock.symbol}</p>
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
    </motion.div>
  );
}

export default function Market() {
  const [search, setSearch] = useState('');

  const filterStocks = (stocks: StockInfo[]) =>
    stocks.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageTransition>
      <AppLayout>
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedHeading text="Market Explorer" className="flex-1" />
          <motion.div
            className="relative w-full sm:w-64"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search stocks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 glass-card transition-shadow duration-300 focus:shadow-[0_0_20px_hsl(var(--primary)/0.2)]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Tabs defaultValue="us">
            <TabsList className="mb-4">
              <TabsTrigger value="us" className="transition-all duration-300">🇺🇸 US Stocks</TabsTrigger>
              <TabsTrigger value="in" className="transition-all duration-300">🇮🇳 Indian Stocks</TabsTrigger>
            </TabsList>
            <TabsContent value="us">
              <Card className="glass-card border-border/50 overflow-hidden">
                <CardContent className="p-0 divide-y divide-border/50">
                  {filterStocks(US_STOCKS).map((s, i) => <StockRow key={s.symbol} stock={s} index={i} />)}
                  {filterStocks(US_STOCKS).length === 0 && <p className="p-4 text-sm text-muted-foreground">No stocks found.</p>}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="in">
              <Card className="glass-card border-border/50 overflow-hidden">
                <CardContent className="p-0 divide-y divide-border/50">
                  {filterStocks(IN_STOCKS).map((s, i) => <StockRow key={s.symbol} stock={s} index={i} />)}
                  {filterStocks(IN_STOCKS).length === 0 && <p className="p-4 text-sm text-muted-foreground">No stocks found.</p>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AppLayout>
    </PageTransition>
  );
}
