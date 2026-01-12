import { ProductStatusEnum } from "../enums";
import { AssetItemEntity } from "./asset-item.entity";
import { BaseEntity } from "./base.entity";
import { CodeItemEntity } from "./code-item.entity";
import { ProductVariantEntity } from "./product-variant.entity";
import { UnitEntity } from "./unit.entity";




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


    type?: CodeItemEntity;


    style?: string;


    attributes?: ProductAttribute[];


    variants?: ProductVariantEntity[];


    categories?: CodeItemEntity[];

    //dimensions

    weight?: UnitEntity;


    length?: UnitEntity;


    width?: UnitEntity;


    height?: UnitEntity;
    //dimensions



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


    isCustomProduct?: boolean
}

