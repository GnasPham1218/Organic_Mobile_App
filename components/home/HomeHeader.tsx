import AppLogo from "@/components/ui/AppLogo";
import IconButton from "@/components/ui/IconButton";
import { COLORS } from "@/theme/tokens";
import React from "react";
import { View } from "react-native";

export interface HomeHeaderProps {
  cartItemCount?: number;
  messageCount?: number;
  onCartPress?: () => void;
  onMessagePress?: () => void;
  onLogoPress?: () => void;
  logoSource?: any; // ImageSourcePropType, dùng any để require(...) tiện hơn
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  cartItemCount = 0,
  messageCount = 0,
  onCartPress,
  onMessagePress,
  onLogoPress,
  logoSource, // ví dụ: require("@/assets/logo.png")
}) => {
  return (
    <View
      className="border-b"
      style={{ backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.BORDER }}
    >
      <View className="flex-row items-center px-4 h-14">
        {/* Logo trái */}
        <AppLogo
          source={logoSource}
          size={100}
          onPress={onLogoPress}
          testID="app-logo"
          visualScale={1.10}
        />

        {/* Actions phải */}
        <View className="ml-auto flex-row items-center">
          <IconButton
            icon="shopping-cart"
            onPress={onCartPress ?? (() => {})}
            color={COLORS.PRIMARY}
            badge={cartItemCount > 0}
            badgeContent={
              cartItemCount > 99 ? "99+" : cartItemCount || undefined
            }
            testID="cart-button"
          />
          <IconButton
            icon="commenting-o"
            onPress={onMessagePress ?? (() => {})}
            color={COLORS.TEXT_PRIMARY}
            badge={messageCount > 0}
            testID="messages-button"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
