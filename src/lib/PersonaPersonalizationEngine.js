
/**
 * PersonaPersonalizationEngine
 * Determines the most relevant landing page persona based on user context.
 */

export const PERSONAS = {
  STRESS_FREE: 'stress-free',
  BUDGET: 'budget',
  FAMILY: 'family',
  ADVENTURE: 'adventure',
  SOLO: 'solo',
  LUXURY: 'luxury',
  BUSINESS: 'business',
  HONEYMOON: 'honeymoon'
};

export const determinePersona = () => {
  if (typeof window === 'undefined') return PERSONAS.STRESS_FREE;

  // 1. Manual Override via URL Params (Highest Priority)
  const urlParams = new URLSearchParams(window.location.search);
  const forcePersona = urlParams.get('persona');
  if (forcePersona && Object.values(PERSONAS).includes(forcePersona)) {
    localStorage.setItem('assigned_persona', forcePersona);
    return forcePersona;
  }

  // 2. Existing Assigned Persona (Sticky Session)
  const savedPersona = localStorage.getItem('assigned_persona');
  if (savedPersona && Object.values(PERSONAS).includes(savedPersona)) {
    return savedPersona;
  }

  // 3. Traffic Source / Referrer Logic
  const referrer = document.referrer.toLowerCase();
  const utmSource = urlParams.get('utm_source')?.toLowerCase() || '';
  const utmCampaign = urlParams.get('utm_campaign')?.toLowerCase() || '';

  if (utmCampaign.includes('family') || referrer.includes('parenting')) return setAndReturn(PERSONAS.FAMILY);
  if (utmCampaign.includes('budget') || referrer.includes('deals')) return setAndReturn(PERSONAS.BUDGET);
  if (utmCampaign.includes('luxury') || referrer.includes('firstclass')) return setAndReturn(PERSONAS.LUXURY);
  if (utmCampaign.includes('business') || referrer.includes('linkedin')) return setAndReturn(PERSONAS.BUSINESS);
  if (utmCampaign.includes('honeymoon') || referrer.includes('wedding')) return setAndReturn(PERSONAS.HONEYMOON);
  if (utmCampaign.includes('solo') || referrer.includes('backpack')) return setAndReturn(PERSONAS.SOLO);
  if (utmCampaign.includes('adventure') || referrer.includes('outdoors')) return setAndReturn(PERSONAS.ADVENTURE);

  // 4. Device & Time Context (Fallback Heuristics)
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const hour = new Date().getHours();
  
  // Example heuristic: Late night mobile users might be stressed planners or solo travelers
  if (isMobile && (hour < 6 || hour > 22)) {
    // A/B split between Solo and Stress-Free for late night mobile
    return setAndReturn(Math.random() > 0.5 ? PERSONAS.SOLO : PERSONAS.STRESS_FREE);
  }

  // 5. Default A/B/C Testing Rotation for generic traffic
  const random = Math.random();
  let assigned = PERSONAS.STRESS_FREE; // 40% default
  
  if (random > 0.4 && random <= 0.6) assigned = PERSONAS.FAMILY; // 20%
  else if (random > 0.6 && random <= 0.8) assigned = PERSONAS.BUDGET; // 20%
  else if (random > 0.8) assigned = PERSONAS.ADVENTURE; // 20%

  return setAndReturn(assigned);
};

const setAndReturn = (persona) => {
  localStorage.setItem('assigned_persona', persona);
  return persona;
};
