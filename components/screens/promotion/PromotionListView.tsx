// File: components/features/promotion/PromotionListView.tsx

import type { Promotion } from "@/data/mockData";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PromotionCard from "./PromotionCard";
import IconButton from "@/components/common/IconButton";

// Định nghĩa kiểu cho Filter
export type PromotionStatusFilter = boolean | null;
type StatusFilter = { label: string; value: PromotionStatusFilter };

// Props mà component này nhận
type PromotionListViewProps = {
  promotions: Promotion[];
  statusFilters: StatusFilter[];
  selectedStatus: PromotionStatusFilter;
  onStatusChange: (status: PromotionStatusFilter) => void;
  onBackPress: () => void;
  onPressItem: (promotionId: number) => void; // Thêm prop để xử lý click
};

const PromotionListView: React.FC<PromotionListViewProps> = ({
  promotions,
  statusFilters,
  selectedStatus,
  onBackPress,
  onStatusChange,
  onPressItem,
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
          Khuyến mãi
        </Text>
      </View>

      {/* --- Khu vực Bộ lọc --- */}
      <View className="p-4 bg-white border-b border-BORDER">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.label}
              onPress={() => onStatusChange(filter.value)}
              className={`mr-2 rounded-full px-4 py-2 border ${
                selectedStatus === filter.value
                  ? "bg-PRIMARY border-PRIMARY"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedStatus === filter.value
                    ? "text-white"
                    : "text-TEXT_SECONDARY"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- Danh sách Promotion --- */}
      <FlatList
        data={promotions}
        renderItem={({ item }) => (
          // Bọc Card bằng TouchableOpacity để điều hướng
          <TouchableOpacity onPress={() => onPressItem(item.promotion_id)}>
            <PromotionCard promotion={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.promotion_id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <FontAwesome name="search" size={60} color="#CBD5E1" />
            <Text className="mt-4 text-base text-TEXT_SECONDARY">
              Không tìm thấy khuyến mãi
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PromotionListView;