// app/[locale]/products/[id]/page.tsx
import Container from "@/components/ui/Container";
import { Suspense } from "react";
import ReviewForm from "./components/ReviewForm";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container>
        <ReviewForm productId={id} />
    </Container>
  );
}
