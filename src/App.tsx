import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'properties' | 'about' | 'services' | 'contact' | 'admin' | 'services/sales' | 'services/management' | 'services/advisory' | 'services/commercial'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [adminSubView, setAdminSubView] = useState<'login' | 'dashboard'>('login');
  const [dashTab, setDashTab] = useState<'analytics' | 'listings' | 'locations' | 'leads' | 'subs'>('analytics');

  // Load properties permanently from LocalStorage with fallback to initial data
  const [dynamicProperties, setDynamicProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('crovation_local_properties');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing local properties', e);
      }
    }
    return PROPERTIES;
  });

  // Track the logged in admin state so we can render an avatar at the top in Navbar!
  const [loggedInAdmin, setLoggedInAdmin] = useState<any>(() => {
    try {
      const activeSession = localStorage.getItem('crovation_logged_in_admin');
      return activeSession ? JSON.parse(activeSession) : null;
    } catch {
      return null;
    }
  });

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

  // Synchronization with server backend to share state between Desktop and Mobile
  useEffect(() => {
    async function syncWithServer() {
      try {
        // Sync properties
        const propsRes = await fetch('/api/properties').then(r => r.json()).catch(() => null);
        if (propsRes && propsRes.success && Array.isArray(propsRes.properties) && propsRes.properties.length > 0) {
          setDynamicProperties(propsRes.properties);
          localStorage.setItem('crovation_local_properties', JSON.stringify(propsRes.properties));
        } else {
          // Seeds the server on startup if the server has empty properties storage
          await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties: dynamicProperties })
          }).catch(() => null);
        }

        // Sync locations
        const locsRes = await fetch('/api/locations').then(r => r.json()).catch(() => null);
        if (locsRes && locsRes.success && Array.isArray(locsRes.locations) && locsRes.locations.length > 0) {
          setLocations(locsRes.locations);
          localStorage.setItem('crovation_custom_locations', JSON.stringify(locsRes.locations));
        } else {
          await fetch('/api/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locations: locations })
          }).catch(() => null);
        }

        // Sync inquiries
        const inquiriesRes = await fetch('/api/inquiries').then(r => r.json()).catch(() => null);
        if (inquiriesRes && inquiriesRes.success && Array.isArray(inquiriesRes.inquiries) && inquiriesRes.inquiries.length > 0) {
          setLocalInquiries(inquiriesRes.inquiries);
          localStorage.setItem('crovation_local_inquiries', JSON.stringify(inquiriesRes.inquiries));
        } else {
          await fetch('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inquiries: localInquiries })
          }).catch(() => null);
        }

        // Sync newsletter subscriptions
        const subsRes = await fetch('/api/subs').then(r => r.json()).catch(() => null);
        if (subsRes && subsRes.success && Array.isArray(subsRes.subs) && subsRes.subs.length > 0) {
          setLocalSubs(subsRes.subs);
          localStorage.setItem('crovation_local_subs', JSON.stringify(subsRes.subs));
        } else {
          await fetch('/api/subs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subs: localSubs })
          }).catch(() => null);
        }
      } catch (err) {
        console.warn('Silent server synchronization failure:', err);
      }
    }
    syncWithServer();
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
  const saveProperties = (updated: Property[]) => {
    setDynamicProperties(updated);
    localStorage.setItem('crovation_local_properties', JSON.stringify(updated));
    fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties: updated })
    }).catch((e) => console.error(e));
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
    setActivePage('properties');
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
    setActivePage('properties');
    setSelectedProperty(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activePage === 'admin') {
    return (
      <div className="relative min-h-screen bg-[#f8fafc] selection:bg-primary selection:text-secondary antialiased" id="admin-workspace-page">
        <AdminPortal 
          properties={dynamicProperties}
          onPropertiesUpdated={saveProperties}
          activeSubView={adminSubView}
          onNavigateSubView={(sub) => setAdminSubView(sub)}
          dashTab={dashTab}
          onDashTabChange={(tab) => setDashTab(tab)}
          locations={locations}
          onLocationsUpdated={saveLocations}
          loggedInAdmin={loggedInAdmin}
          onLoggedInAdminChange={(admin) => setLoggedInAdmin(admin)}
          onBackToSite={() => {
            setActivePage('home');
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
        activePage={activePage === 'admin' ? 'home' : activePage}
        onChangePage={(page) => {
          setActivePage(page);
          setSelectedProperty(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        loggedInAdmin={loggedInAdmin}
        onBackToAdmin={(tab) => {
          setActivePage('admin');
          setAdminSubView('dashboard');
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
        {selectedProperty ? (
          <PropertyDetail 
            property={selectedProperty} 
            onBack={() => {
              setSelectedProperty(null);
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
                  setActivePage(page);
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
                  setActivePage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activePage === 'services/sales' && (
              <PropertySalesPage 
                onBack={() => {
                  setActivePage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}

            {activePage === 'services/management' && (
              <PropertyManagementPage 
                onBack={() => {
                  setActivePage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}

            {activePage === 'services/advisory' && (
              <InvestmentAdvisoryPage 
                onBack={() => {
                  setActivePage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
                onAddInquiry={handleAddInquiry}
              />
            )}

            {activePage === 'services/commercial' && (
              <CommercialRealEstatePage 
                onBack={() => {
                  setActivePage('services');
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
          setActivePage(page);
          setSelectedProperty(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdminAccess={() => {
          setActivePage('admin');
          setAdminSubView('login');
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
