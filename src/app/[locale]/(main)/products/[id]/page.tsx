// app/[locale]/products/[id]/page.tsx
import Container from "@/components/ui/Container";
import { Suspense } from "react";
import ProductDetails from "./components/ProductDetails";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <Container>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductDetails productId={id} />
      </Suspense>
    </Container>
  );
}
