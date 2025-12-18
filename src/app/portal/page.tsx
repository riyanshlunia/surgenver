'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Download, CheckCircle, Share2, Loader2 } from 'lucide-react';

type Certificate = {
  id: string;
  participant_name: string;
  certificate_uuid: string;
  cloudinary_url: string;
  created_at: string;
};

export default function ParticipantPortal() {
  const [email, setEmail] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email) return;
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/certificates?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Failed to search certificates');
      const data = await response.json();

      if (data.certificates) {
        setCertificates(data.certificates);
      } else {
        throw new Error(data.error || 'Failed to fetch certificates');
      }
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
      // Ideally use a toast here
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificate: Certificate) => {
    try {
      // Track the download
      await fetch('/api/certificates/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: certificate.id }),
      });
    } catch (error) {
      console.error('Error tracking download:', error);
    }
    
    // Open the download URL
    const downloadUrl = certificate.cloudinary_url.replace('/upload/', '/upload/fl_attachment/');
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto p-6 max-w-4xl relative z-10">
        {/* Hero Section */}
        <div className="text-center py-16 space-y-6">
          <div className="inline-flex items-center justify-center p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-800 mb-4">
            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              New
            </span>
            <span className="ml-2 text-sm text-muted-foreground pr-2">
              Instant certificate verification available
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Certificate <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Portal</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Access your digital credentials securely. Enter your registered email address to view, download, and share your certificates.
          </p>
        </div>

        {/* Search Card */}
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl">Find Your Certificates</CardTitle>
            <CardDescription className="text-base">
              Enter the email address you used to register for the event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="email" className="sr-only">Email Address</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 text-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading || !email}
                size="lg"
                className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search Certificates'
                )}
              </Button>
            </div>

            {/* Results */}
            {searched && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Search Results
                  </h3>
                  <Badge variant={certificates.length > 0 ? "default" : "secondary"} className="px-3 py-1">
                    {certificates.length} Found
                  </Badge>
                </div>

                {certificates.length > 0 ? (
                  <div className="grid gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="group relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                {cert.participant_name}
                              </h4>
                              <Badge variant="outline" className="text-xs font-normal bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                                Verified
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>Issued on {new Date(cert.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                              <span>•</span>
                              <span className="font-mono text-xs opacity-70">ID: {cert.certificate_uuid.slice(0, 8)}...</span>
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <Button
                              onClick={() => handleDownload(cert)}
                              variant="outline"
                              size="sm"
                              className="h-9 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button
                              onClick={() => window.open(`/verify/${cert.certificate_uuid}`, '_blank')}
                              variant="outline"
                              size="sm"
                              className="h-9 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify
                            </Button>
                            <Button
                              onClick={() => {
                                const verifyUrl = `${window.location.origin}/verify/${cert.certificate_uuid}`;
                                window.open(
                                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`,
                                  '_blank'
                                );
                              }}
                              variant="default"
                              size="sm"
                              className="h-9 bg-[#0077b5] hover:bg-[#006396] text-white border-0"
                            >
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No certificates found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-1">
                      We couldn't find any certificates associated with this email address. Please check for typos or try another email.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? <a href="#" className="text-primary hover:underline underline-offset-4">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
