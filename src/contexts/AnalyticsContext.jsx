
import React, { createContext, useEffect, useState } from 'react';

export const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState({
    persona: null,
    pageViews: 0,
    startTime: Date.now(),
  });

  useEffect(() => {
    // Initialize session
    const persona = localStorage.getItem('assigned_persona') || 'unknown';
    setSessionData(prev => ({ ...prev, persona, pageViews: prev.pageViews + 1 }));
    
    trackEvent('session_start', { persona, url: window.location.pathname });
  }, []);

  const trackEvent = (eventName, properties = {}) => {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      persona: sessionData.persona,
      ...properties
    };
    
    // Stub: In a real app, this would send to PostHog, Mixpanel, or custom backend
    console.log(`[Analytics Track] ${eventName}`, payload);
    
    // Store locally for demo purposes
    const history = JSON.parse(localStorage.getItem('analytics_history') || '[]');
    history.push(payload);
    localStorage.setItem('analytics_history', JSON.stringify(history.slice(-50))); // Keep last 50
  };

  const trackConversion = (conversionType, value = 0) => {
    trackEvent('conversion', { type: conversionType, value });
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackConversion, sessionData }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
