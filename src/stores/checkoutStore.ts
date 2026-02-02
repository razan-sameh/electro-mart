// stores/checkoutStore.ts
import { create } from "zustand";

interface PaymentMethod {
  id: string;
  clientSecret: string;
}

interface CheckoutState {
  step: number;
  clientSecret: string | null;
  paymentMethod: PaymentMethod | null;
  orderId: number | null;
  setOrderId: (id: number | null) => void;
  setStep: (step: number) => void;
  setClientSecret: (secret: string | null) => void;
  setPaymentMethod: (pm: PaymentMethod | null) => void;
  resetCheckout: () => void;
}

const ORDER_ID_KEY = "checkout_order_id";
const CHECKOUT_STEP_KEY = "checkout_step";

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step:
    typeof window !== "undefined"
      ? Number(localStorage.getItem(CHECKOUT_STEP_KEY)) || 0
      : 0,
  clientSecret: null,
  paymentMethod: null,
  orderId:
    typeof window !== "undefined"
      ? Number(localStorage.getItem(ORDER_ID_KEY)) || null
      : null,

  setOrderId: (id) => {
    if (typeof window !== "undefined") {
      if (id === null) localStorage.removeItem(ORDER_ID_KEY);
      else localStorage.setItem(ORDER_ID_KEY, String(id));
    }
    set({ orderId: id });
  },
  setClientSecret: (secret) => set({ clientSecret: secret }),
  setPaymentMethod: (pm) => set({ paymentMethod: pm }),
  setStep: (step) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CHECKOUT_STEP_KEY, String(step));
    }
    set({ step });
  },

  resetCheckout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ORDER_ID_KEY);
      localStorage.removeItem(CHECKOUT_STEP_KEY);
    }
    set({
      step: 0,
      orderId: null,
      clientSecret: null,
      paymentMethod: null,
    });
  },
}));
