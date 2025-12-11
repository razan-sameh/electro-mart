import Container from "@/components/ui/Container";
import React, { Suspense } from "react";
import ReviewsDetails from "./components/ReviewsDetails";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container>
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewsDetails productId={id} />
      </Suspense>
    </Container>
  );
}
