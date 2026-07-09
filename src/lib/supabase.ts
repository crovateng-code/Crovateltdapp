import { createClient } from '@supabase/supabase-js';
import { Property } from '../types';

// Retrieve environment variables via Vite's import.meta.env
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Validate credentials non-destructively so the application never crashes
export const isSupabaseConfigured = 
  typeof supabaseUrl === 'string' && 
  supabaseUrl.trim().length > 0 && 
  typeof supabaseAnonKey === 'string' && 
  supabaseAnonKey.trim().length > 0 &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Fetch all properties from Supabase 'properties' table.
 * If the table doesn't exist, we fallback or raise an error for the seeding prompt.
 */
export async function getSupabaseProperties(): Promise<Property[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('price', { ascending: false });

    if (error) {
      console.warn('Supabase query returned error (table might not exist yet):', error.message);
      return null;
    }

    return (data || []).map((p: any) => ({
      ...p,
      diligenceSummary: p.diligenceSummar || p.diligenceSummary
    })) as Property[];
  } catch (err) {
    console.error('Error fetching from Supabase database:', err);
    return null;
  }
}

/**
 * Seed the Supabase database with the initial catalog properties.
 * Creates the properties table inserts cleanly or upserts.
 */
export async function seedPropertiesIntoSupabase(properties: Property[]): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase client is not configured yet.' };
  }

  try {
    // Attempt insertion. Note that if RLS is enabled without write permissions, this will fail.
    // We will provide clear instructions on SQL schema in the UI too.
    const { error } = await supabase
      .from('properties')
      .upsert(
        properties.map(p => ({
          id: p.id,
          title: p.title,
          type: p.type,
          location: p.location,
          price: p.price,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          size: p.size,
          image: p.image,
          images: p.images || [p.image],
          description: p.description,
          status: p.status || 'Available',
          currency: p.currency || 'USD',
          whatsappLink: p.whatsappLink || null,
          phoneNumber: p.phoneNumber || null,
          videoLink: p.videoLink || null,
          amenities: p.amenities || null,
          diligenceSummar: p.diligenceSummary || null,
          listerName: p.listerName || null,
          listerBio: p.listerBio || null
        })),
        { onConflict: 'id' }
      );

    if (error) {
      return { 
        success: false, 
        message: `Failed to insert: ${error.message}. Ensure RLS is disabled/configured or write policy is active.` 
      };
    }

    return { success: true, message: 'Excellent! All luxury property assets have been synced to your Supabase database.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Unexpected seeding error.' };
  }
}

/**
 * Submit user inquiry details securely to the 'inquiries' table.
 */
export async function submitSupabaseInquiry(inquiry: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyName?: string;
}): Promise<{ success: boolean; errorMsg?: string }> {
  if (!supabase) {
    return { success: false, errorMsg: 'Database integration is currently off.' };
  }

  try {
    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone || '',
          message: inquiry.message,
          property_name: inquiry.propertyName || 'General Inquiry',
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase inquiry insert error:', error.message);
      return { success: false, errorMsg: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, errorMsg: err?.message || 'Failed to submit inquiry' };
  }
}
