# Infrastructure Setup Guide

Ce guide documente la nouvelle infrastructure mise en place pour le SFA avec support pour AI/ML, data pipeline, et queues asynchrones.

## 📦 Nouveaux composants

### 1. Queue Module (Redis + Bull)
**Emplacement**: `src/common/queue/`

**Fonctionnalités**:
- Gestion des tâches asynchrones avec Redis et Bull
- Queues configurées: data-processing, ml-inference, analytics, notifications
- Retry automatique avec backoff exponentiel
- Monitoring et gestion des queues

**Variables d'environnement**:
```env
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
REDIS_DB="0"
```

### 2. Data Pipeline Module (ETL)
**Emplacement**: `src/data-pipeline/etl/`

**Fonctionnalités**:
- ETL (Extract, Transform, Load) complet
- Support de multiples sources: database, API, fichiers
- Transformations personnalisables
- Enrichissement des données
- Traitement asynchrone via queues
- Validation des données

**API Endpoints**:
- `POST /data-pipeline/etl/extract-transform-load` - ETL synchrone
- `POST /data-pipeline/etl/async-etl` - ETL asynchrone
- `GET /data-pipeline/etl/health` - Health check

### 3. Queue Processors
**Emplacement**: `src/common/queue/processors/`

**Processors disponibles**:
- `DataProcessingProcessor`: Transformations de données, agrégation de métriques, sync
- `MLInferenceProcessor`: Prédictions ML, recommandations, computer vision

## 🚀 Installation des dépendances

```bash
cd D:\SFA\backendSFA\backend-sfa
npm install --save @nestjs/bull @nestjs/schedule @nestjs/event-emitter bull ioredis @nestjs/axios axios
npm install --save-dev @types/bull @types/ioredis
```

## 🗄️ Configuration Redis

### Option 1: Docker (Recommandé pour développement)
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

### Option 2: Installation locale Windows
Télécharger Redis pour Windows depuis: https://github.com/microsoftarchive/redis/releases

### Option 3: Démarrage sans Redis (Mode fallback)
Le système fonctionnera en mode synchrone sans Redis, mais sans avantages des queues.

## 🔧 Configuration

### Variables d'environnement additionnelles
Ajouter ces variables dans `.env`:

```env
# Redis Configuration
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
REDIS_DB="0"

# ML Service Configuration
ML_SERVICE_URL="http://localhost:8000"
ML_SERVICE_TIMEOUT="30000"

# Queue Configuration
QUEUE_REDIS_HOST="localhost"
QUEUE_REDIS_PORT="6379"
QUEUE_REDIS_PASSWORD=""
QUEUE_REDIS_DB="0"

# Analytics Configuration
ANALYTICS_ENABLED="true"
ANALYTICS_RETENTION_DAYS="90"

# Data Pipeline Configuration
DATA_PIPELINE_ENABLED="true"
DATA_PIPELINE_BATCH_SIZE="100"
DATA_PIPELINE_MAX_RETRIES="3"
```

## 📊 Utilisation

### ETL Service Example

```typescript
// Extract de la database
const result = await etlService.extractAndTransform(
  'database',
  'database',
  {
    table: 'orders',
    filters: { status: 'COMPLETED' },
    dateRange: { start: '2024-01-01', end: '2024-12-31' },
    transformations: [
      { type: 'rename', field: 'orderNumber', value: 'order_no' },
      { type: 'calculate', field: 'totalWithTax', expression: 'record.totalHt * 1.2' }
    ],
    enrichments: [
      { type: 'lookup', lookupTable: 'outlets', keyField: 'id', sourceField: 'outletId', returnFields: ['name', 'channel'] }
    ]
  }
);
```

### Queue Service Example

```typescript
// Ajouter un job de prédiction ML
const job = await queueService.addOrderPredictionJob({
  outletId: 'outlet-123',
  historicalData: {
    avgOrderQty: 50,
    orderFrequency: 7,
    lastOrderDays: 3
  }
});

// Ajouter un job d'analyse CV
const cvJob = await queueService.addCVAnalysisJob({
  imageUrl: 'https://example.com/shelf-photo.jpg',
  expectedProducts: ['prod-1', 'prod-2']
});
```

### Monitoring des Queues

```typescript
// Stats des queues
const stats = await queueService.getQueueStats('ml-inference');
console.log(stats); // { waiting: 5, active: 2, completed: 100, failed: 3 }

// Pause/Resume des queues
await queueService.pauseQueue('data-processing');
await queueService.resumeQueue('data-processing');
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/data-pipeline/etl/health
```

### Test ETL
```bash
curl -X POST http://localhost:3000/data-pipeline/etl/extract-transform-load \
  -H "Content-Type: application/json" \
  -d '{
    "source": "database",
    "destination": "database",
    "config": {
      "table": "orders",
      "filters": {},
      "transformations": [],
      "enrichments": []
    }
  }'
```

## 📝 Prochaines étapes

1. ✅ Infrastructure base (Queue Module, Data Pipeline)
2. ⏳ Créer ML Service Python
3. ⏳ Implémenter Order Intelligence
4. ⏳ Computer Vision Merchandising
5. ⏳ Advanced Analytics Dashboard

## 🔍 Dépannage

### Problème: Redis connection refused
**Solution**: Vérifier que Redis est démarré
```bash
docker ps | grep redis
# ou
redis-cli ping
```

### Problème: Queue jobs not processing
**Solution**: Vérifier que les processors sont bien enregistrés dans les modules

### Problème: ML service connection failed
**Solution**: Le ML service sera créé dans la prochaine étape. Pour l'instant, les fallbacks sont actifs.

---

**Infrastructure créée le**: 2026-06-11
**Version**: 1.0