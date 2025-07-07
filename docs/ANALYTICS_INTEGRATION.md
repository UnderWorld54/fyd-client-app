# Guide d'Intégration des Analytics - FYD App

## Vue d'ensemble

Ce guide détaille l'intégration d'outils d'analytics no-code dans l'application mobile FYD. L'objectif est de collecter des données d'utilisation pour améliorer l'expérience utilisateur et prendre des décisions basées sur les données.

## Services d'Analytics Intégrés

### 1. Mixpanel (Principal)
- **URL**: https://mixpanel.com
- **Type**: Analytics en temps réel avec interface no-code
- **Fonctionnalités**:
  - Funnels et cohortes
  - A/B testing
  - Export de données
  - Interface drag & drop

### 2. PostHog (Alternative)
- **URL**: https://posthog.com
- **Type**: Analytics open source avec interface no-code
- **Fonctionnalités**:
  - Session recordings
  - Feature flags
  - A/B testing
  - Interface intuitive

## Configuration

### Étape 1: Créer les comptes analytics

#### Mixpanel
1. Allez sur https://mixpanel.com
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Allez dans **Project Settings > Project Token**
5. Copiez le token

#### PostHog
1. Allez sur https://posthog.com
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Allez dans **Project Settings > API Keys**
5. Copiez la clé API

### Étape 2: Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Analytics Configuration
EXPO_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here
EXPO_PUBLIC_POSTHOG_API_KEY=your_posthog_api_key_here
EXPO_PUBLIC_GA_ID=your_google_analytics_id_here
```

### Étape 3: Vérifier la configuration

Le fichier `config/analytics.config.ts` contient la configuration par défaut. Les variables d'environnement remplaceront automatiquement les valeurs par défaut.

## Architecture Technique

### Structure des fichiers

```
services/
├── analytics.service.ts     # Service principal d'analytics
├── auth.service.ts          # Service d'authentification
└── ...

hooks/
├── useAnalytics.ts          # Hook pour utiliser les analytics
└── ...

config/
├── analytics.config.ts      # Configuration des analytics
└── ...

app/
├── _layout.tsx             # Initialisation des analytics
├── main/index.tsx          # Exemple d'utilisation
└── auth/sign-in.tsx        # Exemple d'utilisation
```

### Service d'Analytics (`services/analytics.service.ts`)

Le service centralise toutes les interactions avec les plateformes d'analytics :

```typescript
// Initialisation
await analyticsService.initialize({
  mixpanelToken: 'your_token',
  posthogApiKey: 'your_key',
  enabled: true
});

// Tracker un événement
await analyticsService.trackEvent({
  name: 'User Signed Up',
  properties: {
    method: 'email',
    source: 'landing_page'
  }
});

// Identifier un utilisateur
await analyticsService.identifyUser({
  userId: 'user_123',
  email: 'user@example.com',
  name: 'John Doe'
});
```

### Hook d'Analytics (`hooks/useAnalytics.ts`)

Hook React pour faciliter l'utilisation dans les composants :

```typescript
const { trackEvent, trackScreen, identifyUser } = useAnalytics();

// Tracker un écran
useScreenTracking('Home Screen');

// Tracker un événement
trackEvent({
  name: 'Button Clicked',
  properties: { button_name: 'sign_up' }
});
```

## Événements Prédéfinis

### Authentification
- `User Signed Up` - Inscription d'un utilisateur
- `User Signed In` - Connexion d'un utilisateur
- `User Signed Out` - Déconnexion d'un utilisateur

### Navigation
- `Screen View` - Affichage d'un écran

### Fonctionnalités
- `Interest Selected` - Sélection d'un intérêt
- `Event Created` - Création d'un événement
- `Event Joined` - Rejoindre un événement

### Erreurs
- `Error Occurred` - Erreur dans l'application

### Performance
- `App Opened` - Ouverture de l'application
- `App Backgrounded` - Application en arrière-plan

## Utilisation dans les Composants

### Exemple 1: Tracking d'écran automatique

```typescript
import { useScreenTracking } from '@/hooks/useAnalytics';

