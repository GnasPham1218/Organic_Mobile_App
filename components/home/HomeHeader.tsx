import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { COLORS } from "@/theme/tokens";
import IconButton from "@/components/ui/IconButton";
import SearchBar, { SearchBarProps } from "@/components/home/SearchBar";

export interface HomeHeaderProps {
  cartItemCount?: number;
  messageCount?: number;
  onSearchSubmit?: (query: string) => void;
  onCartPress?: () => void;
  onMessagePress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  cartItemCount = 0,
  messageCount = 0,
  onSearchSubmit,
  onCartPress,
  onMessagePress,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchSubmit = useCallback(() => {
    const trimmed = searchText.trim();
    if (trimmed && onSearchSubmit) onSearchSubmit(trimmed);
    // Nếu muốn dùng router:
    // else router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [searchText, onSearchSubmit]);

  return (
    <View
      className="border-b"
      style={{ backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.BORDER }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSearchSubmit}
        />

        <IconButton
          icon="shopping-cart"
          onPress={onCartPress ?? (() => {})}
          color={COLORS.PRIMARY}
          badge={cartItemCount > 0}
          badgeContent={cartItemCount > 99 ? "99+" : cartItemCount || undefined}
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
  );
};

export default HomeHeader;
export type { SearchBarProps };
