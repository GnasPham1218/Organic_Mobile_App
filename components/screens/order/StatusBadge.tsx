// File: components/orders/StatusBadge.tsx (Cập nhật)

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
// ▼▼▼ Import type mới từ mockData ▼▼▼
import type { OrderStatus } from "@/data/mockData"; // <-- Sửa đường dẫn nếu cần

// Định nghĩa giao diện cho mỗi trạng thái
type StatusDisplayConfig = {
  bgColor: string;
  textColor: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  text: string;
};

// ▼▼▼ Dùng một đối tượng tra cứu (lookup object) cho sạch sẽ ▼▼▼
const statusConfig: Record<OrderStatus, StatusDisplayConfig> = {
  processing: {
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
    icon: "cogs",
    text: "Đang xử lý",
  },
  shipping: {
    bgColor: "bg-sky-100",
    textColor: "text-sky-600",
    icon: "truck",
    text: "Đang giao",
  },
  completed: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    icon: "check-circle",
    text: "Hoàn thành",
  },
  cancelled: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    icon: "times-circle",
    text: "Đã hủy",
  },
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  // Lấy config an toàn, nếu không có thì fallback
  const config = statusConfig[status] || statusConfig.processing;

  return (
    <View
      className={`flex-row items-center self-start rounded-full px-2.5 py-1 ${config.bgColor}`}
    >
      <FontAwesome name={config.icon} size={12} color={config.textColor} />
      <Text
        className={`ml-1.5 text-xs font-semibold ${config.textColor} flex-shrink`}
        numberOfLines={1}
      >
        {config.text}
      </Text>
    </View>
  );
};

export default StatusBadge;
