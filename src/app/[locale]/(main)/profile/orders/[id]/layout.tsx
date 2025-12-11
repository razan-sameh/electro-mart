import Container from "@/components/ui/Container";

export default function OrderDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // no parent layout, just return the children directly
  return <Container>{children}</Container>;
}
