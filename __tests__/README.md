# Tests de l'application FYD

## Vue d'ensemble

Cette suite de tests couvre les composants principaux et les services de l'application. Les tests sont organisés de manière logique et utilisent Jest avec React Native Testing Library.

## Structure des tests

### Composants testés

**Button** - Teste le rendu du composant bouton avec ses différentes variantes (primaire/secondaire) et vérifie que les interactions tactiles fonctionnent correctement.

**Header** - Vérifie l'affichage du titre, la gestion des composants additionnels, et la troncature automatique des titres trop longs.

### Services testés

**Service d'authentification** - Couvre toutes les opérations d'authentification : connexion, inscription, déconnexion et récupération des données utilisateur. Inclut la gestion des erreurs et des échecs de connexion.

**Service d'événements** - Teste la récupération des événements par ville et centres d'intérêt, la gestion des événements utilisateur, et la suppression d'événements.

**Service utilisateur** - Vérifie les mises à jour de profil utilisateur et la suppression de compte, avec gestion des cas d'erreur.

## Infrastructure

Les tests utilisent des mocks complets des services pour isoler la logique métier. Un fichier d'utilitaires centralise les données de test et les fonctions helper pour éviter la duplication de code.

## Couverture

Les tests couvrent à la fois les cas de succès et les cas d'échec, garantissant une robustesse dans la gestion des erreurs. Chaque service est testé avec des scénarios réalistes correspondant aux fonctionnalités de l'application. 