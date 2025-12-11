export const enum enmDiscountType {
  percentage = "percentage",
  fixed = "fixed",
}

// Enum for tab types
export enum enmOrderTab {
  ALL = 'all',
  CURRENT = 'current',
  DELIVERED = 'delivered',
}

// Enum for order status
export enum enmOrderStatus {
  PENDING = "Pending",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

export enum enmPaymentStatus {
  PROCESSING = "processing",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}