// File: components/screens/promotion/PromotionDetailView.tsx

import IconButton from "@/components/common/IconButton";
import { formatCurrency } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";

import PromotionProductCard from "./PromotionProductCard";

// Giả định một type cơ bản cho Promotion Header (Tùy thuộc vào backend)
type BasicPromotion = {
  id: number;
  name: string;
  type: "PERCENT" | "FIXED_AMOUNT"; // Đảm bảo khớp với TypePromotion của backend (in hoa)
  value: number;
  // ... thêm các trường khác nếu cần
};

// Helper để render phần tóm tắt đầu trang
const renderHeaderInfo = (promotion: BasicPromotion) => {
  const discountText =
    promotion.type === "PERCENT"
      ? `Giảm ${promotion.value}%`
      : `Giảm ${formatCurrency(promotion.value)}`;

  return (
    <View className="p-4 bg-white border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-800">{promotion.name}</Text>
      <Text className="mt-2 text-lg font-semibold text-red-600">
        {discountText}
      </Text>
      <Text className="mt-3 text-sm text-gray-500">
        Mã khuyến mãi: #{promotion.id}
      </Text>
    </View>
  );
};

// Props mà component này nhận
type PromotionDetailViewProps = {
  promotion?: BasicPromotion;
  // --- CHỈNH SỬA: Dùng IPromotionProduct[] thay cho PromotionDetailWithProduct[] ---
  details: IPromotionProduct[];
  onBackPress: () => void;
};

const PromotionDetailView: React.FC<PromotionDetailViewProps> = ({
  promotion,
  details,
  onBackPress,
}) => {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-STATUS_BAR py-4">
        <View className="absolute left-4 z-10">
          <IconButton
            icon="arrow-back"
            size={22}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          Chi tiết khuyến mãi
        </Text>
      </View>

      {/* --- Danh sách Sản phẩm --- */}
      <FlatList
        data={details}
        // --- SỬA LỖI CRASH: Dùng item.productId ---
        keyExtractor={(item) => item.productId.toString()}
        // --- SỬA PROP: Truyền item vào PromotionProductCard ---
        renderItem={({ item }) => (
          // Đảm bảo PromotionProductCard nhận prop là 'item'
          <PromotionProductCard item={item} />
        )}
        contentContainerStyle={{ padding: 16 }}
        // Hiển thị thông tin chung của Promotion ở đầu danh sách
        ListHeaderComponent={
          <>
            {promotion && renderHeaderInfo(promotion)}
            <Text className="mt-4 mb-2 text-lg font-bold text-gray-800">
              Sản phẩm áp dụng
            </Text>
          </>
        }
        ListEmptyComponent={
          <View className="mt-10 items-center justify-center">
            <FontAwesome name="dropbox" size={60} color="#CBD5E1" />
            <Text className="mt-4 text-base text-gray-500">
              Không có sản phẩm nào áp dụng khuyến mãi này.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PromotionDetailView;
