// File: components/features/promotion/PromotionCard.tsx

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import type { Promotion } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";

// Hàm helper để hiển thị mô tả giá trị
const getDiscountText = (promotion: Promotion) => {
  if (promotion.type === "percent") {
    return `Giảm ${promotion.value}%`;
  }
  if (promotion.type === "fixed_amount") {
    return `Giảm ${formatCurrency(promotion.value)}`;
  }
  return promotion.name;
};

const PromotionCard: React.FC<{ promotion: Promotion }> = ({ promotion }) => {
  const isDisabled = !promotion.is_active;

  return (
    <View
      className={`mb-4 flex-row overflow-hidden rounded-xl border border-BORDER bg-white shadow-sm ${
        isDisabled ? "opacity-60" : ""
      }`}
    >
      {/* Phần Icon bên trái */}
      <View
        className={`w-20 items-center justify-center bg-green-500 ${
          isDisabled ? "bg-gray-400" : ""
        }`}
      >
        <FontAwesome name="percent" size={32} color="white" />
      </View>

      {/* Phần Thông tin bên phải */}
      <View className="flex-1 p-4">
        <Text className="text-base font-bold text-TEXT_PRIMARY">
          {promotion.name}
        </Text>
        <Text className="mt-1 text-sm text-TEXT_SECONDARY">
          {getDiscountText(promotion)}
        </Text>
        <Text className="mt-2 text-sm font-semibold text-green-600">
          Mã ID: {promotion.promotion_id}
        </Text>
      </View>

      {/* Lớp phủ "Hết hạn" */}
      {isDisabled && (
        <View className="absolute inset-0 items-center justify-center bg-white/70">
          <Text className="rounded-lg border-2 border-gray-500 px-4 py-2 text-lg font-bold text-gray-500">
            Không hoạt động
          </Text>
        </View>
      )}
    </View>
  );
};

export default PromotionCard;