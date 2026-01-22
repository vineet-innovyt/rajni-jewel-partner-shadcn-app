
export class OrderCreateDto {
    partnerId!: string;
    lineItems!: OrderLineItemDto[]
    orderNote?: string;
    deliveryNote?: string;
}

export class OrderLineItemDto {
    lineItemId?: string;
    productId!: string;
    variantId?: string;
    isCustomProduct?: boolean;
    customProductName?: string;
    customProductDescription?: string;
    customProductType?: string;
    remark?: string;
    unitType?: string;
    quantity!: number;
}