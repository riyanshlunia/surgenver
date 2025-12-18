import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { generateCertificateUrl } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, participants } = body;

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Generate certificates for all participants
    const certificates = participants.map((participant: any) => {
      const certificateUuid = uuidv4();
      const cloudinaryUrl = generateCertificateUrl(
        event.template_url,
        participant.name,
        event.text_x,
        event.text_y,
        event.font_size,
        event.font_family,
        event.font_color
      );

      return {
        event_id: eventId,
        participant_name: participant.name,
        participant_email: participant.email,
        certificate_uuid: certificateUuid,
        cloudinary_url: cloudinaryUrl,
      };
    });

    // Bulk insert certificates
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificates)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      count: data.length,
      certificates: data 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const eventId = searchParams.get('eventId');

    let query = supabase
      .from('certificates')
      .select(`
        *,
        events (
          name
        )
      `);

    if (email) {
      query = query.eq('participant_email', email);
    }

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ certificates: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
