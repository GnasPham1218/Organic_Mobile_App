// SỬA: Import FontAwesome5 thay vì Ionicons
import { FontAwesome5 } from "@expo/vector-icons";

import { CATEGORY_ICON_MAP, DEFAULT_CHILD_ICON } from "@/data/categoryIcons";
import {
  getChildCategories,
  getParentCategories,
  mockProducts,
} from "@/data/mockData";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Lấy icon: cha từ map, con dùng mặc định
const getCategoryIcon = (categoryName: string, isParent: boolean = false) => {
  if (isParent) {
    const key = categoryName.toLowerCase();
    // SỬA: Dùng "th-large" của FontAwesome5 làm icon fallback
    return (
      CATEGORY_ICON_MAP[key] || {
        name: "th-large" as const,
        color: "#4B5563",
        bg: "#E5E7EB",
      }
    );
  } else {
    return DEFAULT_CHILD_ICON;
  }
};

export default function CategoryScreen() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const parentCategories = getParentCategories();

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getProductCount = (categoryId: number, isParent: boolean) => {
    if (isParent) {
      const childCategories = getChildCategories(categoryId);
      const childIds = childCategories.map((c) => c.id);
      childIds.push(categoryId);
      return mockProducts.filter((p) => childIds.includes(p.category_id))
        .length;
    }
    return mockProducts.filter((p) => p.category_id === categoryId).length;
  };

  const navigateToCategory = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Danh Mục Sản Phẩm
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Khám phá {parentCategories.length} danh mục sản phẩm
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {parentCategories.map((parentCategory) => {
          const childCategories = getChildCategories(parentCategory.id);
          const isExpanded = expandedCategories.includes(parentCategory.id);
          const productCount = getProductCount(parentCategory.id, true);
          const iconConfig = getCategoryIcon(parentCategory.name, true);

          return (
            <View
              key={parentCategory.id}
              className="bg-white mt-3 mx-4 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Danh mục cha */}
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-between p-4"
                  onPress={() => navigateToCategory(parentCategory.id)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-3"
                      style={{ backgroundColor: iconConfig.bg }}
                    >
                      {/* SỬA: Dùng FontAwesome5 */}
                      <FontAwesome5
                        name={iconConfig.name}
                        size={26}
                        color={iconConfig.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800 mb-1">
                        {parentCategory.name}
                      </Text>
                      <View className="flex-row items-center">
                        {/* SỬA: Dùng FontAwesome5 và icon "box" */}
                        <FontAwesome5 name="box" size={13} color="#9CA3AF" />
                        <Text className="text-sm text-gray-500 ml-1.5">
                          {productCount} sản phẩm
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* SỬA: Dùng FontAwesome5 và icon "chevron-right" */}
                  <FontAwesome5
                    name="chevron-right"
                    size={16}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>

                {/* Nút toggle */}
                {childCategories.length > 0 && (
                  <TouchableOpacity
                    className="p-4 pl-2"
                    onPress={() => toggleCategory(parentCategory.id)}
                  >
                    <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                      {/* SỬA: Dùng FontAwesome5 (tên icon "chevron-up/down" giống nhau) */}
                      <FontAwesome5
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#6B7280"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {/* Danh mục con */}
              {isExpanded && childCategories.length > 0 && (
                <View className="bg-gray-50 border-t border-gray-100">
                  {childCategories.map((childCategory, index) => {
                    const childProductCount = getProductCount(
                      childCategory.id,
                      false
                    );
                    const childIconConfig = getCategoryIcon(
                      childCategory.name,
                      false
                    ); // icon mặc định (từ file data)

                    return (
                      <TouchableOpacity
                        key={childCategory.id}
                        className={`flex-row items-center justify-between py-3 px-4 pl-6 ${
                          index !== childCategories.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                        onPress={() => navigateToCategory(childCategory.id)}
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center flex-1">
                          <View
                            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                            style={{ backgroundColor: childIconConfig.bg }}
                          >
                            {/* SỬA: Dùng FontAwesome5 */}
                            <FontAwesome5
                              name={childIconConfig.name}
                              size={18}
                              color={childIconConfig.color}
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-0.5">
                              {childCategory.name}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              {childProductCount} sản phẩm
                            </Text>
                          </View>
                        </View>
                        {/* SỬA: Dùng FontAwesome5 và icon "chevron-right" */}
                        <FontAwesome5
                          name="chevron-right"
                          size={14}
                          color="#D1D5DB"
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <View className="h-5" />
      </ScrollView>
    </View>
  );
}
