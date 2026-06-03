import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Shield,
  Building2,
  History
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function TrackQueryPage() {
  const router = useRouter();
  const [queryId, setQueryId] = useState('');
  const [mobile, setMobile] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill query ID if provided in URL params
  useEffect(() => {
    if (router.query.id && typeof router.query.id === 'string') {
      setQueryId(router.query.id);
    }
  }, [router.query.id]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      // 1. Check local storage
      const stored = localStorage.getItem('submitted_queries');
      let foundQuery = null;

      if (stored) {
        const queries = JSON.parse(stored);
        foundQuery = queries.find(
          (q: any) => 
            q.id.toLowerCase() === queryId.trim().toLowerCase() && 
            q.mobile.replace(/\D/g, '').includes(mobile.replace(/\D/g, ''))
        );
      }

      // 2. Fallback to hardcoded mock only if they search for 'QRY-2026-001'
      if (!foundQuery && queryId.trim().toUpperCase() === 'QRY-2026-001') {
        foundQuery = {
          id: 'QRY-2026-001',
          customer: 'Alexander Wright',
          status: 'In Progress',
          priority: 'High',
          category: 'Technical Support',
          assignedTo: 'David Chen',
          createdDate: 'June 03, 2026 10:30 AM',
          expectedResolution: 'Within 4 Hours',
          timeline: [
            { title: 'Query Submitted', time: '10:30 AM', desc: 'Query successfully logged in the system.', status: 'completed' },
            { title: 'Department Assigned', time: '10:32 AM', desc: 'Routed to Technical Support department.', status: 'completed' },
            { title: 'Agent Assigned', time: '10:35 AM', desc: 'Assigned to David Chen for investigation.', status: 'completed' },
            { title: 'Work in Progress', time: '10:40 AM', desc: 'Agent is currently working on the resolution.', status: 'active' },
            { title: 'Resolution', time: '--:--', desc: 'Pending agent confirmation.', status: 'pending' },
          ]
        };
      }

      if (foundQuery) {
        setStatus(foundQuery);
      } else {
        setError('No query found matching this ID and Mobile Number combination.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-main p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <Head>
        <title>Track Your Query | Customer Portal</title>
      </Head>

      <div className="absolute top-0 left-0 w-full h-64 bg-brand-primary/5 blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/submit-query" className="inline-flex items-center text-brand-primary hover:text-brand-light mb-6 transition-colors">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            <span className="text-sm font-medium">Back to Submission</span>
          </Link>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border-subtle shadow-md">
            <Search className="text-brand-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Track Your Query</h1>
          <p className="text-text-muted">Enter your Query ID and mobile number to see the current status.</p>
        </div>

        {!status ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="admin-card p-8 md:p-12"
          >
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Query ID"
                  placeholder="e.g. QRY-2026-001"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  required
                />
                <Input 
                  label="Mobile Number"
                  placeholder="+1 (555) 000-0000"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="text-sm text-danger font-medium text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Track Status'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Summary */}
            <div className="admin-card p-6 border-l-4 border-l-brand-primary">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-brand-primary/10 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Query ID</p>
                    <h3 className="text-xl font-bold text-text-main">{status.id}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xs text-text-muted mb-1">Current Status</p>
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-2 h-2 rounded-full bg-info animate-pulse" />
                      <span className="font-bold text-info">{status.status}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setStatus(null)}>
                    New Search
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Query Details */}
              <div className="md:col-span-1 space-y-6">
                <div className="admin-card p-6">
                  <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-widest border-b border-border-subtle pb-4">Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Customer</label>
                      <div className="flex items-center space-x-2 text-text-main text-sm font-medium">
                        <User className="w-4 h-4 text-brand-primary" />
                        <span>{status.customer}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Department</label>
                      <div className="flex items-center space-x-2 text-text-main text-sm font-medium">
                        <Building2 className="w-4 h-4 text-brand-primary" />
                        <span>{status.category || status.department}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Assigned To</label>
                      <div className="flex items-center space-x-2 text-text-main text-sm font-medium">
                        <User className="w-4 h-4 text-brand-primary" />
                        <span>{status.assignedTo}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Expected Resolution</label>
                      <div className="flex items-center space-x-2 text-text-main text-sm font-medium">
                        <Clock className="w-4 h-4 text-brand-primary" />
                        <span>{status.expectedResolution}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-card p-6 bg-brand-primary/5">
                  <h4 className="text-xs font-bold text-brand-primary mb-2">Need Urgent Help?</h4>
                  <p className="text-[11px] text-text-muted leading-relaxed mb-4">
                    If your query is critical and hasn't been resolved, please call our support line.
                  </p>
                  <Button className="w-full text-xs" size="sm">
                    Call Support
                  </Button>
                </div>
              </div>

              {/* Timeline */}
              <div className="md:col-span-2">
                <div className="admin-card p-6">
                  <h3 className="text-sm font-bold text-text-main mb-8 flex items-center">
                    <History className="w-4 h-4 mr-2 text-brand-primary" />
                    ACTIVITY TIMELINE
                  </h3>
                  <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border-subtle">
                    {status.timeline.map((item: any, i: number) => (
                      <div key={i} className="flex items-start space-x-6 relative">
                        <div className={`w-6 h-6 rounded-full border-4 border-bg-card flex items-center justify-center z-10 ${
                          item.status === 'completed' ? 'bg-success' : 
                          item.status === 'active' ? 'bg-brand-primary' : 'bg-border-subtle'
                        }`}>
                          {item.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                          {item.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-bold ${item.status === 'pending' ? 'text-text-muted' : 'text-text-main'}`}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-text-muted font-mono">{item.time}</span>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
