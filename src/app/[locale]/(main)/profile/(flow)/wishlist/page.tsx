import { Suspense } from "react";
import WishlistClient from "./components/WishlistClient";

export default function WishlistPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WishlistClient />
    </Suspense>
  );
}
