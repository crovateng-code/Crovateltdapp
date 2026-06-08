import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Lock, 
  Unlock, 
  User, 
  Mail, 
  Key, 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Maximize2, 
  Eye, 
  RefreshCw,
  LogOut,
  MapPin,
  BedDouble,
  Bath,
  ArrowRight
} from 'lucide-react';
import { Property, PropertyType } from '../types';
import { supabase, isSupabaseConfigured, seedPropertiesIntoSupabase, getSupabaseProperties } from '../lib/supabase';

interface AdminPortalProps {
  properties: Property[];
  onPropertiesUpdated: (updatedProperties: Property[]) => void;
  onBackToSite: () => void;
  activeSubView: 'login' | 'dashboard';
  onNavigateSubView: (view: 'login' | 'dashboard') => void;
}

export default function AdminPortal({ 
  properties, 
  onPropertiesUpdated, 
  onBackToSite,
  activeSubView,
  onNavigateSubView
}: AdminPortalProps) {
  
  // Auth Form State
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [signInName, setSignInName] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSingleAdminRegistered, setIsSingleAdminRegistered] = useState(false);

  // Dashboard Active Tab
  const [dashTab, setDashTab] = useState<'analytics' | 'listings' | 'leads'>('analytics');

  // local listing additions
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    type: 'Apartment' as PropertyType,
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    image: '',
    description: ''
  });

  // Local state for tracking registered admin & login session
  const [registeredAdmin, setRegisteredAdmin] = useState<any>(null);
  const [loggedInAdmin, setLoggedInAdmin] = useState<any>(null);
  const [localInquiries, setLocalInquiries] = useState<any[]>([]);

  // Check registration and active session on mount
  useEffect(() => {
    const adminCheck = localStorage.getItem('crovation_registered_admin');
    if (adminCheck) {
      try {
        const parsed = JSON.parse(adminCheck);
        setRegisteredAdmin(parsed);
        setIsSingleAdminRegistered(true);
      } catch (e) {
        console.error(e);
      }
    }

    const activeSession = localStorage.getItem('crovation_logged_in_admin');
    if (activeSession) {
      try {
        const parsed = JSON.parse(activeSession);
        setLoggedInAdmin(parsed);
        onNavigateSubView('dashboard');
      } catch (e) {
        console.error(e);
      }
    }

    loadLocalInquiries();
  }, []);

  const loadLocalInquiries = () => {
    const savedInquiries = localStorage.getItem('crovation_local_inquiries');
    if (savedInquiries) {
      try {
        setLocalInquiries(JSON.parse(savedInquiries));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Create some default premium sample leads so the inbox is never boringly empty
      const sampleInquiries = [
        {
          id: 'lead-1',
          name: 'Lady Henrietta Cavendish',
          email: 'henrietta@cavendish-estates.co.uk',
          phone: '+44 20 7946 0912',
          message: 'Interested in placing an immediate private equity trade on Orchid Manor Villa. Please coordinate with my Midtown asset directors.',
          propertyName: 'Orchid Manor Villa',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
        },
        {
          id: 'lead-2',
          name: 'Marcus Sterling',
          email: 'm.sterling@sterlingholdings.com',
          phone: '+1 (212) 555-8902',
          message: 'Querying maximum floor loads and structural glass envelope specifications of Penthouse Apex.',
          propertyName: 'Apex Penthouse Resort',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
        }
      ];
      localStorage.setItem('crovation_local_inquiries', JSON.stringify(sampleInquiries));
      setLocalInquiries(sampleInquiries);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (isSingleAdminRegistered) {
      setAuthError('Registration locked. Crovation securities rules restrict the server to a single master administrator.');
      return;
    }

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setAuthError('All fields including a strong password are required.');
      return;
    }

    const adminUser = {
      name: signUpName.trim(),
      email: signUpEmail.trim().toLowerCase(),
      password: signUpPassword
    };

    localStorage.setItem('crovation_registered_admin', JSON.stringify(adminUser));
    setRegisteredAdmin(adminUser);
    setIsSingleAdminRegistered(true);
    setAuthSuccess('Administrator account established successfully! Redirection in progress...');
    
    // Clear sign up form
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');

    // Force redirection to Sign In tab after short elegant delay as requested
    setTimeout(() => {
      setAuthSuccess(null);
      setAuthTab('signin');
    }, 2000);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!signInName.trim() || !signInEmail.trim()) {
      setAuthError('Please input both your registered name and administrative email address.');
      return;
    }

    // Default emergency fallback to allow quick testing if they skipped signup
    const registered = registeredAdmin || {
      name: 'Admin',
      email: 'admin@crovation.com'
    };

    const inputName = signInName.trim().toLowerCase();
    const inputEmail = signInEmail.trim().toLowerCase();
    const adminName = registered.name.toLowerCase();
    const adminEmail = registered.email.toLowerCase();

    if (inputName === adminName && inputEmail === adminEmail) {
      const sessionUser = {
        name: registered.name,
        email: registered.email,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('crovation_logged_in_admin', JSON.stringify(sessionUser));
      setLoggedInAdmin(sessionUser);
      setAuthSuccess('Credentials verified. Initiating Secure Executive Console...');
      
      setSignInName('');
      setSignInEmail('');

      setTimeout(() => {
        setAuthSuccess(null);
        onNavigateSubView('dashboard');
      }, 1000);
    } else {
      setAuthError('Access Denied: The provided administrator credentials do not match our secure workstation databases.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crovation_logged_in_admin');
    setLoggedInAdmin(null);
    onNavigateSubView('login');
  };

  // Listings CRUD
  const handleDeleteProperty = async (id: string) => {
    const filtered = properties.filter(p => p.id !== id);
    onPropertiesUpdated(filtered);

    // If Supabase is active, do sync delete
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('properties').delete().eq('id', id);
        console.log('Synchronized deletion to Supabase catalog.');
      } catch (e) {
        console.error('Supabase delete error:', e);
      }
    }
  };

  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, type, location, price, bedrooms, bathrooms, size, image, description } = newProperty;

    if (!title || !location || !price || !bedrooms || !bathrooms || !size || !image || !description) {
      alert('Kindly populate all structural attributes of the premium listing.');
      return;
    }

    const created: Property = {
      id: `prop-${Date.now()}`,
      title,
      type,
      location,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      size: parseInt(size),
      image,
      images: [image],
      description
    };

    const updatedCatalog = [created, ...properties];
    onPropertiesUpdated(updatedCatalog);

    // Clean up
    setNewProperty({
      title: '',
      type: 'Apartment',
      location: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      size: '',
      image: '',
      description: ''
    });
    setIsAddFormOpen(false);

    // If Supabase is active, do sync save!
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('properties').insert([{
          id: created.id,
          title: created.title,
          type: created.type,
          location: created.location,
          price: created.price,
          bedrooms: created.bedrooms,
          bathrooms: created.bathrooms,
          size: created.size,
          image: created.image,
          images: [created.image],
          description: created.description
        }]);
        console.log('Synthetically inserted luxury record in cloud-synced Supabase.');
      } catch (err) {
        console.error('Error syncing listing to Supabase: ', err);
      }
    }
  };

  const handleClearInquiry = (id: string) => {
    const updated = localInquiries.filter(liq => liq.id !== id);
    setLocalInquiries(updated);
    localStorage.setItem('crovation_local_inquiries', JSON.stringify(updated));
  };

  // Calculations for dashboard analytic counts
  const statistics = useMemo(() => {
    const totalAssets = properties.reduce((accum, curr) => accum + curr.price, 0);
    const averagePrice = properties.length > 0 ? (totalAssets / properties.length) : 0;
    
    // Counter categories
    const countByType = properties.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAssets,
      averagePrice,
      countByType,
      propertyCount: properties.length,
      leadCount: localInquiries.length
    };
  }, [properties, localInquiries]);

  // SQL Trigger status helper inside UI
  const isSyncOn = isSupabaseConfigured;

  return (
    <div className="bg-[#00090a] min-h-screen text-white pt-24 pb-16 font-sans relative" id="admin-module-root">
      
      {/* Decorative luxury radial glow background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#00ffd5]/5 to-transparent pointer-events-none" />

      {/* RENDER VIEW 1: AUTH ENVELOPE */}
      {activeSubView === 'login' && (
        <div className="mx-auto max-w-md px-4 relative z-10 py-12" id="admin-auth-panel">
          <button 
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-primary hover:text-white mb-8 group transition duration-200"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Public Agency Site</span>
          </button>

          <div className="bg-[#010e11]/90 rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-md">
            
            {/* Crown Identity Badge */}
            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <div className="p-3.5 rounded-full bg-primary/20 border border-primary/30 text-primary mb-3">
                <Lock className="h-6 w-6 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest text-white">
                Crovation <span className="font-light text-primary">Admin</span>
              </h2>
              <p className="text-[10px] text-gray-500 font-mono mt-1">
                SECURE CONSOLE ENTRY PROTOCOL
              </p>
            </div>

            {/* Auth Tab Switching with locked/disabled signup state */}
            <div className="grid grid-cols-2 bg-white/5 p-1 rounded-xl border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setAuthError(null);
                }}
                className={`text-xs uppercase font-bold tracking-widest py-2.5 rounded-lg transition duration-200 ${
                  authTab === 'signin' 
                    ? 'bg-primary text-secondary' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setAuthError(null);
                }}
                className={`relative text-xs uppercase font-bold tracking-widest py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
                  authTab === 'signup' 
                    ? 'bg-primary text-secondary' 
                    : isSingleAdminRegistered 
                      ? 'text-gray-600 line-through cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white'
                }`}
                title={isSingleAdminRegistered ? 'Admin signup is locked' : 'Establish Admin'}
                disabled={authTab !== 'signup' && isSingleAdminRegistered}
              >
                <span>Sign Up</span>
                {isSingleAdminRegistered && (
                  <span className="text-[9px] bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded border border-red-500/10 scale-90">
                    Locked
                  </span>
                )}
              </button>
            </div>

            {/* ERROR / SUCCESS FEEDBACK MODULE */}
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs p-3 rounded-lg flex items-start gap-2 mb-4 text-left">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg flex items-start gap-2 mb-4 text-left">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* TAB CONTENT: SIGN IN */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4 text-left">
                
                {/* Visual notice if skipped signup */}
                {!isSingleAdminRegistered && (
                  <div className="bg-amber-500/10 border border-amber-500/15 text-amber-400 text-[10px] p-3 rounded-xl mb-4 font-mono leading-relaxed">
                    SYSTEM INSTANCE DETECTED EMPTY ADMIN FILE. KINDLY CHOOSE "SIGN UP" TAB FIRST TO ACTIVATE ACCESS.
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold mb-1.5">
                    Authorized Admin Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="h-4 w-4 text-primary/70" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-4 py-3 bg-[#00090a] rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs font-sans transition-all"
                      placeholder="e.g. Executive Director"
                      value={signInName}
                      onChange={(e) => setSignInName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold mb-1.5">
                    Administrative Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="h-4 w-4 text-primary/70" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-4 py-3 bg-[#00090a] rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs font-sans transition-all"
                      placeholder="e.g. director@crovation.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#00ffd5] text-secondary font-bold py-3.5 px-4 rounded-xl transition duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 mt-6 active:scale-[0.98]"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Authenticate Executive</span>
                </button>
              </form>
            )}

            {/* TAB CONTENT: SIGN UP (SINGLE ADHERENCE) */}
            {authTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
                {isSingleAdminRegistered ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                      <Lock className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-300">
                      Administrative Registry Locked
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans max-w-xs mx-auto">
                      Crovation core directory registers only one admin to defend the corporate database. An executive user is already stored. Multiple administrative registries are forbidden.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAuthTab('signin')}
                      className="text-xs font-mono text-primary hover:underline hover:text-[#00ffd5]"
                    >
                      Return to authentication panel →
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-1 font-sans">
                      Establish the initial administrator account. <strong className="text-yellow-400">Once created, signup is closed permanently.</strong>
                    </p>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold mb-1.5">
                        Admin Creator Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User className="h-4 w-4 text-[#00ffd5]" />
                        </div>
                        <input
                          type="text"
                          required
                          className="block w-full pl-10 pr-4 py-3 bg-[#00090a] rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs transition-all"
                          placeholder="Your official master name"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold mb-1.5">
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Mail className="h-4 w-4 text-[#00ffd5]" />
                        </div>
                        <input
                          type="email"
                          required
                          className="block w-full pl-10 pr-4 py-3 bg-[#00090a] rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs transition-all"
                          placeholder="your_name@crovation.com"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold mb-1.5">
                        Define Password Access Key
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Key className="h-4 w-4 text-[#00ffd5]" />
                        </div>
                        <input
                          type="password"
                          required
                          className="block w-full pl-10 pr-4 py-3 bg-[#00090a] rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs transition-all"
                          placeholder="••••••••••••••"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-secondary font-bold py-3.5 px-4 rounded-xl transition duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 mt-6 active:scale-[0.98]"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Lock Master Account</span>
                    </button>
                  </>
                )}
              </form>
            )}

            {/* Bottom corporate accreditation */}
            <div className="mt-8 border-t border-white/5 pt-4 text-center">
              <span className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">
                CROVATION TRUST CERTIFIED & SECURED
              </span>
            </div>

          </div>
        </div>
      )}

      {/* RENDER VIEW 2: SPLENDID & MODERN EXECUTIVE DASHBOARD */}
      {activeSubView === 'dashboard' && (
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10" id="admin-panel-dashboard">
          
          {/* Executive Header Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/15 pb-6 mb-8 gap-4">
            <div className="text-left">
              <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase font-bold tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Crovation Luxury Brokerage Core Console</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1 uppercase tracking-tight">
                Executive Workstation
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Administered by: <strong className="text-[#00ffd5]">{loggedInAdmin?.name || 'Administrator'}</strong> &bull; session is cloud synchronized.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Back to public view */}
              <button
                onClick={onBackToSite}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300 transition duration-200 cursor-pointer"
              >
                <Eye className="h-4 w-4 text-[#00ffd5]" />
                <span>Return to Gallery Site</span>
              </button>

              {/* Secure Log out */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-300 transition duration-200 cursor-pointer border border-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Lock Console</span>
              </button>
            </div>
          </div>

          {/* Core Navigation Tab Suite */}
          <div className="flex border-b border-white/5 mb-8">
            <button
              onClick={() => setDashTab('analytics')}
              className={`flex items-center gap-2 text-xs md:text-sm uppercase font-extrabold tracking-wider pb-3.5 px-6 transition-all duration-300 border-b-2 ${
                dashTab === 'analytics' 
                  ? 'border-[#00ffd5] text-[#00ffd5] bg-white/5 rounded-t-xl' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Asset Intelligence</span>
            </button>
            
            <button
              onClick={() => setDashTab('listings')}
              className={`flex items-center gap-2 text-xs md:text-sm uppercase font-extrabold tracking-wider pb-3.5 px-6 transition-all duration-300 border-b-2 ${
                dashTab === 'listings' 
                  ? 'border-[#00ffd5] text-[#00ffd5] bg-white/5 rounded-t-xl' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Catalog Management</span>
            </button>

            <button
              onClick={() => setDashTab('leads')}
              className={`flex items-center gap-2 text-xs md:text-sm uppercase font-extrabold tracking-wider pb-3.5 px-6 transition-all duration-300 border-b-2 relative ${
                dashTab === 'leads' 
                  ? 'border-[#00ffd5] text-[#00ffd5] bg-white/5 rounded-t-xl' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Client Communications</span>
              {statistics.leadCount > 0 && (
                <span className="absolute top-2 right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {statistics.leadCount}
                </span>
              )}
            </button>
          </div>

          {/* TAB SUITE: 1. ANALYTICS INTEL */}
          {dashTab === 'analytics' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Dynamic Stats Cards row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Visual Card 1: Asset Value */}
                <div className="bg-[#010e11] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Aggregated Holdings Listings</span>
                    <div className="p-2 bg-primary/20 text-primary rounded-xl">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black font-mono mt-2">
                    ${(statistics.totalAssets / 1000000).toFixed(1)}M
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Real-time catalog pricing evaluation</span>
                  </p>
                </div>

                {/* Visual Card 2: Average Value */}
                <div className="bg-[#010e11] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Average Asset Pricing Unit</span>
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black font-mono mt-2">
                    ${(statistics.averagePrice / 1000000).toFixed(2)}M
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">
                    Midtown portfolio median pricing index
                  </p>
                </div>

                {/* Visual Card 3: Listing volume */}
                <div className="bg-[#010e11] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Listed High-Value Inventory</span>
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                      <Building2 className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black font-mono mt-2">
                    {statistics.propertyCount} Properties
                  </h3>
                  <p className="text-[10px] text-[#00ffd5] font-mono mt-1">
                    {statistics.countByType.Villa || 0} Villas &bull; {statistics.countByType.Apartment || 0} Apartments
                  </p>
                </div>

                {/* Visual Card 4: Platform Security & Sync State */}
                <div className="bg-[#010e11] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#02ceed]/5 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#02ceed] uppercase">Security Console Status</span>
                    <div className="p-2 rounded-xl bg-[#02ceed]/20 text-[#02ceed]">
                      <Database className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mt-2 truncate">
                    SECURED PROTOCOLS
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">
                    Enterprise catalog sync protocols active
                  </p>
                </div>

              </div>

              {/* Graphical Visualizations (using elegant SVG visuals mimicking D3 charting) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SVG Proportional Property Bar Chart */}
                <div className="bg-[#010e11] border border-white/5 rounded-2xl p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#00ffd5]">
                      Holding Asset Value Distribution
                    </h4>
                    <span className="text-[10px] font-mono text-gray-500">PROPERTIES COMPARATIVE PRICING</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    {properties.map((prop, index) => {
                      // Proportional ratio to max price
                      const maxPrice = Math.max(...properties.map(p => p.price));
                      const ratio = prop.price / maxPrice;
                      return (
                        <div key={prop.id || index} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-sans text-gray-300">
                            <span className="font-medium truncate max-w-sm">{prop.title}</span>
                            <span className="font-mono font-bold text-primary">${(prop.price / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-primary to-[#00ffd5] h-full rounded-full transition-all duration-1000"
                              style={{ width: `${ratio * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Segment Allocation Audit Info */}
                <div className="bg-[#010e11] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#00ffd5]">
                      Segment Allocations
                    </h4>
                    <span className="text-[10px] font-mono text-gray-500">TYPE RATIOS</span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-4">
                    {/* Visual Donut representation */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffffff0a" strokeWidth="3" />
                        
                        {/* Static/Calculated visual SVG slices simulating proportions of types */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#00e1ff" strokeWidth="3.5" 
                          strokeDasharray="45 100" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.5" 
                          strokeDasharray="30 100" strokeDashoffset="-45" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="3.5" 
                          strokeDasharray="15 100" strokeDashoffset="-75" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.5" 
                          strokeDasharray="10 100" strokeDashoffset="-90" />
                      </svg>
                      <div className="absolute text-center bg-[#00090a] rounded-full w-24 h-24 flex flex-col items-center justify-center border border-white/5">
                        <span className="text-2xl font-black font-mono">{properties.length}</span>
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Holdings</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-6 text-xs font-mono">
                      <div className="flex items-center gap-1.5 justify-start text-gray-400">
                        <span className="w-2.5 h-2.5 bg-[#00e1ff] rounded-sm" />
                        <span>Villas ({statistics.countByType.Villa || 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-start text-gray-400">
                        <span className="w-2.5 h-2.5 bg-[#a855f7] rounded-sm" />
                        <span>Aparts ({statistics.countByType.Apartment || 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-start text-gray-400">
                        <span className="w-2.5 h-2.5 bg-[#22c55e] rounded-sm" />
                        <span>Duplex ({statistics.countByType.Duplex || 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-start text-gray-400">
                        <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-sm" />
                        <span>Comm ({statistics.countByType.Commercial || 0})</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB SUITE: 2. LISTINGS MANAGEMENT CRUDS */}
          {dashTab === 'listings' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Luxury Listings Portfolio
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Add new entries or purge existing inventory structures dynamically.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                  className="flex items-center gap-1.5 bg-primary hover:bg-[#00ffd5] text-secondary font-bold text-xs uppercase px-5 py-3 rounded-xl transition duration-200 cursor-pointer shadow-lg active:scale-95 text-center justify-center w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isAddFormOpen ? 'Close Listing Form' : 'Register New Luxury Listing'}</span>
                </button>
              </div>

              {/* COLLAPSIBLE ADD NEW LISTING FORM WORKSPACE */}
              {isAddFormOpen && (
                <div className="bg-[#010e11] border border-white/10 rounded-2xl p-6 mb-6 shadow-xl animate-fade-in-down">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#00ffd5] flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Listing Attribute Specifications
                    </h4>
                    <span className="text-[10px] font-mono text-gray-500">ESTABLISH DYNAMIC ID</span>
                  </div>

                  <form onSubmit={handleAddPropertySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Listing Title</label>
                        <input
                          type="text"
                          required
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          placeholder="e.g. Sapphire Horizon Mansion"
                          value={newProperty.title}
                          onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Category Type</label>
                        <select
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          value={newProperty.type}
                          onChange={(e) => setNewProperty({...newProperty, type: e.target.value as PropertyType})}
                        >
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Duplex">Duplex</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Physical Location</label>
                        <input
                          type="text"
                          required
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          placeholder="e.g. Fifth Avenue, Manhattan"
                          value={newProperty.location}
                          onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Price Valuation (USD)</label>
                        <input
                          type="number"
                          required
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          placeholder="e.g. 15750000"
                          value={newProperty.price}
                          onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Bedrooms Count</label>
                        <input
                          type="number"
                          required
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          placeholder="e.g. 5"
                          value={newProperty.bedrooms}
                          onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Bathrooms Count</label>
                        <input
                          type="number"
                          required
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          placeholder="e.g. 6"
                          value={newProperty.bathrooms}
                          onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Area Size (Sq Ft)</label>
                        <input
                          type="number"
                          required
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          placeholder="e.g. 8450"
                          value={newProperty.size}
                          onChange={(e) => setNewProperty({...newProperty, size: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">High-Res Hero Image URL</label>
                        <input
                          type="url"
                          required
                          className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={newProperty.image}
                          onChange={(e) => setNewProperty({...newProperty, image: e.target.value})}
                        />
                      </div>

                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1 font-semibold">Artistic Property Description</label>
                      <textarea
                        required
                        rows={3}
                        className="block w-full bg-[#00090a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary transition resize-none leading-relaxed"
                        placeholder="Define the exquisite aesthetic value, premium fittings, panoramic exposures, or investment advantages..."
                        value={newProperty.description}
                        onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddFormOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-xs uppercase font-mono border border-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                      >
                        Cancel Clear
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs uppercase font-bold bg-primary text-secondary hover:bg-[#00ffd5] transition duration-200 cursor-pointer shadow-md"
                      >
                        Verify & Commit Listing
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ACTIVE REAL ESTATE DATATABLE catalog */}
              <div className="bg-[#010e11] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-black/40 text-[10px] font-mono uppercase tracking-wider border-b border-white/5 text-gray-400">
                      <tr>
                        <th className="py-4 px-6">Bespoke Listing Model</th>
                        <th className="py-4 px-4">Location</th>
                        <th className="py-4 px-4 text-center">Type</th>
                        <th className="py-4 px-4 text-center">Specifications</th>
                        <th className="py-4 px-4 text-right">Corporate Price</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {properties.map((prop, idx) => (
                        <tr key={prop.id || idx} className="hover:bg-white/[0.02] transition duration-150">
                          
                          {/* Image + Title */}
                          <td className="py-4 px-6 flex items-center gap-3">
                            <img
                              src={prop.image}
                              alt={prop.title}
                              className="w-12 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate max-w-[170px]">
                              <span className="font-bold text-white block text-sm leading-snug">{prop.title}</span>
                              <span className="text-[10px] font-mono text-gray-500">{prop.id}</span>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-4 px-4 text-gray-300">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              <span className="truncate max-w-[140px]">{prop.location}</span>
                            </span>
                          </td>

                          {/* Type Tab */}
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block px-2.5 py-1 rounded bg-[#00e1ff]/10 text-[#00e1ff] font-mono text-[10px] uppercase font-semibold">
                              {prop.type}
                            </span>
                          </td>

                          {/* Spec details */}
                          <td className="py-4 px-4 text-center text-gray-400 font-sans">
                            <div className="flex items-center justify-center gap-2.5">
                              <span className="flex items-center gap-1" title={`${prop.bedrooms} Bedrooms`}><BedDouble className="h-3.5 w-3.5" />{prop.bedrooms}</span>
                              <span className="flex items-center gap-1" title={`${prop.bathrooms} Bathrooms`}><Bath className="h-3.5 w-3.5" />{prop.bathrooms}</span>
                              <span className="font-mono text-[11px]" title={`${prop.size} Sq Ft`}>{prop.size} SF</span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 text-right font-mono font-bold text-primary text-sm whitespace-nowrap">
                            ${prop.price.toLocaleString('en-US')}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you wish to permanently decommission "${prop.title}" from real-time sales directories?`)) {
                                  handleDeleteProperty(prop.id);
                                }
                              }}
                              className="p-2 bg-red-950/40 text-red-400 hover:text-white hover:bg-red-900/60 rounded-lg transition duration-200 border border-red-500/10 cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {properties.length === 0 && (
                  <div className="py-12 text-center text-gray-500 space-y-3">
                    <Building2 className="h-10 w-10 mx-auto text-gray-600 animate-pulse" />
                    <p className="text-sm font-medium">Core property catalog has no listings currently.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB SUITE: 3. INBOX LEADS INQUIRIES */}
          {dashTab === 'leads' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Bespoke Investor Connections
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Private view of qualified leads, view requests, and secure commentary submitted by wealthy buyers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localInquiries.map((liq, index) => (
                  <div 
                    key={liq.id || index}
                    className="bg-[#010e11] border border-white/5 rounded-2xl p-6 relative flex flex-col justify-between hover:border-white/10 transition-all duration-300"
                  >
                    <div>
                      {/* Name badge & creation date */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3 mb-4">
                        <div className="text-left">
                          <span className="text-[9px] font-mono tracking-widest text-[#00ffd5] uppercase font-bold">VIP Prospective Owner</span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{liq.name}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                          {liq.createdAt ? new Date(liq.createdAt).toLocaleString() : 'Recent Session'}
                        </span>
                      </div>

                      {/* Client credentials info */}
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-black/30 p-3 rounded-xl mb-4 text-left">
                        <div className="truncate">
                          <span className="text-[8px] text-gray-500 uppercase block font-semibold">Encrypted Email Address</span>
                          <a href={`mailto:${liq.email}`} className="text-primary hover:underline">{liq.email}</a>
                        </div>
                        <div className="truncate">
                          <span className="text-[8px] text-gray-500 uppercase block font-semibold">Phone Hotkey</span>
                          <a href={`tel:${liq.phone}`} className="text-gray-300 hover:text-white">{liq.phone || 'Not Shared'}</a>
                        </div>
                      </div>

                      {/* Associated asset reference */}
                      <div className="text-xs bg-white/5 rounded-xl px-3 py-2 border border-white/5 mb-4 inline-flex items-center gap-1.5 font-bold text-[#00ffd5]">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>Re Subject: {liq.propertyName || 'General Concierge Consultation'}</span>
                      </div>

                      {/* Actual user commentary */}
                      <p className="text-xs text-gray-300 leading-relaxed italic bg-[#00090a] p-4 rounded-xl border border-white/5 text-left mb-6">
                        "{liq.message}"
                      </p>
                    </div>

                    {/* Archive action button */}
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <span className="text-[8px] font-mono tracking-wider text-gray-600 uppercase">CLASSIFIED &bull; PROTOCOL 95</span>
                      <button
                        onClick={() => handleClearInquiry(liq.id)}
                        className="text-xs font-mono font-bold text-red-400 hover:text-white flex items-center gap-1 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/5 hover:border-red-500/20 transition cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Archive Client Lead</span>
                      </button>
                    </div>

                  </div>
                ))}

                {localInquiries.length === 0 && (
                  <div className="md:col-span-2 py-16 text-center text-gray-500 space-y-4">
                    <MessageSquare className="h-10 w-10 mx-auto text-gray-600 animate-pulse" />
                    <p className="text-sm font-semibold max-w-sm mx-auto">No communication logs gathered yet. Client submissions from public modals are indexed dynamically.</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
