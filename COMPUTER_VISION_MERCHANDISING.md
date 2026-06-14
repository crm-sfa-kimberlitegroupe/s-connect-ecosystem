# Computer Vision Merchandising Module

Module d'intégration Computer Vision pour l'analyse automatique des photos de rayons et la compliance merchandising.

## 🎯 Fonctionnalités

### 1. Analyse de Photos de Rayons
- Détection automatique des produits
- Calcul de la part de rayon (share of shelf)
- Vérification de la compliance
- Identification des problèmes

### 2. Vérification de Planogram
- Comparaison photo vs planogram attendu
- Détection des produits mal placés
- Identification des produits manquants
- Recommandations de correction

### 3. Vérification des Prix
- Détection automatique des étiquettes de prix
- Comparaison avec les prix attendus
- Identification des erreurs de pricing
- Taux de précision global

### 4. Insights Merchandising
- Analyse des tendances par territoire
- Identification des problèmes fréquents
- Recommandations d'amélioration
- Métriques de performance

## 📡 API Endpoints

### Analyse de Photos
```typescript
// Synchrone
POST /merchandising/cv/analyze/:merchCheckId
Body: { imageUrl: string }
Response: ShelfAnalysis

// Asynchrone
POST /merchandising/cv/analyze/:merchCheckId/async
Body: { imageUrl: string }
Response: { jobId: string }
```

### Vérification Planogram
```typescript
POST /merchandising/cv/check-planogram/:merchCheckId
Body: { 
  shelfImageUrl: string;
  planogramData: any;
}
Response: PlanogramCheck
```

### Vérification des Prix
```typescript
POST /merchandising/cv/verify-prices/:merchCheckId
Body: {
  imageUrl: string;
  expectedPrices: Record<string, number>;
}
Response: PriceVerification
```

### Insights
```typescript
GET /merchandising/cv/insights/:territoryId
Response: MerchandisingInsights
```

## 🔧 Utilisation

### Dans le Backend NestJS

```typescript
// Injecter le service
constructor(
  private computerVisionService: ComputerVisionService
) {}

// Analyser une photo de rayon
const analysis = await this.computerVisionService.analyzeShelfPhoto(
  'merch-check-123',
  'https://example.com/shelf-photo.jpg'
);

// Vérifier compliance planogram
const planogramCheck = await this.computerVisionService.checkPlanogramCompliance(
  'merch-check-123',
  'https://example.com/shelf-photo.jpg',
  { products: [...] }
);

// Générer des insights
const insights = await this.computerVisionService.generateMerchandisingInsights(
  'territory-456'
);
```

### Depuis le Frontend

```typescript
// Analyse de photo
const analysis = await api.post('/merchandising/cv/analyze/merch-check-123', {
  imageUrl: photoUrl
});

// Afficher les résultats
{
  "detectedProducts": [...],
  "complianceScore": 0.85,
  "shareOfShelf": {
    "brand-1": 0.45,
    "brand-2": 0.35
  },
  "issues": ["Missing product-003"]
}
```

## 📊 Structures de Données

### ShelfAnalysis
```typescript
{
  imageUrl: string;
  detectedProducts: [{
    productId: string;
    productName: string;
    confidence: number;
    position: { x, y, width, height };
    facingCount: number;
    shelfShare: number;
  }];
  complianceScore: number;
  shareOfShelf: Record<string, number>;
  issues: string[];
  analysisMethod: string;
}
```

### PlanogramCheck
```typescript
{
  shelfImageUrl: string;
  complianceScore: number;
  matchedProducts: string[];
  misplacedProducts: string[];
  missingProducts: string[];
  extraProducts: string[];
  recommendations: string[];
}
```

### MerchandisingInsights
```typescript
{
  territoryId: string;
  period: string;
  totalChecks: number;
  averageComplianceScore: number;
  productVisibility: Record<string, {
    visibilityRate: number;
    priceAccuracy: number;
    stockRate: number;
  }>;
  commonIssues: string[];
  recommendations: string[];
}
```

## 🔄 Workflow

