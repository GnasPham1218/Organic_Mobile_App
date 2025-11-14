// File: components/features/promotion/PromotionProductCard.tsx

import type { ProductType as Product, Promotion } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
// ▼▼▼ THÊM IMPORT COMPONENT MỚI ▼▼▼
import PromotionStatusBadge from "./PromotionStatusBadge";

// Kiểu dữ liệu (giữ nguyên)
export type PromotionDetailWithProduct = {
  product: Product;
  start_date: string;
  end_date: string;
};

const getDisplayPrices = (
  product: Product,
  promotion?: Promotion
): { finalPrice: number; originalPrice: number } => {
  const originalPrice = product.price;
  let promoPrice = Infinity;

  if (promotion && promotion.is_active) {
    if (promotion.type === "percent") {
      promoPrice = originalPrice * (1 - promotion.value / 100);
    } else if (promotion.type === "fixed_amount") {
      const priceAfterFixed = originalPrice - promotion.value;
      promoPrice = priceAfterFixed > 0 ? priceAfterFixed : 0;
    }
  }

  const builtInSalePrice = product.salePrice ?? Infinity;
  const finalPrice = Math.min(originalPrice, promoPrice, builtInSalePrice);

  return { finalPrice, originalPrice: product.price };
};

const PromotionProductCard: React.FC<{
  detail: PromotionDetailWithProduct;
  promotion?: Promotion;
}> = ({ detail, promotion }) => {
  const { product, start_date, end_date } = detail;
  // ▼▼▼ XÓA DÒNG GỌI HÀM STATUS CŨ ▼▼▼
  // const status = getStatusBadge(start_date, end_date);
  const router = useRouter();

  const { finalPrice, originalPrice } = getDisplayPrices(product, promotion);
  const showStrikethrough = finalPrice < originalPrice;

  const handlePress = () => {
    router.push(`/product/${product.product_id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="mb-3 flex-row items-center rounded-lg border border-BORDER bg-white p-6 px-4 gap-4"
    >
      {/* Hình ảnh */}
      <Image
        source={product.image}
        className="h-24 w-24 rounded-md border border-BORDER"
      />

      {/* Khối thông tin */}
      <View className="flex-1">
        {/* Tên sản phẩm */}
        <Text
          className="flex-shrink text-base font-bold text-TEXT_PRIMARY"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Giá sản phẩm */}
        <View className="mt-1 flex-row items-baseline">
          <Text className="text-base font-bold text-PRIMARY">
            {formatCurrency(finalPrice)}
          </Text>
          {showStrikethrough && (
            <Text className="ml-2 text-sm text-TEXT_SECONDARY line-through">
              {formatCurrency(originalPrice)}
            </Text>
          )}
        </View>

        {/* Thời gian áp dụng */}
        <Text className="mt-1 text-sm text-TEXT_SECONDARY">
          Từ: {new Date(start_date).toLocaleString("vi-VN")}
        </Text>
        <Text className="mt-1 text-sm text-TEXT_SECONDARY">
          Đến: {new Date(end_date).toLocaleString("vi-VN")}
        </Text>

      </View>

      <PromotionStatusBadge startDate={start_date} endDate={end_date} />
    </TouchableOpacity>
  );
};

export default PromotionProductCard;