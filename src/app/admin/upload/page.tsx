'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, FileSpreadsheet, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Participant = {
  name: string;
  email: string;
  uuid: string;
};

export default function BulkUploadPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [processing, setProcessing] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [sendEmails, setSendEmails] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    // Load events on mount
    const loadEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        if (data.events) {
          setEvents(data.events);
          // Auto-select the first event or from localStorage
          const savedEventId = localStorage.getItem('currentEventId');
          if (savedEventId) {
            setSelectedEventId(savedEventId);
          } else if (data.events.length > 0) {
            setSelectedEventId(data.events[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    loadEvents();
  }, []);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = results.data
          .filter((row: any) => row.name && row.email)
          .map((row: any) => ({
            name: row.name,
            email: row.email,
            uuid: uuidv4(),
          }));
        setParticipants(parsedData);
      },
      error: (error) => {
        console.error('CSV Parse Error:', error);
        alert('Error parsing CSV file');
      },
    });
  };

  const handleGenerateCertificates = async () => {
    setProcessing(true);

    try {
      // Validate event selection
      if (!selectedEventId) {
        alert('Please select an event first');
        setProcessing(false);
        return;
      }

      // Generate certificates via API
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId,
          participants,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully generated ${data.count} certificates!`);
        
        // Send emails if enabled
        if (sendEmails) {
          try {
            const selectedEvent = events.find(e => e.id === selectedEventId);
            const emailPromises = data.certificates.map((cert: any) => 
              fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: cert.participant_email,
                  participantName: cert.participant_name,
                  eventName: selectedEvent?.name || 'Event',
                  certificateUrl: cert.cloudinary_url.replace('/upload/', '/upload/fl_attachment/'),
                  verificationUrl: `${window.location.origin}/verify/${cert.certificate_uuid}`,
                  customMessage,
                }),
              })
            );
            await Promise.all(emailPromises);
            alert(`Emails sent to ${data.count} participants!`);
          } catch (emailError) {
            console.error('Error sending emails:', emailError);
            alert('Certificates generated but some emails failed to send.');
          }
        }
        
        setParticipants([]);
      } else {
        throw new Error(data.error || 'Failed to generate certificates');
      }
    } catch (error: any) {
      console.error('Error generating certificates:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

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
              Bulk Generation
            </h1>
            <p className="text-muted-foreground">
              Upload participant data and generate certificates in batch
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Select event and upload data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Event</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Upload CSV</Label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer relative group">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                      <FileSpreadsheet className="w-10 h-10" />
                      <div className="space-y-1">
                        <p className="font-medium">Drop CSV file here</p>
                        <p className="text-xs">name, email columns required</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Checkbox 
                    id="sendEmails" 
                    checked={sendEmails}
                    onCheckedChange={(checked) => setSendEmails(checked as boolean)}
                  />
                  <Label htmlFor="sendEmails" className="cursor-pointer">
                    Send emails automatically
                  </Label>
                </div>

                {sendEmails && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                    <Textarea
                      id="customMessage"
                      placeholder="Add a personal note to the email..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>
                )}

                <Button 
                  className="w-full bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-purple-500/20" 
                  size="lg"
                  onClick={handleGenerateCertificates}
                  disabled={participants.length === 0 || processing || !selectedEventId}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate {participants.length > 0 ? `(${participants.length})` : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {participants.length > 0 && (
              <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-blue-900 dark:text-blue-100">Ready to process</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {participants.length} participants loaded. Click Generate to create certificates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Data Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  Review participant data before generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {participants.length > 0 ? (
                  <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-900">
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="w-25">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.slice(0, 10).map((p, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{p.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                                Pending
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {participants.length > 10 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                              ...and {participants.length - 10} more rows
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="h-100 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                    <p>No data loaded yet</p>
                    <p className="text-sm">Upload a CSV file to see preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

