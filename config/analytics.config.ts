import { AnalyticsConfig } from '@/services/analytics.service';

// Configuration des analytics
export const analyticsConfig: AnalyticsConfig = {
  enabled: true,
  
  mixpanelToken: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
  
  posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  
};

// Configuration par environnement
export const getAnalyticsConfig = (): AnalyticsConfig => {
  const isDevelopment = __DEV__;
  
  return {
    ...analyticsConfig,
    // Désactiver certains services en développement si nécessaire
    enabled: analyticsConfig.enabled && !isDevelopment,
  };
};
