import { AssetItemEntity } from "./asset-item.entity";
import { ProductEntity } from "./product.entity";

export class OrderLineItemEntity {
    lineItemId!: string;
    productId!: string;
    variantId?: string;
    isCustomProduct!: boolean;
    remark?: string;
    unitType?: string;
    dimensions?: string;
    imageAttachments?: AssetItemEntity[];
    quantity!: number;

    product!: ProductEntity;
    productVariant?: ProductEntity;
}
