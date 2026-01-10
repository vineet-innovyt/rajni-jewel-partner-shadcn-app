import { AssetItemEntity } from "./asset-item.entity";
import { BaseEntity } from "./base.entity";
import { DimensionEntity } from "./dimension.entity";

export class ProductVariantEntity extends BaseEntity {
    //Color
    optionName!: string;
    //Red
    value!: string;
    description?: string;
    sku?: string;
    barcode?: string;
    ean?: string;
    upc?: string;
    images?: AssetItemEntity[];
    dimension?: DimensionEntity;
    costPrice?: number;
    price?: number;
    campareToPrice?: number;
    requiresShipping?: boolean;
    shippingCharge?: number;
    isShippingChargeFixed?: boolean;
}