### 1. Analyse de Photo de Rayon
```
1. Upload photo par vendeur
2. Appel CV Service → ML Service
3. Analyse avec TensorFlow/YOLO
4. Détection produits + compliance
5. Sauvegarde résultats
6. Retour insights + recommandations
```

### 2. Vérification Planogram
```
1. Photo du rayon
2. Données planogram attendu
3. Comparaison CV
4. Identification écarts
5. Recommandations correction
```

## 🎨 Intégration UI

### Component Photo Analysis
```typescript
// Dans le composant Merchandising
const [analysis, setAnalysis] = useState(null);
const [analyzing, setAnalyzing] = useState(false);

const analyzePhoto = async (photoUrl: string) => {
  setAnalyzing(true);
  try {
    const result = await api.post(`/merchandising/cv/analyze/${merchCheckId}`, {
      imageUrl: photoUrl
    });
    setAnalysis(result.data);
  } finally {
    setAnalyzing(false);
  }
};

// Affichage
{analyzing && <LoadingSpinner />}
{analysis && (
  <ShelfAnalysisResults 
    complianceScore={analysis.complianceScore}
    detectedProducts={analysis.detectedProducts}
    issues={analysis.issues}
  />
)}
```

## 🧪 Testing

### Test CV Analysis
```bash
curl -X POST http://localhost:3000/merchandising/cv/analyze/merch-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/shelf.jpg"
  }'
```

### Test Planogram Check
```bash
curl -X POST http://localhost:3000/merchandising/cv/check-planogram/merch-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shelfImageUrl": "https://example.com/shelf.jpg",
    "planogramData": {
      "products": [
        {"productId": "prod-1", "position": "A1"},
        {"productId": "prod-2", "position": "A2"}
      ]
    }
  }'
```

## 🔍 Dépannage

### Problème: ML service not available
**Solution**: 
- Vérifier que le ML Service est démarré: `curl http://localhost:8000/health`
- Le système utilisera un fallback avec des données simulées

### Problème: Low confidence results
**Solution**: 
- Améliorer la qualité des photos
- Entraîner le modèle avec plus de données
- Ajuster les seuils de confiance

### Problème: Analysis takes too long
**Solution**: 
- Utiliser le mode asynchrone
- Optimiser les images avant envoi
- Utiliser des queues pour le traitement

## 📈 Améliorations Futures

### Phase 2: Modèles CV Réels
1. **Dataset Preparation**: Collecter des images de rayons annotées
2. **Model Training**: Entraîner YOLO/TensorFlow avec vos produits
3. **Optimization**: Optimiser pour performance mobile
4. **Real-time Processing**: Traitement en temps réel

### Phase 3: Avancé
1. **Part de Rayon en Centimètres**: Measurement précis vs facings
2. **Concurrent Detection**: Détection automatique des produits concurrents
3. **POSM Detection**: Détection du matériel promotionnel
4. **Seasonal Analysis**: Analyse des tendances saisonnières

### Phase 4: Intelligence
1. **Automated Alerts**: Alertes automatiques sur problèmes détectés
2. **Predictive Compliance**: Prédiction des problèmes avant visite
3. **Optimization Suggestions**: Suggestions d'optimisation du planogram
4. **ROI Analysis**: Analyse ROI des actions merchandising

## 🎯 Cas d'Utilisation

### Cas 1: Visite de Vendeur
1. Vendeur prend photo du rayon
2. Système analyse automatiquement
3. Identifie produits manquants/mal placés
4. Suggère actions correctives
5. Sauvegarde pour analytics

### Cas 2: Audit Merchandising
1. Merchandiser visite PDV
2. Prend plusieurs photos
3. Analyse compliance planogram
4. Génère rapport détaillé
5. Planifie actions correctives

### Cas 3: Monitoring Régional
1. Manager demande insights territoire
2. Système analyse checks récents
3. Identifie problèmes récurrents
4. Génère recommandations
5. Planifie interventions ciblées

---

**Module créé le**: 2026-06-11
**Version**: 1.0.0 (Mode PoC avec simulation ML)