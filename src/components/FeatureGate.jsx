
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import FeatureLockingComponent from './FeatureLockingComponent.jsx';
import { Loader2 } from 'lucide-react';

const FeatureGate = ({ featureName, requiredPlan = 'pro', benefits = [], children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Fetch user's active subscription
        const records = await pb.collection('subscriptions').getList(1, 1, {
          filter: `user_id="${currentUser.id}" && status="active"`,
          $autoCancel: false
        });

        const planLevels = { free: 0, pro: 1, premium: 2, enterprise: 3 };
        const userPlan = records.items.length > 0 ? records.items[0].plan : 'free';
        
        if (planLevels[userPlan] >= planLevels[requiredPlan]) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, currentUser, requiredPlan]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!hasAccess) {
    return <FeatureLockingComponent featureName={featureName} requiredPlan={requiredPlan} benefits={benefits} />;
  }

  return <>{children}</>;
};

export default FeatureGate;
