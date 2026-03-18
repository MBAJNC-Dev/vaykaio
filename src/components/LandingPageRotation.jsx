
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { determinePersona, PERSONAS } from '@/lib/PersonaPersonalizationEngine';
import { useAnalytics } from '@/hooks/useAnalytics';

// Lazy load landing page variants for performance
const StressFreeLanding = lazy(() => import('@/pages/landing/StressFreeLanding'));
const BudgetLanding = lazy(() => import('@/pages/landing/BudgetLanding'));
const FamilyLanding = lazy(() => import('@/pages/landing/FamilyLanding'));
const AdventureLanding = lazy(() => import('@/pages/landing/AdventureLanding'));
const SoloLanding = lazy(() => import('@/pages/landing/SoloLanding'));
const LuxuryLanding = lazy(() => import('@/pages/landing/LuxuryLanding'));
const BusinessLanding = lazy(() => import('@/pages/landing/BusinessLanding'));
const HoneymoonLanding = lazy(() => import('@/pages/landing/HoneymoonLanding'));

/**
 * Loading Skeleton for Landing Page
 */
const LandingLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-300 font-medium">Loading your personalized VaykAIo experience...</p>
    </div>
  </div>
);

/**
 * LandingPageRotation Component
 * Dynamic landing page engine that personalizes the experience based on user persona
 * Tracks analytics for each variant viewed
 */
const LandingPageRotation = () => {
  const [persona, setPersona] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    try {
      const assigned = determinePersona();
      setPersona(assigned);

      // Track which variant the user sees
      trackEvent('landing_page_view', {
        variant: assigned,
        timestamp: new Date().toISOString(),
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error determining persona:', error);
      // Fallback to stress-free if there's an error
      setPersona(PERSONAS.STRESS_FREE);
      setIsLoading(false);
    }
  }, [trackEvent]);

  // Show loading skeleton while determining persona
  if (isLoading || !persona) {
    return <LandingLoadingSkeleton />;
  }

  // Render appropriate landing page based on persona
  const personaLandingMap = {
    [PERSONAS.BUDGET]: <BudgetLanding />,
    [PERSONAS.FAMILY]: <FamilyLanding />,
    [PERSONAS.ADVENTURE]: <AdventureLanding />,
    [PERSONAS.SOLO]: <SoloLanding />,
    [PERSONAS.LUXURY]: <LuxuryLanding />,
    [PERSONAS.BUSINESS]: <BusinessLanding />,
    [PERSONAS.HONEYMOON]: <HoneymoonLanding />,
    [PERSONAS.STRESS_FREE]: <StressFreeLanding />,
  };

  const LandingComponent = personaLandingMap[persona] || <StressFreeLanding />;

  return (
    <Suspense fallback={<LandingLoadingSkeleton />}>
      {LandingComponent}
    </Suspense>
  );
};

export default LandingPageRotation;
