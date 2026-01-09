export class BaseEntity {
    tenantCode!: string;
    id!: string;
    isDeleted?: boolean;
    isActive?: boolean;
    metadata?: Record<string, unknown>;
    updatedBy?: string;
    createdBy?: string;
    createdOn!: Date;
    updatedOn?: Date;
}