# Application SIG Web 3D - CesiumJS

Application SIG Web 3D professionnelle développée avec **CesiumJS**, **React**, **TypeScript**, et **HeroUI**. Cette application permet de visualiser des points d'intérêt (POI) en 3D, d'afficher des popups interactifs au clic, et de géolocaliser l'utilisateur en temps réel.

## 🎯 Objectifs

- **Visualisation 3D** : Affichage d'une carte 3D haute résolution avec CesiumJS
- **Points d'intérêt** : Chargement et affichage de POI depuis des fichiers GeoJSON
- **Interactivité** : Popup HeroUI personnalisé au clic sur un POI
- **Géolocalisation** : Suivi de la position utilisateur en temps réel
- **Architecture propre** : Respect des principes SOLID, SRP, et KISS
- **Tests** : Tests Playwright (E2E) et Jest (unitaires)

## 🚀 Technologies utilisées

### Frontend

- **React 19** + **Vite** (TypeScript strict)
- **CesiumJS** : Moteur 3D géospatial
- **HeroUI** (ex-NextUI) : Composants UI modernes
- **Material UI Icons** : Bibliothèque d'icônes professionnelles
- **Tailwind CSS** : Framework CSS utilitaire
- **Framer Motion** : Animations fluides

### Développement

- **TypeScript** : Typage strict (no `any` autorisé)
- **ESLint** : Linting avec règles strictes
- **Prettier** : Formatage automatique on save
- **Husky** : Pre-commit hooks (lint-staged)

### Tests

- **Playwright** : Tests E2E (interaction UI)
- **Jest** : Tests unitaires (services, data layer)
- **@testing-library/react** : Tests de composants React

## 📁 Structure du projet

```
my-cesium-app/
├── src/
│   ├── core/
│   │   ├── models/          # Modèles TypeScript (POI, GeoJSON)
│   │   └── utils/           # Utilitaires génériques
│   ├── features/
│   │   ├── poi/             # Feature POI (Layer, Popup)
│   │   └── geolocation/     # Feature géolocalisation
│   ├── components/          # Composants UI génériques
│   │   └── CesiumViewer.tsx # Viewer Cesium principal
│   ├── services/            # Services métier (GeoJSON loader)
│   └── assets/
│       └── data/            # Fichiers GeoJSON
├── tests/
│   ├── e2e/                 # Tests Playwright
│   └── unit/                # Tests Jest
├── .husky/                  # Git hooks
└── playwright-report/       # Rapports de tests E2E
```

## 🛠️ Installation

### Prérequis

- **Node.js** >= 18
- **pnpm** (recommandé) ou npm

### Étapes

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Application accessible sur http://localhost:5173
```

## 📦 Scripts disponibles

```bash
# Développement
pnpm dev              # Lancer le serveur dev (Vite)

# Production
pnpm build            # Build de production (TypeScript + Vite)
pnpm preview          # Preview du build

# Qualité du code
pnpm lint             # Vérifier le code avec ESLint
pnpm lint:fix         # Corriger automatiquement les erreurs ESLint
pnpm format           # Formater le code avec Prettier
pnpm format:check     # Vérifier le formatage

