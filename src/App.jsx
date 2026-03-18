
import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { Web3Provider } from '@/contexts/Web3Context.jsx';
import { AIVacationPlannerProvider } from '@/contexts/AIVacationPlannerContext.jsx';
import { AdminProvider } from '@/contexts/AdminContext.jsx';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ProtectedLayout from '@/components/ProtectedLayout.jsx';
import AdminProtectedRoute from '@/components/AdminProtectedRoute.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PlaceCaptureFeature from '@/components/PlaceCaptureFeature.jsx';
import MobileOptimization from '@/components/MobileOptimization.jsx';

// Dynamic Landing Page Engine
import LandingPageRotation from '@/components/LandingPageRotation.jsx';

// ============================================================================
// LANDING PAGES - Lazy Loaded
// ============================================================================
const StressFreeLanding = lazy(() => import('@/pages/landing/StressFreeLanding.jsx'));
const BudgetLanding = lazy(() => import('@/pages/landing/BudgetLanding.jsx'));
const FamilyLanding = lazy(() => import('@/pages/landing/FamilyLanding.jsx'));
const AdventureLanding = lazy(() => import('@/pages/landing/AdventureLanding.jsx'));
const SoloLanding = lazy(() => import('@/pages/landing/SoloLanding.jsx'));
const LuxuryLanding = lazy(() => import('@/pages/landing/LuxuryLanding.jsx'));
const BusinessLanding = lazy(() => import('@/pages/landing/BusinessLanding.jsx'));
const HoneymoonLanding = lazy(() => import('@/pages/landing/HoneymoonLanding.jsx'));

// ============================================================================
// PUBLIC MARKETING PAGES - Lazy Loaded
// ============================================================================
const FeaturesPage = lazy(() => import('@/pages/FeaturesPage.jsx'));
const PricingPage = lazy(() => import('@/pages/PricingPage.jsx'));
const AboutPage = lazy(() => import('@/pages/AboutPage.jsx'));
const CaseStudiesPage = lazy(() => import('@/pages/CaseStudiesPage.jsx'));
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage.jsx'));
const FAQPage = lazy(() => import('@/pages/FAQPage.jsx'));
const ContactPage = lazy(() => import('@/pages/ContactPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage.jsx'));
const BlogPage = lazy(() => import('@/pages/marketing/BlogPage.jsx'));

