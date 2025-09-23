// app/[locale]/categories/[categoryId]/page.tsx
import { Suspense } from "react";
// import ShopPageClient from "./components/ShopPageClient";
import Filters from "./components/Filters";
import ShopProducts from "./components/ShopProducts";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string[] }>;
}) {
  const { categoryId } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex gap-6 px-6 py-8">
        <aside className="w-64 shrink-0">
          <Filters categoryId={categoryId?.[0]}/>
        </aside>

        <ShopProducts categoryId={categoryId?.[0]}/>
      </div>
    </Suspense>
  );
}
