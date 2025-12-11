"use client";
import React, { useState } from "react";
import { Tab } from "./Tab";
import { OrderRow } from "./OrderRow";
import { TableHeader } from "./TableHeader";
import { enmOrderTab, enmOrderStatus } from "@/content/enums";
import { useOrders } from "@/lib/hooks/useOrders";
import { typOrder } from "@/content/types";
import Pagination from "@/components/reusable/Pagination";
import { OrderCard } from "./OrderCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState<enmOrderTab>(enmOrderTab.ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Map tabs to status
  const statusMap = {
    [enmOrderTab.ALL]: undefined,
    [enmOrderTab.CURRENT]: enmOrderStatus.PENDING,
    [enmOrderTab.DELIVERED]: enmOrderStatus.DELIVERED,
  };

  const { data, isLoading } = useOrders(page, pageSize, statusMap[activeTab]);

  const allOrders = data?.orders || [];
  const pagination = data?.meta?.pagination;
  const counts = data?.meta?.counts;

  const tabCounts = {
    [enmOrderTab.ALL]: counts?.all,
    [enmOrderTab.CURRENT]: counts?.pending,
    [enmOrderTab.DELIVERED]: counts?.delivered,
  };

  const tabs = [
    { key: enmOrderTab.ALL, label: "All Time" },
    { key: enmOrderTab.CURRENT, label: "Current" },
    { key: enmOrderTab.DELIVERED, label: "Delivered" },
  ];

  const handleTabClick = (tabKey: enmOrderTab) => {
    setActiveTab(tabKey);
    setPage(1); // Reset pagination when tab changes
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      {/* Tabs */}
      <ul className="flex flex-row gap-4 overflow-y-auto scrollbar-hide shadow-md/5 rounded-md p-2">
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            count={tabCounts[tab.key]}
            isActive={activeTab === tab.key}
            onClick={() => handleTabClick(tab.key)}
          />
        ))}
      </ul>

      {/* Cards (Mobile) */}
      <div className="lg:hidden">
        {allOrders.length > 0 ? (
          allOrders.map((order: typOrder, index) => (
            <div key={order.id}>
              <OrderCard order={order} />
              {index !== allOrders.length - 1 && (
                <div className="border-b border-gray-200 my-4" />
              )}
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            You have not placed any orders yet
          </div>
        )}
      </div>

      {/* Table (Desktop) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full table-fixed border-spacing-y-2">
          <TableHeader />
          <tbody className="divide-y divide-lightGray">
            {allOrders.length > 0 ? (
              allOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  You have not placed any orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-auto">
        {pagination?.total > pageSize && (
          <Pagination
            setPaginate={setPage}
            currentPage={page}
            pageSize={pageSize}
            itemsLength={pagination.total}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
