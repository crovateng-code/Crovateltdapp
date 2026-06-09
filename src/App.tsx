import React, { useState } from 'react';
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

  // Persist properties state changes
  const saveProperties = (updated: Property[]) => {
    setDynamicProperties(updated);
    localStorage.setItem('crovation_local_properties', JSON.stringify(updated));
  };

  // Helper to persist updated locations list
  const saveLocations = (newLocs: string[]) => {
    setLocations(newLocs);
    localStorage.setItem('crovation_custom_locations', JSON.stringify(newLocs));
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
          locations={locations}
          onLocationsUpdated={saveLocations}
          loggedInAdmin={loggedInAdmin}
          onLoggedInAdminChange={(admin) => setLoggedInAdmin(admin)}
          onBackToSite={() => {
            setActivePage('home');
            setSelectedProperty(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
        onBackToAdmin={() => {
          setActivePage('admin');
          setAdminSubView('dashboard');
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
              />
            )}

            {activePage === 'services/management' && (
              <PropertyManagementPage 
                onBack={() => {
                  setActivePage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
              />
            )}

            {activePage === 'services/advisory' && (
              <InvestmentAdvisoryPage 
                onBack={() => {
                  setActivePage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
              />
            )}

            {activePage === 'services/commercial' && (
              <CommercialRealEstatePage 
                onBack={() => {
                  setActivePage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onOpenInquiry={handleOpenInquiry} 
              />
            )}

            {activePage === 'contact' && (
              <ContactPage onOpenInquiry={handleOpenInquiry} />
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
      />

      {/* PRIVATE CLIENT CONCIERGE MODAL SYSTEM */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        defaultSubject={inquirySubject} 
      />
      
    </div>
  );
}
