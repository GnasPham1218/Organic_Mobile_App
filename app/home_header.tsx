import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ==================== THEME (Organic) ====================
const ICON_SIZE = { MAIN: 24, SEARCH: 16, CLEAR: 16 } as const;

const COLORS = {
  PRIMARY: "#2E7D32",
  ACCENT: "#F59E0B",
  BACKGROUND: "#FAFAF6",
  BORDER: "#E7ECE9",
  TEXT_PRIMARY: "#1B4332",
  TEXT_SECONDARY: "#5F6F65",
  INPUT_BG: "#EEF5F0",
} as const;

// ==================== TYPES ====================
interface HomeHeaderProps {
  cartItemCount?: number;
  messageCount?: number;
  onSearchSubmit?: (query: string) => void;
  onCartPress?: () => void;
  onMessagePress?: () => void;
}

interface IconButtonProps {
  icon: keyof typeof FontAwesome.glyphMap;
  onPress: () => void;
  color?: string;
  size?: number;
  badge?: number | boolean;
  badgeContent?: string | number;
  testID?: string;
}

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

// ==================== SUB-COMPONENTS ====================
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

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Tìm rau, quả, sữa…",
}) => {
  const handleClear = useCallback(() => {
    onChangeText("");
  }, [onChangeText]);

  return (
    <View
      className="flex-1 flex-row items-center rounded-2xl py-2.5 px-4 mx-3"
      style={{ backgroundColor: COLORS.INPUT_BG }}
    >
      <FontAwesome
        name="search"
        size={ICON_SIZE.SEARCH}
        color={COLORS.TEXT_SECONDARY}
      />
      <TextInput
        className="flex-1 ml-2 text-sm"
        style={[styles.searchInput, { color: COLORS.TEXT_PRIMARY }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        testID="search-input"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          className="ml-2 p-1"
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          testID="clear-search-button"
        >
          <FontAwesome
            name="times-circle"
            size={ICON_SIZE.CLEAR}
            color={COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ==================== MAIN COMPONENT ====================
const HomeHeader: React.FC<HomeHeaderProps> = ({
  cartItemCount = 0,
  messageCount = 0,
  onSearchSubmit,
  onCartPress,
  onMessagePress,
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchSubmit = useCallback(() => {
    const trimmedText = searchText.trim();
    if (trimmedText) {
      if (onSearchSubmit) onSearchSubmit(trimmedText);
      // else router.push(`/search?q=${encodeURIComponent(trimmedText)}`);
    }
  }, [searchText, onSearchSubmit]);

  const handleMessagePress = useCallback(() => {
    if (onMessagePress) onMessagePress();
    // else router.push('/messages');
  }, [onMessagePress]);

  const handleCartPress = useCallback(() => {
    if (onCartPress) onCartPress();
    // else router.push('/cart');
  }, [onCartPress]);

  const handleSearchTextChange = useCallback(
    (text: string) => setSearchText(text),
    []
  );

  return (
    <View
      className="border-b"
      style={{ backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.BORDER }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Search only (no Drawer) */}
        <SearchBar
          value={searchText}
          onChangeText={handleSearchTextChange}
          onSubmit={handleSearchSubmit}
        />

        {/* Right actions */}
        <IconButton
          icon="shopping-cart"
          onPress={handleCartPress}
          color={COLORS.PRIMARY}
          badge={cartItemCount > 0}
          badgeContent={
            cartItemCount > 99
              ? "99+"
              : cartItemCount > 0
                ? cartItemCount
                : undefined
          }
          testID="cart-button"
        />
        <IconButton
          icon="commenting-o"
          onPress={handleMessagePress}
          color={COLORS.TEXT_PRIMARY}
          badge={messageCount > 0}
          testID="messages-button"
        />
      </View>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  searchInput: {
    height: 30,
    paddingVertical: 0,
  },
  badgeSm: { width: 8, height: 8 },
  badgeLg: { width: 16, height: 16 },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 10,
  },
});

export default HomeHeader;
export type { HomeHeaderProps, IconButtonProps, SearchBarProps };
