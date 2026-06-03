import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Settings,
  Search,
  Check,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const notifications = [
  { 
    id: 1, 
    type: 'new_query', 
    title: 'High-Priority Assignment', 
    desc: 'New technical query QRY-2026-085 has been routed to your queue.', 
    time: '2 minutes ago', 
    isRead: false,
    icon: MessageSquare,
    color: 'brand'
  },
  { 
    id: 2, 
    type: 'sla_warning', 
    title: 'SLA Breach Warning', 
    desc: 'QRY-2026-012 is reaching deadline (15 minutes remaining).', 
    time: '15 minutes ago', 
    isRead: false,
    icon: Clock,
    color: 'warning'
  },
  { 
    id: 3, 
    type: 'escalation', 
    title: 'Automatic Escalation Triggered', 
    desc: 'QRY-2026-005 escalated to Manager Level 1 due to SLA breach.', 
    time: '1 hour ago', 
    isRead: true,
    icon: ShieldAlert,
    color: 'danger'
  },
  { 
    id: 4, 
    type: 'resolution', 
    title: 'Resolution Confirmed', 
    desc: 'Facilities has marked QRY-2025-998 as resolved.', 
    time: '3 hours ago', 
    isRead: true,
    icon: CheckCircle2,
    color: 'success'
  },
];

export default function NotificationCenterPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Notifications | Admin Panel</title>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
            <p className="text-text-muted text-sm">Stay updated with operational alerts and system activity.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" className="space-x-2 h-9 text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </Button>
            <Button variant="secondary" className="h-9 w-9 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              className="w-full bg-bg-dark border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary/50"
            />
          </div>
        </Card>

        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`p-5 hover:bg-white/5 transition-all cursor-pointer group border-l-4 ${
                !notif.isRead 
                  ? 'border-l-brand-primary bg-brand-primary/5' 
                  : 'border-l-transparent'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2.5 rounded-xl bg-bg-dark border border-border-subtle group-hover:border-brand-primary/30 transition-all`}>
                    <notif.icon className={`w-5 h-5 ${
                      notif.color === 'brand' ? 'text-brand-primary' : 
                      notif.color === 'warning' ? 'text-warning' : 
                      notif.color === 'danger' ? 'text-danger' : 'text-success'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-bold ${notif.isRead ? 'text-white' : 'text-brand-primary'}`}>
                        {notif.title}
                        {!notif.isRead && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-brand-primary inline-block" />}
                      </h3>
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{notif.time}</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed mb-4">{notif.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="text-[10px] font-bold text-brand-primary hover:text-brand-light uppercase tracking-widest transition-colors">View Details</button>
                        {!notif.isRead && <button className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors">Mark as read</button>}
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-text-muted hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-text-muted hover:text-danger transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-6">
          <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white">
            Load Older Notifications
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
