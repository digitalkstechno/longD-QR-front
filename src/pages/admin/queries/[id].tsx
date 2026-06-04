import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  History,
  Send,
  Clock,
  CheckCircle2,
  MessageSquare,
  Lock,
  Activity,
  Building2,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Ticket, Department } from '@/utils/storage';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function TicketDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [isAdmin, setIsAdmin] = useState(true);

  const fetchTicket = async () => {
    if (id && typeof id === 'string') {
      try {
        const ticketData = await api.getTicketById(id);
        setTicket(ticketData);
        const depts = await api.getDepartments();
        setDepartments(depts);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (!ticket) return <DashboardLayout><div className="p-8 text-white">Loading...</div></DashboardLayout>;

  const dept = departments.find(d => d.id === ticket.departmentId);
  const isExpired = ticket.status === 'Expired';
  const timeRemainingMs = new Date(ticket.expiryAt).getTime() - new Date().getTime();
  const timeRemainingHours = Math.max(0, Math.floor(timeRemainingMs / (1000 * 60 * 60)));
  const timeRemainingMins = Math.max(0, Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60)));

  const handleUpdateStatus = async (newStatus: 'Open' | 'In Progress' | 'Resolved' | 'Expired') => {
    try {
      await api.updateTicket(ticket.id, { ...ticket, status: newStatus });
      toast.success(`Ticket status updated to ${newStatus}`);
      fetchTicket();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async () => {
    if (!message.trim()) return;
    const note = {
      text: message,
      addedBy: 'Admin',
      addedAt: new Date().toISOString()
    };
    try {
      await api.updateTicket(ticket.id, { ...ticket, internalNotes: [...ticket.internalNotes, note] });
      setMessage('');
      toast.success('Note added successfully');
      fetchTicket();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add note');
    }
  };

  const handleReassign = async (newDeptId: string) => {
    try {
      await api.updateTicket(ticket.id, { ...ticket, departmentId: newDeptId });
      toast.success('Ticket reassigned successfully');
      fetchTicket();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reassign ticket');
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Ticket Details - {ticket.id}</title>
      </Head>

      <div className="space-y-6 text-text-main">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button

              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-text-main tracking-tight">{ticket.id}</h1>
                <Badge variant={isExpired ? 'danger' : ticket.status === 'Resolved' ? 'success' : 'info'}>
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && (
              <div className="flex items-center space-x-2 bg-bg-dark border border-border-subtle rounded-lg px-2 h-9">
                <UserPlus className="w-3.5 h-3.5 text-text-muted" />
                <select
                  className="bg-transparent text-xs text-text-main focus:outline-none"
                  value={ticket.departmentId}
                  onChange={(e) => handleReassign(e.target.value)}
                >
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            )}
            {ticket.status !== 'Resolved' && (
              <Button
                onClick={() => handleUpdateStatus('Resolved')}
                className="space-x-2 h-9 text-xs bg-success hover:bg-success/90 text-white"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </Button>
            )}
            {ticket.status === 'Open' && (
              <Button
                onClick={() => handleUpdateStatus('In Progress')}

                className="space-x-2 h-9 text-xs"
              >
                <span>Start Progress</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center">
                  <User className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  Customer Information
                </h3>
              </div>
              <div className="p-6">
                <h4 className="text-text-main font-bold mb-4">{ticket.customerName}</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs">
                    <Phone className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-text-main">{ticket.mobileNumber}</span>
                  </div>
                  {ticket.email && (
                    <div className="flex items-center space-x-3 text-xs">
                      <Mail className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-text-main">{ticket.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark/30">
                <h3 className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center">
                  <History className="w-3.5 h-3.5 mr-2 text-brand-primary" />
                  Ticket Details
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Subject</label>
                  <span className="text-xs text-text-main font-medium">{ticket.subject}</span>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Assigned Department</label>
                  <span className="text-xs text-text-main font-medium">{dept?.name || 'Unknown'}</span>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Description</label>
                  <p className="text-xs text-text-main leading-relaxed">{ticket.description}</p>
                </div>
              </div>
            </Card>

            {ticket.status !== 'Resolved' && (
              <Card className={`p-4 ${isExpired ? 'bg-danger/5 border-danger/10' : 'bg-warning/5 border-warning/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isExpired ? 'text-danger' : 'text-warning'}`}>
                    Resolution Time Remaining
                  </span>
                  <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-danger' : 'text-warning'}`} />
                </div>
                {isExpired ? (
                  <p className="text-xl font-mono font-bold text-danger tracking-tighter">EXPIRED</p>
                ) : (
                  <p className="text-xl font-mono font-bold text-warning tracking-tighter">
                    {timeRemainingHours}h {timeRemainingMins}m
                  </p>
                )}
                <p className="text-[10px] text-text-muted mt-1 uppercase font-bold">
                  Expires: {new Date(ticket.expiryAt).toLocaleString()}
                </p>
              </Card>
            )}
          </div>

          <div className="xl:col-span-8 space-y-6">
            <Card className="p-0 flex flex-col h-[700px]">
              <div className="flex items-center px-4 border-b border-border-subtle bg-bg-dark/30">
                {[
                  { id: 'notes', label: 'Internal Notes', icon: Lock },
                  { id: 'timeline', label: 'Timeline', icon: Activity },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 border-b-2 transition-all ${activeTab === tab.id
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-text-muted hover:text-brand-primary'
                      }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    {ticket.internalNotes.length === 0 ? (
                      <p className="text-center text-text-muted text-sm py-8">No internal notes yet.</p>
                    ) : (
                      ticket.internalNotes.map((note, idx) => (
                        <div key={idx} className="p-4 bg-bg-dark border border-border-subtle rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-brand-primary uppercase">{note.addedBy}</span>
                            <span className="text-[10px] text-text-muted">{new Date(note.addedAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-text-main">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    {ticket.timeline.map((log, i) => (
                      <div key={i} className="flex items-center justify-between text-xs border-b border-border-subtle pb-4 last:border-0">
                        <div>
                          <p className="text-text-main font-bold uppercase tracking-tight">{log.title}</p>
                          <p className="text-text-muted">{log.desc}</p>
                        </div>
                        <span className="font-mono text-text-muted">{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {activeTab === 'notes' && (
                <div className="p-4 border-t border-border-subtle bg-bg-dark/50">
                  <div className="relative">
                    <textarea
                      className="w-full bg-bg-dark border border-border-subtle rounded-xl p-4 pr-32 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 transition-all min-h-[120px] resize-none"
                      placeholder="Type internal note..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                      <Button onClick={handleAddNote} className="h-10 px-6 space-x-2 text-white">
                        <span className="text-xs uppercase font-bold">Add Note</span>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
