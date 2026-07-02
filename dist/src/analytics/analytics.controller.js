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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const tenant_id_decorator_1 = require("../common/decorators/tenant-id.decorator");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboard(tenantId) {
        return this.analyticsService.getDashboardData(tenantId);
    }
    async getSalesAnalytics(tenantId, startDate, endDate, territoryId, vendorId) {
        return this.analyticsService.getSalesAnalytics(tenantId, {
            startDate,
            endDate,
            territoryId,
            vendorId,
        });
    }
    async getPerformanceAnalytics(tenantId, userId, territoryId, period) {
        return this.analyticsService.getPerformanceAnalytics(tenantId, {
            userId,
            territoryId,
            period,
        });
    }
    async getTerritoryAnalytics(territoryId, tenantId) {
        return this.analyticsService.getTerritoryAnalytics(territoryId, tenantId);
    }
    async generateReport(tenantId, data) {
        return this.analyticsService.generateReport(tenantId, data);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overview dashboard metrics' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed sales analytics' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('territoryId')),
    __param(4, (0, common_1.Query)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSalesAnalytics", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get representative KPIs performance' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('territoryId')),
    __param(3, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPerformanceAnalytics", null);
__decorate([
    (0, common_1.Get)('territories/:territoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get regional territory insights' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('territoryId')),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTerritoryAnalytics", null);
__decorate([
    (0, common_1.Post)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger an export report generation' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateReport", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map