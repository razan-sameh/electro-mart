import Container from "@/components/layout/Container";

export default function OrderDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // no parent layout, just return the children directly
  return <Container>{children}</Container>;
}
