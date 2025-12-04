// components/payment/PaymentHistoryItem.tsx
import { formatCurrency } from "@/utils/formatters"; // Giả sử bạn có tệp này
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { Payment } from "@/type/payment";
import { methodIcons, statusStyles, statusTextMap } from "./payment.config";

interface PaymentHistoryItemProps {
  item: Payment;
}

export const PaymentHistoryItem: React.FC<PaymentHistoryItemProps> = ({ item }) => {
  const statusStyle = statusStyles[item.status];
  const methodIcon = methodIcons[item.method] || methodIcons.default;

  return (
    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 flex-row items-center">
      {/* Icon phương thức */}
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Ionicons name={methodIcon} size={24} color="#4B5563" />
      </View>

      {/* Thông tin */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {item.provider}
        </Text>
        <Text className="text-sm text-gray-500">
          {new Date(item.created_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Số tiền & Trạng thái */}
      <View className="items-end">
        <Text className="text-base font-bold text-gray-900">
          {formatCurrency(item.amount)}
        </Text>
        <View
          className={`flex-row items-center px-2 py-1 rounded-full mt-1 ${statusStyle.bg}`}
        >
          <Ionicons
            name={statusStyle.icon}
            size={12}
            color={statusStyle.iconColor}
          />
          <Text className={`text-xs font-medium ml-1 ${statusStyle.text}`}>
            {statusTextMap[item.status]}
          </Text>
        </View>
      </View>
    </View>
  );
};