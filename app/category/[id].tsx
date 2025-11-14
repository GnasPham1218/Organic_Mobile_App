// app/category/[id].tsx
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";
import {
  getCategoryById,
  getChildCategories,
  mockProducts,
  Product,
} from "@/data/mockData";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

// Import View component chính
import CategoryDetailView from "@/components/screens/category/CategoryDetailView";

// Định nghĩa kiểu sắp xếp (có thể chuyển ra file types riêng)
export type SortOrder = "default" | "price_asc" | "price_desc" | "name_asc";

export default function CategoryDetailScreen() {
  // --- STATE VÀ HOOKS ---
  const { id } = useLocalSearchParams();
  const categoryId = parseInt(id as string);

  const { cart, addToCart } = useCart();
  const { showToast } = useToast();

  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // --- LOGIC DATA (LỌC VÀ SẮP XẾP) ---

  const isFilteredOrSorted = useMemo(() => {
    return (
      sortOrder !== "default" ||
      appliedMinPrice !== null ||
      appliedMaxPrice !== null
    );
  }, [sortOrder, appliedMinPrice, appliedMaxPrice]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const currentCategory = getCategoryById(categoryId);

  // 1. Lấy danh sách sản phẩm thuần túy theo category (để đưa vào modal lọc)
  const categoryProducts = useMemo(() => {
    const childCategories = getChildCategories(categoryId);
    let filteredProducts: Product[] = [];
    if (childCategories.length > 0) {
      const childIds = childCategories.map((c) => c.id);
      childIds.push(categoryId);
      filteredProducts = mockProducts.filter((p) =>
        childIds.includes(p.category_id)
      );
    } else {
      filteredProducts = mockProducts.filter(
        (p) => p.category_id === categoryId
      );
    }
    return filteredProducts;
  }, [categoryId]);

  // 2. Lấy danh sách đã lọc giá và sắp xếp (để hiển thị)
  const products = useMemo(() => {
    let priceFilteredProducts = [...categoryProducts];

    if (appliedMinPrice !== null) {
      priceFilteredProducts = priceFilteredProducts.filter(
        (p) => (p.salePrice || p.price) >= appliedMinPrice
      );
    }
    if (appliedMaxPrice !== null) {
      priceFilteredProducts = priceFilteredProducts.filter(
        (p) => (p.salePrice || p.price) <= appliedMaxPrice
      );
    }

    let sortedProducts = [...priceFilteredProducts];
    switch (sortOrder) {
      case "price_asc":
        sortedProducts.sort(
          (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
        );
        break;
      case "price_desc":
        sortedProducts.sort(
          (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
        );
        break;
      case "name_asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sortedProducts.sort((a, b) => a.product_id - b.product_id);
        break;
    }
    return sortedProducts;
  }, [categoryProducts, sortOrder, appliedMinPrice, appliedMaxPrice]);

  // --- HANDLERS ---
  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = useCallback(
    (productId: number) => {
      const productToAdd = mockProducts.find((p) => p.product_id === productId);
      if (productToAdd) {
        addToCart(productToAdd);
        showToast("success", "Đã thêm sản phẩm vào giỏ hàng!");
      }
    },
    [addToCart, showToast]
  );

  const handleCartPress = () => {
    router.push("/cart/CartScreen");
  };

  const handleBackPress = () => {
    router.back();
  };

  // Handlers cho Sắp xếp
  const handleSortPress = () => setIsSortModalVisible(true);
  const handleCloseSortModal = () => setIsSortModalVisible(false);
  const handleSelectSort = (order: SortOrder) => {
    setSortOrder(order);
    setIsSortModalVisible(false);
  };

  // Handlers cho Lọc
  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
  };
  const handleCloseFilterModal = () => {
    setIsFilterModalVisible(false);
  };
  const handleApplyFilters = (min: number | null, max: number | null) => {
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setIsFilterModalVisible(false);
  };

  // Handler cho nút Reset
  const handleResetFiltersAndSort = () => {
    setSortOrder("default");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
  };

  // --- GIAO DIỆN RENDER ---
  // Chỉ render component View và truyền props
  return (
    <View className="flex-1 bg-gray-50">
      <CategoryDetailView
        // Dữ liệu
        products={products}
        categoryProducts={categoryProducts}
        currentCategory={currentCategory}
        cartItemCount={cartItemCount}
        
        // State
        isFilteredOrSorted={isFilteredOrSorted}
        sortOrder={sortOrder}
        appliedMinPrice={appliedMinPrice}
        appliedMaxPrice={appliedMaxPrice}
        isSortModalVisible={isSortModalVisible}
        isFilterModalVisible={isFilterModalVisible}
        
        // Handlers
        onBackPress={handleBackPress}
        onCartPress={handleCartPress}
        onProductPress={handleProductPress}
        onAddToCart={handleAddToCart}
        onFilterPress={handleFilterPress}
        onCloseFilterModal={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        onSortPress={handleSortPress}
        onCloseSortModal={handleCloseSortModal}
        onSelectSort={handleSelectSort}
        onResetFiltersAndSort={handleResetFiltersAndSort}
      />
    </View>
  );
}