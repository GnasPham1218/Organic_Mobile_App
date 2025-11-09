// app/category/[id].tsx
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";
import {
  getCategoryById,
  getChildCategories,
  mockProducts,
  Product, // Import kiểu Product
} from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Import các component View
import IconButton from "@/components/common/IconButton";
import FilterBottomSheet from "@/components/features/category/FilterBottomSheet";
import SortBottomSheet from "@/components/features/category/SortBottomSheet";
import ProductVerticalGrid from "@/components/features/product/ProductVerticalGrid";

// Định nghĩa kiểu sắp xếp
type SortOrder = "default" | "price_asc" | "price_desc" | "name_asc";

export default function CategoryDetailScreen() {
  // --- STATE VÀ HOOKS ---
  const { id } = useLocalSearchParams();
  const categoryId = parseInt(id as string);

  const { cart, addToCart } = useCart();
  const { showToast } = useToast();

  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // State cho Lọc
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // State để biết có đang lọc/sắp xếp hay không
  const isFilteredOrSorted = useMemo(() => {
    return (
      sortOrder !== "default" ||
      appliedMinPrice !== null ||
      appliedMaxPrice !== null
    );
  }, [sortOrder, appliedMinPrice, appliedMaxPrice]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const currentCategory = getCategoryById(categoryId);

  // --- LOGIC DATA (LỌC VÀ SẮP XẾP) ---

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
    // 2. Lọc theo giá (từ danh sách đã lọc theo category)
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

    // 3. Sắp xếp sản phẩm
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
        // Luôn sắp xếp theo ID khi là "default"
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
    setIsFilterModalVisible(true); // Mở modal
  };
  const handleCloseFilterModal = () => {
    setIsFilterModalVisible(false); // Đóng modal
  };
  const handleApplyFilters = (min: number | null, max: number | null) => {
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setIsFilterModalVisible(false); // Đóng modal sau khi áp dụng
  };

  // Handler cho nút Reset
  const handleResetFiltersAndSort = () => {
    setSortOrder("default");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
  };

  // --- COMPONENT CON (ĐỊNH NGHĨA TRONG COMPONENT CHA) ---

  const ListHeader = () => (
    <View
      className="p-4 bg-white mb-3 rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Tiêu đề */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-bold text-gray-800 mb-1">
          {currentCategory?.name}
        </Text>
        <View className="flex-row items-center">
          <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
            <Ionicons name="basket" size={14} color="#16A34A" />
            <Text className="text-xs text-green-700 font-semibold ml-1">
              {products.length} sản phẩm
            </Text>
          </View>
        </View>
      </View>
      {/* Nút Lọc / Sắp xếp / Reset */}
      <View className="flex-row items-center gap-2 flex-wrap">
        <TouchableOpacity
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
          onPress={handleFilterPress}
        >
          <Ionicons name="funnel-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
          onPress={handleSortPress}
        >
          <Ionicons name="swap-vertical" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">
            Sắp xếp
          </Text>
        </TouchableOpacity>

        {/* Nút Bỏ lọc (chỉ hiện khi đang lọc/sắp xếp) */}
        {isFilteredOrSorted && (
          <TouchableOpacity
            className="flex-row items-center bg-red-100 px-3 py-2 rounded-lg"
            onPress={handleResetFiltersAndSort}
          >
            <Ionicons name="refresh-outline" size={14} color="#DC2626" />
            <Text className="text-xs text-red-600 ml-1 font-medium">
              Mặc định
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
      </View>
      <Text className="text-base text-gray-400 font-medium">
        Không tìm thấy sản phẩm phù hợp
      </Text>
      <Text className="text-sm text-gray-400 mt-1">
        Vui lòng thử điều chỉnh bộ lọc
      </Text>
    </View>
  );

  // --- GIAO DIỆN RENDER ---
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header chính */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <IconButton
          icon="arrow-back"
          size={22}
          color="#333"
          onPress={handleBackPress}
        />
        <Text className="text-lg font-semibold text-gray-800">Danh mục</Text>
        <IconButton
          icon="cart-outline"
          size={22}
          color="#2E7D32"
          onPress={handleCartPress}
          badge={cartItemCount > 0}
          badgeContent={cartItemCount > 99 ? "99+" : cartItemCount || undefined}
          testID="cart-button"
        />
      </View>

      {/* Lưới sản phẩm */}
      <ProductVerticalGrid
        products={products} // Truyền danh sách đã sắp xếp
        onPressProduct={handleProductPress}
        onAddToCart={handleAddToCart}
        ListHeaderComponent={ListHeader} // Dùng component đã định nghĩa ở trên
        ListEmptyComponent={ListEmpty} // Dùng component đã định nghĩa ở trên
        numColumns={2}
        contentPaddingHorizontal={16}
        columnGap={12}
        rowGap={12}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
        }}
      />

      {/* Modal Sắp xếp */}
      <SortBottomSheet
        visible={isSortModalVisible}
        onClose={handleCloseSortModal}
        onSelectSort={handleSelectSort}
        currentSort={sortOrder}
      />

      {/* Modal Lọc */}
      <FilterBottomSheet
        visible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
        currentMinPrice={appliedMinPrice}
        currentMaxPrice={appliedMaxPrice}
        allProducts={categoryProducts} // Truyền danh sách CHƯA lọc giá
      />
    </View>
  );
}
