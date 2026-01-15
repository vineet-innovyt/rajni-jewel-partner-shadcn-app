import { OrderStageTypeEnum } from "../enums";
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
    currentStage!: OrderStageEntity;
    orderNote?: string;
    deliveryNote?: string;
    createdOn!: Date;
    createdBy!: string;
}

export class OrderStageEntity {


    name!: string;


    type!: OrderStageTypeEnum;


    productId?: string;


    remark?: string;


    createdOn?: Date;


    updatedOn?: Date;

}