import { ProductEntity } from "@/services/entities";
import { take } from "lodash-es";

const MAX = 10;
export const getBestsellerProducts = (products?: ProductEntity[]) => {
    if (!products?.length) return [];

    const bestsellerProducts = products.filter((p) => p.metadata?.bestSeller);

    if (!bestsellerProducts.length) return take(products, MAX);

    return take(bestsellerProducts, MAX);
}