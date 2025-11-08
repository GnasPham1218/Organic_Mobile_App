// components/ui/AppLogo.tsx
import React from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/theme/tokens";

type AppLogoProps = {
  source?: ImageSourcePropType;
  size?: number;            // kích thước KHUNG (layout)
  visualScale?: number;     // phóng to NỘI DUNG bên trong (không đổi layout)
  round?: boolean;
  bgColor?: string;
  emoji?: string;
  onPress?: () => void;
  testID?: string;
};

const AppLogo: React.FC<AppLogoProps> = ({
  source,
  size = 32,
  visualScale = 1.0,        // <— NEW
  round = true,
  bgColor = COLORS.BACKGROUND,
  emoji = "🌿",
  onPress,
  testID,
}) => {
  const radius = round ? size / 2 : 8;
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: source ? "transparent" : bgColor,
      }}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            transform: [{ scale: visualScale }], // <— phóng nội dung
          }}
          resizeMode="contain"
        />
      ) : (
        <Text style={{ fontSize: size * 0.7 * visualScale }}>{emoji}</Text> // <— phóng emoji
      )}
    </Container>
  );
};

export default AppLogo;
