// File: components/features/promotion/PromotionListView.tsx

import IconButton from "@/components/common/IconButton";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PromotionCard from "./PromotionCard";

// Định nghĩa kiểu cho Filter
export type PromotionStatusFilter = boolean | null;
type StatusFilter = { label: string; value: PromotionStatusFilter };

// Props
type PromotionListViewProps = {
  promotions: IPromotion[];
  statusFilters: StatusFilter[];
  selectedStatus: PromotionStatusFilter;
  loading: boolean; // Thêm prop
  refreshing: boolean; // Thêm prop
  onStatusChange: (status: PromotionStatusFilter) => void;
  onBackPress: () => void;
  onPressItem: (promotionId: IPromotion) => void;
  onRefresh: () => void; // Thêm prop
};

const PromotionListView: React.FC<PromotionListViewProps> = ({
  promotions,
  statusFilters,
  selectedStatus,
  loading,
  refreshing,
  onBackPress,
  onStatusChange,
  onPressItem,
  onRefresh,
}) => {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-3 bg-white border-b border-gray-100 mt-8">
        <View className="absolute left-4 z-10">
          <IconButton
            icon="arrow-back"
            size={24}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-xl font-bold text-gray-800">
          Khuyến mãi
        </Text>
      </View>

      {/* --- Khu vực Bộ lọc --- */}
      <View className="py-3 px-4 bg-white mb-2 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.label}
              onPress={() => onStatusChange(filter.value)}
              className={`mr-3 rounded-full px-5 py-2 border ${
                selectedStatus === filter.value
                  ? "bg-orange-500 border-orange-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedStatus === filter.value
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- Danh sách Promotion --- */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <FlatList
          data={promotions}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onPressItem(item)}>
              {/* Lưu ý: Bạn cần sửa cả PromotionCard để nhận đúng prop IPromotion */}
              <PromotionCard promotion={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()} // Sửa từ promotion_id thành id
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#f97316"]}
            />
          }
          ListEmptyComponent={
            <View className="mt-20 items-center justify-center">
              <FontAwesome name="search" size={60} color="#CBD5E1" />
              <Text className="mt-4 text-base text-gray-500">
                Không tìm thấy chương trình khuyến mãi nào
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default PromotionListView;
