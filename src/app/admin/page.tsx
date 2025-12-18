'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Upload, BarChart3, ArrowRight, Settings, Users, Download } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCertificates: 0,
    downloaded: 0,
    totalEvents: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
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
          setStats({
            totalCertificates: certsData.certificates.length,
            downloaded: certsData.certificates.filter((c: any) => c.downloaded).length,
            totalEvents: eventsData.events.length,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

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
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your certificate generation workflow
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" /> Settings
            </Button>
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                View Site <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Active events configured</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates Generated</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCertificates}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.downloaded}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCertificates > 0 
                  ? Math.round((stats.downloaded / stats.totalCertificates) * 100) 
                  : 0}% engagement rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Template Configuration Card */}
          <Link href="/admin/template" className="group">
            <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Template Configuration</CardTitle>
                <CardDescription>
                  Design and configure your certificate templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Upload certificate background
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Drag & drop text positioning
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Customize fonts and colors
                  </li>
                </ul>
                <Button className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/20">
                  Configure Template
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Bulk Upload Card */}
          <Link href="/admin/upload" className="group">
            <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Bulk Generation</CardTitle>
                <CardDescription>
                  Generate certificates from CSV data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Import participant data
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Batch processing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Automatic email delivery
                  </li>
                </ul>
                <Button className="w-full bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-purple-500/20">
                  Upload CSV
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Analytics Card */}
          <Link href="/admin/analytics" className="group">
            <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Analytics</CardTitle>
                <CardDescription>
                  Track performance and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Download statistics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Event performance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Real-time insights
                  </li>
                </ul>
                <Button className="w-full bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-green-500/20">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

