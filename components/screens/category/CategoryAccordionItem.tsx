// components/screens/category/CategoryAccordionItem.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
// SỬA: Import FontAwesome5
import { FontAwesome5 } from "@expo/vector-icons";
import { CategoryItemData } from "./CategoryView"; // Import kiểu dữ liệu

interface CategoryAccordionItemProps {
  item: CategoryItemData;
  onNavigateToCategory: (categoryId: number) => void;
  onToggleCategory: (categoryId: number) => void;
}

const CategoryAccordionItem: React.FC<CategoryAccordionItemProps> = ({
  item,
  onNavigateToCategory,
  onToggleCategory,
}) => {
  const hasChildren = item.children.length > 0;

  return (
    <View className="bg-white mt-3 mx-4 rounded-2xl overflow-hidden shadow-sm">
      {/* --- Danh mục cha --- */}
      <View className="flex-row items-center">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-between p-4"
          onPress={() => onNavigateToCategory(item.id)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center flex-1">
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mr-3"
              style={{ backgroundColor: item.iconConfig.bg }}
            >
              <FontAwesome5
                name={item.iconConfig.name}
                size={26}
                color={item.iconConfig.color}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                {item.name}
              </Text>
              <View className="flex-row items-center">
                <FontAwesome5 name="box" size={13} color="#9CA3AF" />
                <Text className="text-sm text-gray-500 ml-1.5">
                  {item.productCount} sản phẩm
                </Text>
              </View>
            </View>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Nút toggle */}
        {hasChildren && (
          <TouchableOpacity
            className="p-4 pl-2"
            onPress={() => onToggleCategory(item.id)}
          >
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
              <FontAwesome5
                name={item.isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#6B7280"
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* --- Danh mục con (nếu có và đang mở) --- */}
      {item.isExpanded && hasChildren && (
        <View className="bg-gray-50 border-t border-gray-100">
          {item.children.map((child, index) => (
            <TouchableOpacity
              key={child.id}
              className={`flex-row items-center justify-between py-3 px-4 pl-6 ${
                index !== item.children.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              onPress={() => onNavigateToCategory(child.id)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: child.iconConfig.bg }}
                >
                  <FontAwesome5
                    name={child.iconConfig.name}
                    size={18}
                    color={child.iconConfig.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-0.5">
                    {child.name}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {child.productCount} sản phẩm
                  </Text>
                </View>
              </View>
              <FontAwesome5 name="chevron-right" size={14} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CategoryAccordionItem;