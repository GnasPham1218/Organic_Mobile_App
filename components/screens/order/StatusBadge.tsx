// File: components/screens/order/StatusBadge.tsx

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

// Định nghĩa cấu hình hiển thị
type StatusDisplayConfig = {
  bgColor: string; // Class background Tailwind
  textColorClass: string; // Class text color Tailwind
  iconColor: string; // Mã Hex cho Icon (FontAwesome cần Hex)
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  text: string;
};

// Map trạng thái từ Backend (Key viết hoa) sang Giao diện
const statusConfig: Record<string, StatusDisplayConfig> = {
  // 1. Trạng thái chờ / Đang xử lý
  PENDING: {
    bgColor: "bg-amber-100",
    textColorClass: "text-amber-700",
    iconColor: "#b45309", // amber-700
    icon: "clock-o",
    text: "Đang xử lý",
  },
  PROCESSING: {
    bgColor: "bg-amber-100",
    textColorClass: "text-amber-700",
    iconColor: "#b45309",
    icon: "cogs",
    text: "Đang xử lý",
  },

  // 2. Trạng thái giao hàng
  SHIPPING: {
    bgColor: "bg-sky-100",
    textColorClass: "text-sky-700",
    iconColor: "#0369a1", // sky-700
    icon: "truck",
    text: "Đang giao",
  },

  // 3. Trạng thái hoàn thành
  DELIVERED: {
    bgColor: "bg-green-100",
    textColorClass: "text-green-700",
    iconColor: "#15803d", // green-700
    icon: "check-circle",
    text: "Hoàn thành",
  },
  COMPLETED: {
    // Fallback nếu backend trả về completed
    bgColor: "bg-green-100",
    textColorClass: "text-green-700",
    iconColor: "#15803d",
    icon: "check-circle",
    text: "Hoàn thành",
  },

  // 4. Trạng thái hủy
  CANCELLED: {
    bgColor: "bg-red-100",
    textColorClass: "text-red-700",
    iconColor: "#b91c1c", // red-700
    icon: "times-circle",
    text: "Đã hủy",
  },
};

// Config mặc định (cho trường hợp status lạ)
const defaultConfig: StatusDisplayConfig = {
  bgColor: "bg-gray-100",
  textColorClass: "text-gray-600",
  iconColor: "#4b5563",
  icon: "question-circle",
  text: "Không xác định",
};

// Component nhận vào string (linh hoạt hơn enum cứng)
const StatusBadge: React.FC<{ status: string | null | undefined }> = ({
  status,
}) => {
  // 1. Chuẩn hóa input: Chuyển về chữ in hoa để khớp với key
  const statusKey = status ? status.toUpperCase() : "PENDING";

  // 2. Lấy config hoặc fallback
  const config = statusConfig[statusKey] || defaultConfig;

  return (
    <View
      className={`flex-row items-center self-start rounded-full px-2.5 py-1 ${config.bgColor}`}
    >
      {/* FontAwesome cần mã màu Hex */}
      <FontAwesome name={config.icon} size={12} color={config.iconColor} />

      {/* Text dùng class Tailwind */}
      <Text
        className={`ml-1.5 text-xs font-semibold ${config.textColorClass} flex-shrink`}
        numberOfLines={1}
      >
        {config.text}
      </Text>
    </View>
  );
};

export default StatusBadge;
