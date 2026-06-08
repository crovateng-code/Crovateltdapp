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
  Eye, 
  LogOut, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Calendar,
  Layers
} from 'lucide-react';
import { Property, PropertyType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import CrovationLogo from './CrovationLogo';

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

  // Dashboard Active Tab & Sidebar State
  const [dashTab, setDashTab] = useState<'analytics' | 'listings' | 'leads'>('analytics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search/Filters inside listings
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | PropertyType>('All');

  // Property Create State & Form Toggle
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

  // Property Editing State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Local administrative credentials database
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
      setAuthError('Registration is locked. Crovation safety rules restrict this console to a single master administrator.');
      return;
    }

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setAuthError('All registration fields are mandatory.');
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
    setAuthSuccess('Administrative account registered successfully! Redirecting...');
    
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');

    setTimeout(() => {
      setAuthSuccess(null);
      setAuthTab('signin');
    }, 1800);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!signInName.trim() || !signInEmail.trim()) {
      setAuthError('Please input both your executive name and administrative email.');
      return;
    }

    // Default emergency fallback to allow quick testing
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
      setAuthSuccess('Credentials verified. Initiating secured executive system...');
      
      setSignInName('');
      setSignInEmail('');

      setTimeout(() => {
        setAuthSuccess(null);
        onNavigateSubView('dashboard');
      }, 900);
    } else {
      setAuthError('Access Denied: The provided parameters do not match our certified admin databases.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crovation_logged_in_admin');
    setLoggedInAdmin(null);
    onNavigateSubView('login');
  };

  // Delete inventory item
  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to retire this luxury listing? This action is irreversible.')) {
      return;
    }
    const filtered = properties.filter(p => p.id !== id);
    onPropertiesUpdated(filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('properties').delete().eq('id', id);
        console.log('Successfully deleted in cloud database.');
      } catch (e) {
        console.error('Supabase delete error:', e);
      }
    }
  };

  // Add new inventory item
  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, type, location, price, bedrooms, bathrooms, size, image, description } = newProperty;

    if (!title || !location || !price || !bedrooms || !bathrooms || !size || !image || !description) {
      alert('Kindly compile all specifications to complete the luxury file.');
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
      } catch (err) {
        console.error('Error syncing dynamic insertion to Supabase: ', err);
      }
    }
  };

  // Edit existing inventory item
  const handleEditPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    const { id, title, type, location, price, bedrooms, bathrooms, size, image, description } = editingProperty;

    if (!title || !location || !price || !bedrooms || !bathrooms || !size || !image || !description) {
      alert('All attributes must be valid and filled.');
      return;
    }

    const updatedCatalog = properties.map(p => p.id === id ? editingProperty : p);
    onPropertiesUpdated(updatedCatalog);
    setEditingProperty(null);

    // If Supabase is active, push updates
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('properties').update({
          title,
          type,
          location,
          price: parseFloat(price as any),
          bedrooms: parseInt(bedrooms as any),
          bathrooms: parseInt(bathrooms as any),
          size: parseInt(size as any),
          image,
          images: [image],
          description
        }).eq('id', id);
        console.log('Supabase real-time update completed.');
      } catch (err) {
        console.error('Failed to sync edit change to Supabase: ', err);
      }
    }
  };

  const handleClearInquiry = (id: string) => {
    if (!window.confirm('Delete this client registration lead?')) return;
    const updated = localInquiries.filter(liq => liq.id !== id);
    setLocalInquiries(updated);
    localStorage.setItem('crovation_local_inquiries', JSON.stringify(updated));
  };

  // Calculations for analytics metrics
  const statistics = useMemo(() => {
    const totalAssets = properties.reduce((accum, curr) => accum + curr.price, 0);
    const averagePrice = properties.length > 0 ? (totalAssets / properties.length) : 0;
    
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

  // Filter listings based on search metrics
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.type === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [properties, searchQuery, categoryFilter]);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 antialiased font-sans flex flex-col md:flex-row relative" id="admin-module-root">
      
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2472c8]/5 rounded-bl-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#02ceed]/5 rounded-tr-full blur-3xl pointer-events-none z-0" />

      {/* RENDER VIEW 1: PRESTIGIOUS LIGHT AUTHENTICATION BOX */}
      {activeSubView === 'login' && (
        <div className="w-full flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10" id="admin-auth-pane">
          
          <button 
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#2472c8] hover:text-slate-900 mb-8 group transition duration-200 focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform text-[#2472c8]" />
            <span>Return to Agency Portfolio</span>
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-2xl max-w-md w-full relative">
            <div className="absolute top-0 left-12 right-12 h-1.5 bg-gradient-to-r from-[#2472c8] to-[#02ceed] rounded-b-full shadow-sm" />
            
            {/* Identity badge */}
            <div className="flex flex-col items-center justify-center mb-8 text-center mt-2">
              <div className="mb-4">
                <CrovationLogo isDarkTheme={false} height={42} />
              </div>
              <div className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono tracking-widest uppercase font-bold mt-2">
                Executive Console Gate
              </div>
            </div>

            {/* Locked-In Signup / Signin Navigation tabs */}
            <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setAuthError(null);
                }}
                className={`text-xs uppercase font-extrabold tracking-widest py-3 rounded-xl transition duration-200 ${
                  authTab === 'signin' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
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
                className={`relative text-xs uppercase font-extrabold tracking-widest py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 ${
                  authTab === 'signup' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : isSingleAdminRegistered 
                      ? 'text-slate-300 line-through cursor-not-allowed' 
                      : 'text-slate-500 hover:text-slate-800'
                }`}
                disabled={authTab !== 'signup' && isSingleAdminRegistered}
              >
                <span>Register</span>
                {isSingleAdminRegistered && (
                  <span className="text-[8px] bg-slate-200/70 text-slate-500 px-1.5 py-0.5 rounded-md font-mono scale-90">
                    Locked
                  </span>
                )}
              </button>
            </div>

            {/* Validation Alerts */}
            {authError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5 mb-5 text-left leading-relaxed">
                <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5 mb-5 text-left leading-relaxed">
                <CheckCircle className="h-4.5 w-4.5 flex-shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* AUTH TAB CONTENT: SIGN IN */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4.5 text-left">
                {!isSingleAdminRegistered && (
                  <div className="bg-amber-50 border border-amber-100 text-amber-900 text-[10px] p-3 rounded-xl font-mono leading-relaxed mb-4">
                    NOTE: NO REGISTERED SECURITY PROTOCOLS FOUND yet. PLEASE GOTO the "REGISTER" TAB TO INITIATE MASTER SECURITY CONSOLE KEYS.
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold mb-1.5">
                    Authorized Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-[#2472c8] focus:ring-1 focus:ring-[#2472c8] text-xs transition duration-200"
                      placeholder="e.g. Master Agent"
                      value={signInName}
                      onChange={(e) => setSignInName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold mb-1.5">
                    Administrative Email Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-[#2472c8] focus:ring-1 focus:ring-[#2472c8] text-xs transition duration-200"
                      placeholder="e.g. admin@crovation.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1e293b] hover:bg-slate-900 text-white font-extrabold py-3.5 px-4 rounded-xl transition duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer mt-6 active:scale-[0.98]"
                >
                  <Unlock className="h-4.5 w-4.5 text-[#02ceed]" />
                  <span>Access Secure Workstation</span>
                </button>
              </form>
            )}

            {/* AUTH TAB CONTENT: REGISTER */}
            {authTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4.5 text-left">
                {isSingleAdminRegistered ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#2472c8] border border-slate-200">
                      <Lock className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      System Administrative Directory Locked
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans max-w-xs mx-auto">
                      Crovation Limited systems restrict administrative access panels strictly to a single registered master controller. An account is already registered.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAuthTab('signin')}
                      className="text-xs font-bold font-mono text-[#2472c8] hover:underline"
                    >
                      Authenticate credentials now →
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
                      Set up your credentials correctly. <strong className="text-[#2472c8]">Only a single master account can be active in secondary memory backup models.</strong>
                    </p>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-[#1e293b] uppercase font-bold mb-1.5">
                        Admin Official User Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required
                          className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-[#2472c8] text-xs"
                          placeholder="Your official designation"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-[#1e293b] uppercase font-bold mb-1.5">
                        Secure Electronic Mail
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          required
                          className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-[#2472c8] text-xs"
                          placeholder="broker@crovation.com"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-[#1e293b] uppercase font-bold mb-1.5">
                        Secret Security Word
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Key className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="password"
                          required
                          className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-[#2472c8] text-xs"
                          placeholder="••••••••••••••"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#2472c8] hover:bg-[#1d5fb0] text-white font-extrabold py-3.5 px-4 rounded-xl transition duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer mt-6 active:scale-[0.98]"
                    >
                      <CheckCircle className="h-4.5 w-4.5" />
                      <span>Lock Security Registry</span>
                    </button>
                  </>
                )}
              </form>
            )}

            <div className="mt-8 border-t border-slate-100 pt-4 text-center">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-medium">
                Crovation Security Framework v2.4
              </span>
            </div>

          </div>
        </div>
      )}

      {/* RENDER VIEW 2: SPLENDID & MODERN EXECUTIVE SIDEBAR + LIGHT CONTENT DASHBOARD */}
      {activeSubView === 'dashboard' && (
        <>
          {/* MOBILE RESPONSIVE NAV BAR (Visible only on mobile/tablet) */}
          <div className="md:hidden flex items-center justify-between w-full px-6 py-4 bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
            <CrovationLogo isDarkTheme={false} height={32} />
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition focus:outline-none"
              >
                <Layers className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* SIDEBAR CONTAINER: Collapsible vertical and highly elegant menu */}
          <aside 
            id="executive-sidebar"
            className={`bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out z-40 
              ${isSidebarCollapsed ? 'w-20 md:w-20' : 'w-64 md:w-64'}
              ${mobileMenuOpen ? 'fixed inset-y-0 left-0 translate-x-0 w-64' : 'hidden md:flex relative'}
            `}
          >
            <div>
              {/* BRAND HEADER & TOGGLE */}
              <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
                {!isSidebarCollapsed ? (
                  <div className="flex-shrink-0">
                    <CrovationLogo isDarkTheme={false} height={34} />
                  </div>
                ) : (
                  <div className="mx-auto flex items-center justify-center bg-slate-100/80 text-[#2472c8] w-10 h-10 rounded-xl font-black text-xs font-mono tracking-tighter border border-slate-200/40">
                    CV
                  </div>
                )}
                
                {/* Collapse trigger icon */}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden md:flex p-1.5 rounded-lg bg-slate-50 border border-slate-200/50 text-slate-400 hover:text-[#2472c8] hover:bg-slate-100 transition-all focus:outline-none cursor-pointer"
                  title={isSidebarCollapsed ? 'Expand menu' : 'Collapse menu'}
                >
                  {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>

                {/* Mobile close button drawer */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="md:hidden p-1 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-500 focus:outline-none"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* ADMIN ACCOUNT PRECISE INFOPATH */}
              <div className={`px-5 py-4 border-b border-slate-50 bg-slate-50/40 flex items-center gap-3 ${isSidebarCollapsed && 'justify-center'}`}>
                <div className="w-10 h-10 rounded-full bg-[#2472c8]/10 border border-[#2472c8]/25 text-[#2472c8] flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase shadow-sm">
                  {loggedInAdmin?.name?.charAt(0) || 'A'}
                </div>
                {!isSidebarCollapsed && (
                  <div className="text-left overflow-hidden">
                    <h5 className="text-xs font-extrabold text-slate-700 truncate capitalize">{loggedInAdmin?.name || 'Administrator'}</h5>
                    <span className="text-[9px] font-mono text-slate-400 block tracking-wider uppercase font-bold">MASTER BROKER</span>
                  </div>
                )}
              </div>

              {/* NAVIGATION MENU SCHEME */}
              <nav className="p-4 space-y-1.5">
                <button
                  onClick={() => {
                    setDashTab('analytics');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all duration-200 focus:outline-none group ${
                    dashTab === 'analytics' 
                      ? 'bg-[#2472c8]/10 text-[#2472c8] font-black border-l-4 border-[#2472c8]' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                  id="tab-btn-analytics"
                >
                  <LayoutDashboard className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${dashTab === 'analytics' ? 'text-[#2472c8]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!isSidebarCollapsed && <span className="tracking-wide">Asset Intelligence</span>}
                </button>

                <button
                  onClick={() => {
                    setDashTab('listings');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all duration-200 focus:outline-none group ${
                    dashTab === 'listings' 
                      ? 'bg-[#2472c8]/10 text-[#2472c8] font-black border-l-4 border-[#2472c8]' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                  id="tab-btn-listings"
                >
                  <Building2 className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${dashTab === 'listings' ? 'text-[#2472c8]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!isSidebarCollapsed && <span className="tracking-wide">Portfolio Catalog</span>}
                </button>

                <button
                  onClick={() => {
                    setDashTab('leads');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all duration-200 focus:outline-none group relative ${
                    dashTab === 'leads' 
                      ? 'bg-[#2472c8]/10 text-[#2472c8] font-black border-l-4 border-[#2472c8]' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                  id="tab-btn-leads"
                >
                  <MessageSquare className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${dashTab === 'leads' ? 'text-[#2472c8]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!isSidebarCollapsed && <span className="tracking-wide">Client Inquiries</span>}
                  {statistics.leadCount > 0 && (
                    <span className="absolute right-3.5 top-3.5 bg-[#e11d48] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full scale-90">
                      {statistics.leadCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* LOWER ACTIONS BUTTON BAR */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/20 space-y-1">
              <button
                onClick={onBackToSite}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none ${isSidebarCollapsed && 'justify-center'}`}
                title="Go back to the real estate catalog"
              >
                <Eye className="h-4 w-4 flex-shrink-0 text-[#2472c8]" />
                {!isSidebarCollapsed && <span>View Gallery Site</span>}
              </button>

              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-[11px] font-extrabold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors focus:outline-none ${isSidebarCollapsed && 'justify-center'}`}
                title="Sign out of the system"
              >
                <LogOut className="h-4 w-4 flex-shrink-0 text-rose-500" />
                {!isSidebarCollapsed && <span>Disconnect Console</span>}
              </button>
            </div>
          </aside>

          {/* ACTIVE CONTENT SHEET BODY */}
          <main className="flex-1 min-h-screen p-6 md:p-8 lg:p-10 relative z-10 flex flex-col justify-start overflow-x-hidden text-left bg-[#f8fafc]">
            
            {/* TOP BAR INFORMATION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-5 mb-8 gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#2472c8] uppercase block">SYSTEM OPERATIONS MODULE</span>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mt-0.5">
                  {dashTab === 'analytics' && "Asset Intelligence Center"}
                  {dashTab === 'listings' && "Luxury Portfolio Catalog"}
                  {dashTab === 'leads' && "Client Inquiries Vault"}
                </h1>
              </div>

              {/* Real-time sync badge */}
              <div className="flex items-center gap-3.5 bg-white border border-slate-200/80 py-2 px-4 rounded-xl shadow-sm w-fit self-end sm:self-auto">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-slate-600">Enterprise Core Node Active</span>
              </div>
            </div>

            {/* INTERACTIVE MODULE CONTENT PANEL */}
            
            {/* 1. ANALYTICS INTEL SHEET */}
            {dashTab === 'analytics' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* 4 Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Holdings value card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#2472c8]/5 rounded-bl-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Total Portfolio Assets</span>
                      <div className="p-2.5 bg-[#2472c8]/10 text-[#2472c8] rounded-xl">
                        <DollarSign className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black font-mono text-slate-800 mt-2">
                      ${(statistics.totalAssets / 1000000).toFixed(1)}M
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-mono mt-1 flex items-center gap-1.5 font-bold">
                      <TrendingUp className="h-3 w-3" />
                      <span>Live dynamic pricing evaluation</span>
                    </p>
                  </div>

                  {/* Median Pricing card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#02ceed]/5 rounded-bl-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Average Listing Unit</span>
                      <div className="p-2.5 bg-[#02ceed]/15 text-[#02ceed] rounded-xl">
                        <TrendingUp className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black font-mono text-slate-800 mt-2">
                      ${(statistics.averagePrice / 1000000).toFixed(2)}M
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Median value across properties
                    </p>
                  </div>

                  {/* Portfolio Count card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Active Listings</span>
                      <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black font-mono text-slate-800 mt-2">
                      {statistics.propertyCount} listings
                    </h3>
                    <p className="text-[10px] text-indigo-600 font-bold mt-1 font-sans">
                      {statistics.countByType.Villa || 0} Villas &bull; {statistics.countByType.Apartment || 0} Apts
                    </p>
                  </div>

                  {/* Secured state card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Client Inquiries Inbox</span>
                      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                        <MessageSquare className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black font-mono text-slate-800 mt-2">
                      {statistics.leadCount} registered
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">
                      Clients waiting response
                    </p>
                  </div>

                </div>

                {/* Performance analytics & charts block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Price allocation bars (simulating precise analytics) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-700 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#2472c8]" />
                        Holding Value Distributions
                      </h3>
                      <span className="text-[9px] font-mono text-slate-400 font-bold">PROPORTIONAL SCALE</span>
                    </div>

                    <div className="space-y-4 pt-1">
                      {properties.length === 0 ? (
                        <div className="text-xs text-slate-400 py-6 text-center">No properties on catalog to graph.</div>
                      ) : (
                        properties.slice(0, 7).map((prop, index) => {
                          const maxPrice = Math.max(...properties.map(p => p.price));
                          const ratio = prop.price / maxPrice;
                          return (
                            <div key={prop.id || index} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-700 truncate pr-4 max-w-xs">{prop.title}</span>
                                <span className="font-mono font-bold text-[#2472c8]">${(prop.price / 1000000).toFixed(2)}M</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40">
                                <div 
                                  className="bg-gradient-to-r from-[#2472c8] to-[#02ceed] h-full rounded-full transition-all duration-1000"
                                  style={{ width: `${ratio * 100}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Allocation by Type segment chart layout */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-extrabold tracking-wider uppercase text-slate-700">
                          Segment Percentiles
                        </h3>
                        <span className="text-[9px] font-mono text-slate-400 font-bold col">COMPOSITE RATIO</span>
                      </div>

                      <div className="flex flex-col items-center justify-center py-3">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2472c8" strokeWidth="4.5" 
                              strokeDasharray="50 100" strokeDashoffset="0" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#02ceed" strokeWidth="4.5" 
                              strokeDasharray="25 100" strokeDashoffset="-50" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="4.5" 
                              strokeDasharray="15 100" strokeDashoffset="-75" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.5" 
                              strokeDasharray="10 100" strokeDashoffset="-90" />
                          </svg>
                          <div className="absolute text-center bg-white rounded-full w-20 h-20 flex flex-col items-center justify-center border border-slate-100 shadow-inner">
                            <span className="text-2xl font-black font-mono text-slate-800">{properties.length}</span>
                            <span className="text-[8px] text-slate-400 uppercase tracking-widest font-extrabold">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 w-full mt-4 text-[10px] font-mono border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-1.5 justify-start text-slate-600">
                        <span className="w-2.5 h-2.5 bg-[#2472c8] rounded-sm" />
                        <span>Villas ({statistics.countByType.Villa || 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-start text-slate-600">
                        <span className="w-2.5 h-2.5 bg-[#02ceed] rounded-sm" />
                        <span>Aparts ({statistics.countByType.Apartment || 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-start text-slate-600">
                        <span className="w-2.5 h-2.5 bg-[#6366f1] rounded-sm" />
                        <span>Duplex ({statistics.countByType.Duplex || 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-start text-slate-600">
                        <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-sm" />
                        <span>Commer ({statistics.countByType.Commercial || 0})</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* 2. CATALOG PORTFOLIO CRUD LISTS */}
            {dashTab === 'listings' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                {/* Search, Filter Category bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  
                  {/* Left Filters */}
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 flex-1 max-w-2xl">
                    <div className="relative w-full sm:w-72">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search className="h-4 w-4" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search title, location or type..."
                        className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl text-xs transition duration-200 focus:outline-none focus:border-[#2472c8] focus:bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 uppercase select-none">Category:</span>
                      <select
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#2472c8] transition"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                      >
                        <option value="All">All Categories</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions right Button */}
                  <button
                    onClick={() => {
                      setEditingProperty(null); // Cancel edit when opening insert form
                      setIsAddFormOpen(!isAddFormOpen);
                    }}
                    className="flex items-center justify-center gap-2 bg-[#2472c8] hover:bg-[#1d5fb0] text-white font-extrabold text-xs uppercase px-5 py-3.5 rounded-xl transition duration-200 cursor-pointer shadow-md select-none active:scale-95"
                  >
                    <Plus className="h-4 w-4 text-white" />
                    <span>{isAddFormOpen ? 'Close Listing Form' : 'Register New Asset'}</span>
                  </button>

                </div>

                {/* ADD NEW REAL ESTATE FILE PANEL */}
                {isAddFormOpen && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md animate-fade-in-down">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                      <h3 className="text-xs font-black uppercase text-slate-700 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#2472c8]" />
                        Compile New Asset Specifications
                      </h3>
                      <button 
                        onClick={() => setIsAddFormOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition focus:outline-none"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddPropertySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Listing Title</label>
                          <input
                            type="text"
                            required
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
                            placeholder="e.g. Zenith Serenity Villa"
                            value={newProperty.title}
                            onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Category Type</label>
                          <select
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
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
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Physical Location</label>
                          <input
                            type="text"
                            required
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
                            placeholder="e.g. Ikoyi, Lagos"
                            value={newProperty.location}
                            onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Price Valuation (USD)</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
                            placeholder="e.g. 5200000"
                            value={newProperty.price}
                            onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Bedrooms</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
                            placeholder="e.g. 5"
                            value={newProperty.bedrooms}
                            onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Bathrooms</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
                            placeholder="e.g. 6"
                            value={newProperty.bathrooms}
                            onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Floor Size (SQM)</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
                            placeholder="e.g. 850"
                            value={newProperty.size}
                            onChange={(e) => setNewProperty({...newProperty, size: e.target.value})}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Image URL Anchor</label>
                          <input
                            type="url"
                            required
                            className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition"
                            placeholder="e.g. https://images.unsplash.com/photo-..."
                            value={newProperty.image}
                            onChange={(e) => setNewProperty({...newProperty, image: e.target.value})}
                          />
                        </div>

                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Narrative Description</label>
                        <textarea
                          required
                          rows={3}
                          className="block w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition resize-none"
                          placeholder="Provide a glamorous editorial pitch of the architectural landmark..."
                          value={newProperty.description}
                          onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center gap-3 justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => setIsAddFormOpen(false)}
                          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#2472c8] hover:bg-[#1d5fb0] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Publish Premium Asset
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* EDITING COMPONENT SHEET WORKSPACE (Highly requested edit capabilities) */}
                {editingProperty && (
                  <div className="bg-[#f0f9ff]/70 border border-sky-200 text-slate-800 rounded-2xl p-6 shadow-md animate-fade-in-down">
                    <div className="flex items-center justify-between border-b border-sky-100 pb-3.5 mb-4">
                      <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                        <Pencil className="h-4.5 w-4.5 text-[#2472c8]" />
                        Modify Asset Registry File: <span className="text-[#2472c8]">{editingProperty.title}</span>
                      </h3>
                      <button 
                        onClick={() => setEditingProperty(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition focus:outline-none"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <form onSubmit={handleEditPropertySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Listing Title</label>
                          <input
                            type="text"
                            required
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.title}
                            onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Category Type</label>
                          <select
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.type}
                            onChange={(e) => setEditingProperty({...editingProperty, type: e.target.value as PropertyType})}
                          >
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Duplex">Duplex</option>
                            <option value="Commercial">Commercial</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Physical Location</label>
                          <input
                            type="text"
                            required
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.location}
                            onChange={(e) => setEditingProperty({...editingProperty, location: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Price Valuation ($)</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.price}
                            onChange={(e) => setEditingProperty({...editingProperty, price: parseFloat(e.target.value) || 0})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Bedrooms Count</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.bedrooms}
                            onChange={(e) => setEditingProperty({...editingProperty, bedrooms: parseInt(e.target.value) || 0})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Bathrooms Count</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.bathrooms}
                            onChange={(e) => setEditingProperty({...editingProperty, bathrooms: parseInt(e.target.value) || 0})}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Floor Size (SQM)</label>
                          <input
                            type="number"
                            required
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.size}
                            onChange={(e) => setEditingProperty({...editingProperty, size: parseInt(e.target.value) || 0})}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Primary Image URL</label>
                          <input
                            type="url"
                            required
                            className="block w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition shadow-sm"
                            value={editingProperty.image}
                            onChange={(e) => setEditingProperty({...editingProperty, image: e.target.value})}
                          />
                        </div>

                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Narrative Pitch Description</label>
                        <textarea
                          required
                          rows={3}
                          className="block w-full bg-white border border-sky-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-[#2472c8] transition resize-none shadow-sm"
                          value={editingProperty.description}
                          onChange={(e) => setEditingProperty({...editingProperty, description: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center gap-3 justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingProperty(null)}
                          className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow"
                        >
                          Save Changes
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* LUXURY PORTFOLIO DATATABLE */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[10px] font-mono tracking-widest uppercase text-slate-400 font-bold select-none">
                          <th className="py-4.5 px-6">Landmark Asset</th>
                          <th className="py-4.5 px-6">Classification</th>
                          <th className="py-4.5 px-6">Geography</th>
                          <th className="py-4.5 px-6">Financial Appraisal</th>
                          <th className="py-4.5 px-6">Specs</th>
                          <th className="py-4.5 px-6 text-right">Console Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredProperties.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                              No high-value assets matching search criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredProperties.map((prop, idx) => (
                            <tr key={prop.id || idx} className="hover:bg-slate-50/50 transition">
                              
                              {/* Title / Name */}
                              <td className="py-4 px-6 font-bold text-slate-800">
                                <div className="flex items-center gap-3.5">
                                  <img 
                                    src={prop.image} 
                                    alt="" 
                                    className="w-11 h-11 object-cover rounded-xl border border-slate-200 shadow-sm"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="truncate max-w-[180px]">
                                    <span className="block font-sans font-bold text-slate-800">{prop.title}</span>
                                    <span className="text-[10px] text-slate-400 font-mono tracking-wide">{prop.id}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Classification type */}
                              <td className="py-4 px-6 text-slate-700">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  prop.type === 'Villa' 
                                    ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                    : prop.type === 'Apartment' 
                                      ? 'bg-[#2472c8]/5 text-[#2472c8] border border-[#2472c8]/10' 
                                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                }`}>
                                  {prop.type}
                                </span>
                              </td>

                              {/* Location */}
                              <td className="py-4 px-6 text-slate-500 font-medium truncate max-w-[140px]">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{prop.location}</span>
                                </div>
                              </td>

                              {/* Price */}
                              <td className="py-4 px-6 font-mono font-bold text-slate-800">
                                ${(prop.price).toLocaleString()} USD
                              </td>

                              {/* Specs */}
                              <td className="py-4 px-6 text-slate-500">
                                <div className="flex items-center gap-3 font-mono text-[10px]">
                                  <span className="flex items-center gap-0.5"><BedDouble className="h-3 w-3" /> {prop.bedrooms}</span>
                                  <span className="flex items-center gap-0.5"><Bath className="h-3 w-3" /> {prop.bathrooms}</span>
                                  <span className="flex items-center gap-0.5"><Maximize2 className="h-3 w-3" /> {prop.size}㎡</span>
                                </div>
                              </td>

                              {/* Actions buttons */}
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button
                                    onClick={() => {
                                      setEditingProperty(prop);
                                      setIsAddFormOpen(false); // Close dynamic insertion form on edit
                                      window.scrollTo({ top: 120, behavior: 'smooth' });
                                    }}
                                    className="p-2 bg-slate-50 hover:bg-[#2472c8]/10 border border-slate-200/60 hover:border-[#2472c8]/20 rounded-xl text-slate-500 hover:text-[#2472c8] transition"
                                    title="Edit specifications file"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteProperty(prop.id)}
                                    className="p-2 bg-slate-50 hover:bg-rose-100 border border-slate-200/60 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition"
                                    title="Retire listing"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer bar */}
                  <div className="bg-slate-50/70 border-t border-slate-200/60 p-4.5 flex items-center justify-between text-xs text-slate-500 font-sans font-medium">
                    <span>Showing <b>{filteredProperties.length}</b> of <b>{properties.length}</b> catalog entries</span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">CROVATION LIMITED REALTY WORKSPACE</span>
                  </div>

                </div>

              </div>
            )}

            {/* 3. CLIENT COMMUNICATIONS LEADS INBOX */}
            {dashTab === 'leads' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-slate-700">Recent Web inquiries</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Live connection request leads entered via list request/view modals on private agency portals.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-[#2472c8]/10 border border-[#2472c8]/20 rounded-xl text-xs font-bold text-[#2472c8] font-mono">
                    {localInquiries.length} LEADS TOTAL
                  </div>
                </div>

                {localInquiries.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 font-sans">
                    <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs font-semibold">Leads database currently silent.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {localInquiries.map((liq, index) => (
                      <div key={liq.id || index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#2472c8]/5 rounded-bl-full pointer-events-none" />
                        
                        <div>
                          {/* Client badge and card header */}
                          <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4.5">
                            <div className="text-left">
                              <h4 className="text-sm font-extrabold text-slate-800">{liq.name}</h4>
                              <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5 uppercase font-bold">CLIENT DESIGNATION</p>
                            </div>
                            <button
                              onClick={() => handleClearInquiry(liq.id)}
                              className="p-1 px-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 text-[10px] font-bold text-slate-400 hover:text-rose-600 transition"
                              title="Purge lead file"
                            >
                              Purge Lead
                            </button>
                          </div>

                          {/* Connection specifications (Email/Phone) */}
                          <div className="space-y-2 mt-2 text-xs text-slate-600 mb-4 font-sans font-medium">
                            <div className="flex items-center gap-2.5">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <a href={`mailto:${liq.email}`} className="hover:text-[#2472c8] transition">{liq.email}</a>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Mail className="h-4 w-4 text-slate-400 opacity-0" />
                              <span className="text-slate-400">Phone: </span>
                              <span className="text-slate-700 font-semibold">{liq.phone || '+44 Private'}</span>
                            </div>
                            {liq.propertyName && (
                              <div className="flex items-center gap-2.5">
                                <Building2 className="h-4 w-4 text-[#2472c8]/70" />
                                <span className="text-slate-400">Inquiry Context: </span>
                                <span className="text-[#2472c8] font-bold">{liq.propertyName}</span>
                              </div>
                            )}
                          </div>

                          {/* Message bubble */}
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 text-xs text-slate-700 leading-relaxed text-left font-medium">
                            "{liq.message}"
                          </div>
                        </div>

                        {/* Timestamp card footer */}
                        <div className="flex items-center gap-1.5 mt-5 text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-3.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-300" />
                          <span>REGISTERED SYSTEM TIME: {new Date(liq.createdAt || liq.created_at).toLocaleString()}</span>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </main>
        </>
      )}

    </div>
  );
}
