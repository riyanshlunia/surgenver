import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, FileText, Layout, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Navbar Placeholder (if needed, or just top spacing) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-20 gap-6 md:gap-0">
          <div className="font-bold text-2xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            CertificatePro
          </div>
          <div className="flex gap-4 w-full md:w-auto justify-center md:justify-end">
            <Link href="/portal">
              <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Verify Certificate</Button>
            </Link>
            <Link href="/admin">
              <Button className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 border-0">Admin Login</Button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-8 py-12 md:py-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-800 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
              Secure
            </span>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 pr-2">
              Tamper-proof digital credentials
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Certificate Generation <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Create, distribute, and verify professional certificates at scale. 
            The complete solution for event organizers and educational institutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link href="/admin">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 border-0 transition-all">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/portal">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-900/80 border-slate-200 dark:border-slate-800">
                Find My Certificate
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: <Layout className="w-8 h-8 text-blue-500" />,
              title: "Custom Templates",
              desc: "Upload your own designs and configure dynamic text placement with pixel-perfect precision."
            },
            {
              icon: <Zap className="w-8 h-8 text-purple-500" />,
              title: "Bulk Generation",
              desc: "Generate thousands of certificates in seconds by simply uploading a CSV file."
            },
            {
              icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
              title: "Instant Verification",
              desc: "Every certificate gets a unique QR code for instant authenticity verification."
            }
          ].map((feature, i) => (
            <Card key={i} className="group border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-32 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Four simple steps to generate professional certificates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 -z-10" />

            {[
              { step: '1', title: 'Upload Template', desc: 'Add your certificate design' },
              { step: '2', title: 'Configure Layout', desc: 'Set text position and style' },
              { step: '3', title: 'Import Data', desc: 'Upload CSV with participant details' },
              { step: '4', title: 'Distribute', desc: 'Email and share automatically' },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center text-2xl font-bold text-primary mb-6 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 z-10">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
