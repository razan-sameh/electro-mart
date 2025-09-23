// app/[locale]/categories/[categoryId]/page.tsx
import { Suspense } from "react";
import ShopPageClient from "./components/ShopPageClient";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string[] }>;
  searchParams: Promise<{ q: string }>;
}) {
  const { categoryId } = await params;
  const { q } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageClient categoryId={categoryId} searchQuery={q} />
    </Suspense>
  );
}
