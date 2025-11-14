import {
  CATEGORY_ICON_MAP,
  DEFAULT_CHILD_ICON,
} from "@/constants/categoryIcons";
import {
  getChildCategories,
  getParentCategories,
  mockProducts,
} from "@/data/mockData";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import CategoryView, { CategoryItemData } from "@/components/screens/category/CategoryView";



// --- HELPERS (Vẫn nằm trong file Container vì đây là logic) ---

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

// Lấy số lượng sản phẩm
const getProductCount = (categoryId: number, isParent: boolean) => {
  if (isParent) {
    const childCategories = getChildCategories(categoryId);
    const childIds = childCategories.map((c) => c.id);
    childIds.push(categoryId);
    return mockProducts.filter((p) => childIds.includes(p.category_id)).length;
  }
  return mockProducts.filter((p) => p.category_id === categoryId).length;
};

// --- COMPONENT CONTAINER ---
export default function CategoryScreen() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const parentCategories = getParentCategories();

  // --- HANDLERS ---
  const handleToggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNavigateToCategory = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };

  // --- DATA TRANSFORMATION ---
  // Sử dụng useMemo để tính toán dữ liệu cho View
  // Chỉ tính toán lại khi `parentCategories` hoặc `expandedCategories` thay đổi
  const categoryData = useMemo<CategoryItemData[]>(() => {
    return parentCategories.map((parentCategory) => {
      const childCategories = getChildCategories(parentCategory.id);
      const isExpanded = expandedCategories.includes(parentCategory.id);
      const productCount = getProductCount(parentCategory.id, true);
      const iconConfig = getCategoryIcon(parentCategory.name, true);

      // Tính toán sẵn dữ liệu cho các danh mục con
      const children = childCategories.map((childCategory) => {
        const childProductCount = getProductCount(childCategory.id, false);
        const childIconConfig = getCategoryIcon(childCategory.name, false);
        return {
          id: childCategory.id,
          name: childCategory.name,
          productCount: childProductCount,
          iconConfig: childIconConfig,
        };
      });

      // Trả về đối tượng đã được "làm phẳng" cho View
      return {
        id: parentCategory.id,
        name: parentCategory.name,
        productCount: productCount,
        iconConfig: iconConfig,
        isExpanded: isExpanded,
        children: children,
      };
    });
  }, [parentCategories, expandedCategories]);

  // --- RENDER ---
  return (
    <View className="flex-1 bg-gray-50">
      <CategoryView
        categoryData={categoryData}
        parentCategoryCount={parentCategories.length}
        onNavigateToCategory={handleNavigateToCategory}
        onToggleCategory={handleToggleCategory}
      />
    </View>
  );
}