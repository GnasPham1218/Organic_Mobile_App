import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS, ICON_SIZE } from "@/theme/tokens";

export interface IconButtonProps {
  icon: keyof typeof FontAwesome.glyphMap;
  onPress: () => void;
  color?: string;
  size?: number;
  badge?: number | boolean;
  badgeContent?: string | number;
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  color = COLORS.TEXT_PRIMARY,
  size = ICON_SIZE.MAIN,
  badge = false,
  badgeContent,
  testID,
}) => {
  const showBadge = badge === true || (typeof badge === "number" && badge > 0);
  const displayContent = badgeContent !== undefined ? String(badgeContent) : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="p-2 relative"
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      testID={testID}
    >
      <FontAwesome name={icon} size={size} color={color} />
      {showBadge && (
        <View
          className="absolute top-1 right-1 rounded-full z-10 items-center justify-center"
          style={[
            { backgroundColor: COLORS.ACCENT },
            displayContent ? styles.badgeLg : styles.badgeSm,
          ]}
        >
          {displayContent ? (
            <Text style={styles.badgeText}>{displayContent}</Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badgeSm: { width: 8, height: 8 },
  badgeLg: { width: 16, height: 16 },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 10,
  },
});

export default IconButton;
