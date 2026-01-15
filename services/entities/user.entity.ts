import { DeviceTypeEnum, UserRolesEnum } from "../enums";

export class UserEntity {
    id!: string;
    name!: string;
    email!: string;
    displayName?: string;
    tenantCode!: string;
    roles!: UserRolesEnum[];
    partnerId!: string;
}

export class ClientAppEntity {
    id?: string;
    tenantCode!: string;
    appName!: string;
    appDescription?: string;
    deviceType?: DeviceTypeEnum;
    clientKey?: string;
    clientSecret?: string;
    locationId?: string;
    manufacturer?: string;
    model?: string;
    version?: string;
    indexNumber?: number;
    metadata?: Record<string, unknown>;
}