interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

export default function IconButton({
  children,
  onClick,
  className = "",
  "aria-label": ariaLabel,
}: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center cursor-pointer hover:text-primary transition-colors ${className}`}
    >
      {children}
    </button>
  );
}