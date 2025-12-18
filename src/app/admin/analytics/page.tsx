'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, ArrowLeft, Download, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>({
    eventStats: [],
    downloadStats: { downloaded: 0, pending: 0 },
    totalCertificates: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Fetch events
        const eventsResponse = await fetch('/api/events');
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsResponse.json();

        // Fetch all certificates
        const certsResponse = await fetch('/api/certificates');
        if (!certsResponse.ok) throw new Error('Failed to fetch certificates');
        const certsData = await certsResponse.json();

        if (eventsData.events && certsData.certificates) {
          // Calculate certificates per event
          const eventStats = eventsData.events.map((event: any) => ({
            name: event.name.substring(0, 20) + (event.name.length > 20 ? '...' : ''),
            certificates: certsData.certificates.filter((c: any) => c.event_id === event.id).length,
          }));

          // Download stats
          const downloaded = certsData.certificates.filter((c: any) => c.downloaded).length;
          const pending = certsData.certificates.length - downloaded;

          setData({
            eventStats,
            downloadStats: { downloaded, pending },
            totalCertificates: certsData.certificates.length,
            totalEvents: eventsData.events.length,
          });
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Downloaded', value: data.downloadStats.downloaded },
    { name: 'Pending', value: data.downloadStats.pending },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive insights into certificate generation and downloads
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.totalCertificates}</div>
              <p className="text-xs text-muted-foreground mt-1">Generated across all events</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloaded</CardTitle>
              <Download className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-500">{data.downloadStats.downloaded}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.totalCertificates > 0 
                  ? ((data.downloadStats.downloaded / data.totalCertificates) * 100).toFixed(1)
                  : 0}% download rate
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">{data.totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">Active campaigns</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Certificates per Event</CardTitle>
              <CardDescription>Distribution of certificates across different events</CardDescription>
            </CardHeader>
            <CardContent className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eventStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs" 
                    tick={{ fill: 'currentColor' }}
                    stroke="currentColor"
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{ fill: 'currentColor' }}
                    stroke="currentColor"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Bar dataKey="certificates" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Download Status</CardTitle>
              <CardDescription>Ratio of downloaded vs pending certificates</CardDescription>
            </CardHeader>
            <CardContent className="h-75 [&_*:focus]:outline-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    fill="#8884d8"
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                    label={({ name, percent }: any) => (percent || 0) > 0 ? `${name} ${((percent || 0) * 100).toFixed(0)}%` : ''}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-transparent outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

