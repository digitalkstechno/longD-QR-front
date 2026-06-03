import React, { useState } from 'react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-dark text-text-main flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-bg-card border-r border-border-subtle transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 mb-4 flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'lg:hidden'}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md p-1 border border-border-subtle">
                <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-lg text-text-main tracking-tight">ADMIN PANEL</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-text-muted hover:text-text-main"
            >
              <X />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
            {sidebarItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                      : 'text-text-muted hover:bg-brand-primary/5 hover:text-brand-primary'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : 'group-hover:text-brand-primary'}`} />
                  <span className={`font-medium transition-opacity duration-300 ${!isSidebarOpen && 'lg:hidden opacity-0'}`}>
                    {item.label}
                  </span>
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border-subtle">
            <Link href="/admin/login" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all duration-300 ${!isSidebarOpen && 'lg:justify-center'}`}>
              <LogOut className="w-5 h-5" />
              <span className={`font-medium ${!isSidebarOpen && 'lg:hidden'}`}>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-border-subtle bg-bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-text-muted hover:text-text-main lg:hidden"
            >
              <Menu />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search queries, customers..." 
                className="w-full bg-bg-dark border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-text-main focus:outline-none focus:border-brand-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-text-muted hover:text-text-main transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-bg-card" />
            </button>
            
            <div className="h-10 w-px bg-border-subtle mx-2" />
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-text-main">James Sterling</p>
                <p className="text-xs text-text-muted">General Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-primary/30 p-0.5">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full bg-bg-card"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
