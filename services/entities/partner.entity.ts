import { PartnerStatusEnum } from "../enums";
import { BaseEntity } from "./base.entity";

export class PartnerEntity extends BaseEntity {
    businessName!: string;
    businessEmail!: string;
    description?: string;
    logo?: string;
    contactFirstName!: string;
    contactLastName!: string;
    contactEmail!: string;
    contactMobile!: string;
    accountEmail!: string;
    publishableKey?: string;
    storeLocation?: string;
    status!: PartnerStatusEnum;
    statusUpdatedOn?: Date;
    salesChannels?: string[];
}

export class PartnerSettingEntity {
    b2cEnabled?: boolean;
}