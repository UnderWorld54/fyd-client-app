import { AnalyticsConfig } from '@/services/analytics.service';

// Configuration des analytics
// Remplacez ces valeurs par vos vraies clés API
export const analyticsConfig: AnalyticsConfig = {
  enabled: true,
  
  // Mixpanel - Créez un compte sur https://mixpanel.com
  // Obtenez votre token dans Project Settings > Project Token
  mixpanelToken: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN || 'YOUR_MIXPANEL_TOKEN',
  
  // PostHog - Créez un compte sur https://posthog.com
  // Obtenez votre clé API dans Project Settings > API Keys
  posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'YOUR_POSTHOG_API_KEY',
  
  // Google Analytics (optionnel)
  googleAnalyticsId: process.env.EXPO_PUBLIC_GA_ID || 'YOUR_GOOGLE_ANALYTICS_ID',
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

// Instructions pour configurer les services d'analytics
export const ANALYTICS_SETUP_INSTRUCTIONS = {
  mixpanel: {
    name: 'Mixpanel',
    url: 'https://mixpanel.com',
    steps: [
      '1. Créez un compte sur Mixpanel',
      '2. Créez un nouveau projet',
      '3. Allez dans Project Settings > Project Token',
      '4. Copiez le token et ajoutez-le dans .env : EXPO_PUBLIC_MIXPANEL_TOKEN=your_token',
    ],
    features: [
      'Analytics en temps réel',
      'Funnels et cohortes',
      'A/B testing',
      'Interface no-code',
      'Export de données',
    ],
  },
  posthog: {
    name: 'PostHog',
    url: 'https://posthog.com',
    steps: [
      '1. Créez un compte sur PostHog',
      '2. Créez un nouveau projet',
      '3. Allez dans Project Settings > API Keys',
      '4. Copiez la clé API et ajoutez-la dans .env : EXPO_PUBLIC_POSTHOG_API_KEY=your_key',
    ],
    features: [
      'Analytics open source',
      'Session recordings',
      'Feature flags',
      'A/B testing',
      'Interface no-code',
    ],
  },
}; 