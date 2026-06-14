# Order Intelligence Module

Module d'intelligence pour les commandes utilisant ML et l'analyse de données historiques.

## 🎯 Fonctionnalités

### 1. Suggestions de Commandes
- Recommandations de produits basées sur l'historique
- Prise en compte des promotions actives
- Quantités optimales suggérées
- Intégration avec le service ML

### 2. Prédictions de Commandes
- Prédiction de la prochaine commande
- Analyse des tendances
- Facteurs influents
- Mode fallback si ML service indisponible

### 3. Optimisations
- Fréquence de commande optimale
- Valeur de commande suggérée
- Économies potentielles
- Recommandations d'optimisation

### 4. Traitement Asynchrone
- Queue pour les tâches longues
- Traitement en arrière-plan
- Scalabilité améliorée

## 📡 API Endpoints

### Suggestions de Commandes
```typescript
// Synchrone
POST /order-intelligence/suggestions/:outletId
Body: { userId?: string }
Response: OrderSuggestion[]

// Asynchrone
POST /order-intelligence/suggestions/:outletId/async
Body: { userId?: string }
Response: { jobId: string }
```

### Prédictions de Commandes
```typescript
// Synchrone
GET /order-intelligence/predict/:outletId
Response: OrderPrediction

// Asynchrone
POST /order-intelligence/predict/:outletId/async
Response: { jobId: string }
```

### Prédictions en Bulk
```typescript
POST /order-intelligence/predict/bulk
Body: { outletIds: string[] }
Response: { predictions: Record<string, OrderPrediction> }
```

### Optimisations
```typescript
GET /order-intelligence/optimizations/:outletId
Response: OrderOptimization
```

## 🔧 Utilisation

### Dans le Backend NestJS

```typescript
// Injecter le service
constructor(
  private orderIntelligenceService: OrderIntelligenceService
) {}

// Obtenir des suggestions
const suggestions = await this.orderIntelligenceService.getOrderSuggestions(
  'outlet-123',
  'user-456'
);

// Prédire la prochaine commande
const prediction = await this.orderIntelligenceService.predictNextOrder('outlet-123');

// Optimisations
const optimizations = await this.orderIntelligenceService.getOrderOptimizations('outlet-123');
```

### Depuis le Frontend

```typescript
// Appels API
const suggestions = await api.post('/order-intelligence/suggestions/outlet-123', {
  userId: 'user-456'
});

const prediction = await api.get('/order-intelligence/predict/outlet-123');
```

## 📊 Structures de Données

### OrderSuggestion
```typescript
{
  productId: string;
  productName: string;
  suggestedQty: number;
  confidence: number;
  reason: string;
  promotion?: {
    discount: number;
    validUntil: Date;
  };
}
```

### OrderPrediction
```typescript
{
  predictedQty: number;
  confidence: number;
  factors: string[];
  method: string;
}
```

### OrderOptimization
```typescript
{
  outletId: string;
  optimalOrderFrequency: number;
  suggestedOrderValue: number;
  potentialSavings: number;
  recommendations: string[];
}
```

## 🔄 Workflow

### 1. Suggestions de Commandes
```
1. Requête API → Order Intelligence Service
2. Récupération données historiques outlet
3. Appel ML Service (ou fallback)
4. Enrichissement avec promotions
5. Retour suggestions enrichies
```

### 2. Prédictions
```
1. Requête API → Order Intelligence Service
2. Analyse historique
3. Calcul features (avg qty, frequency, trends)
4. Appel ML Service
5. Retour prédiction avec confidence
```

### 3. Asynchrone
```
1. Requête API → Queue Service
2. Job ajouté à queue Bull
3. Processor traite en arrière-plan
4. Résultat disponible via job ID
```

## 🎨 Intégration UI

Exemple d'intégration dans le formulaire de commande:

```typescript
// Dans le composant de commande
const [suggestions, setSuggestions] = useState([]);

useEffect(() => {
  loadSuggestions();
}, [outletId]);

const loadSuggestions = async () => {
  const data = await api.post(`/order-intelligence/suggestions/${outletId}`);
  setSuggestions(data.data);
};

// Afficher les suggestions
{suggestions.map(suggestion => (
  <SuggestionCard 
    key={suggestion.productId}
    suggestion={suggestion}
    onAddToOrder={handleAddToOrder}
  />
))}
```

## ⚙️ Configuration

Variables d'environnement nécessaires:
```env
ML_SERVICE_URL="http://localhost:8000"
ML_SERVICE_TIMEOUT="30000"
```

## 🧪 Testing

### Test Endpoint
```bash
# Suggestions
curl -X POST http://localhost:3000/order-intelligence/suggestions/outlet-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-456"}'

# Prédiction
curl http://localhost:3000/order-intelligence/predict/outlet-123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Optimisations
curl http://localhost:3000/order-intelligence/optimizations/outlet-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔍 Dépannage

### Problème: ML service connection failed
**Solution**: Vérifier que le ML Service est démarré
```bash
curl http://localhost:8000/health
```

### Problème: No historical data
**Solution**: Le système utilise des valeurs par défaut et des règles fallback

### Problème: Queue jobs not processing
**Solution**: Vérifier que Redis est actif et que les processors sont enregistrés

## 📈 Améliorations Futures

1. **ML Models Réels**: Remplacer les règles par des modèles ML entraînés
2. **Real-time Learning**: Apprentissage continu des nouvelles commandes
3. **A/B Testing**: Tester différentes stratégies de recommandation
4. **Personalisation Avancée**: Plus de facteurs personnels
5. **Cross-selling**: Recommandations de produits complémentaires

---

**Module créé le**: 2026-06-11
**Version**: 1.0.0