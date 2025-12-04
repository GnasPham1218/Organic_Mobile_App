// components/screens/category/CategoryHeader.tsx
import React from "react";
import { View, Text } from "react-native";
import IconButton from "@/components/common/IconButton";

interface CategoryHeaderProps {
  onBackPress: () => void;
  onCartPress: () => void;
  cartItemCount: number;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  onBackPress,
  onCartPress,
  cartItemCount,
}) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-STATUS_BAR border-b border-gray-100">
      <IconButton
        icon="arrow-back"
        size={22}
        color="#333"
        onPress={onBackPress}
      />
      <Text className="text-2xl font-bold text-PRIMARY">Danh mục</Text>
      <IconButton
        icon="cart-outline"
        size={22}
        color="#2E7D32"
        onPress={onCartPress}
        badge={cartItemCount > 0}
        badgeContent={cartItemCount > 99 ? "99+" : cartItemCount || undefined}
        testID="cart-button"
      />
    </View>
  );
};

export default CategoryHeader;