'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload, Type, MousePointer2, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

export default function TemplateConfigPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [displayCoordinates, setDisplayCoordinates] = useState({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(50);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [fontColor, setFontColor] = useState('#000000');
  const [eventName, setEventName] = useState('');

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = canvasRef.current?.querySelector('img') as HTMLImageElement;
    if (!img || !canvasRef.current) return;
    
    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Store display coordinates for the marker
    setDisplayCoordinates({ x: clickX, y: clickY });
    
    // Scale coordinates to actual image size for Cloudinary
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    
    const x = Math.round(clickX * scaleX);
    const y = Math.round(clickY * scaleY);
    
    setCoordinates({ x, y });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplateImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateImage || !eventName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // First, upload the template image to Cloudinary
      const response = await fetch(templateImage);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'template.png');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload template');
      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error('Failed to upload template');
      }

      // Save event configuration to Supabase
      const eventResponse = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eventName,
          templateUrl: uploadData.publicId,
          textX: coordinates.x,
          textY: coordinates.y,
          fontSize,
          fontFamily,
          fontColor: fontColor.replace('#', ''),
        }),
      });

      if (!eventResponse.ok) throw new Error('Failed to create event');
      const eventData = await eventResponse.json();

      if (eventData.success) {
        alert('Template configuration saved successfully!');
        // Store event ID in localStorage for use in bulk upload
        localStorage.setItem('currentEventId', eventData.event.id);
      } else {
        throw new Error(eventData.error || 'Failed to save event');
      }
    } catch (error: any) {
      console.error('Error saving template:', error);
      alert(`Error: ${error.message}`);
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
              Template Configuration
            </h1>
            <p className="text-muted-foreground">
              Design your certificate layout and text positioning
            </p>
          </div>
          <Button 
            onClick={handleSaveTemplate} 
            className="gap-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/20"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Controls */}
          <Card className="h-fit bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5" /> Settings
              </CardTitle>
              <CardDescription>Configure event details and styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  placeholder="e.g. Hackathon 2024"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Template Image</Label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" /> Typography
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Label>Coordinates</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-center">
                    <span className="text-xs text-muted-foreground block">X</span>
                    <span className="font-mono">{coordinates.x}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-center">
                    <span className="text-xs text-muted-foreground block">Y</span>
                    <span className="font-mono">{coordinates.y}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer2 className="w-5 h-5" /> Preview
                </CardTitle>
                <CardDescription>
                  Click anywhere on the image to set the text position
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 bg-slate-100 dark:bg-slate-950/50 min-h-125 flex items-center justify-center relative overflow-auto">
                {templateImage ? (
                  <div 
                    ref={canvasRef} 
                    className="relative cursor-crosshair inline-block shadow-2xl"
                    onClick={handleCanvasClick}
                  >
                    <img 
                      src={templateImage} 
                      alt="Template" 
                      className="max-w-full h-auto block"
                    />
                    {displayCoordinates.x > 0 && (
                      <div
                        className="absolute pointer-events-none border-2 border-primary bg-primary/20 text-primary font-bold whitespace-nowrap px-2 py-1 rounded"
                        style={{
                          left: displayCoordinates.x,
                          top: displayCoordinates.y,
                          transform: 'translate(-50%, -50%)',
                          fontSize: `${fontSize * 0.5}px`, // Scaled down for preview roughly
                          fontFamily: fontFamily,
                          color: fontColor,
                        }}
                      >
                        Participant Name
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-12">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload a template image to get started</p>
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

