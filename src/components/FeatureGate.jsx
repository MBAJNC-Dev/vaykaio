
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import FeatureLockingComponent from './FeatureLockingComponent.jsx';
import { Loader2 } from 'lucide-react';

const FeatureGate = ({ featureName, requiredPlan = 'pro', benefits = [], children }) => {
  const { isAuthenticated, currentUser, profile } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    const planLevels = { free: 0, pro: 1, premium: 2, enterprise: 3 };
    const userPlan = profile.subscription_plan || 'free';

    if (planLevels[userPlan] >= planLevels[requiredPlan]) {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
    setLoading(false);
  }, [isAuthenticated, profile, requiredPlan]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!hasAccess) {
    return <FeatureLockingComponent featureName={featureName} requiredPlan={requiredPlan} benefits={benefits} />;
  }

  return <>{children}</>;
};

export default FeatureGate;
