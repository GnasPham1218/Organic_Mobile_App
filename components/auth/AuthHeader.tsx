import React from "react";
import { Image, Text, View } from "react-native"; // Import Image

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  imageSource?: any; // Thay thế emoji bằng imageSource
  circleColor?: string; // mặc định: #6B8E23
};

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  imageSource, // Sử dụng imageSource thay vì emoji
}) => {
  return (
    <View className="items-center gap-3">
      <View className="w-30 h-30 rounded-full items-center justify-center mb-10">
        {imageSource ? (
          <Image
            source={imageSource}
            className="w-30 h-28"
            resizeMode="contain"
          />
        ) : (
          // Nếu không có imageSource, có thể chọn hiển thị emoji mặc định hoặc bỏ qua
          <Text className="text-5xl">🌿</Text> // Emoji mặc định nếu không có ảnh
        )}
      </View>
      <Text className="text-3xl font-bold text-gray-800">{title}</Text>
      {subtitle ? (
        <Text className="text-gray-500 text-base text-center">{subtitle}</Text>
      ) : null}
    </View>
  );
};

export default AuthHeader;
