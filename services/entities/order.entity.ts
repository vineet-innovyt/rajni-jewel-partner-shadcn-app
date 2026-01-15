import { OrderStatusEnum } from "../enums";
import { OrderLineItemEntity } from "./order-line-item";
import { PartnerEntity } from "./partner.entity";

export class OrderEntity {
    id!: string;
    orderNumber!: string;
    currencyCode!: string;
    salesChannel!: string;
    partnerId?: string;
    partner?: PartnerEntity;
    items!: OrderLineItemEntity[]
    status!: OrderStatusEnum;
    orderNote?: string;
    deliveryNote?: string;
    createdOn!: Date;
    createdBy!: string;
}