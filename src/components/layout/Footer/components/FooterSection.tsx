interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-bold mb-3">{title}</h3>
      {children}
    </div>
  );
}
