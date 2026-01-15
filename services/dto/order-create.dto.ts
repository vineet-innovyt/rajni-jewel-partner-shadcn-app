
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
    remark?: string;
    unitType?: string;
    quantity!: number;
}