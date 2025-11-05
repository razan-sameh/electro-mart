import { Suspense } from "react";
import OrderManagement from "./component/OrderManagement";

export default function OrdersPage() {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderManagement />
    </Suspense>
  );
}
