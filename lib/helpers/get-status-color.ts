import { OrderStageTypeEnum } from "@/services/enums";

export const getOrderStatusColor = (status?: OrderStageTypeEnum) => {
    switch (status) {
        case "complete":
            return "bg-green-100 text-green-800";
        case "placed":
            return "bg-yellow-100 text-yellow-800";
        case "accepted":
            return "bg-blue-100 text-blue-800";
        case "partially-accepted":
            return "bg-purple-100 text-purple-800";
        case "cancelled":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const getOrderStatusLabel = (status?: OrderStageTypeEnum) => {
    let label = 'Unknown';
    if (!status) return label;
    switch (status) {
        case OrderStageTypeEnum.Placed:
            label = "In Progress";
            break;
        case OrderStageTypeEnum.Accepted:
            label = "Accepted";
            break;
        case OrderStageTypeEnum.PartiallyAccepted:
            label = "Partially Accepted";
            break;
        case OrderStageTypeEnum.Cancelled:
            label = "Cancelled";
            break;
        case OrderStageTypeEnum.Achieved:
            label = "Achieved";
            break;
        case OrderStageTypeEnum.OnHold:
            label = "On Hold";
            break;
        case OrderStageTypeEnum.Complete:
            label = "Complete";
            break;
    }
    return label;
}