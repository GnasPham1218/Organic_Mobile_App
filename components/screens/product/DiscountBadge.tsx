import React from "react";
import { View, Text } from "react-native";

type DiscountBadgeProps = {
  percentage: number;
};

const DiscountBadge: React.FC<DiscountBadgeProps> = ({ percentage }) => {
  if (percentage <= 0) {
    return null;
  }

  return (
    <View
      className="
        absolute top-0 right-3 w-12 items-center justify-center rounded-b-lg
        bg-red-600 shadow shadow-black
      "
      testID="discount-badge"
    >
      <Text className="text-white text-[10px] font-bold uppercase pt-1">
        Giảm
      </Text>
      <Text className="text-white text-sm font-bold pb-1">
        {percentage}%
      </Text>
    </View>
  );
};

export default React.memo(DiscountBadge);