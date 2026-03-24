import { ReactNode } from "react";
import { Bell, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

interface LayoutVisionps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutVisionps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="bg-dark-secondary border-b border-accent-gray/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <Gem className="text-gold text-2xl mr-3" />
                <span className="text-xl font-bold text-white">Pawn</span>
                <span className="text-gold ml-1 font-light">Vision</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard">
                <span className={`transition-colors ${isActive('/dashboard') || isActive('/') ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>
                  Dashboard
                </span>
              </Link>
              <Link href="/valuations">
                <span className={`transition-colors ${isActive('/valuations') ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>
                  Valuations
                </span>
              </Link>
              <Link href="/reports">
                <span className={`transition-colors ${isActive('/reports') ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>
                  Reports
                </span>
              </Link>
              <Link href="/market-data">
                <span className={`transition-colors ${isActive('/market-data') ? 'text-gold' : 'text-gray-300 hover:text-gold'}`}>
                  Market Data
                </span>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-gold">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">JP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-secondary border-t border-accent-gray/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Gem className="text-gold text-xl mr-2" />
                <span className="text-lg font-bold">PawnVision</span>
              </div>
              <p className="text-text-gray text-sm">
                Visionfessional item valuation system for pawn shops, powered by real-time market data and AI-driven pricing algorithms.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Data Sources</h4>
              <ul className="space-y-2 text-sm text-text-gray">
                <li>eBay Marketplace Insights API</li>
                <li>Edmunds Vehicle Valuation</li>
                <li>PriceAPI Electronics Data</li>
                <li>KBB Automotive Pricing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-text-gray">
                <li><a href="#" className="hover:text-gold transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Training Resources</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Technical Support</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">System Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-text-gray">eBay API: </span>
                  <span className="text-green-500 ml-1">Operational</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-text-gray">Edmunds API: </span>
                  <span className="text-green-500 ml-1">Operational</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-text-gray">Price API: </span>
                  <span className="text-yellow-400 ml-1">Limited</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-accent-gray/30 mt-8 pt-8 text-center">
            <p className="text-text-gray text-sm">
              © 2025 PawnVision. All rights reserved. | 
              <a href="#" className="text-gold hover:text-gold-dark transition-colors ml-1 mr-1">Privacy Policy</a> | 
              <a href="#" className="text-gold hover:text-gold-dark transition-colors">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
