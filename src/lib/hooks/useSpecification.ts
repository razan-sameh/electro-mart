import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { typSpecificationType } from "@/content/types";
import { fetchSpecification } from "../services/specification";

export const useSpecification = (
  categoryId?: string
): typSpecificationType[] | undefined => {
  const locale = useLocale();
  const query = useSuspenseQuery({
    queryKey: ["specs", categoryId, locale],
    queryFn: () => fetchSpecification(locale, categoryId),
    retry: 1, // 👈 Avoid infinite retry loops
  });

  return query.data;
};
