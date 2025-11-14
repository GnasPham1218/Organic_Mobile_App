// File: components/features/return/ReturnStatusBadge.tsx

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import type { ReturnStatus } from "@/data/mockData";

type StatusDisplayConfig = {
  bgColor: string;
  textColor: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  text: string;
};
const statusConfig: Record<ReturnStatus, StatusDisplayConfig> = {
  pending: {
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
    icon: "clock-o",
    text: "Chờ duyệt",
  },
  approved: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    icon: "check-circle",
    text: "Đã duyệt",
  },
  rejected: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    icon: "times-circle",
    text: "Từ chối",
  },
  canceled: {
    bgColor: "bg-gray-100", 
    textColor: "text-gray-600",
    icon: "ban", 
    text: "Đã hủy",
  },
};

const ReturnStatusBadge: React.FC<{ status: ReturnStatus }> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;

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

export default ReturnStatusBadge;