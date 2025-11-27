import {
  CATEGORY_ICON_MAP,
  DEFAULT_CHILD_ICON,
} from "@/constants/categoryIcons";
// Xóa các import mock data cũ liên quan đến category
import CategoryView, {
  CategoryItemData,
} from "@/components/screens/category/CategoryView";
import { mockProducts } from "@/data/mockData"; // Giữ lại nếu bạn muốn map count ảo, hoặc xóa nếu không dùng
import { getAllCategoriesAPI } from "@/service/api"; // Giả sử đường dẫn file api của bạn
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

// --- LOCAL TYPE DEFINITION ---
// Interface này giúp TS hiểu dữ liệu thực tế từ JSON (có parentCategoryId)
// dù global.d.ts định nghĩa khác.
interface ICategoryAPI extends ICategory {
  parentCategoryId?: number | null;
}

// --- HELPERS ---

const getCategoryIcon = (categoryName: string, isParent: boolean = false) => {
  if (isParent) {
    const key = categoryName.toLowerCase();
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

// Hàm tính số lượng sản phẩm
// LƯU Ý: Hiện tại API Category chưa trả về số lượng sản phẩm.
// Logic dưới đây vẫn dùng mockProducts để demo UI không bị lỗi.
// Nếu muốn chính xác, Backend cần trả về field 'productCount' hoặc gọi API đếm riêng.
const getProductCountFromMock = (
  categoryId: number,
  allCategories: ICategoryAPI[]
) => {
  // Tìm các ID con nếu là cha
  const childCategories = allCategories.filter(
    (c) => c.parentCategoryId === categoryId
  );
  const targetIds = [categoryId, ...childCategories.map((c) => c.id)];

  // Đếm trong mockProducts (hoặc trả về 0 nếu đã xóa mockProducts)
  if (!mockProducts) return 0;
  return mockProducts.filter((p) => targetIds.includes(p.category_id)).length;
};

// --- COMPONENT CONTAINER ---
export default function CategoryScreen() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // State lưu dữ liệu từ API
  const [categories, setCategories] = useState<ICategoryAPI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- FETCH API ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await getAllCategoriesAPI();

        // Cấu trúc: IBackendRes -> data -> ISpringRawResponse -> result
        if (res.data && res.data.data && res.data.data.result) {
          setCategories(res.data.data.result as ICategoryAPI[]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        Alert.alert("Lỗi", "Không thể tải danh mục sản phẩm.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
  const categoryData = useMemo<CategoryItemData[]>(() => {
    if (!categories || categories.length === 0) return [];

    // 1. Lọc ra danh sách Category Cha (parentCategoryId === null)
    const parentCategories = categories.filter(
      (c) => c.parentCategoryId === null || c.parentCategoryId === undefined
    );

    return parentCategories.map((parentCategory) => {
      // 2. Tìm con của category hiện tại
      const childCategories = categories.filter(
        (c) => c.parentCategoryId === parentCategory.id
      );

      const isExpanded = expandedCategories.includes(parentCategory.id);

      // Tính count (Dùng mock hoặc set cứng = 0)
      const productCount = getProductCountFromMock(
        parentCategory.id,
        categories
      );
      const iconConfig = getCategoryIcon(parentCategory.name, true);

      // 3. Map children sang cấu trúc View cần
      const childrenMapped = childCategories.map((childCategory) => {
        const childProductCount = getProductCountFromMock(
          childCategory.id,
          categories
        );
        const childIconConfig = getCategoryIcon(childCategory.name, false);

        return {
          id: childCategory.id,
          name: childCategory.name,
          productCount: childProductCount,
          iconConfig: childIconConfig,
        };
      });

      // 4. Trả về object hoàn chỉnh
      return {
        id: parentCategory.id,
        name: parentCategory.name,
        productCount: productCount,
        iconConfig: iconConfig,
        isExpanded: isExpanded,
        children: childrenMapped,
      };
    });
  }, [categories, expandedCategories]);

  // --- RENDER ---
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <CategoryView
        categoryData={categoryData}
        parentCategoryCount={categoryData.length}
        onNavigateToCategory={handleNavigateToCategory}
        onToggleCategory={handleToggleCategory}
      />
    </View>
  );
}
