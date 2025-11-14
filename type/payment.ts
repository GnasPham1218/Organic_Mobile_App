// types/payment.ts

export type PaymentStatus = "success" | "failed" | "pending";

export interface Payment {
  payment_id: number;
  method: string;
  provider: string;
  status: PaymentStatus;
  amount: number;
  created_at: string; // Dùng ISO string
}