import { COLORS, ICON_SIZE } from "@/theme/tokens";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  testID?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Tìm rau, quả, sữa…",
  testID,
}) => {
  const handleClear = useCallback(() => onChangeText(""), [onChangeText]);

  return (
    <View
      className="flex-1 flex-row items-center rounded-2xl py-2.5 px-4 mx-3"
      style={{ backgroundColor: COLORS.INPUT_BG }}
      testID={testID}
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

const styles = StyleSheet.create({
  searchInput: { height: 30, paddingVertical: 0 },
});

export default SearchBar;
