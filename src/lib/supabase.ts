import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Event = {
  id: string;
  name: string;
  template_url: string;
  text_x: number;
  text_y: number;
  font_family: string;
  font_size: number;
  font_color: string;
  created_at: string;
};

export type Certificate = {
  id: string;
  event_id: string;
  participant_name: string;
  participant_email: string;
  certificate_uuid: string;
  cloudinary_url: string;
  downloaded: boolean;
  created_at: string;
};
