// app/[locale]/categories/[categoryId]/page.tsx
import { Suspense } from "react";
import Filters from "./components/Filters";
import ShopProducts from "./components/ShopProducts";


export default async function ShopPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;

  return (
    <div className="flex gap-6 px-6 py-8">
      {/* Sidebar Filters */}
      <Suspense fallback={<div>Loading...</div>}>
        <aside className="w-64 shrink-0">
          <Filters categoryID={categoryId} />
        </aside>
      </Suspense>

      {/* Products */}
      <Suspense fallback={<div>Loading...</div>}>
        <ShopProducts categoryID={categoryId} />
      </Suspense>
    </div>
  );
}
