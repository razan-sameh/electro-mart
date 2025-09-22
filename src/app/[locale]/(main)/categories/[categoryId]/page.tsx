// app/[locale]/categories/[categoryId]/page.tsx
import { Suspense } from "react";
import ShopPageClient from "./components/ShopPageClient";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageClient categoryId={categoryId} />
    </Suspense>
  );
}
