// app/[locale]/categories/[categoryId]/page.tsx
import { Suspense } from "react";
import Filters from "./components/Filters";
import ShopProducts from "./components/ShopProducts";
import Container from "@/components/ui/Container";
import MobileFilters from "./components/MobileFilters"; // 👈 component للـ bottom sheet
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: number[] }>;
}) {
  const { categoryId } = await params;

  return (
    <Container>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="flex flex-col md:flex-row gap-6 py-6">
          {/* Sidebar (hidden on mobile, visible on desktop) */}
          <aside className="hidden md:block w-72 lg:w-80 xl:w-80 shrink-0">
            <Filters categoryId={categoryId?.[0]} />
          </aside>
          {/* Filters toggle for mobile */}
          <div className="md:hidden">
            <MobileFilters categoryId={categoryId?.[0]} />
          </div>

          {/* Products */}
          <ShopProducts categoryId={categoryId?.[0]} />
        </div>
      </Suspense>
    </Container>
  );
}
