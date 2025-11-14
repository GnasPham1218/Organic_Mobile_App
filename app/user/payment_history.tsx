// app/user/payment-history.tsx
import { PaymentHistoryView } from "@/components/screens/checkout/PaymentHistoryView"; // ✨ Import View
import { mockPayments } from "@/data/mockData";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";

export default function PaymentHistoryScreen() {
  const router = useRouter();

  // ✨ Logic lọc dữ liệu vẫn ở đây
  const successfulPayments = useMemo(() => {
    return mockPayments.filter((payment) => payment.status === "success");
  }, []);

  // ✨ Logic điều hướng được đóng gói lại
  const handleBackPress = () => {
    router.back();
  };

  // ✨ Chỉ cần render View và truyền props
  return (
    <PaymentHistoryView
      payments={successfulPayments}
      onBackPress={handleBackPress}
    />
  );
}
