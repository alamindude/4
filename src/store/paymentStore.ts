import { create } from 'zustand';

interface PaymentState {
  name: string;
  amount: number;
  invoiceId: string;
  setName: (name: string) => void;
  setAmount: (amount: number) => void;
  generateInvoiceId: () => void;
  reset: () => void;
}

const generateInvoiceId = (name: string): string => {
  const slugifiedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 12) || 'user';
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `${slugifiedName}-${random4}`;
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  name: '',
  amount: 0,
  invoiceId: '',
  setName: (name) => set({ name }),
  setAmount: (amount) => set({ amount }),
  generateInvoiceId: () => {
    const { name } = get();
    const invoiceId = generateInvoiceId(name);
    set({ invoiceId });
    
    // Save to localStorage
    localStorage.setItem('payment_data', JSON.stringify({
      name,
      amount: get().amount,
      invoiceId
    }));
  },
  reset: () => set({ name: '', amount: 0, invoiceId: '' })
}));