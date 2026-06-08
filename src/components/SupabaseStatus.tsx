import React, { useState, useEffect } from 'react';
import { Database, ShieldAlert, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, TableProperties, HelpCircle, Loader2 } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseProperties, seedPropertiesIntoSupabase, supabase } from '../lib/supabase.ts';
import { PROPERTIES } from '../data.ts';
import { Property } from '../types.ts';

interface SupabaseStatusProps {
  onDataLoaded: (properties: Property[]) => void;
}

export default function SupabaseStatus({ onDataLoaded }: SupabaseStatusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dbPropertiesCount, setDbPropertiesCount] = useState<number | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'inquiries'>('instructions');

  // Verify connection count on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      checkSupabaseSync();
    }
  }, []);

  const checkSupabaseSync = async () => {
    try {
      const liveProps = await getSupabaseProperties();
      if (liveProps !== null) {
        setDbPropertiesCount(liveProps.length);
        if (liveProps.length > 0) {
          onDataLoaded(liveProps); // Dynamic runtime override!
        }
      }
      fetchRecentInquiries();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentInquiries = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setIsLoadingInquiries(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentInquiries(data);
      }
    } catch (err) {
      console.warn('Inquiries table might not exist yet:', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedPropertiesIntoSupabase(PROPERTIES);
      setSeedResult(res);
      if (res.success) {
        // Refresh properties
        const liveProps = await getSupabaseProperties();
        if (liveProps) {
          setDbPropertiesCount(liveProps.length);
          onDataLoaded(liveProps);
        }
      }
    } catch (err: any) {
      setSeedResult({ success: false, message: err?.message || 'Error executing seed query.' });
    } finally {
      setIsSeeding(false);
    }
  };

  const sqlSchema = `-- Run this inside the Supabase SQL Editor:

-- 1. Create the properties catalog table
create table properties (
  id text primary key,
  title text not null,
  type text not null,
  location text not null,
  price numeric not null,
  bedrooms int not null,
  bathrooms int not null,
  size int not null,
  image text not null,
  images text[] not null,
  description text not null
);

-- 2. Create the inquiries leads table
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  property_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Disable row-level security (RLS) or add public insert/select permissions for quick testing:
alter table properties enable row level security;
alter table inquiries enable row level security;

create policy "Allow public read access to properties" on properties
  for select using (true);

create policy "Allow public insert and read access to properties" on properties
  for all using (true);

create policy "Allow public insert access to inquiries" on inquiries
  for insert with check (true);

create policy "Allow public select access to inquiries" on inquiries
  for select using (true);
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Fully silent background synchronization: do not render any visible HTML, banners, or badges.
  return null;
}
