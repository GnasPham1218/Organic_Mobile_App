// File: components/features/promotion/PromotionDetailView.tsx

import IconButton from "@/components/common/IconButton";
import type { Promotion } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
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
      <View className="flex-row items-center justify-center px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
        <View className="absolute left-4">
          <IconButton
            icon="arrow-back"
            size={22}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-2xl font-bold text-TEXT_PRIMARY">
          Chi tiết khuyến mãi
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
