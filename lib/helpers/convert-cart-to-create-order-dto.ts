import { OrderCreateDto } from "@/services/dto";
import { OrderLineItemEntity } from "@/services/entities";

export function convertCartToCreateOrderDto(partnerId: string, items: OrderLineItemEntity[]): OrderCreateDto {
    const dto: OrderCreateDto = {
        partnerId: 'to-be-set-by-server',
        lineItems: [...items]
    }
    dto.lineItems.forEach(item => {
        if (item.isCustomProduct) {
            const product = items.find(o => item.lineItemId == o.lineItemId)?.product;
            item.customProductName = product?.name;
            item.customProductDescription = product?.description;
            item.customProductType = product?.type?.code;
        }
    })
    return dto;
}   