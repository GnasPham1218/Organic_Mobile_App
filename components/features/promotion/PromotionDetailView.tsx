// File: components/features/promotion/PromotionDetailView.tsx

import type { Promotion } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import PromotionProductCard, {
  PromotionDetailWithProduct,
} from "./PromotionProductCard";

// Props mà component này nhận
type PromotionDetailViewProps = {
  promotion?: Promotion; // Có thể undefined nếu không tìm thấy
  details: PromotionDetailWithProduct[]; // Danh sách sản phẩm đã gộp
  onBackPress: () => void;
};

// Helper để render phần tóm tắt đầu trang
const renderHeaderInfo = (promotion: Promotion) => {
  const discountText =
    promotion.type === "percent"
      ? `Giảm ${promotion.value}%`
      : `Giảm ${formatCurrency(promotion.value)}`;

  return (
    <View className="p-4 bg-white border-b border-BORDER">
      <Text className="text-2xl font-bold text-TEXT_PRIMARY">
        {promotion.name}
      </Text>
      <Text className="mt-2 text-lg font-semibold text-PRIMARY">
        {discountText}
      </Text>
      <View
        className={`mt-3 inline-flex flex-row items-center rounded-full px-3 py-1 ${
          promotion.is_active ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        <FontAwesome
          name={promotion.is_active ? "check-circle" : "times-circle"}
          size={16}
          color={promotion.is_active ? "#16A34A" : "#6B7280"}
        />
        <Text
          className={`ml-2 font-semibold ${
            promotion.is_active ? "text-green-700" : "text-gray-700"
          }`}
        >
          {promotion.is_active ? "Đang hoạt động" : "Không hoạt động"}
        </Text>
      </View>
    </View>
  );
};

const PromotionDetailView: React.FC<PromotionDetailViewProps> = ({
  promotion,
  details,
  onBackPress,
}) => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-STATUS_BAR py-4">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 top-0 bottom-0 z-10 flex-row items-center justify-center p-2"
        >
          <FontAwesome name="arrow-left" size={20} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold text-TEXT_PRIMARY">
          Chi tiết Khuyến mãi
        </Text>
      </View>

      {/* --- Danh sách Sản phẩm --- */}
      <FlatList
        data={details}
        renderItem={({ item }) => (
          <PromotionProductCard detail={item} promotion={promotion} />
        )}
        keyExtractor={(item) => item.product.product_id.toString()}
        contentContainerStyle={{ padding: 16 }}
        // Hiển thị thông tin chung của Promotion ở đầu danh sách
        ListHeaderComponent={
          <>
            {promotion ? (
              renderHeaderInfo(promotion)
            ) : (
              <Text className="p-4 text-center text-TEXT_SECONDARY">
                Không tìm thấy thông tin khuyến mãi.
              </Text>
            )}
            <Text className="mt-4 px-4 text-lg font-bold text-TEXT_PRIMARY">
              Sản phẩm áp dụng
            </Text>
          </>
        }
        ListEmptyComponent={
          <View className="mt-10 items-center justify-center">
            <FontAwesome name="dropbox" size={60} color="#CBD5E1" />
            <Text className="mt-4 text-base text-TEXT_SECONDARY">
              Không có sản phẩm nào áp dụng
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PromotionDetailView;
