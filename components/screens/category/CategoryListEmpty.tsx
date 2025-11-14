// components/screens/category/CategoryListEmpty.tsx
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CategoryListEmpty = () => {
  return (
    <View className="flex-1 justify-center items-center py-20">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
      </View>
      <Text className="text-base text-gray-400 font-medium">
        Không tìm thấy sản phẩm phù hợp
      </Text>
      <Text className="text-sm text-gray-400 mt-1">
        Vui lòng thử điều chỉnh bộ lọc
      </Text>
    </View>
  );
};

export default CategoryListEmpty;