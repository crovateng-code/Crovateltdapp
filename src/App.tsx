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

// Dedicated standalone pages imports
import PropertiesPage from './components/PropertiesPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import PropertyDetail from './components/PropertyDetail';
import { Property } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'properties' | 'about' | 'services' | 'contact'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [searchFilters, setSearchFilters] = useState({
    location: 'All',
    type: 'All',
    priceRange: 'All',
    bedrooms: 'All',
  });

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState('');

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

  return (
    <div className="relative min-h-screen bg-brandbg selection:bg-primary selection:text-secondary antialiased" id="homepage-app">
      
      {/* Dynamic Navigation Bar Header */}
      <Navbar 
        onOpenInquiry={handleOpenInquiry} 
        activePage={activePage}
        onChangePage={(page) => {
          setActivePage(page);
          setSelectedProperty(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

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
                />

                {/* WHY CHOOSE CROVATION SECTION */}
                <WhyChoose />

                {/* FEATURED PROPERTIES SECTION WITH LIVE FILTER */}
                <FeaturedProperties 
                  filters={searchFilters} 
                  onResetFilters={handleResetFilters} 
                  onOpenInquiry={handleOpenInquiry} 
                  onSelectProperty={handleSelectProperty}
                />

                {/* NUMBERS ACHIEVEMENT STATS BANNER */}
                <Numbers />

                {/* BESPOKE ADVISORY SERVICES SHORT PREVIEW */}
                <Services />

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
              />
            )}

            {activePage === 'about' && (
              <AboutPage onOpenInquiry={handleOpenInquiry} />
            )}

            {activePage === 'services' && (
              <ServicesPage onOpenInquiry={handleOpenInquiry} />
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
