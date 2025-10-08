import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type SocialButtonsProps = {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
};

const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGooglePress,
  onFacebookPress,
}) => {
  return (
    <View className="gap-y-4">
      <TouchableOpacity
        className="w-full flex-row items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4"
        onPress={onGooglePress}
        activeOpacity={0.7}
      >
        <Image source={require("@/assets/auth/google.png")} className="w-6 h-6" />
        <Text className="text-gray-700 font-semibold text-base" numberOfLines={1}>
          Đăng nhập bằng Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full flex-row items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4"
        onPress={onFacebookPress}
        activeOpacity={0.8}
      >
        <Image source={require("@/assets/auth/facebook.png")} className="w-6 h-6" />
        <Text className="text-gray-700 font-semibold text-base" numberOfLines={1}>
          Đăng nhập bằng Facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SocialButtons;
