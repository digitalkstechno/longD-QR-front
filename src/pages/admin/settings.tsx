import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Building2, 
  QrCode, 
  Smartphone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Palette,
  Bell,
  Workflow,
  Plus,
  ArrowRight,
  Upload,
  ChevronRight,
  Database,
  Lock,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const settingsSections = [
  { id: 'general', name: 'Company Profile', icon: Building2, desc: 'Enterprise details and primary branding' },
  { id: 'qr', name: 'QR Management', icon: QrCode, desc: 'Dynamic QR generator and scan tracking' },
  { id: 'automation', name: 'Auto Assignment', icon: Workflow, desc: 'Smart routing and workload balancing' },
  { id: 'integrations', name: 'API & Gateways', icon: Globe, desc: 'WhatsApp, Email, and SMS configurations' },
  { id: 'notifications', name: 'System Alerts', icon: Bell, desc: 'Internal and external notification rules' },
  { id: 'security', name: 'Security & Auth', icon: ShieldCheck, desc: 'SSO, MFA and access log policies' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('general');

  return (
    <DashboardLayout>
      <Head>
        <title>System Settings | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-text-muted text-sm">Configure system behavior and administrative preferences.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <div className="xl:col-span-4 space-y-4">
            <Card className="p-2 overflow-hidden">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 group flex items-start space-x-4 mb-1 ${
                    activeSection === section.id 
                      ? 'bg-brand-primary/10 border border-brand-primary/20' 
                      : 'border border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeSection === section.id ? 'bg-brand-primary/20 text-brand-primary' : 'bg-bg-dark text-text-muted group-hover:text-white'}`}>
                    <section.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold ${activeSection === section.id ? 'text-brand-primary' : 'text-white'}`}>
                      {section.name}
                    </h3>
                    <p className="text-[11px] text-text-muted leading-tight mt-0.5">{section.desc}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${activeSection === section.id ? 'text-brand-primary translate-x-1' : 'text-text-muted opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </Card>

            <Card className="p-5 bg-brand-primary/5 border-brand-primary/10">
              <div className="flex items-center space-x-3 mb-3">
                <Database className="w-4 h-4 text-brand-primary" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Health</h4>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed mb-4">
                All systems are operational. Last configuration backup completed successfully at 04:00 AM.
              </p>
              <Button variant="outline" size="sm" className="w-full text-[10px] font-bold uppercase tracking-widest">
                System Audit Logs
              </Button>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="xl:col-span-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border-subtle bg-bg-dark/30 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {settingsSections.find(s => s.id === activeSection)?.name}
                  </h3>
                  <Button size="sm" className="h-8 text-xs font-bold px-4">Save Changes</Button>
                </div>

                <div className="p-8">
                  {activeSection === 'general' && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-8 pb-8 border-b border-border-subtle">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-2xl bg-bg-dark border-2 border-dashed border-border-subtle flex items-center justify-center overflow-hidden transition-colors hover:border-brand-primary/50">
                            <Building2 className="w-10 h-10 text-text-muted" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Company Logo</h4>
                          <p className="text-[11px] text-text-muted mb-4">Recommended: 512x512px SVG or PNG.</p>
                          <div className="flex space-x-2">
                            <Button variant="secondary" size="sm" className="h-8 text-[10px] uppercase font-bold">Update</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-danger">Remove</Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Business Name" defaultValue="Enterprise Operations Ltd." />
                        <Input label="Administrative Email" defaultValue="ops@enterprise.com" />
                        <Input label="Support Phone" defaultValue="+1 (555) 000-0000" />
                        <Input label="Corporate Website" defaultValue="https://enterprise.com" />
                        <div className="md:col-span-2">
                          <Input label="HQ Physical Address" defaultValue="101 Tech Plaza, Silicon Valley, CA 94025" />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border-subtle">
                        <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                          <Palette className="w-4 h-4 mr-2 text-brand-primary" />
                          System Branding
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-bg-dark border border-border-subtle rounded-xl flex items-center justify-between">
                            <span className="text-xs text-text-muted font-bold uppercase">Primary Color</span>
                            <div className="w-6 h-6 rounded bg-brand-primary border border-white/20" />
                          </div>
                          <div className="p-4 bg-bg-dark border border-border-subtle rounded-xl flex items-center justify-between">
                            <span className="text-xs text-text-muted font-bold uppercase">Accent Color</span>
                            <div className="w-6 h-6 rounded bg-info border border-white/20" />
                          </div>
                          <div className="p-4 bg-bg-dark border border-border-subtle rounded-xl flex items-center justify-between">
                            <span className="text-xs text-text-muted font-bold uppercase">Theme</span>
                            <Badge variant="outline">Dark Mode</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'qr' && (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Active QR Entry Points</h4>
                          <p className="text-[11px] text-text-muted">Generate dynamic QR codes for physical locations.</p>
                        </div>
                        <Button variant="secondary" size="sm" className="space-x-2 h-9">
                          <Plus className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">New Code</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { name: 'Lobby Service QR', location: 'Main Entrance', scans: 1245 },
                          { name: 'Room Service QR', location: 'Guest Rooms', scans: 856 },
                        ].map((qr, i) => (
                          <div key={i} className="p-6 bg-bg-dark border border-border-subtle rounded-2xl flex items-center space-x-6 hover:border-brand-primary/30 transition-all group">
                            <div className="w-20 h-20 bg-white p-2 rounded-xl">
                              <QrCode className="w-full h-full text-bg-dark" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{qr.name}</h4>
                              <p className="text-[10px] text-text-muted mb-4 uppercase font-bold">{qr.location}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-brand-primary">{qr.scans} scans</span>
                                <button className="text-[10px] font-bold text-text-muted hover:text-white flex items-center uppercase tracking-widest transition-colors">
                                  Stats <ArrowRight className="w-3 h-3 ml-1" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection !== 'general' && activeSection !== 'qr' && (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-bg-dark border border-border-subtle rounded-2xl flex items-center justify-center mb-4">
                        <Settings className="w-8 h-8 text-text-muted animate-spin-slow" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">{settingsSections.find(s => s.id === activeSection)?.name} Module</h3>
                      <p className="text-[11px] text-text-muted max-w-xs mx-auto leading-relaxed uppercase font-bold">
                        This administrative module is currently undergoing security hardening. Configuration options will be available in the next release.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
