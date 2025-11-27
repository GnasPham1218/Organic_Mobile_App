import CategoryView, {
  CategoryItemData,
} from "@/components/screens/category/CategoryView";
import {
  CATEGORY_ICON_MAP,
  DEFAULT_CHILD_ICON,
} from "@/constants/categoryIcons";
// Đã xóa import mockProducts
import { getAllCategoriesAPI } from "@/service/api";
import { formatCategoryName } from "@/utils/formatters";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

// --- LOCAL TYPE DEFINITION ---
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

// Đã xóa hàm getProductCountFromMock

// --- COMPONENT CONTAINER ---
export default function CategoryScreen() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<ICategoryAPI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- FETCH API ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await getAllCategoriesAPI();

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
    // ✅ Xử lý riêng cho item "Tất cả sản phẩm" (ID = -1)
    if (categoryId === -1) {
      router.push({
        pathname: "/category/[id]",
        params: {
          id: "all-products", // Truyền ID đặc biệt này
          name: "Tất cả sản phẩm",
        },
      });
      return;
    }

    // Logic cũ cho các danh mục thường
    const selectedCategory = categories.find((c) => c.id === categoryId);
    router.push({
      pathname: "/category/[id]",
      params: {
        id: categoryId,
        name: selectedCategory?.name || "Danh mục",
      },
    });
  };

  // --- DATA TRANSFORMATION ---
  const categoryData = useMemo<CategoryItemData[]>(() => {
    // 1. Tạo item tĩnh "Tất cả sản phẩm"
    const allProductsItem: CategoryItemData = {
      id: -1, // Dùng ID âm để không trùng với ID thật từ database
      name: "Tất cả sản phẩm",
      productCount: 0, // API chưa có count, tạm để 0
      iconConfig: {
        name: "cubes", // Icon FontAwesome5
        color: "#10B981", // Màu xanh lá (Primary)
        bg: "#D1FAE5", // Nền xanh nhạt
      },
      isExpanded: false,
      children: [], // Không có con
    };

    if (!categories || categories.length === 0) {
      // Nếu chưa có category load về, ít nhất vẫn hiện nút này
      return [allProductsItem];
    }

    const parentCategories = categories.filter(
      (c) => c.parentCategoryId === null || c.parentCategoryId === undefined
    );

    const mappedCategories = parentCategories.map((parentCategory) => {
      const childCategories = categories.filter(
        (c) => c.parentCategoryId === parentCategory.id
      );

      const isExpanded = expandedCategories.includes(parentCategory.id);
      const productCount = 0; // API chưa có count, tạm để 0
      const iconConfig = getCategoryIcon(parentCategory.name, true);

      const childrenMapped = childCategories.map((childCategory) => {
        const childProductCount = 0; // API chưa có count, tạm để 0
        const childIconConfig = getCategoryIcon(childCategory.name, false);

        return {
          id: childCategory.id,
          name: formatCategoryName(childCategory.name),
          productCount: childProductCount,
          iconConfig: childIconConfig,
        };
      });

      return {
        id: parentCategory.id,
        name: formatCategoryName(parentCategory.name),
        productCount: productCount,
        iconConfig: iconConfig,
        isExpanded: isExpanded,
        children: childrenMapped,
      };
    });

    // 2. Chèn "Tất cả sản phẩm" lên đầu mảng
    return [allProductsItem, ...mappedCategories];
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
