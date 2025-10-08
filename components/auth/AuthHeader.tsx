import React from "react";
import { Text, View } from "react-native";

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  emoji?: string; // mặc định: 🌿
  circleColor?: string; // mặc định: #6B8E23
};

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  emoji = "🌿",
  circleColor = "#6B8E23",
}) => {
  return (
    <View className="items-center gap-2">
      <View
        className="w-20 h-20 rounded-full items-center justify-center"
        style={{ backgroundColor: circleColor }}
      >
        <Text className="text-5xl">{emoji}</Text>
      </View>
      <Text className="text-3xl font-bold text-gray-800">{title}</Text>
      {subtitle ? (
        <Text className="text-gray-500 text-base text-center">{subtitle}</Text>
      ) : null}
    </View>
  );
};

export default AuthHeader;
