import AppLogo from "@/components/common/AppLogo";
import IconButton from "@/components/common/IconButton";
import { COLORS } from "@/theme/tokens";
import React from "react";
import { View } from "react-native";

export interface HomeHeaderProps {
  cartItemCount?: number;
  messageCount?: number;
  notificationCount?: number; // <-- ĐÃ THÊM
  onCartPress?: () => void;
  onMessagePress?: () => void;
  onNotificationPress?: () => void; // <-- ĐÃ THÊM
  onLogoPress?: () => void;
  logoSource?: any; // ImageSourcePropType, dùng any để require(...) tiện hơn
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  cartItemCount = 0,
  messageCount = 0,
  notificationCount = 0, // <-- ĐÃ THÊM
  onCartPress,
  onMessagePress,
  onNotificationPress, // <-- ĐÃ THÊM
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
          visualScale={1.1}
        />

        {/* Actions phải */}
        <View className="ml-auto flex-row items-center">
          <IconButton
          icon="cart-outline" // Sửa ở đây
          onPress={onCartPress ?? (() => {})}
          color={COLORS.PRIMARY}
          badge={cartItemCount > 0}
          badgeContent={
            cartItemCount > 99 ? "99+" : cartItemCount || undefined
          }
          testID="cart-button"
        />
        <IconButton
          icon="chatbubble-ellipses-outline" // Sửa ở đây
          onPress={onMessagePress ?? (() => {})}
          color={COLORS.TEXT_PRIMARY}
          badge={messageCount > 0}
          testID="messages-button"
        />
        {/* --- ICON CHUÔNG ĐÃ THÊM --- */}
        <IconButton
          icon="notifications-outline" // Sửa ở đây
          onPress={onNotificationPress ?? (() => {})}
          color={COLORS.TEXT_PRIMARY}
          badge={notificationCount > 0}
          badgeContent={
            notificationCount > 99 ? "99+" : notificationCount || undefined
          }
          testID="notifications-button"
        />
          {/* --- KẾT THÚC THÊM MỚI --- */}
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
