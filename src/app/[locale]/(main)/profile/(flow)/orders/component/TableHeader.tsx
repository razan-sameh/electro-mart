"use client";

import { useTranslations } from "next-intl";

export const TableHeader = () => {
  const t = useTranslations("Orders.TableHeader");

  return (
    <thead className="text-sm font-medium text-content">
      <tr>
        <th className="py-3 px-4 text-left rounded-l-lg">
          <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
            {t("orderNumber")}
          </span>
        </th>
        <th className="py-3 px-4 text-center">
          <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
            {t("product")}
          </span>
        </th>
        <th className="py-3 px-4 text-center">
          <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
            {t("date")}
          </span>
        </th>
        <th className="py-3 px-4 text-center">
          <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
            {t("totalPayment")}
          </span>
        </th>
        <th className="py-3 px-4 text-center rounded-r-lg">
          <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
            {t("status")}
          </span>
        </th>
      </tr>
    </thead>
  );
};
