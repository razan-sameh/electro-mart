import { useTranslations } from "next-intl";

interface PaginationProps {
  setPaginate: (value: number) => void;
  currentPage: number;
  pageSize: number;
  productsLength: number;
}

export default function Pagination({
  setPaginate,
  currentPage,
  pageSize,
  productsLength,
}: PaginationProps) {
  const totalPages = Math.ceil(productsLength / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const t = useTranslations("Pagination");

  return (
    <nav aria-label="Page navigation">
      <ul className="list-style-none flex justify-center mt-6 gap-1">
        <li>
          <button
            onClick={() => currentPage > 1 && setPaginate(currentPage - 1)}
            className="relative block cursor-pointer rounded bg-transparent px-3 py-1.5 text-sm  transition-all duration-300 hover:text-primary/90"
          >
            {t("previous")}
          </button>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            aria-current={page === currentPage ? "page" : undefined}
          >
            <button
              onClick={() => setPaginate(page)}
              className={`relative block cursor-pointer rounded px-3 py-1.5 text-sm  transition-all duration-300 hover:text-primary/90 ${
                page === currentPage ? " text-primary" : ""
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() =>
              currentPage < totalPages && setPaginate(currentPage + 1)
            }
            className="relative block cursor-pointer rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 hover:text-primary/90"
          >
            {t("next")}
          </button>
        </li>
      </ul>
    </nav>
  );
}
