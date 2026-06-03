import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Shield, 
  Clock, 
  AlertTriangle, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut,
  Search,
  Menu,
  X,
  Building2
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: MessageSquare, label: 'Queries', href: '/admin/queries' },
  { icon: Building2, label: 'Departments', href: '/admin/departments' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Shield, label: 'Roles & Permissions', href: '/admin/roles' },
  { icon: Clock, label: 'SLA Management', href: '/admin/sla' },
  { icon: AlertTriangle, label: 'Escalation Center', href: '/admin/escalations' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-main flex relative font-sans">
      {/* Sidebar Overlay on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-bg-card border-r border-border-subtle transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 mb-2 flex items-center justify-between border-b border-border-subtle/50">
            <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'lg:hidden'}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md p-1 border border-border-subtle">
                <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-base text-text-main tracking-widest uppercase royal-font">ADMIN PANEL</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-text-muted hover:text-text-main p-1.5 rounded-lg border border-border-subtle hover:bg-brand-primary/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-4">
            {sidebarItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm' 
                      : 'text-text-muted hover:bg-brand-primary/5 hover:text-brand-primary'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : 'group-hover:text-brand-primary transition-transform group-hover:scale-105'}`} />
                  <span className={`font-medium text-sm transition-opacity duration-300 ${!isSidebarOpen && 'lg:hidden opacity-0'}`}>
                    {item.label}
                  </span>
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#C8A45D]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border-subtle">
            <Link 
              href="/admin/login" 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all duration-300 ${!isSidebarOpen && 'lg:justify-center'}`}
            >
              <LogOut className="w-5 h-5" />
              <span className={`font-medium text-sm ${!isSidebarOpen && 'lg:hidden'}`}>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-border-subtle bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-text-muted hover:text-text-main lg:hidden border border-border-subtle rounded-xl bg-bg-dark hover:bg-brand-primary/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search queries, customers..." 
                className="w-full bg-bg-dark border border-border-subtle rounded-xl py-2.5 pl-11 pr-4 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <button className="relative p-2 text-text-muted hover:text-text-main border border-border-subtle rounded-xl bg-bg-dark hover:bg-brand-primary/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-px bg-border-subtle" />
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-main leading-none royal-font">James Sterling</p>
                <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mt-1">General Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-primary/30 p-0.5 shadow-sm">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full bg-bg-dark object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
