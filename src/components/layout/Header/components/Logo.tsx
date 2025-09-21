import { Link } from "@/i18n/navigation";

export default function Logo() {
  return (
    <Link href="/" className="text-lg md:text-xl font-bold text-blue-600">
      ELECTRIC<span className="text-secondary">.</span>MART
    </Link>
  );
}
