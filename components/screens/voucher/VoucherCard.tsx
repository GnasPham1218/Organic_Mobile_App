// File: components/features/voucher/VoucherCard.tsx

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import type { Voucher } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";

// Hàm helper để kiểm tra Hết hạn
const isExpired = (endDate: string) => {
  return new Date(endDate) < new Date();
};

// Hàm helper để hiển thị mô tả giá trị
const getDiscountText = (voucher: Voucher) => {
  if (voucher.type === "freeship") {
    return `Miễn phí vận chuyển (Tối đa ${formatCurrency(voucher.value)})`;
  }
  if (voucher.type === "percent") {
    let text = `Giảm ${voucher.value}%`;
    if (voucher.max_discount_amount) {
      text += ` (Tối đa ${formatCurrency(voucher.max_discount_amount)})`;
    }
    return text;
  }
  if (voucher.type === "fixed_amount") {
    return `Giảm ${formatCurrency(voucher.value)}`;
  }
  return voucher.description;
};

const VoucherCard: React.FC<{ voucher: Voucher }> = ({ voucher }) => {
  // Logic kiểm tra 2 điều kiện
  const expired = isExpired(voucher.end_date);
  const outOfStock = voucher.used_count >= voucher.quantity;
  const isDisabled = expired || outOfStock; // Vô hiệu hóa nếu 1 trong 2 là true
  
  const isFreeship = voucher.type === "freeship";
  const iconBg = isFreeship ? "bg-sky-500" : "bg-amber-500";
  const iconName = isFreeship ? "truck" : "tag";

  return (
    <View
      className={`mb-4 flex-row overflow-hidden rounded-xl border border-BORDER bg-white shadow-sm ${
        isDisabled ? "opacity-60" : ""
      }`}
    >
      {/* Phần Icon bên trái */}
      <View
        className={`w-20 items-center justify-center ${iconBg} ${
          isDisabled ? "bg-gray-400" : ""
        }`}
      >
        <FontAwesome name={iconName} size={32} color="white" />
      </View>

      {/* Phần Thông tin bên phải */}
      <View className="flex-1 p-4">
        <Text className="text-base font-bold text-TEXT_PRIMARY">
          {getDiscountText(voucher)}
        </Text>
        <Text className="mt-1 text-sm text-TEXT_SECONDARY">
          Đơn tối thiểu: {formatCurrency(voucher.min_order_value)}
        </Text>
        <Text className="mt-1 text-sm text-TEXT_SECONDARY">
          HSD: {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
        </Text>
        <Text className="mt-2 text-sm font-semibold text-PRIMARY">
          Mã: {voucher.code}
        </Text>
      </View>

      {/* Lớp phủ "Hết hạn" / "Hết mã" */}
      {/* (Ưu tiên "Hết hạn" hơn "Hết mã") */}
      {isDisabled && (
        <View className="absolute inset-0 items-center justify-center bg-white/70">
          <Text className="rounded-lg border-2 border-red-600 px-4 py-2 text-lg font-bold text-red-600">
            {expired ? "Hết hạn" : "Hết mã"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default VoucherCard;