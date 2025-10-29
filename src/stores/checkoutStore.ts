// stores/checkoutStore.ts
import { create } from "zustand";

interface PaymentMethod {
  id: string;
  clientSecret: string;
}

interface CardInfo {
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
}

interface PaymentResult {
  success: boolean;
  message?: string;
}

interface CheckoutState {
  step: number;
  shippingAddress: any | null;
  clientSecret: string | null;
  paymentMethod: PaymentMethod | null;
  paymentResult: PaymentResult | null;
  cardInfo: CardInfo | null;
  loadingCardInfo: boolean;

  // actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setShippingAddress: (address: any) => void;
  setClientSecret: (secret: string | null) => void;
  setPaymentMethod: (pm: PaymentMethod | null) => void;
  setPaymentResult: (res: PaymentResult | null) => void;
  setCardInfo: (info: CardInfo | null) => void;
  setLoadingCardInfo: (loading: boolean) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 0,
  shippingAddress: null,
  clientSecret: null,
  paymentMethod: null,
  paymentResult: null,
  cardInfo: null,
  loadingCardInfo: false,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(2, s.step + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setClientSecret: (secret) => set({ clientSecret: secret }),
  setPaymentMethod: (pm) => set({ paymentMethod: pm }),
  setPaymentResult: (res) => set({ paymentResult: res }),
  setCardInfo: (info) => set({ cardInfo: info }),
  setLoadingCardInfo: (loading) => set({ loadingCardInfo: loading }),
  resetCheckout: () =>
    set({
      step: 0,
      shippingAddress: null,
      clientSecret: null,
      paymentMethod: null,
      paymentResult: null,
      cardInfo: null,
      loadingCardInfo: false,
    }),
}));
