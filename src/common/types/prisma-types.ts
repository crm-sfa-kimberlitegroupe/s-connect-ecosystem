/**
 * Shared enum types to replace missing Prisma exports
 * These match the schema definition in schema.prisma
 */

export enum OrderStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethodEnum {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  MOBILE = 'MOBILE'
}

export enum OutletStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE'
}

export enum RoleEnum {
  REP = 'REP',
  ADMIN = 'ADMIN',
  SUP = 'SUP'
}

export enum RouteStatusEnum {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE'
}

export enum RouteStopStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  VISITED = 'VISITED',
  PLANNED = 'PLANNED'
}

export enum TerritoryLevelEnum {
  PAYS = 'PAYS',
  REGION = 'REGION',
  ZONE = 'ZONE',
  SECTEUR = 'SECTEUR'
}

export enum PotentielCommercialEnum {
  TRES_FORT = 'TRES_FORT',
  FORT = 'FORT',
  MOYEN = 'MOYEN',
  FAIBLE = 'FAIBLE'
}

export enum CategorieMarche {
  RESIDENTIEL = 'RESIDENTIEL',
  COMMERCIAL = 'COMMERCIAL',
  MIXTE = 'MIXTE',
  SEMI_URBAIN = 'SEMI_URBAIN'
}

export enum TypeZone {
  RESIDENTIEL = 'RESIDENTIEL',
  COMMERCIAL = 'COMMERCIAL',
  MIXTE = 'MIXTE',
  SEMI_URBAIN = 'SEMI_URBAIN'
}

export enum UserRole {
  REP = 'REP',
  ADMIN = 'ADMIN',
  SUP = 'SUP'
}