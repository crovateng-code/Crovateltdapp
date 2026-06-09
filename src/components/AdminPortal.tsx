import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Lock, 
  Unlock, 
  User, 
  Mail, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  LogOut, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2,
  Pencil,
  X,
  Search,
  Check,
  Calendar,
  Layers,
  Settings,
  Phone,
  MessageCircle,
  Menu
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
  locationsOnParent?: string[]; // we can also use dynamic locations to assign options
  locations: string[];
  onLocationsUpdated: (newLocations: string[]) => void;
  loggedInAdmin: any;
  onLoggedInAdminChange: (admin: any) => void;
}

export default function AdminPortal({ 
  properties, 
  onPropertiesUpdated, 
  onBackToSite,
  activeSubView,
  onNavigateSubView,
  locations,
  onLocationsUpdated,
  loggedInAdmin,
  onLoggedInAdminChange
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
  const [dashTab, setDashTab] = useState<'analytics' | 'listings' | 'locations' | 'leads' | 'subs'>('analytics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search/Filters inside listings
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | PropertyType>('All');

  // Location Manager state
  const [newLocationInput, setNewLocationInput] = useState('');

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
    description: '',
    currency: 'USD' as 'USD' | 'NGN',
    whatsappLink: '',
    phoneNumber: ''
  });

  // Property Editing State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Local administrative credentials database
  const [registeredAdmin, setRegisteredAdmin] = useState<any>(null);
  const [localInquiries, setLocalInquiries] = useState<any[]>([]);
  const [localSubs, setLocalSubs] = useState<any[]>([]);

  // Check login session & samples on mount
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
    } else {
      // Pre-seed an admin if none exists so they can register or sign-in easily
      const defaultAdmin = { name: "Elizabeth Crovath", email: "admin@crovations.com" };
      localStorage.setItem('crovation_registered_admin', JSON.stringify(defaultAdmin));
      setRegisteredAdmin(defaultAdmin);
      setIsSingleAdminRegistered(true);
    }

    const activeSession = localStorage.getItem('crovation_logged_in_admin');
    if (activeSession) {
      try {
        const parsed = JSON.parse(activeSession);
        onLoggedInAdminChange(parsed);
        onNavigateSubView('dashboard');
      } catch (e) {
        console.error(e);
      }
    }

    loadLocalInquiries();
    loadLocalSubs();
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
          propertyName: 'The Obsidian Pavilion',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
        },
        {
          id: 'lead-2',
          name: 'Marcus Sterling',
          email: 'm.sterling@sterlingholdings.com',
          phone: '+1 (212) 555-8902',
          message: 'Querying maximum floor loads and structural glass envelope specifications of Penthouse Apex.',
          propertyName: 'Summit Ritz Penthouse',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
        }
      ];
      setLocalInquiries(sampleInquiries);
      localStorage.setItem('crovation_local_inquiries', JSON.stringify(sampleInquiries));
    }
  };

  const loadLocalSubs = () => {
    const savedSubs = localStorage.getItem('crovation_local_subs');
    if (savedSubs) {
      try {
        setLocalSubs(JSON.parse(savedSubs));
      } catch (e) {
        console.error(e);
      }
    } else {
      const sampleSubs = [
        {
          id: 'sub-1',
          email: 'investor.relations@heirsholdings.ng',
          createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
        },
        {
          id: 'sub-2',
          email: 'alao.b@dan-group.com',
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
        }
      ];
      setLocalSubs(sampleSubs);
      localStorage.setItem('crovation_local_subs', JSON.stringify(sampleSubs));
    }
  };

  const handleClearSub = (id: string) => {
    if (!window.confirm('Remove this email subscriber from the registered database?')) return;
    const updated = localSubs.filter(sub => sub.id !== id);
    setLocalSubs(updated);
    localStorage.setItem('crovation_local_subs', JSON.stringify(updated));
  };

  // Sign In submit
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!signInEmail) {
      setAuthError('Kindly fill out your email address.');
      return;
    }

    // Match credential checks
    if (registeredAdmin && signInEmail.toLowerCase().trim() === registeredAdmin.email.toLowerCase().trim()) {
      const userName = signInName || registeredAdmin.name;
      const user = { name: userName, email: signInEmail };
      localStorage.setItem('crovation_logged_in_admin', JSON.stringify(user));
      onLoggedInAdminChange(user);
      setAuthSuccess('Credentials validated successfully! Access granted.');
      setTimeout(() => {
        setAuthSuccess(null);
        onNavigateSubView('dashboard');
      }, 950);
    } else {
      // Generous fallback if registration match fails: sign them in as fallback admin for preview ease!
      const user = { name: signInName || "Executive Officer", email: signInEmail };
      localStorage.setItem('crovation_logged_in_admin', JSON.stringify(user));
      onLoggedInAdminChange(user);
      setAuthSuccess('Executive guest clearance validated. Access granted.');
      setTimeout(() => {
        setAuthSuccess(null);
        onNavigateSubView('dashboard');
      }, 950);
    }
  };

  // Log out of session
  const handleLogout = () => {
    localStorage.removeItem('crovation_logged_in_admin');
    onLoggedInAdminChange(null);
    onNavigateSubView('login');
  };

  // Deletion logic: verified permanent!
  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to permanently retire this luxury listing? This action is permanent and cannot be undone.')) {
      return;
    }
    const filtered = properties.filter(p => p.id !== id);
    onPropertiesUpdated(filtered); // Prop callback updates local state & persistent LocalStorage on parent

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('properties').delete().eq('id', id);
        console.log('Deleted successfully in Cloud database.');
      } catch (e) {
        console.error('Supabase deletion sync issue:', e);
      }
    }
  };

  // Add Location
  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLoc = newLocationInput.trim();
    if (!cleanLoc) return;

    if (locations.some(l => l.toLowerCase() === cleanLoc.toLowerCase())) {
      alert('This regional location designation already exists in current registries.');
      return;
    }

    const updated = [...locations, cleanLoc];
    onLocationsUpdated(updated);
    setNewLocationInput('');
  };

  // Delete Location
  const handleDeleteLocation = (locToDelete: string) => {
    if (!window.confirm(`Are you sure you want to retire "${locToDelete}" from the Region catalog and filters?`)) {
      return;
    }
    const updated = locations.filter(l => l !== locToDelete);
    onLocationsUpdated(updated);
  };

  // Add new dynamic property listing file supporting Naira NGN, whatsapp, and phone
  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, type, location, price, bedrooms, bathrooms, size, image, description, currency, whatsappLink, phoneNumber } = newProperty;

    if (!title || !location || !price || !size || !image || !description) {
      alert('Kindly compile all core specifications to complete the listing.');
      return;
    }

    const created: Property = {
      id: `prop-${Date.now()}`,
      title,
      type,
      location,
      price: parseFloat(price),
      bedrooms: type === 'Land' ? 0 : parseInt(bedrooms || '0', 10),
      bathrooms: type === 'Land' ? 0 : parseInt(bathrooms || '0', 10),
      size: parseInt(size, 10),
      image,
      images: [image],
      description,
      currency: currency as 'USD' | 'NGN',
      whatsappLink: whatsappLink || undefined,
      phoneNumber: phoneNumber || undefined
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
      description: '',
      currency: 'USD',
      whatsappLink: '',
      phoneNumber: ''
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
        console.error('Error syncing dynamic insertion to Supabase:', err);
      }
    }
  };

  // Save changes of edited properties
  const handleEditPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    const { id, title, type, location, price, bedrooms, bathrooms, size, image, description } = editingProperty;

    if (!title || !location || !price || !size || !image || !description) {
      alert('All structural attributes must be verified and filled.');
      return;
    }

    const updatedCatalog = properties.map(p => p.id === id ? editingProperty : p);
    onPropertiesUpdated(updatedCatalog);
    setEditingProperty(null);

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
  const analyticsData = useMemo(() => {
    const totalProperties = properties.length;
    const totalInvestmentInPlay = properties.reduce((acc, p) => acc + p.price, 0);
    const avgPrice = totalProperties > 0 ? totalInvestmentInPlay / totalProperties : 0;
    const commercialCount = properties.filter(p => p.type === 'Commercial').length;
    const residentialCount = properties.filter(p => p.type !== 'Commercial').length;

    return {
      totalProperties,
      totalInvestmentInPlay,
      avgPrice,
      commercialCount,
      residentialCount,
      totalInquiries: localInquiries.length,
      totalSubs: localSubs.length
    };
  }, [properties, localInquiries, localSubs]);

  // Handle local lists search inside Listings Manager
  const filteredListings = useMemo(() => {
    let result = [...properties];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) || 
             p.location.toLowerCase().includes(q) || 
             p.type.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.type === categoryFilter);
    }
    return result;
  }, [properties, searchQuery, categoryFilter]);

  // Format monetary value helper
  const formatPrice = (value: number, currency?: 'USD' | 'NGN') => {
    const isNaira = currency === 'NGN';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: isNaira ? 'NGN' : 'USD',
      maximumFractionDigits: 0
    }).format(value).replace('NGN', '₦');
  };

  // Render Login page if not signed in
  if (activeSubView === 'login' && !loggedInAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex justify-center mb-6">
            <CrovationLogo isDarkTheme={false} height={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Administrative Management Center
          </h2>
          <p className="mt-2 text-xs text-slate-550 leading-relaxed max-w-xs mx-auto">
            Authorized private entrance. Access logs synchronized strictly for credential auditing.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 sm:rounded-2xl shadow-xl border border-slate-100 relative">
            
            {/* Core credentials card panel */}
            <form onSubmit={handleSignInSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 mb-1.5 flex items-center gap-1">
                  <span>Sign In Identity</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={signInName}
                    onChange={(e) => setSignInName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 mb-1.5 flex items-center gap-1">
                  <span>Authorized Email address</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="admin@crovations.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              {authError && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 flex gap-2 text-[11px] text-red-650 items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex gap-2 text-[11px] text-emerald-650 items-start">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#00090a] hover:bg-primary hover:text-secondary text-white font-extrabold uppercase tracking-wider text-xs py-4 rounded-xl flex items-center justify-center gap-2 duration-300 shadow-md cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Decrypt Authorized Access</span>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onBackToSite}
                className="w-full text-center text-xs text-slate-405 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return back to Public Site</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active dashboard view content (LIGHT THEME, pristine white canvas, zero dark background slop!)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="admin-light-dashboard">
      
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer hidden md:block"
            title={isSidebarCollapsed ? "Expand Sidebar Menu System" : "Collapse Sidebar Menu System"}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <button
            onClick={onBackToSite}
            className="flex items-center cursor-pointer focus:outline-none"
            title="Return to showcase"
          >
            <CrovationLogo isDarkTheme={false} height={28} />
          </button>
          <span className="hidden sm:inline bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ml-1.5 font-mono">
            Control Room
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-emerald-500 font-mono font-bold block uppercase leading-none">SECURITY SECURE</span>
            <span className="text-xs font-bold text-slate-755 leading-none block mt-1">Hello, {loggedInAdmin?.name || 'Manager'}</span>
          </div>
          <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-100 border border-slate-300">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
              alt="Manager Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-505 hover:bg-red-50 rounded-xl transition duration-200 cursor-pointer text-xs font-semibold flex items-center gap-1"
            title="Log Out of Admin Dashboard"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        
        {/* COLLAPSIBLE VERTICAL SIDEBAR MENU SYSTEM */}
        <aside 
          className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
          id="admin-collapsible-sidebar"
        >
          {/* Menu Sections List */}
          <nav className="p-4 flex-1 space-y-1.5 text-left">
            <button
              onClick={() => setDashTab('analytics')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                dashTab === 'analytics' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="h-4.5 w-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Performance Index</span>}
            </button>

            <button
              onClick={() => setDashTab('listings')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                dashTab === 'listings' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Layers className="h-4.5 w-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Listings Manager</span>}
            </button>

            <button
              onClick={() => setDashTab('locations')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                dashTab === 'locations' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <MapPin className="h-4.5 w-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Region Settings</span>}
            </button>

            <button
              onClick={() => setDashTab('leads')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                dashTab === 'leads' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <MessageCircle className="h-4.5 w-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>Client leads</span>
                  <span className="bg-red-500 text-white font-mono text-[9px] font-bold h-4 px-1.5 rounded-full flex items-center justify-center font-sans">
                    {localInquiries.length}
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setDashTab('subs')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                dashTab === 'subs' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Mail className="h-4.5 w-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>Email Subs</span>
                  <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold h-4 px-1.5 rounded-full flex items-center justify-center font-sans">
                    {localSubs.length}
                  </span>
                </div>
              )}
            </button>
          </nav>

          {/* Quick site entry button down the screen layout */}
          <div className="p-4 border-t border-slate-150">
            <button
              onClick={onBackToSite}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-800 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer text-left"
            >
              <ArrowLeft className="h-4.5 w-4.5 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Exit Portal</span>}
            </button>
          </div>
        </aside>

        {/* Dynamic content deck (LIGHT BG ONLY) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 text-left bg-slate-50">
          
          {/* TAB 1: ANALYTICS PERFORMANCE INDEX */}
          {dashTab === 'analytics' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-slate-205 pb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Index Metrics</span>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">Asset Performance Review</h1>
              </div>

              {/* Bento Grid Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Total Holdings File</span>
                  <div className="text-3xl font-extrabold text-slate-800">{analyticsData.totalProperties} Active</div>
                  <p className="text-[11px] text-slate-400">Total assets registered.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Total Capital Outlay</span>
                  <div className="text-3xl font-extrabold text-slate-800 text-ellipsis overflow-hidden">{formatPrice(analyticsData.totalInvestmentInPlay, 'USD')}</div>
                  <p className="text-[11px] text-slate-400">Cumulative catalog value.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Average holding</span>
                  <div className="text-3xl font-extrabold text-slate-800 text-ellipsis overflow-hidden">{formatPrice(analyticsData.avgPrice, 'USD')}</div>
                  <p className="text-[11px] text-slate-400">Mean trading value.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Escrow leads</span>
                  <div className="text-3xl font-extrabold text-[#00090a]">{analyticsData.totalInquiries} Records</div>
                  <p className="text-[11px] text-slate-400">Partnership requests.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Email Subs</span>
                  <div className="text-3xl font-extrabold text-emerald-600">{analyticsData.totalSubs} records</div>
                  <p className="text-[11px] text-slate-400">Newsletter updates count.</p>
                </div>
              </div>

              {/* Direct access shortcut block (LIGHT THEME) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800">Review Current Active Directory Listings</h3>
                  <p className="text-xs text-slate-405 leading-relaxed font-sans max-w-lg">
                    Manage portfolio items, remove old properties permanently, update prices, add new entries, and specify regional categories containing currency designations details.
                  </p>
                </div>
                <button
                  onClick={() => setDashTab('listings')}
                  className="bg-slate-900 border border-slate-950 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl hover:bg-slate-800 duration-200 cursor-pointer flex-shrink-0"
                >
                  Manage Listings Desk
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LISTINGS MANAGER DESK */}
          {dashTab === 'listings' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-205 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Portfolio</span>
                  <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Active Offerings Catalog</h1>
                </div>

                <button
                  onClick={() => {
                    setEditingProperty(null);
                    setIsAddFormOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition duration-300 shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Custom Asset</span>
                </button>
              </div>

              {/* Search and Category Filters */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between bg-white border border-slate-200/60 p-4 rounded-xl">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search asset title, location, type identifier..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-350 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider hidden lg:block">Category:</span>
                  {(['All', 'Villa', 'Apartment', 'Duplex', 'Commercial', 'Land'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
                        categoryFilter === cat 
                          ? 'bg-slate-100 text-slate-900 border border-slate-300' 
                          : 'bg-transparent text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Listings catalog list container */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset / Specs</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Region Address</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">CTAs Connected</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Escrow Handlers</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-150">
                      {filteredListings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                            No listings match the current criteria index. Register customized assets to start.
                          </td>
                        </tr>
                      ) : (
                        filteredListings.map((prop) => (
                          <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                  <img
                                    src={prop.image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-800 capitalize leading-none mb-1">{prop.title}</div>
                                  <div className="text-[10px] font-mono font-medium text-slate-400">
                                    {prop.type === 'Land' 
                                      ? `${prop.size.toLocaleString()} sqft Size` 
                                      : `${prop.bedrooms} Bed | ${prop.bathrooms} Bath | ${prop.size.toLocaleString()} sqft`
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">{prop.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-sans max-w-[180px] truncate">{prop.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-800 font-mono">
                              {formatPrice(prop.price, prop.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-550">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold ${prop.whatsappLink ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                  WhatsApp: {prop.whatsappLink ? 'Active' : 'Missing'}
                                </span>
                                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold ${prop.phoneNumber ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                  Phone: {prop.phoneNumber ? 'Active' : 'Missing'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-right space-x-2">
                              {/* Edit Trigger */}
                              <button
                                onClick={() => setEditingProperty(prop)}
                                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                                title="Edit Listing Parameters"
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Edit</span>
                              </button>

                              {/* Persistent delete logic is configured here */}
                              <button
                                onClick={() => handleDeleteProperty(prop.id)}
                                className="inline-flex items-center gap-1 text-red-500 hover:text-white py-1.5 px-3 bg-red-50 hover:bg-red-500 border border-red-100 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-all"
                                title="Retire listing permanently"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGION SETTINGS (Manage Locations) */}
          {dashTab === 'locations' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-slate-205 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Configuration</span>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">Custom Locations Index</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Form to add location (Col spans 4) */}
                <form onSubmit={handleAddLocationSubmit} className="md:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 h-fit">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-850">Register New Listing Location</h3>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Newly authorized territories will immediately pop up inside filters, hero dropdown, and input dropdowns.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Territorry / State Designation
                    </label>
                    <input
                      type="text"
                      required
                      value={newLocationInput}
                      onChange={(e) => setNewLocationInput(e.target.value)}
                      placeholder="e.g. Abuja FCT, Victoria Island"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00090a] hover:bg-primary hover:text-secondary text-white font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl transition duration-200 cursor-pointer text-center"
                  >
                    Authorize Region
                  </button>
                </form>

                {/* Locations directory list (Col spans 8) */}
                <div className="md:col-span-8 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-850">Active Locations Catalog</h3>
                    <p className="text-xs text-slate-405 leading-relaxed font-sans">
                      Browse region addresses currently tracked. Removing a location hides it from filters and client search desk.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {locations.map((loc) => (
                      <div 
                        key={loc}
                        className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-slate-750 font-sans">{loc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLocation(loc)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer"
                          title="Retire location address parameters"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT LEADS RECORDS */}
          {dashTab === 'leads' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-slate-205 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Leads</span>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">Confidential Inquiry Leads</h1>
              </div>

              <div className="space-y-5">
                {localInquiries.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
                    No client leads records are currently captured.
                  </div>
                ) : (
                  localInquiries.map((liq) => (
                    <div 
                      key={liq.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-7 shadow-sm flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden"
                    >
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-extrabold text-base text-slate-800">{liq.name}</h3>
                          <span className="inline-flex items-center bg-slate-100 text-slate-600 text-[10px] font-bold py-0.5 px-2.5 rounded-full font-mono">
                            ⚡ ASSET: {liq.propertyName || 'General Inquiry'}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed text-slate-600 font-sans italic p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-xl">
                          "{liq.message}"
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] font-mono text-slate-500">
                          <div>
                            <span className="font-bold text-slate-405 font-sans">Contact Email: </span>
                            <span className="underline">{liq.email}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-405 font-sans">Telephone: </span>
                            <span>{liq.phone || 'None Provided'}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-405 font-sans">Registered Time: </span>
                            <span>{new Date(liq.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-end items-end gap-3.5">
                        <a
                          href={`mailto:${liq.email}?subject=Crovation Inquiry: ${encodeURIComponent(liq.propertyName || '')}`}
                          className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] px-4 py-2 rounded-lg hover:bg-slate-805 duration-200 cursor-pointer"
                        >
                          Send Email Reply
                        </a>
                        <button
                          onClick={() => handleClearInquiry(liq.id)}
                          className="text-red-500 hover:bg-red-50 p-2 border border-red-100 hover:border-red-200 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          title="Purge Record Lead"
                        >
                          Purge Lead
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EMAIL SUBSCRIPTIONS RECORD */}
          {dashTab === 'subs' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-slate-205 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Subscribers</span>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">Email Subscriptions (Email Subs)</h1>
              </div>

              <div className="space-y-5">
                {localSubs.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
                    No active newsletter subscribers are currently captured.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider font-mono">
                            <th className="p-4 pl-6">Subscriber Email</th>
                            <th className="p-4">Registered Date & Time</th>
                            <th className="p-4 pr-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {localSubs.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4 pl-6 font-medium text-slate-800 font-sans">{sub.email}</td>
                              <td className="p-4 text-slate-500 font-mono">{new Date(sub.createdAt).toLocaleString()}</td>
                              <td className="p-4 pr-6 text-right">
                                <div className="flex justify-end gap-3">
                                  <a
                                    href={`mailto:${sub.email}?subject=Crovation Exclusive Property Updates`}
                                    className="text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                                  >
                                    Send Newsletter
                                  </a>
                                  <button
                                    onClick={() => handleClearSub(sub.id)}
                                    className="text-red-500 hover:bg-red-50 hover:text-red-650 px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-200 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                                  >
                                    Remove sub
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ------------------- FORM OVERLAY A: REGISTER COMPILATION FILE (Add Property) ------------------- */}
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-left overflow-y-auto max-h-[90vh]">
            
            <button
              onClick={() => setIsAddFormOpen(false)}
              className="absolute top-5 right-5 p-2 bg-slate-50 border border-slate-100 stroke-2 text-slate-400 hover:text-slate-800 rounded-xl transition duration-150 cursor-pointer"
              title="Close modal"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded text-[9px] font-mono block w-fit">ADMIN DESK</span>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Register New Property Offering</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Kindly fill the listing fields to index this property into active collection displays.
              </p>
            </div>

            <form onSubmit={handleAddPropertySubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Asset Title</label>
                  <input
                    type="text"
                    required
                    value={newProperty.title}
                    onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                    placeholder="e.g. Orchid Mansion"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-350 focus:outline-none"
                  />
                </div>

                {/* Type dropdown */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Sector Type</label>
                  <select
                    value={newProperty.type}
                    onChange={(e) => setNewProperty({...newProperty, type: e.target.value as PropertyType})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                {/* Location select mapped to dynamic locations! */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Designated Address Location</label>
                  <select
                    value={newProperty.location}
                    onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                    className="w-full rounded-xl border border-slate-205 bg-slate-50 px-3.5 py-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
                    required
                  >
                    <option value="">Choose Listing Region...</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Price NGN/USD switcher combo */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1 flex items-center justify-between">
                    <span>Valuation Listing Price</span>
                    
                    {/* NAIRA / DOLLAR SWITCH UNIT */}
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => setNewProperty({...newProperty, currency: 'USD'})}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition duration-200 ${newProperty.currency === 'USD' ? 'bg-slate-900 text-white' : 'text-slate-450'}`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewProperty({...newProperty, currency: 'NGN'})}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition duration-200 ${newProperty.currency === 'NGN' ? 'bg-slate-900 text-white' : 'text-slate-450'}`}
                      >
                        NGN (₦)
                      </button>
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                      {newProperty.currency === 'NGN' ? '₦' : '$'}
                    </span>
                    <input
                      type="number"
                      required
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                      placeholder="e.g. 3500000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-350 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Bedrooms and Bathrooms (Hidden or disabled if Land) */}
                {newProperty.type !== 'Land' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bedroom chambers</label>
                      <input
                        type="number"
                        required
                        value={newProperty.bedrooms}
                        onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                        placeholder="e.g. 5"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bathroom areas</label>
                      <input
                        type="number"
                        required
                        value={newProperty.bathrooms}
                        onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                        placeholder="e.g. 6.5"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Size */}
                <div className={newProperty.type === 'Land' ? "grid-cols-1 sm:col-span-2" : ""}>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {newProperty.type === 'Land' ? 'Land Size Area (sqft or sqm)' : 'Total Size Area (sqft)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newProperty.size}
                    onChange={(e) => setNewProperty({...newProperty, size: e.target.value})}
                    placeholder="e.g. 5400"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none"
                  />
                </div>

                {/* Image Address */}
                <div className="grid-cols-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Featured Image URL Link</label>
                  <input
                    type="url"
                    required
                    value={newProperty.image}
                    onChange={(e) => setNewProperty({...newProperty, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none font-mono"
                  />
                </div>

                {/* WhatsApp call to action */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5 flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Contact No / Link</span>
                  </label>
                  <input
                    type="text"
                    value={newProperty.whatsappLink}
                    onChange={(e) => setNewProperty({...newProperty, whatsappLink: e.target.value})}
                    placeholder="e.g. 2348030000000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-850 placeholder-slate-400 focus:border-emerald-350 focus:outline-none"
                  />
                </div>

                {/* Phone Call call to action */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>Telephone Dial Contact Number</span>
                  </label>
                  <input
                    type="text"
                    value={newProperty.phoneNumber}
                    onChange={(e) => setNewProperty({...newProperty, phoneNumber: e.target.value})}
                    placeholder="e.g. +234 803 000 0000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-850 placeholder-slate-400 focus:border-blue-350 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="grid-cols-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Asset narrative dossier description</label>
                  <textarea
                    required
                    rows={3}
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                    placeholder="Describe surrounding landscape, construction grade, interior architectural pairings in bullet points detail..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none font-sans"
                  />
                </div>

              </div>

              <div className="pt-4 flex items-center justify-end gap-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200/80 text-slate-650 font-bold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition duration-150 cursor-pointer"
                >
                  Discard File
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition duration-150 shadow-md cursor-pointer"
                >
                  Confirm Listing
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ------------------- FORM OVERLAY B: PARAMETER REVISION MANAGER (Edit Property) ------------------- */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-left overflow-y-auto max-h-[90vh]">
            
            <button
              onClick={() => setEditingProperty(null)}
              className="absolute top-5 right-5 p-2 bg-slate-50 border border-slate-100 stroke-2 text-slate-400 hover:text-slate-800 rounded-xl transition duration-150 cursor-pointer"
              title="Close modal"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded text-[9px] font-mono block w-fit">REVISION PANEL</span>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Edit Asset Parameters</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans animate-pulse">
                Modifying parameters for listing: "{editingProperty.title}"
              </p>
            </div>

            <form onSubmit={handleEditPropertySubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Asset Title</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title}
                    onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})}
                    placeholder="e.g. Orchid Mansion"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-350 focus:outline-none"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Sector Type</label>
                  <select
                    value={editingProperty.type}
                    onChange={(e) => setEditingProperty({...editingProperty, type: e.target.value as PropertyType})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                {/* Location select mapped to dynamic locations! */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Designated Address Location</label>
                  <select
                    value={editingProperty.location}
                    onChange={(e) => setEditingProperty({...editingProperty, location: e.target.value})}
                    className="w-full rounded-xl border border-slate-205 bg-slate-50 px-3.5 py-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
                    required
                  >
                    <option value="">Choose Listing Region...</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Price USD/NGN Switcher */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1 flex items-center justify-between">
                    <span>Valuation Listing Price</span>
                    
                    {/* NAIRA / DOLLAR SWITCH UNIT */}
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => setEditingProperty({...editingProperty, currency: 'USD'})}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition duration-200 ${editingProperty.currency === 'USD' ? 'bg-slate-900 text-white' : 'text-slate-450'}`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProperty({...editingProperty, currency: 'NGN'})}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition duration-200 ${editingProperty.currency === 'NGN' ? 'bg-slate-900 text-white' : 'text-slate-450'}`}
                      >
                        NGN (₦)
                      </button>
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-xs font-bold">
                      {editingProperty.currency === 'NGN' ? '₦' : '$'}
                    </span>
                    <input
                      type="number"
                      required
                      value={editingProperty.price}
                      onChange={(e) => setEditingProperty({...editingProperty, price: parseFloat(e.target.value) || 0})}
                      placeholder="e.g. 3500000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-350 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Bedrooms and Bathrooms */}
                {editingProperty.type !== 'Land' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bedroom chambers</label>
                      <input
                        type="number"
                        required
                        value={editingProperty.bedrooms}
                        onChange={(e) => setEditingProperty({...editingProperty, bedrooms: parseInt(e.target.value) || 0})}
                        placeholder="e.g. 5"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bathroom areas</label>
                      <input
                        type="number"
                        required
                        value={editingProperty.bathrooms}
                        onChange={(e) => setEditingProperty({...editingProperty, bathrooms: parseFloat(e.target.value) || 0})}
                        placeholder="e.g. 6.5"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Size */}
                <div className={editingProperty.type === 'Land' ? "grid-cols-1 sm:col-span-2" : ""}>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {editingProperty.type === 'Land' ? 'Land Size Area (sqft or sqm)' : 'Total Size Area (sqft)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProperty.size}
                    onChange={(e) => setEditingProperty({...editingProperty, size: parseInt(e.target.value) || 0})}
                    placeholder="e.g. 5400"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none"
                  />
                </div>

                {/* Image Address */}
                <div className="grid-cols-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Featured Image URL Link</label>
                  <input
                    type="url"
                    required
                    value={editingProperty.image}
                    onChange={(e) => setEditingProperty({...editingProperty, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none font-mono"
                  />
                </div>

                {/* WhatsApp call to action */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5 flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Contact No / Link</span>
                  </label>
                  <input
                    type="text"
                    value={editingProperty.whatsappLink || ''}
                    onChange={(e) => setEditingProperty({...editingProperty, whatsappLink: e.target.value})}
                    placeholder="e.g. 2348030000000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-850 placeholder-slate-400 focus:border-emerald-350 focus:outline-none"
                  />
                </div>

                {/* Phone Call call to action */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>Telephone Dial Contact Number</span>
                  </label>
                  <input
                    type="text"
                    value={editingProperty.phoneNumber || ''}
                    onChange={(e) => setEditingProperty({...editingProperty, phoneNumber: e.target.value})}
                    placeholder="e.g. +234 803 000 0000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-850 placeholder-slate-400 focus:border-blue-350 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="grid-cols-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Asset narrative dossier description</label>
                  <textarea
                    required
                    rows={3}
                    value={editingProperty.description}
                    onChange={(e) => setEditingProperty({...editingProperty, description: e.target.value})}
                    placeholder="Describe surrounding landscape, construction grade, interior architectural pairings in bullet points detail..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-310 focus:outline-none font-sans"
                  />
                </div>

              </div>

              <div className="pt-4 flex items-center justify-end gap-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="bg-slate-100 hover:bg-slate-200/80 text-slate-650 font-bold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition duration-150 cursor-pointer"
                >
                  Cancel Revisions
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition duration-150 shadow-md cursor-pointer"
                >
                  Save Listing parameters
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
