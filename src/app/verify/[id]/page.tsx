import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import QRCode from 'qrcode';
import Image from 'next/image';
import { CheckCircle2, XCircle, Download, Share2, Calendar, User, Award, Mail } from 'lucide-react';

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Generate QR code for this verification URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  const verificationUrl = `${appUrl}/verify/${id}`;
  let qrCodeDataUrl = '';
  
  try {
    qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Fetch certificate by UUID
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select(`
      *,
      events (
        name
      )
    `)
    .eq('certificate_uuid', id)
    .single();

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md border-destructive/50 shadow-2xl bg-white dark:bg-slate-900">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-600 dark:text-red-500">
              Invalid Certificate
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              This certificate could not be verified. It may have been tampered with or does not exist in our records.
            </p>
            <Button className="mt-6 w-full" variant="outline" asChild>
              <Link href="/portal">Return to Portal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-linear-to-b from-green-500/10 to-transparent blur-3xl" />
      </div>

      <Card className="w-full max-w-3xl border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <div className="h-2 bg-linear-to-r from-green-500 to-emerald-600" />
        
        <div className="grid md:grid-cols-3 gap-0">
          {/* Left Column: Status & QR */}
          <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-800 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verified</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900 px-3 py-1">
                Authentic Document
              </Badge>
            </div>

            {qrCodeDataUrl && (
              <div className="p-3 bg-white dark:bg-white rounded-xl shadow-sm border border-slate-200">
                <Image 
                  src={qrCodeDataUrl} 
                  alt="QR Code" 
                  width={140} 
                  height={140}
                  className="mix-blend-multiply"
                />
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Scan to verify authenticity
            </p>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2 p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Event</h3>
                <p className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  {certificate.events?.name || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recipient</h3>
                  <p className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {certificate.participant_name}
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Issue Date</h3>
                  <p className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(certificate.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Email</h3>
                <p className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {certificate.participant_email}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Certificate ID</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {certificate.certificate_uuid}
                  </span>
                </div>
              </div>
            </div>

            {certificate.cloudinary_url && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={certificate.cloudinary_url.replace('/upload/', '/upload/fl_attachment/')} target="_blank" className="flex-1">
                  <Button className="w-full h-11" variant="default">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </Link>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full h-11 bg-[#0077b5] hover:bg-[#006396] text-white border-0" variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share on LinkedIn
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
