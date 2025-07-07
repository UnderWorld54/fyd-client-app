// Exemple de configuration des variables d'environnement
// Copiez ce fichier vers .env et remplissez vos vraies clés API

export const ENV_EXAMPLE = {
  // Mixpanel - Créez un compte sur https://mixpanel.com
  // Obtenez votre token dans Project Settings > Project Token
  EXPO_PUBLIC_MIXPANEL_TOKEN: 'your_mixpanel_token_here',
  
  // PostHog - Créez un compte sur https://posthog.com
  // Obtenez votre clé API dans Project Settings > API Keys
  EXPO_PUBLIC_POSTHOG_API_KEY: 'your_posthog_api_key_here',
  
  // Google Analytics (optionnel)
  // Obtenez votre ID dans Google Analytics
  EXPO_PUBLIC_GA_ID: 'your_google_analytics_id_here',
};

// Instructions pour créer le fichier .env :
/*
1. Créez un fichier .env à la racine du projet
2. Ajoutez les variables suivantes :

EXPO_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here
EXPO_PUBLIC_POSTHOG_API_KEY=your_posthog_api_key_here
EXPO_PUBLIC_GA_ID=your_google_analytics_id_here

3. Remplacez les valeurs par vos vraies clés API
4. Ne committez jamais le fichier .env dans Git
*/ 