import { ProductEntity } from "./product.entity";

export type ProductVariantEntity = Omit<ProductEntity, 'variants'>;