// ============================================================================
// AUTH PAGES - Lazy Loaded
// ============================================================================
const LoginPage = lazy(() => import('@/pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('@/pages/SignupPage.jsx'));

// ============================================================================
// PROTECTED PAGES - CORE DASHBOARD & SETTINGS - Lazy Loaded
// ============================================================================
const DashboardPage = lazy(() => import('@/pages/DashboardPage.jsx'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage.jsx'));

// ============================================================================
// PROTECTED PAGES - TRIPS & ITINERARY - Lazy Loaded
// ============================================================================
const TripListPage = lazy(() => import('@/pages/TripListPage.jsx'));
const CreateTripPage = lazy(() => import('@/pages/CreateTripPage.jsx'));
const TripOverviewPage = lazy(() => import('@/pages/TripOverviewPage.jsx'));
const ItineraryPage = lazy(() => import('@/pages/ItineraryPage.jsx'));
const ItineraryBuilderPage = lazy(() => import('@/pages/ItineraryBuilderPage.jsx'));
const AIItineraryBuilderPage = lazy(() => import('@/pages/AIItineraryBuilderPage.jsx'));

// ============================================================================
// PROTECTED PAGES - BUDGETING & EXPENSES - Lazy Loaded
// ============================================================================
const BudgetTrackerPage = lazy(() => import('@/pages/BudgetTrackerPage.jsx'));
const ExpenseTrackingPage = lazy(() => import('@/pages/ExpenseTrackingPage.jsx'));
const SplitExpensesPage = lazy(() => import('@/pages/SplitExpensesPage.jsx'));

// ============================================================================
// PROTECTED PAGES - PHOTOS & MEDIA - Lazy Loaded
// ============================================================================
const PhotoGalleryPage = lazy(() => import('@/pages/PhotoGalleryPage.jsx'));
const SmartPhotoAlbumsPage = lazy(() => import('@/pages/SmartPhotoAlbumsPage.jsx'));

// ============================================================================
// PROTECTED PAGES - JOURNAL & PLANNING - Lazy Loaded
// ============================================================================
const TravelJournalPage = lazy(() => import('@/pages/TravelJournalPage.jsx'));
const PackingChecklistPage = lazy(() => import('@/pages/PackingChecklistPage.jsx'));
const BookingChecklistPage = lazy(() => import('@/pages/BookingChecklistPage.jsx'));

// ============================================================================
// PROTECTED PAGES - GROUP & SOCIAL - Lazy Loaded
// ============================================================================
const GroupTravelDashboard = lazy(() => import('@/pages/GroupTravelDashboard.jsx'));

// ============================================================================
// PROTECTED PAGES - NOTIFICATIONS - Lazy Loaded
// ============================================================================
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage.jsx'));

// ============================================================================
// PROTECTED PAGES - DISCOVERY & RECOMMENDATIONS - Lazy Loaded
// ============================================================================
const DiscoveryPage = lazy(() => import('@/pages/DiscoveryPage.jsx'));
const AIRecommendationsPage = lazy(() => import('@/pages/AIRecommendationsPage.jsx'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage.jsx'));

// ============================================================================
// PROTECTED PAGES - AI FEATURES - Lazy Loaded
// ============================================================================
const AIAssistantPage = lazy(() => import('@/pages/AIAssistantPage.jsx'));
const AIVacationPlannerLandingPage = lazy(() => import('@/pages/AIVacationPlannerLandingPage.jsx'));

// ============================================================================
// PROTECTED PAGES - PROFILE - Lazy Loaded
// ============================================================================
const UserProfiles = lazy(() => import('@/pages/profile/UserProfiles.jsx'));

// ============================================================================
// LOADING FALLBACK COMPONENT
// ============================================================================
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.log('SW registration failed: ', err);
        });
      });
    }
  }, []);

  return (
    <AnalyticsProvider>
      <AuthProvider>
        <AdminProvider>
          <Web3Provider>
            <AIVacationPlannerProvider>
              <Router>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                  <Routes>
                    {/* ================================================================ */}
                    {/* ADMIN ROUTES - Protected with admin layout */}
                    {/* ================================================================ */}
                    <Route path="/admin/*" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>} />

                    {/* ================================================================ */}
                    {/* PUBLIC & PROTECTED ROUTES - With Header & Footer */}
                    {/* ================================================================ */}
                    <Route path="*" element={
                      <>
                        <Header />
                        <main className="flex-1 relative pb-16 md:pb-0">
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              {/* ============================================================ */}
                              {/* PUBLIC ROUTES - NO AUTH REQUIRED */}
                              {/* ============================================================ */}

                              {/* Root Landing Page (Dynamic Rotation) */}
                              <Route path="/" element={<LandingPageRotation />} />

                              {/* Specific Landing Pages */}
                              <Route path="/landing/stress-free" element={<StressFreeLanding />} />
                              <Route path="/landing/budget" element={<BudgetLanding />} />
                              <Route path="/landing/family" element={<FamilyLanding />} />
                              <Route path="/landing/adventure" element={<AdventureLanding />} />
                              <Route path="/landing/solo" element={<SoloLanding />} />
                              <Route path="/landing/luxury" element={<LuxuryLanding />} />
                              <Route path="/landing/business" element={<BusinessLanding />} />
                              <Route path="/landing/honeymoon" element={<HoneymoonLanding />} />

                              {/* Public Marketing Routes */}
                              <Route path="/features" element={<FeaturesPage />} />
                              <Route path="/pricing" element={<PricingPage />} />
                              <Route path="/about" element={<AboutPage />} />
                              <Route path="/case-studies" element={<CaseStudiesPage />} />
                              <Route path="/testimonials" element={<TestimonialsPage />} />
                              <Route path="/faq" element={<FAQPage />} />
                              <Route path="/contact" element={<ContactPage />} />
                              <Route path="/privacy" element={<PrivacyPolicyPage />} />
                              <Route path="/blog" element={<BlogPage />} />

                              {/* Auth Routes */}
                              <Route path="/login" element={<LoginPage />} />
                              <Route path="/signup" element={<SignupPage />} />

                              {/* ============================================================ */}
                              {/* PROTECTED ROUTES - AUTH REQUIRED WITH SIDEBAR LAYOUT */}
                              {/* ============================================================ */}
                              <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>

                                {/* Dashboard & Settings */}
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/profile" element={<UserProfiles />} />
                                <Route path="/notifications" element={<NotificationsPage />} />

                                {/* Trips - List, Create, Overview */}
                                <Route path="/trips" element={<TripListPage />} />
                                <Route path="/trips/create" element={<CreateTripPage />} />
                                <Route path="/trips/:tripId" element={<TripOverviewPage />} />

                                {/* Itinerary Management */}
                                <Route path="/trips/:tripId/itinerary" element={<ItineraryPage />} />
                                <Route path="/trips/:tripId/itinerary/builder" element={<ItineraryBuilderPage />} />
                                <Route path="/trips/:tripId/itinerary/ai-builder" element={<AIItineraryBuilderPage />} />

                                {/* Budget & Expenses */}
                                <Route path="/trips/:tripId/budget" element={<BudgetTrackerPage />} />
                                <Route path="/trips/:tripId/expenses" element={<ExpenseTrackingPage />} />
                                <Route path="/trips/:tripId/split-expenses" element={<SplitExpensesPage />} />

                                {/* Photos & Media */}
                                <Route path="/trips/:tripId/photos" element={<PhotoGalleryPage />} />
                                <Route path="/trips/:tripId/albums" element={<SmartPhotoAlbumsPage />} />

                                {/* Journal & Checklists */}
                                <Route path="/trips/:tripId/journal" element={<TravelJournalPage />} />
                                <Route path="/trips/:tripId/packing" element={<PackingChecklistPage />} />
                                <Route path="/trips/:tripId/booking-checklist" element={<BookingChecklistPage />} />

                                {/* Group Travel */}
                                <Route path="/trips/:tripId/group" element={<GroupTravelDashboard />} />

                                {/* Discovery & Exploration */}
                                <Route path="/trips/:tripId/discovery" element={<DiscoveryPage />} />
                                <Route path="/discover" element={<DiscoveryPage />} />
                                <Route path="/favorites" element={<FavoritesPage />} />

                                {/* AI Features */}
                                <Route path="/trips/:tripId/ai-assistant" element={<AIAssistantPage />} />
                                <Route path="/ai/planner" element={<AIVacationPlannerLandingPage />} />
                                <Route path="/ai/recommendations" element={<AIRecommendationsPage />} />

                              </Route>
                            </Routes>
                          </Suspense>

                          {/* Global Floating Action Button for Place Capture */}
                          <Routes>
                            <Route path="/trip/:tripId/*" element={<PlaceCaptureFeature />} />
                          </Routes>

                          {/* Mobile Bottom Navigation */}
                          <MobileOptimization />
                        </main>
                        <Footer />
                      </>
                    } />
                  </Routes>
                </div>
                <Toaster position="top-center" />
              </Router>
            </AIVacationPlannerProvider>
          </Web3Provider>
        </AdminProvider>
      </AuthProvider>
    </AnalyticsProvider>
  );
}

export default App;
