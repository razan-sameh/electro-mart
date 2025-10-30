import { Suspense } from "react";
import Cart from "./component/Cart";
import Container from "@/components/layout/Container";

export default function CartPage() {
  return (
    <Container>
      <main className=" py-8">
        <Suspense fallback={<p className="text-gray-400">Loading cart...</p>}>
          <Cart />
        </Suspense>
      </main>
    </Container>
  );
}
