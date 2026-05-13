import OrderDetail from "./components/OrderDetail";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return <OrderDetail orderId={id} />;
}
