import React from "react";
import { Text, View } from "react-native";

type AuthSwitchLinkProps = {
  prompt: string;        // "Chưa có tài khoản?"
  linkText: string;      // "Đăng ký ngay"
  onPress: () => void;
};

const AuthSwitchLink: React.FC<AuthSwitchLinkProps> = ({
  prompt,
  linkText,
  onPress,
}) => {
  return (
    <View className="px-2">
      <Text className="text-gray-600 text-base text-center">
        {prompt}{" "}
        <Text className="text-[#6B8E23] font-bold" onPress={onPress}>
          {linkText}
        </Text>
      </Text>
    </View>
  );
};

export default AuthSwitchLink;
