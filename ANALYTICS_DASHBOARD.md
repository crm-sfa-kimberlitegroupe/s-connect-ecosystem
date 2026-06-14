# Advanced Analytics Dashboard Module

Module d'analytics avancé pour dashboards et reporting dans le système SFA.

## 🎯 Fonctionnalités

### 1. Dashboard Metrics
- Métriques globales (ventes, commandes, visites)
- Taux de conversion
- Valeur moyenne des commandes
- Nombre d'outlets et vendeurs actifs
- Périodes configurables (7d, 30d, 90d, 1y)

### 2. Analytics par Territoire
- Performance par territoire/secteur
- Comparaison inter-territoires
- Taux de croissance
- Taux de conversion local

### 3. Séries Temporelles
- Ventes au fil du temps
- Granularité configurable (hourly, daily, weekly, monthly)
- Tendances et patterns

### 4. Top Products
- Produits les plus vendus
- Revenus par produit
- Volume des ventes
- Performance par marque

### 5. Top Outlets
- PDV les plus performants
- Revenus par outlet
- Segmentation par canal
- Performance territoriale

### 6. Performance Vendeurs
- Performance individuelle ou équipe
- Taux de conversion par vendeur
- Valeur moyenne des commandes
- Classement par performance

## 📡 API Endpoints

### Dashboard Metrics
```typescript
GET /analytics/dashboard?period=30d
Response: DashboardMetrics
```

### Territory Metrics
```typescript
GET /analytics/territories?territoryId=optional
Response: TerritoryMetrics[]
```

### Sales Time Series
```typescript
GET /analytics/sales/timeseries?period=30d&granularity=daily
Response: TimeSeriesData[]
```

### Top Products
```typescript
GET /analytics/products/top?period=30d&limit=10
Response: ProductPerformance[]
```

### Top Outlets
```typescript
GET /analytics/outlets/top?period=30d&limit=10
Response: OutletPerformance[]
```

### Vendor Performance
```typescript
GET /analytics/vendors/performance?userId=optional
Response: VendorPerformance[]
```

### Report Generation
```typescript
POST /analytics/reports/generate
Body: { reportType: string; config: any }
Response: { jobId: string }
```

## 🔧 Utilisation

### Dans le Backend NestJS

```typescript
// Injecter le service
constructor(
  private analyticsService: AnalyticsService
) {}

// Obtenir les métriques dashboard
const metrics = await this.analyticsService.getDashboardMetrics('30d');

// Analytics par territoire
const territoryMetrics = await this.analyticsService.getTerritoryMetrics('territory-123');

// Séries temporelles
const salesTrend = await this.analyticsService.getSalesTimeSeries('30d', 'weekly');

// Top produits
const topProducts = await this.analyticsService.getTopProducts('90d', 20);

// Performance vendeurs
const vendorPerf = await this.analyticsService.getVendorPerformance('user-456');
```

### Depuis le Frontend

```typescript
// Dashboard metrics
const metrics = await api.get('/analytics/dashboard', {
  params: { period: '30d' }
});

// Territory comparison
const territories = await api.get('/analytics/territories');

// Sales trend
const salesTrend = await api.get('/analytics/sales/timeseries', {
  params: { period: '90d', granularity: 'weekly' }
});

// Top products
const topProducts = await api.get('/analytics/products/top', {
  params: { period: '30d', limit: 10 }
});
```

## 📊 Structures de Données

### DashboardMetrics
```typescript
{
  totalSales: number;
  totalOrders: number;
  totalVisits: number;
  averageOrderValue: number;
  conversionRate: number;
  activeOutlets: number;
  activeVendors: number;
}
```

### TerritoryMetrics
```typescript
{
  territoryId: string;
  territoryName: string;
  sales: number;
  orders: number;
  visits: number;
  conversionRate: number;
  growth: number; // pourcentage
}
```

### TimeSeriesData
```typescript
{
  date: string;        // "2024-01-15"
  value: number;
  label?: string;
}
```

### ProductPerformance
```typescript
{
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  revenue: number;
  orderCount: number;
}
```

### VendorPerformance
```typescript
{
  userId: string;
  userName: string;
  visits: number;
  orders: number;
  sales: number;
  conversionRate: number;
  averageOrderValue: number;
}
```

## 🎨 Intégration UI

### Dashboard Component
```typescript
// Dashboard principal
const [metrics, setMetrics] = useState(null);
const [territories, setTerritories] = useState([]);
const [salesTrend, setSalesTrend] = useState([]);

useEffect(() => {
  loadDashboardData();
}, []);

const loadDashboardData = async () => {
  const [metricsData, territoriesData, trendData] = await Promise.all([
    api.get('/analytics/dashboard'),
    api.get('/analytics/territories'),
    api.get('/analytics/sales/timeseries')
  ]);
  
  setMetrics(metricsData.data);
  setTerritories(territoriesData.data);
  setSalesTrend(trendData.data);
};

// Affichage
<DashboardLayout>
  <MetricCards metrics={metrics} />
  <SalesChart data={salesTrend} />
  <TerritoryTable data={territories} />
</DashboardLayout>
```

## 🧪 Testing

### Test Dashboard
```bash
curl http://localhost:3000/analytics/dashboard?period=30d \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Territory Metrics
```bash
curl http://localhost:3000/analytics/territories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Sales Trend
```bash
curl "http://localhost:3000/analytics/sales/timeseries?period=90d&granularity=weekly" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 Workflow

### 1. Dashboard Loading
```
1. User ouvre dashboard
2. Appel API /analytics/dashboard
3. Service calcule métriques
4. Agrégation données DB
5. Calcul ratios & conversions
6. Retour métriques enrichies
```

### 2. Report Generation (Async)
```
1. User demande rapport
2. Job ajouté à queue
3. Processor génère rapport
4. Calculs complexes
5. Export PDF/Excel
6. Notification utilisateur
```

## 📈 Optimisations

### Performance
- Indexation DB sur dates et territoires
- Caching des résultats fréquents
- Agrégations pré-calculées
- Pagination pour grands datasets

### Scalabilité
- Traitement asynchrone pour rapports
- Distribution des calculs
- Queue system pour longs traitements
- Rate limiting pour API calls

## 🔮 Améliorations Futures

### Phase 2: Real-time Analytics
1. **WebSocket Updates**: Mise à jour temps réel
2. **Live Dashboards**: Données en direct
3. **Alert System**: Alertes automatiques
4. **Predictive Analytics**: Prédictions intégrées

### Phase 3: Advanced Features
1. **Custom Reports**: Créateur de rapports personnalisés
2. **Data Visualization**: Graphiques avancés
3. **Export Options**: PDF, Excel, CSV
4. **Scheduled Reports**: Rapports automatisés

### Phase 4: AI-Powered
1. **Anomaly Detection**: Détection d'anomalies
2. **Trend Prediction**: Prédictions de tendances
3. **Smart Insights**: Insights générés par AI
4. **Recommendations**: Recommandations actionnables

## 🎯 Cas d'Utilisation

### Cas 1: Dashboard Manager
1. Manager ouvre dashboard
2. Voit métriques globales
3. Compare territoires
4. Identifie opportunités
5. Planifie actions

### Cas 2: Analyse Performance
1. User sélectionne période
2. Voit séries temporelles
3. Analyse tendances
4. Identifie patterns
5. Prend décisions

### Cas 3: Reporting
1. Manager demande rapport
2. Système génère rapport
3. Inclut analytics détaillés
4. Export pour partage
5. Archive pour historique

---

**Module créé le**: 2026-06-11
**Version**: 1.0.0