export default function HomeScreen() {
  // Tracker automatiquement cette page
  useScreenTracking('Home Screen');
  
  return (
    <View>
      {/* Contenu de l'écran */}
    </View>
  );
}
```

### Exemple 2: Tracking d'événements personnalisés

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsEvents } from '@/services/analytics.service';

export default function SignUpScreen() {
  const { trackEvent } = useAnalytics();
  
  const handleSignUp = async () => {
    try {
      // Logique d'inscription
      await authService.signUp(userData);
      
      // Tracker l'événement
      trackEvent({
        name: AnalyticsEvents.USER_SIGNED_UP,
        properties: {
          method: 'email',
          source: 'signup_screen',
          timestamp: new Date().toISOString()
        }
      });
      
      // Identifier l'utilisateur
      identifyUser(userData.id, {
        email: userData.email,
        name: userData.name
      });
      
    } catch (error) {
      // Tracker l'erreur
      trackEvent({
        name: AnalyticsEvents.ERROR_OCCURRED,
        properties: {
          error_type: 'signup_error',
          error_message: error.message
        }
      });
    }
  };
  
  return (
    <View>
      {/* Formulaire d'inscription */}
    </View>
  );
}
```

### Exemple 3: Tracking d'erreurs

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

export default function ErrorBoundary() {
  const { trackError } = useAnalytics();
  
  useEffect(() => {
    const handleError = (error: Error) => {
      trackError(error, {
        component: 'ErrorBoundary',
        user_action: 'unknown'
      });
    };
    
    // Logique de gestion d'erreur
  }, [trackError]);
}
```

## Données Collectées

### Informations de base
- ID utilisateur unique
- Timestamp des événements
- Informations sur l'appareil (plateforme, version, modèle)
- Version de l'application

### Données utilisateur (optionnelles)
- Email
- Nom
- Propriétés personnalisées

### Données d'événements
- Nom de l'événement
- Propriétés contextuelles
- Source de l'événement

## Sécurité et Confidentialité

### Conformité RGPD
- Les données sont anonymisées par défaut
- L'utilisateur peut désactiver les analytics
- Pas de collecte de données personnelles sensibles

### Stockage local
- ID utilisateur stocké localement
- Pas de données sensibles dans les logs

### Contrôle utilisateur
```typescript
// Désactiver les analytics
analyticsService.setEnabled(false);

// Réinitialiser les données
await analyticsService.reset();
```

## Monitoring et Debugging

### Logs de développement
En mode développement, tous les événements sont loggés dans la console :

```
Event tracked: {
  name: "User Signed Up",
  userId: "user_123",
  properties: { method: "email" },
  timestamp: "2024-01-01T12:00:00.000Z"
}
```

### Vérification des données
1. **Mixpanel**: Dashboard en temps réel
2. **PostHog**: Interface de capture d'événements
3. **Console**: Logs détaillés en développement

## Tests

### Tests unitaires
```typescript
import { analyticsService } from '@/services/analytics.service';

describe('Analytics Service', () => {
  beforeEach(() => {
    analyticsService.reset();
  });
  
  it('should track events correctly', async () => {
    await analyticsService.initialize({ enabled: true });
    await analyticsService.trackEvent({
      name: 'Test Event',
      properties: { test: true }
    });
    
    // Vérifications...
  });
});
```

### Tests d'intégration
- Vérifier que les événements arrivent dans Mixpanel/PostHog
- Tester les différents types d'événements
- Valider la structure des données

## Déploiement

### Production
1. Configurer les vraies clés API dans les variables d'environnement
2. Vérifier que les analytics sont activés
3. Tester la collecte de données

### Staging
1. Utiliser des projets de test séparés
2. Activer les logs détaillés
3. Valider la configuration

## Maintenance

### Mises à jour
- Surveiller les changements d'API des services
- Mettre à jour les dépendances régulièrement
- Tester après chaque mise à jour

### Monitoring
- Vérifier la santé des services d'analytics
- Surveiller les erreurs de tracking
- Analyser les métriques de performance

## Support

### Ressources utiles
- [Documentation Mixpanel](https://developer.mixpanel.com/)
- [Documentation PostHog](https://posthog.com/docs)
- [Guide Expo Analytics](https://docs.expo.dev/guides/analytics/)

### Contact
Pour toute question sur l'intégration des analytics, consultez la documentation des services ou contactez l'équipe de développement.

## Changelog

### Version 1.0.0 (2024-01-01)
- Intégration initiale de Mixpanel et PostHog
- Service d'analytics centralisé
- Hooks React pour faciliter l'utilisation
- Configuration par variables d'environnement
- Tracking automatique des écrans et événements 