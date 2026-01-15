import { ProductEntity } from "./product.entity";

export class OrderLineItemEntity {
    lineItemId!: string;
    productId!: string;
    variantId?: string;
    isCustomProduct!: boolean;
    remark?: string;
    unitType?: string;
    quantity!: number;

    product!: ProductEntity;
    productVariant?: ProductEntity;
}