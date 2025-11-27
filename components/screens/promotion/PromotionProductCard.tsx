// File: components/features/promotion/PromotionProductCard.tsx
import { AppConfig } from "@/constants/AppConfig";
import { formatCurrency } from "@/utils/formatters";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import PromotionStatusBadge from "./PromotionStatusBadge"; // Component đã có
// --- SỬA CẤU TRÚC PROP: Chuyển từ 'detail' sang 'item' ---
interface Props {
  item: IPromotionProduct;
}

const PromotionProductCard: React.FC<Props> = ({ item }) => {
  const router = useRouter();

  // Logic kiểm tra tồn kho (MỚI)
  const isOutOfStock = item.quantity <= 0;

  // Tính % giảm giá để hiển thị
  const discountPercent =
    item.promotionType === "PERCENT"
      ? item.promotionValue
      : Math.round(
          ((item.originalPrice - item.discountedPrice) / item.originalPrice) *
            100
        );

  // Xử lý ảnh (Dùng placeholder hoặc ghép Base URL)
  const imageUrl = { uri: `${AppConfig.PRODUCTS_URL}${item.image}` };

  return (
    <TouchableOpacity
      // Dùng productId thay vì product.product_id
      onPress={() => router.push(`/product/${item.productId}`)}
      disabled={isOutOfStock}
      className={`mb-3 flex-row rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${
        isOutOfStock ? "bg-gray-50 opacity-60" : ""
      }`}
    >
      {/* --- Cột Trái: Hình ảnh --- */}
      <View className="relative h-24 w-24 items-center justify-center rounded-md border border-gray-100 bg-gray-50">
        <Image source={imageUrl} className="h-20 w-20" resizeMode="contain" />

        {/* Badge % Giảm giá */}
        {!isOutOfStock && (
          <View className="absolute left-0 top-0 rounded-br-lg rounded-tl-md bg-red-600 px-1.5 py-0.5">
            <Text className="text-[10px] font-bold text-white">
              -{discountPercent}%
            </Text>
          </View>
        )}

        {/* Badge Hết hàng */}
        {isOutOfStock && (
          <View className="absolute inset-0 items-center justify-center rounded-md bg-black/40">
            <Text className="rounded bg-black/60 px-2 py-1 text-xs font-bold text-white">
              Hết hàng
            </Text>
          </View>
        )}
      </View>

      {/* --- Cột Phải: Thông tin --- */}
      <View className="ml-3 flex-1 justify-between py-1">
        <View>
          <Text className="text-sm font-bold text-gray-800" numberOfLines={2}>
            {item.productName}
          </Text>

          {/* Hiển thị số lượng sắp hết */}
          {item.quantity > 0 && item.quantity < 10 && (
            <Text className="mt-1 text-[10px] text-orange-500">
              🔥 Chỉ còn {item.quantity} sản phẩm
            </Text>
          )}
        </View>

        {/* Giá cả */}
        <View className="flex-row items-baseline gap-2">
          <Text
            className={`text-lg font-bold ${
              isOutOfStock ? "text-gray-500" : "text-red-600"
            }`}
          >
            {formatCurrency(item.discountedPrice)}
          </Text>
          <Text className="text-xs text-gray-400 line-through">
            {formatCurrency(item.originalPrice)}
          </Text>
        </View>
      </View>

      {/* --- Badge Trạng thái thời gian --- */}
      <PromotionStatusBadge
        startDate={item.promotionStartDate}
        endDate={item.promotionEndDate}
      />
    </TouchableOpacity>
  );
};

export default PromotionProductCard;
