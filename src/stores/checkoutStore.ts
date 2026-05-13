// stores/checkoutStore.ts
import { create } from "zustand";

interface PaymentMethod {
  id: string;
  clientSecret: string;
}

interface CheckoutState {
  clientSecret: string | null;
  paymentMethod: PaymentMethod | null;
  setClientSecret: (secret: string | null) => void;
  setPaymentMethod: (pm: PaymentMethod | null) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  clientSecret: null,
  paymentMethod: null,
  setClientSecret: (secret) => set({ clientSecret: secret }),
  setPaymentMethod: (pm) => set({ paymentMethod: pm }),
  resetCheckout: () => {
    set({
      clientSecret: null,
      paymentMethod: null,
    });
  },
}));
