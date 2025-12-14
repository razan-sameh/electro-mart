import "../globals.css";
import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";
import Container from "@/components/ui/Container";
import { Toaster } from "react-hot-toast";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Container>
        <Header />
      </Container>
      {children}
      <Toaster position="bottom-right" />
      <Footer />
    </>
  );
}
