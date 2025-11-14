// components/screens/category/CategoryScreenHeader.tsx
import React from "react";
import { View, Text } from "react-native";

interface CategoryScreenHeaderProps {
  parentCategoryCount: number;
}

const CategoryScreenHeader: React.FC<CategoryScreenHeaderProps> = ({
  parentCategoryCount,
}) => {
  return (
    <View className="bg-STATUS_BAR px-5 py-1 border-b border-gray-200">
      <Text className="text-2xl text-center font-bold text-PRIMARY">
        Danh Mục Sản Phẩm
      </Text>
      <Text className="text-sm text-center text-gray-500">
        Khám phá {parentCategoryCount} danh mục sản phẩm
      </Text>
    </View>
  );
};

export default CategoryScreenHeader;