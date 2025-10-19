// components/HomeHeader.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS, ICON_SIZE } from "../theme/tokens";

// TYPES
interface HomeHeaderProps {
  cartItemCount?: number;
  messageCount?: number;
  onSearchSubmit?: (query: string) => void;
  onCartPress?: () => void;
  onMessagePress?: () => void;
}

// SUB-COMPONENTS
const IconButton: React.FC<any> = ({
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
      className="relative p-2"
      activeOpacity={0.7}
      testID={testID}
    >
      <FontAwesome name={icon} size={size} color={color} />
      {showBadge && (
        <View
          className={`absolute top-1 right-1 z-10 items-center justify-center rounded-full bg-ACCENT ${
            displayContent ? "h-4 w-4" : "h-2 w-2"
          }`}
        >
          {displayContent && (
            <Text className="text-[10px] font-bold leading-[10px] text-WHITE">
              {displayContent}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const SearchBar: React.FC<any> = ({
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
      className="mr-3 flex-1 flex-row items-center rounded-2xl bg-INPUT_BG py-2.5 px-4"
    >
      <FontAwesome
        name="search"
        size={ICON_SIZE.SEARCH}
        color={COLORS.TEXT_SECONDARY}
      />
      <TextInput
        className="ml-2 flex-1 py-0 text-sm text-TEXT_PRIMARY h-[30px]"
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        testID="search-input"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          className="ml-2 p-1"
          activeOpacity={0.7}
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

// MAIN COMPONENT
const HomeHeader: React.FC<HomeHeaderProps> = ({
  cartItemCount = 0,
  messageCount = 0,
  onSearchSubmit,
  onCartPress,
  onMessagePress,
}) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchSubmit = useCallback(() => {
    if (onSearchSubmit) onSearchSubmit(searchText.trim());
  }, [searchText, onSearchSubmit]);

  const handleMessagePress = useCallback(() => {
    if (onMessagePress) onMessagePress();
  }, [onMessagePress]);

  const handleCartPress = useCallback(() => {
    if (onCartPress) onCartPress();
  }, [onCartPress]);

  return (
    <View className="border-b border-BORDER bg-BACKGROUND">
      <View className="flex-row items-center justify-between px-4 py-3">
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSearchSubmit}
        />
        <View className="flex-row items-center">
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
    </View>
  );
};



export default HomeHeader;