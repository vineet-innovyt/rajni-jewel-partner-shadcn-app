"use client";

import { notFound, useParams } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { getProductByIdApi } from "@/services/rajni-apis";
import { PageLoading } from "@/lib/app-init";

export default function ProductPage() {
  const params = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.ProductById, params.id],
    queryFn: () => getProductByIdApi(params.id),
  });

  if (isLoading) {
    return <PageLoading />;
  }

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
