// app/[locale]/products/[id]/page.tsx
import Container from "@/components/layout/Container";
import { Suspense } from "react";
import ProductDetails from "./components/ProductDetails";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetails productId={id} />
      </Suspense>
    </Container>
  );
}
