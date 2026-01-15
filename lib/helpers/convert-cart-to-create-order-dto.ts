import { OrderCreateDto } from "@/services/dto";
import { OrderLineItemEntity } from "@/services/entities";

export function convertCartToCreateOrderDto(partnerId: string, items: OrderLineItemEntity[]): OrderCreateDto {
    const dto: OrderCreateDto = {
        partnerId: 'to-be-set-by-server',
        lineItems: items
    }

    return dto;
}   