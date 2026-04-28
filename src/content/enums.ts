export const enum enmDiscountType {
  percentage = "percentage",
  fixed = "fixed",
}

// Enum for tab types
export enum enmOrderTab {
  ALL       = "all",
  PLACED    = "placed",
  PENDING   = "pending",
  SHIPPED   = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

// Enum for order status
export enum enmOrderStatus {
  DRAFT     = "draft",
  PLACED    = "placed",      // ← add this
  PENDING   = "pending",
  SHIPPED   = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum enmPaymentStatus {
  PROCESSING = "processing",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}