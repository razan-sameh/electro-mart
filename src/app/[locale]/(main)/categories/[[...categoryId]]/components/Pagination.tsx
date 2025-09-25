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

  return (
    <nav aria-label="Page navigation">
      <ul className="list-style-none flex justify-center mt-6 gap-1">
        <li>
          <button
            onClick={() => currentPage > 1 && setPaginate(currentPage - 1)}
            className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
          >
            Previous
          </button>
        </li>

        {pages.map((page) => (
          <li key={page} aria-current={page === currentPage ? "page" : undefined}>
            <button
              onClick={() => setPaginate(page)}
              className={`relative block rounded px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white ${
                page === currentPage ? "bg-primary-100" : "bg-transparent"
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => currentPage < totalPages && setPaginate(currentPage + 1)}
            className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
