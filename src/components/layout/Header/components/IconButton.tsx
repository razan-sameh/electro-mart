// components/Header/IconButton.tsx
interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function IconButton({ children, onClick, className = "" }: Props) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center cursor-pointer hover:text-primary transition-colors ${className}`}>
      {children}
    </button>
  );
}