# Tests
pnpm test             # Lancer tous les tests (Jest + Playwright)
pnpm test:unit        # Tests unitaires Jest
pnpm test:e2e         # Tests E2E Playwright
```

## 🗺️ Architecture et principes

### Principes de conception

- **SOLID** : Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **SRP** : Chaque module a une responsabilité unique
- **KISS** : Keep It Simple, Stupid
- **Clean Code** : Code lisible, maintenable, et testable

### Séparation des responsabilités

- **`core/`** : Logique métier et modèles de données
- **`features/`** : Modules applicatifs (POI, géolocalisation)
- **`components/`** : Composants UI réutilisables
- **`services/`** : Accès aux données (GeoJSON, API)

### Gestion d'état

- État local React (useState, useRef)
- Pas de Redux pour cette démo (peut être ajouté plus tard)

## 🎨 Fonctionnalités

### 1. Visualisation 3D

- Carte 3D CesiumJS avec fond haute résolution (Bing Maps Aerial)
- Terrain 3D avec élévation (Cesium World Terrain)
- Éclairage dynamique et atmosphère

### 2. Points d'intérêt (POI)

- Chargement depuis fichiers GeoJSON
- Affichage de marqueurs colorés (chalet, station de ski, restaurant, viewpoint)
- Labels dynamiques avec le nom du POI

### 3. Popup interactif

- Popup personnalisé avec overlay glassmorphism
- Affichage : icône Material UI, description, coordonnées, altitude
- Style cohérent avec design moderne (backdrop-blur, transparence)
- Bouton "Voir sur Google Maps"

### 4. Géolocalisation

- Bouton de géolocalisation en bas à droite
- Affichage de la position utilisateur sur la carte
- Cercle de précision limité à 100m de rayon
- Style glassmorphism cohérent avec l'UI
- Centrage automatique sur la position

### 5. Contrôles natifs Cesium

- **Bouton Home** : Retour à Courchevel (position par défaut)
- **Bouton d'aide** : Affichage des contrôles de navigation Cesium
- Navigation clavier : Flèches / WASD / Q-E

## 🧪 Tests

### Tests E2E (Playwright)

```bash
pnpm test:e2e
```

- Vérification du chargement de la carte 3D
- Affichage des contrôles natifs Cesium (Home, Help)
- Présence et positionnement du bouton de géolocalisation (bas à droite)
- Absence d'erreurs console (hors warnings Cesium)

### Tests unitaires (Jest)

```bash
pnpm test:unit
```

- Tests du service GeoJSONLoader
- Conversion GeoJSON → POI
- Validation des types de POI
- Filtrage des géométries non-Point

### Couverture de code

```bash
pnpm test:unit --coverage
```

Objectif : **70% minimum** (branches, functions, lines, statements)

## 📝 Données d'exemple

Le fichier [`src/assets/data/pois.geojson`](src/assets/data/pois.geojson) contient 10 POI dans les Alpes :

- 3 chalets
- 3 stations de ski (Chamonix, Les Deux Alpes, Alpe d'Huez)
- 2 restaurants
- 2 points de vue (Aiguille du Midi, Belvédère de la Meije)

Format GeoJSON standard :

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [6.8657, 45.8326, 1850]
      },
      "properties": {
        "id": "chalet-001",
        "name": "Chalet du Mont Blanc",
        "type": "chalet",
        "description": "...",
        "altitude": 1850
      }
    }
  ]
}
```

## 🔧 Configuration

### Vite

- Plugin Cesium (`vite-plugin-cesium`)
- Alias `@` → `src/`
- Optimisation des dépendances (Cesium)

### Tailwind CSS

- Configuration HeroUI
- Mode dark (`darkMode: 'class'`)
- Content paths pour purge CSS

### ESLint

- Règles strictes (no `any`, unused vars, console)
- React Hooks exhaustive deps
- React Refresh warnings

### Prettier

- Single quotes, trailing comma ES5
- Print width 100
- Import order plugin

## 🚧 Développement futur

- [ ] Connexion à une API backend (PostGIS, WFS)
- [ ] Filtrage dynamique des POI par type
- [ ] Calcul d'itinéraires 3D
- [ ] Profil vertical (terrain elevation)
- [ ] Export de données (CSV, KML)
- [ ] Mode sombre / clair
- [ ] Internationalisation (i18n)

## 📚 Documentation

- [CesiumJS Documentation](https://cesium.com/learn/cesiumjs-learn/)
- [HeroUI Documentation](https://www.heroui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Playwright Documentation](https://playwright.dev/)

## 👨‍💻 Développeur

Projet développé selon les principes **Clean Code** et **SOLID**, avec une architecture modulaire et testable.

**Tech Stack** : React 19 + TypeScript + CesiumJS + HeroUI + Material UI Icons + Vite + Playwright + Jest

## 🎨 Design

L'application utilise un design moderne **glassmorphism** :

- Fonds semi-transparents avec `backdrop-blur`
- Dégradés subtils (`from-black/60 to-black/40`)
- Bordures translucides (`border-white/20`)
- Ombres portées prononcées (`shadow-2xl`)
- Icônes Material UI pour une cohérence visuelle

Ce style donne une interface épurée et élégante qui s'intègre naturellement avec le globe 3D Cesium.

---

**Licence** : MIT
