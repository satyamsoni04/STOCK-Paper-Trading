import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border relative">
        <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent drop-shadow-[0_0_8px_hsl(142,71%,45%,0.4)] hover:drop-shadow-[0_0_16px_hsl(142,71%,45%,0.7)] hover:scale-105 transition-all duration-300 cursor-default">
          WOJAK TRADE'S
        </h1>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost">Login</Button></Link>
          <Link to="/signup"><Button>Sign Up</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center border-4 border-double shadow-md">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Learn Trading.<br />
          <span className="text-primary">Risk Nothing.</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 italic bg-[sidebar-primary-foreground] bg-[#0d3cab]">
          Practice stock trading with <span className="font-bold text-primary">$100,000</span> virtual money. Track <span className="font-bold text-primary">US &amp; Indian markets</span>, build your <span className="font-bold text-foreground">portfolio</span>, and master <span className="font-bold text-foreground">trading strategies</span>.
        </p>
        <Link to="/signup">
          <Button size="lg" className="text-lg px-8 py-6">Start Trading Free</Button>
        </Link>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          {[
          { icon: TrendingUp, title: 'Real-Time Prices', desc: '40+ US & Indian stocks with live simulated pricing' },
          { icon: Shield, title: 'Zero Risk', desc: 'Trade with virtual money — no real funds needed' },
          { icon: BarChart3, title: 'Track Performance', desc: 'Portfolio analytics, P&L tracking, and trade history' }].
          map((f) =>
          <div key={f.title} className="bg-card border border-border rounded-lg p-6 text-left">
              <f.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border">
        WOJAK TRADE'S — A Paper Trading Simulator
      </footer>
    </div>);

}