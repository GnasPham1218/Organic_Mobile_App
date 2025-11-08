// File: components/common/StatusBadge.tsx

import React from "react";
import { Text, View } from "react-native";

// Định nghĩa các biến thể màu mà badge này hỗ trợ
export type BadgeVariant =
  | "success" // Xanh lá
  | "warning" // Xanh dương (cho "Sắp diễn ra")
  | "danger" // Đỏ (cho "Đã kết thúc")
  | "info" // Xanh trời
  | "default"; // Xám

type Props = {
  text: string;
  variant: BadgeVariant;
  /**
   * Thêm prop 'className' để component cha có thể tùy chỉnh style.
   * Ví dụ: truyền 'absolute top-0 right-0 ...'
   * Nếu không truyền, nó sẽ là một badge "inline" (tự co).
   */
  className?: string;
};

// Hàm helper để lấy class màu dựa trên variant
const getVariantClasses = (variant: BadgeVariant) => {
  switch (variant) {
    case "success":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "warning":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "danger":
      return { bg: "bg-red-100", text: "text-red-700" };
    case "info":
      return { bg: "bg-sky-100", text: "text-sky-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
};

/**
 * StatusBadge chung, chỉ nhận text và variant màu.
 * Mặc định là badge "inline" (tự co, bo tròn).
 */
const StatusBadge: React.FC<Props> = ({ text, variant, className = "" }) => {
  const colorClasses = getVariantClasses(variant);

  return (
    <View
      className={`
    px-2 py-1 
        ${colorClasses.bg} 
        ${className} 
      `}
    >
      <Text className={`text-xs font-bold ${colorClasses.text}`}>{text}</Text>
    </View>
  );
};

export default StatusBadge;
