// components/features/cart/CartHeader.tsx
import IconButton from "@/components/common/IconButton";
import React from "react";
import { Text, View } from "react-native";

interface CartHeaderProps {
  title: string;
  onBack: () => void;
}

const CartHeader: React.FC<CartHeaderProps> = ({ title, onBack }) => {
  return (
    <View className="flex-row items-center justify-center px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
      <View className="absolute left-4">
        <IconButton icon="arrow-back" size={22} color="#333" onPress={onBack} />
      </View>
      <Text className="text-center text-2xl font-bold text-PRIMARY">
        {title}
      </Text>
    </View>
  );
};

export default CartHeader;
