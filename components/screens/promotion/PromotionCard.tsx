// File: components/features/promotion/PromotionCard.tsx

import { formatCurrency } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

// Hàm helper để hiển thị mô tả giá trị
const getDiscountText = (promotion: IPromotion) => {
  // <--- 2. Cập nhật logic so sánh (API trả về in hoa)
  if (promotion.type === "PERCENT") {
    return `Giảm ${promotion.value}%`;
  }
  if (promotion.type === "FIXED_AMOUNT") {
    return `Giảm ${formatCurrency(promotion.value)}`;
  }
  return promotion.name;
};

const PromotionCard: React.FC<{ promotion: IPromotion }> = ({ promotion }) => {
  // <--- 3. Sử dụng field 'active' thay vì 'is_active'
  const isDisabled = !promotion.active;

  return (
    <View
      className={`mb-4 flex-row overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${
        isDisabled ? "opacity-60" : ""
      }`}
    >
      {/* Phần Icon bên trái */}
      <View
        className={`w-20 items-center justify-center bg-orange-500 ${
          isDisabled ? "bg-gray-400" : ""
        }`}
      >
        <FontAwesome name="tags" size={32} color="white" />
      </View>

      {/* Phần Thông tin bên phải */}
      <View className="flex-1 p-4">
        <Text className="text-base font-bold text-gray-800">
          {promotion.name}
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          {getDiscountText(promotion)}
        </Text>

        {/* <--- 4. Sử dụng field 'id' thay vì 'promotion_id' */}
        <Text className="mt-2 text-xs font-semibold text-gray-400">
          Mã ID: #{promotion.id}
        </Text>
      </View>

      {/* Lớp phủ "Ngưng hoạt động" */}
      {isDisabled && (
        <View className="absolute inset-0 items-center justify-center bg-white/70">
          <Text className="rounded-lg border-2 border-gray-500 px-4 py-2 text-lg font-bold text-gray-500">
            Đã kết thúc
          </Text>
        </View>
      )}
    </View>
  );
};

export default PromotionCard;
