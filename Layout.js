import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  CreditCard, 
  Heart, 
  Settings, 
  Building2,
  Sparkles,
  Calculator
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
    { name: "Transactions", url: createPageUrl("Transactions"), icon: CreditCard },
    { name: "Donations", url: createPageUrl("Donations"), icon: Heart },
    { name: "Charities", url: createPageUrl("Charities"), icon: Building2 },
    { name: "Zakat", url: createPageUrl("ZakatCalculator"), icon: Calculator },
    { name: "Settings", url: createPageUrl("Settings"), icon: Settings },
  ];

  const isActive = (url) => location.pathname === url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full blur-3xl transform -translate-x-32 -translate-y-32"></div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glass-active {
          background: rgba(16, 185, 129, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
        }
      `}</style>
      
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="glass-nav m-4 rounded-2xl p-4 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  SparqDonate
                </h1>
                <p className="text-xs text-gray-600">Round up for good</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.url)
                      ? 'glass-active text-emerald-700'
                      : 'text-gray-600 hover:bg-white/20'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Mobile Navigation */}
        <nav className="glass-nav m-4 rounded-2xl p-2 mt-0 md:hidden">
          <div className="flex justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-300 w-1/6 ${
                    isActive(item.url)
                      ? 'glass-active text-emerald-700'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium text-center">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}