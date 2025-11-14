// components/screens/category/CategoryView.tsx
import React from "react";
import { ScrollView, View } from "react-native";
import { IconConfig } from "@/constants/categoryIcons"; // Giả sử bạn export type này
import CategoryScreenHeader from "./CategoryScreenHeader";
import CategoryAccordionItem from "./CategoryAccordionItem";

// --- TYPE DEFINITIONS ---
// Định nghĩa kiểu dữ liệu cho từng item con
export interface CategoryChildItemData {
  id: number;
  name: string;
  productCount: number;
  iconConfig: IconConfig;
}

// Định nghĩa kiểu dữ liệu cho 1 item cha (đã bao gồm con)
export interface CategoryItemData {
  id: number;
  name: string;
  productCount: number;
  iconConfig: IconConfig;
  isExpanded: boolean;
  children: CategoryChildItemData[];
}

// Props mà CategoryView nhận
interface CategoryViewProps {
  categoryData: CategoryItemData[];
  parentCategoryCount: number;
  onNavigateToCategory: (categoryId: number) => void;
  onToggleCategory: (categoryId: number) => void;
}

// --- COMPONENT VIEW ---
const CategoryView: React.FC<CategoryViewProps> = ({
  categoryData,
  parentCategoryCount,
  onNavigateToCategory,
  onToggleCategory,
}) => {
  return (
    <>
      {/* Header */}
      <CategoryScreenHeader parentCategoryCount={parentCategoryCount} />

      {/* List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {categoryData.map((item) => (
          <CategoryAccordionItem
            key={item.id}
            item={item} // Truyền toàn bộ đối tượng item
            onNavigateToCategory={onNavigateToCategory}
            onToggleCategory={onToggleCategory}
          />
        ))}
        <View className="h-5" />
      </ScrollView>
    </>
  );
};

export default CategoryView;