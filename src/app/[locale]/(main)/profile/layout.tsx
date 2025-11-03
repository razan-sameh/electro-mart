// app/profile/layout.tsx
import Container from "@/components/layout/Container";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className="flex flex-col md:grid md:grid-cols-[1fr_4fr] gap-6 min-h-screen">
        {/* Mobile toggle button */}

        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="py-8">
          {/* Make children + button on same line (only for mobile) */}
          <div className="md:hidden flex items-start mb-4">
            <div className="flex-1">{children}</div>
            <MobileSidebar />
          </div>

          {/* Show normal children layout for desktop */}
          <div className="hidden md:block">{children}</div>
        </main>
      </div>
    </Container>
  );
}
