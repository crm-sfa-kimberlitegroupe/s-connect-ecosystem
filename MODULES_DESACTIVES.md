# Modules Désactivés - Backend SFA

Les modules suivants ont été temporairement désactivés pour permettre le démarrage du backend avec les modules de base uniquement.

## Modules désactivés
- ProductsModule
- SkusModule
- PromotionsModule
- RoutesModule
- RoutePlansModule
- VisitsModule
- MerchandisingModule
- VendorStockModule
- OrdersModule
- DashboardModule
- DataPipelineModule
- OrderIntelligenceModule
- AnalyticsModule
- TrainingModule
- B2BModule
- QueueModule (infrastructure)

## Modules actifs (base)
✅ PrismaModule
✅ AuthModule
✅ UsersModule
✅ TerritoriesModule
✅ OutletsModule
✅ CloudinaryModule

## Raison de la désactivation
Ces modules contiennent des incompatibilités majeures avec le schéma Prisma actuel:
- Références à des modèles qui n'existent plus (category, brand, packFormat comme modèles séparés)
- Modèles manquants dans le schéma (Payment, Promotion, etc.)
- Structure de hiérarchie des produits incompatible

## Prochaines étapes
Pour réactiver ces modules, il faudra soit:
1. Réviser le schéma Prisma pour correspondre au code existant
2. Réécrire le code pour correspondre au schéma actuel

Consultez RAPPORT_CORRECTIONS_BACKEND.md pour plus de détails.