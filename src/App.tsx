import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChoose from './components/WhyChoose';
import FeaturedProperties from './components/FeaturedProperties';
import Numbers from './components/Numbers';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';
import SupabaseStatus from './components/SupabaseStatus.tsx';

// Dedicated standalone pages imports
import PropertiesPage from './components/PropertiesPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import PropertyDetail from './components/PropertyDetail';
import AdminPortal from './components/AdminPortal';
import PropertySalesPage from './components/PropertySalesPage';
import PropertyManagementPage from './components/PropertyManagementPage';
import InvestmentAdvisoryPage from './components/InvestmentAdvisoryPage';
import CommercialRealEstatePage from './components/CommercialRealEstatePage';
import { Property } from './types';
import { PROPERTIES } from './data';
import { getSupabaseProperties, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'properties' | 'about' | 'services' | 'contact' | 'admin' | 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [adminSubView, setAdminSubView] = useState<'login' | 'dashboard'>('login');
  const [dashTab, setDashTab] = useState<'analytics' | 'listings' | 'locations' | 'leads' | 'subs' | 'security'>('analytics');
  const lastSaveTimeRef = useRef<number>(0);

  // Client-side path-routing system
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  // Load properties permanently from LocalStorage with fallback to initial data
  const [dynamicProperties, setDynamicProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('crovation_local_properties');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing local properties', e);
      }
    }
    return PROPERTIES;
  });

  const getSlug = (title: string): string => {
    if (!title) return '';
    return title
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  useEffect(() => {
    const path = currentPath;
    if (path === '/' || path === '' || path === '/home') {
      setActivePage('home');
      setSelectedProperty(null);
    } else if (path === '/properties') {
      setActivePage('properties');
      setSelectedProperty(null);
    } else if (path === '/about') {
      setActivePage('about');
      setSelectedProperty(null);
    } else if (path === '/services') {
      setActivePage('services');
      setSelectedProperty(null);
    } else if (path === '/contact') {
      setActivePage('contact');
      setSelectedProperty(null);
    } else if (path === '/services/sales') {
      setActivePage('services/sales');
      setSelectedProperty(null);
    } else if (path === '/services/management') {
      setActivePage('services/management');
      setSelectedProperty(null);
    } else if (path === '/services/advisory') {
      setActivePage('services/advisory');
      setSelectedProperty(null);
    } else if (path === '/services/commercial') {
      setActivePage('services/commercial');
      setSelectedProperty(null);
    } else if (path === '/Executive-Console' || path === '/admin-dashboard') {
      setActivePage('admin');
      setSelectedProperty(null);
    } else if (path.startsWith('/property/')) {
      const slug = path.substring('/property/'.length);
      const found = [...dynamicProperties, ...PROPERTIES].find(p => {
        if (!p) return false;
        const pSlug = p.title ? getSlug(p.title) : '';
        const decodedSlug = decodeURIComponent(slug).toLowerCase();
        return pSlug === slug.toLowerCase() || 
               pSlug === decodedSlug || 
               String(p.id).toLowerCase() === slug.toLowerCase() ||
               String(p.id).toLowerCase() === decodedSlug;
      });
      if (found) {
        setSelectedProperty(found);
      }
    }
  }, [currentPath, dynamicProperties]);

  // Track the logged in admin state so we can render an avatar at the top in Navbar!
  const [loggedInAdmin, setLoggedInAdmin] = useState<any>(() => {
    try {
      const activeSession = localStorage.getItem('crovation_logged_in_admin');
      return activeSession ? JSON.parse(activeSession) : null;
    } catch {
      return null;
    }
  });

  // Redirect rule matching for security & authenticated console pages
  useEffect(() => {
    if (currentPath === '/admin-dashboard' && !loggedInAdmin) {
      navigateTo('/');
    } else if (currentPath === '/Executive-Console' && loggedInAdmin) {
      navigateTo('/admin-dashboard');
    }
  }, [currentPath, loggedInAdmin]);

  // Unique list of customizable locations, with sensible defaults
  const [locations, setLocations] = useState<string[]>(() => {
    const saved = localStorage.getItem('crovation_custom_locations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return ['California', 'New York', 'Dubai', 'Colorado', 'Boston', 'Lagos', 'Abuja'];
  });

  const [searchFilters, setSearchFilters] = useState({
    location: 'All',
    type: 'All',
    priceRange: 'All',
    bedrooms: 'All',
  });

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState('');

  // Unified, live client leads database
  const [localInquiries, setLocalInquiries] = useState<any[]>(() => {
    const saved = localStorage.getItem('crovation_local_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
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
    localStorage.setItem('crovation_local_inquiries', JSON.stringify(sampleInquiries));
    return sampleInquiries;
  });

  // Unified, live email subscribers database
  const [localSubs, setLocalSubs] = useState<any[]>(() => {
    const saved = localStorage.getItem('crovation_local_subs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
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
    localStorage.setItem('crovation_local_subs', JSON.stringify(sampleSubs));
    return sampleSubs;
  });

  // Synchronization with server backend to share state live between Desktop and Mobile
  useEffect(() => {
    let isFirstSync = true;

    async function syncWithServer() {
      // Prevent background polling from overwriting recent local updates / deletions
      if (!isFirstSync && Date.now() - lastSaveTimeRef.current < 10000) {
        return;
      }
      try {
        // Simple helper to check if two arrays are structurally equal to prevent redundant updates
        const isSameArray = (a: any[], b: any[]) => {
          if (a.length !== b.length) return false;
          return JSON.stringify(a) === JSON.stringify(b);
        };

        // 1. SYNC PROPERTIES - load from Supabase if configured as the primary source of truth
        let fetchedProps: Property[] | null = null;
        if (isSupabaseConfigured) {
          fetchedProps = await getSupabaseProperties();
        }

        if (isSupabaseConfigured && fetchedProps !== null) {
          // If Supabase is configured and the fetch succeeded, it's the absolute source of truth (even if empty!)
          const finalProps = fetchedProps;
          setDynamicProperties(prev => {
            if (!isSameArray(prev, finalProps)) {
              localStorage.setItem('crovation_local_properties', JSON.stringify(finalProps));
              return finalProps;
            }
            return prev;
          });
          // Keep backend JSON backup up to date too
          fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties: finalProps })
          }).catch(() => null);
        } else {
          // If Supabase is not configured, or fetchedProps was null:
          if (isFirstSync) {
            // First run: warm up the server cache if we have client-side local changes
            const savedLocal = localStorage.getItem('crovation_local_properties');
            if (savedLocal !== null) {
              try {
                const parsed = JSON.parse(savedLocal);
                if (Array.isArray(parsed)) {
                  // Push local storage to warm up server cache
                  await fetch('/api/properties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ properties: parsed })
                  }).catch(() => null);
                }
              } catch (e) {
                console.error('Error parsing local properties on first sync', e);
              }
            } else {
              // No local storage, load fallback from server backup
              const propsRes = await fetch('/api/properties').then(r => r.json()).catch(() => null);
              if (propsRes && propsRes.success && Array.isArray(propsRes.properties)) {
                setDynamicProperties(propsRes.properties);
                localStorage.setItem('crovation_local_properties', JSON.stringify(propsRes.properties));
              }
            }
          } else {
            // Subsequent polls: fetch from server (absolute source of truth)
            const propsRes = await fetch('/api/properties').then(r => r.json()).catch(() => null);
            if (propsRes && propsRes.success && Array.isArray(propsRes.properties)) {
              const serverProps = propsRes.properties;
              setDynamicProperties(prev => {
                if (!isSameArray(prev, serverProps)) {
                  localStorage.setItem('crovation_local_properties', JSON.stringify(serverProps));
                  return serverProps;
                }
                return prev;
              });
            }
          }
        }

        // 2. SYNC LOCATIONS
        if (isFirstSync) {
          const savedLocs = localStorage.getItem('crovation_custom_locations');
          if (savedLocs !== null) {
            try {
              const parsedLocs = JSON.parse(savedLocs);
              if (Array.isArray(parsedLocs) && parsedLocs.length > 0) {
                await fetch('/api/locations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ locations: parsedLocs })
                }).catch(() => null);
              }
            } catch (e) {
              console.error('Error parsing local locations on sync', e);
            }
          } else {
            const locsRes = await fetch('/api/locations').then(r => r.json()).catch(() => null);
            if (locsRes && locsRes.success && Array.isArray(locsRes.locations) && locsRes.locations.length > 0) {
              setLocations(locsRes.locations);
              localStorage.setItem('crovation_custom_locations', JSON.stringify(locsRes.locations));
            }
          }
        } else {
          // Subsequent polls: pull from server
          const locsRes = await fetch('/api/locations').then(r => r.json()).catch(() => null);
          if (locsRes && locsRes.success && Array.isArray(locsRes.locations)) {
            const serverLocs = locsRes.locations;
            setLocations(prev => {
              if (!isSameArray(prev, serverLocs)) {
                localStorage.setItem('crovation_custom_locations', JSON.stringify(serverLocs));
                return serverLocs;
              }
              return prev;
            });
          }
        }

        // 3. SYNC INQUIRIES
        if (isFirstSync) {
          const savedInquiries = localStorage.getItem('crovation_local_inquiries');
          if (savedInquiries !== null) {
            try {
              const parsedInqs = JSON.parse(savedInquiries);
              if (Array.isArray(parsedInqs)) {
                await fetch('/api/inquiries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ inquiries: parsedInqs })
                }).catch(() => null);
              }
            } catch (e) {
              console.error('Error parsing local inquiries on sync', e);
            }
          } else {
            const inquiriesRes = await fetch('/api/inquiries').then(r => r.json()).catch(() => null);
            if (inquiriesRes && inquiriesRes.success && Array.isArray(inquiriesRes.inquiries) && inquiriesRes.inquiries.length > 0) {
              setLocalInquiries(inquiriesRes.inquiries);
              localStorage.setItem('crovation_local_inquiries', JSON.stringify(inquiriesRes.inquiries));
            }
          }
        } else {
          // Subsequent polls: pull from server
          const inquiriesRes = await fetch('/api/inquiries').then(r => r.json()).catch(() => null);
          if (inquiriesRes && inquiriesRes.success && Array.isArray(inquiriesRes.inquiries)) {
            const serverInqs = inquiriesRes.inquiries;
            setLocalInquiries(prev => {
              if (!isSameArray(prev, serverInqs)) {
                localStorage.setItem('crovation_local_inquiries', JSON.stringify(serverInqs));
                return serverInqs;
              }
              return prev;
            });
          }
        }

        // 4. SYNC NEWSLETTER SUBSCRIPTIONS
        if (isFirstSync) {
          const savedSubs = localStorage.getItem('crovation_local_subs');
          if (savedSubs !== null) {
            try {
              const parsedSubs = JSON.parse(savedSubs);
              if (Array.isArray(parsedSubs)) {
                await fetch('/api/subs', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ subs: parsedSubs })
                }).catch(() => null);
              }
            } catch (e) {
              console.error('Error parsing local subs on sync', e);
            }
          } else {
            const subsRes = await fetch('/api/subs').then(r => r.json()).catch(() => null);
            if (subsRes && subsRes.success && Array.isArray(subsRes.subs) && subsRes.subs.length > 0) {
              setLocalSubs(subsRes.subs);
              localStorage.setItem('crovation_local_subs', JSON.stringify(subsRes.subs));
            }
          }
        } else {
          // Subsequent polls: pull from server
          const subsRes = await fetch('/api/subs').then(r => r.json()).catch(() => null);
          if (subsRes && subsRes.success && Array.isArray(subsRes.subs)) {
            const serverSubs = subsRes.subs;
            setLocalSubs(prev => {
              if (!isSameArray(prev, serverSubs)) {
                localStorage.setItem('crovation_local_subs', JSON.stringify(serverSubs));
                return serverSubs;
              }
              return prev;
            });
          }
        }

        // Set isFirstSync to false after completing the initial seeding sync
        isFirstSync = false;
      } catch (err) {
        console.warn('Silent server synchronization failure:', err);
      }
    }

    // Run initial sync right away on load
    syncWithServer();

    // Setup active background polling (every 8 seconds) to keep laptop/desktop and mobile phones perfectly harmonized
    const syncInterval = setInterval(syncWithServer, 8000);
    return () => clearInterval(syncInterval);
  }, []);

  const handleAddInquiry = (inquiry: any) => {
    setLocalInquiries(prev => {
      const updated = [inquiry, ...prev];
      localStorage.setItem('crovation_local_inquiries', JSON.stringify(updated));
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiries: updated })
      }).catch((e) => console.error(e));
      return updated;
    });
  };

  const handleAddSub = (sub: any) => {
    setLocalSubs(prev => {
      // Avoid duplicate subscriptions
      if (prev.some(s => s.email.toLowerCase() === sub.email.toLowerCase())) {
        return prev;
      }
      const updated = [sub, ...prev];
      localStorage.setItem('crovation_local_subs', JSON.stringify(updated));
      fetch('/api/subs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subs: updated })
      }).catch((e) => console.error(e));
      return updated;
    });
  };

  const handleClearInquiry = (id: string) => {
    setLocalInquiries(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('crovation_local_inquiries', JSON.stringify(updated));
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiries: updated })
      }).catch((e) => console.error(e));
      return updated;
    });
  };

  const handleClearSub = (id: string) => {
    setLocalSubs(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('crovation_local_subs', JSON.stringify(updated));
      fetch('/api/subs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subs: updated })
      }).catch((e) => console.error(e));
      return updated;
    });
  };

  // Persist properties state changes
  const saveProperties = async (updated: Property[]) => {
    lastSaveTimeRef.current = Date.now();
    setDynamicProperties(updated);
    localStorage.setItem('crovation_local_properties', JSON.stringify(updated));
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: updated })
      });
      if (response.ok) {
        console.log('Successfully saved properties to backend API.');
      } else {
        console.error('Failed to save properties to backend API:', response.statusText);
      }
    } catch (e) {
      console.error('Error in saveProperties fetch:', e);
    }
  };

  // Helper to persist updated locations list
  const saveLocations = (newLocs: string[]) => {
    setLocations(newLocs);
    localStorage.setItem('crovation_custom_locations', JSON.stringify(newLocs));
    fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations: newLocs })
    }).catch((e) => console.error(e));
  };

  // Handle dynamic queries from search section and transition directly to the Properties catalog
  const handleSearch = (filters: {
    location: string;
    type: string;
    priceRange: string;
    bedrooms: string;
  }) => {
    setSearchFilters(filters);
    navigateTo('/properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset search variables
  const handleResetFilters = () => {
    setSearchFilters({
      location: 'All',
      type: 'All',
      priceRange: 'All',
      bedrooms: 'All',
    });
  };

  // Trigger specialized concierge interaction modal
  const handleOpenInquiry = (subject?: string) => {
    setInquirySubject(subject || 'Confidential Brokerage Inquiry');
    setIsInquiryOpen(true);
  };

  // Switch to Properties page
  const handleExploreClick = () => {
    navigateTo('/properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    const slug = getSlug(property.title);
    navigateTo(`/property/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminPath = currentPath === '/Executive-Console' || currentPath === '/admin-dashboard';

  if (isAdminPath) {
    const subViewToRender = currentPath === '/Executive-Console' ? 'login' : 'dashboard';
    return (
      <div className="relative min-h-screen bg-[#f8fafc] selection:bg-primary selection:text-secondary antialiased" id="admin-workspace-page">
        <AdminPortal 
          properties={dynamicProperties}
          onPropertiesUpdated={saveProperties}
          activeSubView={subViewToRender}
          onNavigateSubView={(sub) => {
            if (sub === 'login') {
              navigateTo('/');
            } else {
              navigateTo('/admin-dashboard');
            }
          }}
          dashTab={dashTab}
          onDashTabChange={(tab) => setDashTab(tab)}
          locations={locations}
          onLocationsUpdated={saveLocations}
          loggedInAdmin={loggedInAdmin}
          onLoggedInAdminChange={(admin) => {
            setLoggedInAdmin(admin);
            if (!admin) {
              navigateTo('/');
            }
          }}
          onBackToSite={() => {
            navigateTo('/');
            setSelectedProperty(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          localInquiries={localInquiries}
          onClearInquiry={handleClearInquiry}
          localSubs={localSubs}
          onClearSub={handleClearSub}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brandbg selection:bg-primary selection:text-secondary antialiased" id="homepage-app">
      
      {/* Dynamic Navigation Bar Header */}
      <Navbar 
        onOpenInquiry={handleOpenInquiry} 
        activePage={activePage}
        onChangePage={(page) => {
          navigateTo(page === 'home' ? '/' : `/${page}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        loggedInAdmin={loggedInAdmin}
        onBackToAdmin={(tab) => {
          navigateTo('/admin-dashboard');
          if (tab) {
            setDashTab(tab);
          }
          setSelectedProperty(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Supabase Integration & Diagnostics Dashboard */}
      <SupabaseStatus onDataLoaded={saveProperties} />

      {/* Main Flow Sections based on Active Page */}
      <main className="relative min-h-[70vh]">
        {currentPath.startsWith('/property/') && !selectedProperty ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4" id="loading-property-detail">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-sm font-mono text-gray-400">Retrieving secure portfolio assets...</p>
          </div>
        ) : selectedProperty ? (
          <PropertyDetail 
            property={selectedProperty} 
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigateTo('/properties');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {activePage === 'home' && (
              <>
                {/* HERO SECTION / PROPERTY SEARCH CARD */}
                <Hero 
                  onSearch={handleSearch} 
                  onOpenInquiry={handleOpenInquiry} 
                  onExploreClick={handleExploreClick} 
                  locations={locations}
                  onNavigateAbout={() => navigateTo('/about')}
                />

                {/* WHY CHOOSE CROVATION SECTION */}
                <WhyChoose />

                {/* FEATURED PROPERTIES SECTION WITH LIVE FILTER */}
                <FeaturedProperties 
                  filters={searchFilters} 
                  onResetFilters={handleResetFilters} 
                  onOpenInquiry={handleOpenInquiry} 
                  onSelectProperty={handleSelectProperty}
                  properties={dynamicProperties || undefined}
                  locations={locations}
                />

                {/* NUMBERS ACHIEVEMENT STATS BANNER */}
                <Numbers />

                {/* BESPOKE ADVISORY SERVICES SHORT PREVIEW */}
                <Services onChangePage={(page) => {
                  navigateTo(`/${page}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} />

                {/* TRUSTWORTHY TESTIMONIAL AUDIT CARDS */}
                <Testimonials />

                {/* CORE DARK CALL-TO-ACTION SECTION */}
                <CTA 
                  onOpenInquiry={handleOpenInquiry} 
                  onExploreProperties={handleExploreClick} 
                />
              </>
            )}

            {activePage === 'properties' && (
              <PropertiesPage 
                onOpenInquiry={handleOpenInquiry}
                onSelectProperty={handleSelectProperty}
                initialFilters={searchFilters} 
                properties={dynamicProperties || undefined}
                locations={locations}
              />
            )}

            {activePage === 'about' && (
              <AboutPage onOpenInquiry={handleOpenInquiry} />
            )}

            {activePage === 'services' && (
              <ServicesPage 
                onOpenInquiry={handleOpenInquiry} 
                onNavigateToFullPage={(page) => {
                  navigateTo(`/${page}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activePage === 'services/sales' && (
              <PropertySalesPage 
                onBack={() => {
                  navigateTo('/services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}

            {activePage === 'services/management' && (
              <PropertyManagementPage 
                onBack={() => {
                  navigateTo('/services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}

            {activePage === 'services/advisory' && (
              <InvestmentAdvisoryPage 
                onBack={() => {
                  navigateTo('/services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}

            {activePage === 'services/commercial' && (
              <CommercialRealEstatePage 
                onBack={() => {
                  navigateTo('/services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}

            {activePage === 'contact' && (
              <ContactPage 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER BLOCK */}
      <Footer 
        onOpenInquiry={handleOpenInquiry}
        onChangePage={(page) => {
          navigateTo(page === 'home' ? '/' : `/${page}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdminAccess={() => {
          navigateTo('/Executive-Console');
          setSelectedProperty(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAddSub={handleAddSub}
      />

      {/* PRIVATE CLIENT CONCIERGE MODAL SYSTEM */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        defaultSubject={inquirySubject} 
        onAddInquiry={handleAddInquiry}
      />
      
    </div>
  );
}
