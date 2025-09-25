// components/Container.tsx
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-screen-3xl mx-auto px-4 md:px-12 ${className}`}>
      {children}
    </div>
  );
}
