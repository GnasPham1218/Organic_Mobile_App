import React from "react";
import { Text, View } from "react-native";

type DividerWithTextProps = { text: string };

const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => {
  return (
    <View className="flex-row items-center">
      <View className="flex-1 h-px bg-gray-300" />
      <Text className="mx-3 text-gray-500 text-sm">{text}</Text>
      <View className="flex-1 h-px bg-gray-300" />
    </View>
  );
};

export default DividerWithText;
