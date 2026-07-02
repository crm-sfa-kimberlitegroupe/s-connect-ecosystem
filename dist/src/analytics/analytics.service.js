"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service"); 

let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    
    async getDashboardData(tenantId) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        try {
            // Requêtes réelles sur ta base Supabase avec les 4 éléments attendus
            const [activeVendors, validatedOutlets, pendingOutlets, ordersMetrics] = await Promise.all([
                this.prisma.user.count({
                    where: { tenantId, role: 'REP', status: 'ACTIVE' }
                }).catch(() => 0),
                this.prisma.outlet.count({
                  where: { tenantId, status: 'VALIDATED' } 
                }).catch(() => 0), // 🔓 Corrigé ici !
                this.prisma.outlet.count({
                    where: { tenantId, status: 'PENDING' }
                }).catch(() => 0),
                this.prisma.order.aggregate({
                    where: { tenantId },
                    _count: { id: true },
                    _sum: { totalPrice: true }
                }).catch(() => ({ _count: { id: 0 }, _sum: { totalPrice: 0 } }))
            ]);

            const totalOrders = ordersMetrics._count?.id || 0;
            const totalSales = ordersMetrics._sum?.totalPrice || 0;
            const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

            return {
                totalSales,
                totalOrders,
                averageOrderValue,
                conversionRate: validatedOutlets > 0 ? parseFloat((totalOrders / validatedOutlets).toFixed(2)) : 0,
                activeOutlets: validatedOutlets, // Renvoie les PDV validés à l'écran
                pendingOutlets: pendingOutlets,  // Ajouté pour ta carte "PDV en attente" !
                activeVendors,
                tenantContext: tenantId,
                period: {
                    start: todayStart.toISOString(),
                    end: todayEnd.toISOString(),
                },
                trends: {
                    salesGrowth: 0,
                    ordersGrowth: 0,
                    conversionGrowth: 0,
                }
            };
        } catch (error) {
            return {
                totalSales: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                conversionRate: 0,
                activeOutlets: 0,
                pendingOutlets: 0,
                activeVendors: 0,
                tenantContext: tenantId,
                period: { start: todayStart.toISOString(), end: todayEnd.toISOString() },
                trends: { salesGrowth: 0, ordersGrowth: 0, conversionGrowth: 0 }
            };
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);