// components/screens/category/CategoryListHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CategoryListHeaderProps {
  categoryName: string | undefined;
  productCount: number;
  isFilteredOrSorted: boolean;
  onFilterPress: () => void;
  onSortPress: () => void;
  onResetFiltersAndSort: () => void;
}

const CategoryListHeader: React.FC<CategoryListHeaderProps> = ({
  categoryName,
  productCount,
  isFilteredOrSorted,
  onFilterPress,
  onSortPress,
  onResetFiltersAndSort,
}) => {
  return (
    <View
      className="p-4 bg-white mb-3 rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Tiêu đề */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-bold text-gray-800 mb-1">
          {categoryName}
        </Text>
        <View className="flex-row items-center">
          <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
            <Ionicons name="basket" size={14} color="#16A34A" />
            <Text className="text-xs text-green-700 font-semibold ml-1">
              {productCount} sản phẩm
            </Text>
          </View>
        </View>
      </View>
      {/* Nút Lọc / Sắp xếp / Reset */}
      <View className="flex-row items-center gap-2 flex-wrap">
        <TouchableOpacity
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
          onPress={onFilterPress}
        >
          <Ionicons name="funnel-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
          onPress={onSortPress}
        >
          <Ionicons name="swap-vertical" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">
            Sắp xếp
          </Text>
        </TouchableOpacity>

        {/* Nút Bỏ lọc (chỉ hiện khi đang lọc/sắp xếp) */}
        {isFilteredOrSorted && (
          <TouchableOpacity
            className="flex-row items-center bg-red-100 px-3 py-2 rounded-lg"
            onPress={onResetFiltersAndSort}
          >
            <Ionicons name="refresh-outline" size={14} color="#DC2626" />
            <Text className="text-xs text-red-600 ml-1 font-medium">
              Mặc định
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CategoryListHeader;