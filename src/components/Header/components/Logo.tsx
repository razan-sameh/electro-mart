import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="text-lg md:text-xl font-bold text-blue-600">
      ELECTRIC<span style={{ color: "#FB5F2F" }}>.</span>MART
    </Link>
  );
}
