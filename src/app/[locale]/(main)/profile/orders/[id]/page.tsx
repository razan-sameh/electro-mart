import OrderDetail from "./components/OrderDetail";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return <OrderDetail orderId={id} />;
}
