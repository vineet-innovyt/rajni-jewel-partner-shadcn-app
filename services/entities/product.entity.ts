import { ProductStatusEnum, UnitTypesEnum } from "../enums";
import { AssetItemEntity } from "./asset-item.entity";
import { BaseEntity } from "./base.entity";
import { CodeItemEntity } from "./code-item.entity";
import { DimensionEntity } from "./dimension.entity";
import { ProductVariantEntity } from "./product-variant.entity";




export class ProductAttribute {
    name?: string;
    description?: string;
    value?: string;
}

export class ProductEntity extends BaseEntity {
    externalId?: string;
    sku!: string;
    name?: string;
    code?: string;
    costPrice?: number;
    price?: number;
    campareToPrice?: number;
    description?: string;
    featureImage?: string;
    type?: CodeItemEntity;
    style?: string;
    attributes?: ProductAttribute[];
    variants?: ProductVariantEntity[];
    categories?: CodeItemEntity[];
    unit?: UnitTypesEnum;
    dimension?: DimensionEntity;
    weight?: string;
    vendor?: CodeItemEntity;
    brand?: CodeItemEntity;
    tags?: string[];
    requiresShipping?: boolean;
    images?: AssetItemEntity[];
    status?: ProductStatusEnum;
    collections?: CodeItemEntity[];
    reorderLevel?: number;
    storeLocations?: string[];
    manufactureDate?: Date;
    isVariant?: boolean;
    expiryDate?: Date;
    shippingCharge?: number;
    isShippingChargeFixed?: boolean;
}

