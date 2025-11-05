"use client";
import React, { useState } from "react";
import { Tab } from "./Tab";
import { OrderRow } from "./OrderRow";
import { TableHeader } from "./TableHeader";
import { enmOrderTab, enmOrderStatus } from "@/content/enums";
import { useOrders } from "@/lib/hooks/useOrders";
import { typOrder } from "@/content/types";
import Pagination from "@/components/reusable/Pagination";

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState<enmOrderTab>(enmOrderTab.ALL);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data } = useOrders(page, pageSize);
  const allOrders: typOrder[] = data?.orders || [];
  const meta = data?.meta?.pagination;

  const getFilteredOrders = () => {
    switch (activeTab) {
      case enmOrderTab.ALL:
        return allOrders;
      case enmOrderTab.CURRENT:
        return allOrders.filter(
          (order) => order.orderStatus === enmOrderStatus.PROCESSING
        );
      case enmOrderTab.DELIVERED:
        return allOrders.filter(
          (order) => order.orderStatus === enmOrderStatus.DELIVERED
        );
      case enmOrderTab.CANCELLED:
        return allOrders.filter(
          (order) => order.orderStatus === enmOrderStatus.CANCELLED
        );
      case enmOrderTab.RETURNED:
        return allOrders.filter(
          (order) => order.orderStatus === enmOrderStatus.RETURNED
        );
      default:
        return allOrders;
    }
  };

  const filteredOrders = getFilteredOrders();

  const getTabCounts = () => ({
    [enmOrderTab.ALL]: allOrders.length,
    [enmOrderTab.CURRENT]: allOrders.filter(
      (o) => o.orderStatus === enmOrderStatus.PROCESSING
    ).length,
    [enmOrderTab.DELIVERED]: allOrders.filter(
      (o) => o.orderStatus === enmOrderStatus.DELIVERED
    ).length,
    [enmOrderTab.CANCELLED]: allOrders.filter(
      (o) => o.orderStatus === enmOrderStatus.CANCELLED
    ).length,
    [enmOrderTab.RETURNED]: allOrders.filter(
      (o) => o.orderStatus === enmOrderStatus.RETURNED
    ).length,
  });

  const tabCounts = getTabCounts();

  const tabs = [
    { key: enmOrderTab.ALL, label: "All Time" },
    { key: enmOrderTab.CURRENT, label: "Current" },
    { key: enmOrderTab.DELIVERED, label: "Delivered" },
    { key: enmOrderTab.CANCELLED, label: "Cancelled" },
    { key: enmOrderTab.RETURNED, label: "Returned" },
  ];



  return (
    <div className="w-full mx-auto">
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            count={tabCounts[tab.key]}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
      </div>

      <TableHeader />

      <div className="divide-y divide-gray-200">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: typOrder) => (
            <OrderRow
              key={order.id}
              order={order}
            />
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            No orders found for this category
          </div>
        )}
      </div>
      <div className="mt-auto">
        {meta?.total > pageSize && (
          <Pagination
            setPaginate={setPage}
            currentPage={page}
            pageSize={pageSize}
            itemsLength={meta?.total || 0}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
