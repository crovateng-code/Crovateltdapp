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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 mb-2" id="supabase-status-widget">
      <div className="bg-secondary/95 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Banner Top Row */}
        <div className="px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${
              isSupabaseConfigured 
                ? dbPropertiesCount !== null && dbPropertiesCount > 0 
                  ? 'bg-emerald-500/15 text-emerald-400 ring-2 ring-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/30'
                : 'bg-rose-500/15 text-rose-400 ring-2 ring-rose-500/30'
            }`}>
              <Database className="h-5 w-5 animate-pulse" />
            </div>
            
            <div className="text-left">
              <span className="text-[9px] font-mono tracking-widest text-primary uppercase font-bold block">
                Database Integration Center
              </span>
              <h4 className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
                {isSupabaseConfigured ? (
                  dbPropertiesCount !== null && dbPropertiesCount > 0 ? (
                    <>Connected to Supabase <span className="text-emerald-400 font-mono text-xs">({dbPropertiesCount} items synced)</span></>
                  ) : (
                    <>Connected to Supabase <span className="text-amber-400 font-mono text-xs">(Database empty)</span></>
                  )
                ) : (
                  <>Supabase Sandbox Offline <span className="text-rose-400 font-mono text-xs">(Using fallback mock data)</span></>
                )}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {!isSupabaseConfigured && (
              <span className="text-xs text-gray-400 font-medium leading-relaxed hidden lg:block max-w-sm">
                Add keys in the <strong>Secrets panel</strong> to start pulling from your database!
              </span>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-xs px-3.5 py-2 rounded-xl transition duration-200 cursor-pointer text-[#00e1ff] hover:text-white border border-white/5"
            >
              <span>{isOpen ? 'Close Settings' : 'Open Integration Guide'}</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Guidelines Panel */}
        {isOpen && (
          <div className="border-t border-white/10 bg-black/40 px-6 py-6 animate-fade-in-down">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Instruction Steps & SQL Scripts copy paste */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h5 className="text-sm font-bold tracking-wide uppercase text-[#00e1ff] flex items-center gap-2">
                    <TableProperties className="h-4 w-4" /> Setup Instructions
                  </h5>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 bg-white/5 hover:bg-primary hover:text-secondary text-[11px] px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer border border-white/5"
                    title="Copy tables SQL query"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied Schema!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy SQL Script</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed text-left">
                  To stream dynamic real estate listings from your own database, simply run this query in your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Supabase SQL Editor</a>.
                </p>

                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#00090a]">
                  <pre className="text-[10px] font-mono p-4 text-emerald-300/90 overflow-x-auto text-left max-h-56 leading-relaxed select-all">
                    {sqlSchema}
                  </pre>
                </div>
              </div>

              {/* Right Column: Key Diagnostic, Seeding Hub, and Live inquiry logs */}
              <div className="space-y-4 text-left">
                <div className="flex border-b border-white/5 pb-2">
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`text-xs uppercase font-extrabold tracking-wider pb-1 px-3 ${activeTab === 'instructions' ? 'border-b-2 border-[#00e1ff] text-[#00e1ff]' : 'text-gray-400'}`}
                  >
                    Control Panel
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('inquiries');
                      fetchRecentInquiries();
                    }}
                    className={`text-xs uppercase font-extrabold tracking-wider pb-1 px-3 relative ${activeTab === 'inquiries' ? 'border-b-2 border-[#00e1ff] text-[#00e1ff]' : 'text-gray-400'}`}
                  >
                    Recent Web Leads
                    {recentInquiries.length > 0 && (
                      <span className="absolute top-[-4px] right-[-2px] bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {recentInquiries.length}
                      </span>
                    )}
                  </button>
                </div>

                {activeTab === 'instructions' ? (
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <h6 className="text-xs font-semibold text-gray-200">How to populate database:</h6>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Define <strong>`VITE_SUPABASE_URL`</strong> & <strong>`VITE_SUPABASE_ANON_KEY`</strong> in the <strong>Secrets panel</strong> on the top-right settings.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Execute the schema script on the left side inside your Supabase client dashboard to form tables.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Click below to automatically write the 6 ultra-luxury initial properties directly into Supabase!
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <button
                        onClick={handleSeed}
                        disabled={isSeeding || !isSupabaseConfigured}
                        className={`w-full flex items-center justify-center gap-2 font-bold text-xs uppercase py-3.5 px-4 rounded-xl transition duration-300 ${
                          !isSupabaseConfigured 
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                            : 'bg-primary hover:bg-[#00e1ff] text-secondary hover:text-white cursor-pointer active:scale-95 shadow-md shadow-primary/25'
                        }`}
                      >
                        {isSeeding ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Seeding Database Catalog...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Seed initial Properties into Supabase</span>
                          </>
                        )}
                      </button>

                      {seedResult && (
                        <div className={`text-xs p-3 rounded-lg border flex gap-2 ${
                          seedResult.success 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        }`}>
                          {seedResult.success ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <ShieldAlert className="h-4 w-4 flex-shrink-0" />}
                          <span>{seedResult.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5 min-h-[180px]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="text-xs font-semibold text-gray-300">Live Client Submissions</span>
                      <button 
                        onClick={fetchRecentInquiries} 
                        className="text-[10px] text-primary hover:underline font-mono"
                        disabled={isLoadingInquiries}
                      >
                        {isLoadingInquiries ? 'Refreshing...' : 'Refresh Logs'}
                      </button>
                    </div>

                    {!isSupabaseConfigured ? (
                      <div className="text-xs text-gray-400 py-8 text-center">
                        Configure Supabase keys to view live leads.
                      </div>
                    ) : recentInquiries.length === 0 ? (
                      <div className="text-xs text-gray-400 py-8 text-center">
                        {isLoadingInquiries ? 'Fetching recent logs...' : 'No inquiries found in custom tables yet.'}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {recentInquiries.map((inq, index) => (
                          <div key={inq.id || index} className="p-2 bg-black/20 rounded-lg text-left border border-white/5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-xs text-[#00e1ff] truncate max-w-[120px]">{inq.name}</span>
                              <span className="text-[9px] font-mono text-gray-400">{new Date(inq.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="text-[10px] text-gray-300 mt-1 truncate">{inq.message}</div>
                            <div className="text-[9px] text-[#00e1ff]/70 font-mono mt-0.5 truncate">Property: {inq.property_name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
