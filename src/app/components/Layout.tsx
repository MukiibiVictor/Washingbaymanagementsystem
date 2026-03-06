import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import Footer from './Footer';
import {
  LayoutDashboard,
  Camera,
  Receipt,
  DollarSign,
  Users,
  LogOut,
  Car,
  Menu,
  X,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import zeroLogo from '../../assets/7c8b52700404010ef9d70a93ba8a793d0656723b.png';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['superadmin', 'admin'] },
  { path: '/checkins', label: 'Check-ins', icon: Camera, roles: ['superadmin', 'admin'] },
  { path: '/transactions', label: 'Transactions', icon: Receipt, roles: ['superadmin', 'admin'] },
  { path: '/expenses', label: 'Expenses', icon: DollarSign, roles: ['superadmin', 'admin'] },
  { path: '/reports', label: 'Reports', icon: TrendingUp, roles: ['superadmin', 'admin'] },
  { path: '/services', label: 'Services', icon: Sparkles, roles: ['superadmin', 'admin', 'viewer'] },
  { path: '/pricing', label: 'Pricing', icon: FileText, roles: ['superadmin', 'admin', 'viewer'] },
  { path: '/users', label: 'Users', icon: Users, roles: ['superadmin', 'admin'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect viewers to services page if they try to access restricted pages
  useEffect(() => {
    if (user?.role === 'viewer' && location.pathname === '/') {
      navigate('/services');
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allowedNavItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-[#0a1628] dark:via-[#0d1b2e] dark:to-[#0f1f3a] relative overflow-hidden">
      {/* Background Logo - Faint */}
      <div 
        className="fixed inset-0 bg-center bg-no-repeat opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url(${zeroLogo})`,
          backgroundSize: '50%',
        }}
      />

      {/* Header */}
      <header className="bg-slate-900 dark:bg-[#0a1628] border-b border-slate-800 dark:border-[#1e3a5f] sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={zeroLogo} alt="ZORI Logo" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="font-bold text-lg text-white">ZORI auto spa</h1>
                <p className="text-xs text-slate-400 dark:text-slate-500">flawless shine, water with luxury</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <div className="text-right border-l border-slate-700 dark:border-slate-600 pl-3">
                <p className="text-sm font-medium text-white dark:text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="border-red-600 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all shadow-sm hover:shadow-red-500/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <button
              className="md:hidden p-2 text-white hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 dark:bg-[#0a1628] border-b border-slate-800 dark:border-[#1e3a5f]">
          <div className="px-4 py-2 space-y-1">
            {/* Theme Toggle for Mobile */}
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <span className="text-sm text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
            
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-700 hover:translate-x-1'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/30 hover:border-red-500 transition-all mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1 bg-white dark:bg-[#0f1f3a] rounded-xl p-3 shadow-sm border border-slate-200 dark:border-[#1e3a5f]">
                {allowedNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1e3a5f] hover:translate-x-1 hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}