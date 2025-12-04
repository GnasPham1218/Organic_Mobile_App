// components/payment/payment.config.ts
import { PaymentStatus } from "@/type/payment";
import { Ionicons } from "@expo/vector-icons";

export const statusStyles: Record<
  PaymentStatus,
  {
    bg: string;
    text: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
  }
> = {
  success: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: "checkmark-circle",
    iconColor: "#15803D", // green-700
  },
  failed: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: "close-circle",
    iconColor: "#B91C1C", // red-700
  },
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: "time",
    iconColor: "#A16207", // yellow-700
  },
};

export const methodIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  "E-Wallet": "wallet",
  COD: "cash",
  "Credit Card": "card",
  default: "card-outline",
};

export const statusTextMap: Record<PaymentStatus, string> = {
  success: "Thành công",
  failed: "Thất bại",
  pending: "Đang chờ",
};
