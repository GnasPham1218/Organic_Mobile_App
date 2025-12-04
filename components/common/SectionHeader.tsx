// components/ui/SectionHeader.tsx
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
  seeAllText?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onSeeAllPress,
  seeAllText = "",
}) => {
  return (
    <View className="flex-row items-center justify-between px-4 mt-4 mb-2">
      <Text className="text-lg font-semibold text-[#1B4332]">{title}</Text>
      {onSeeAllPress && (
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text className="text-[#2E7D32]">{seeAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
