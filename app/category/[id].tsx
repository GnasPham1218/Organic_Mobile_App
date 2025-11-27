import CategoryDetailView from "@/components/screens/category/CategoryDetailView";
import { useCart } from "@/context/cart/CartContext";
import { getProductCardListAPI, getProductsByCategoryAPI } from "@/service/api";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

// Định nghĩa kiểu sắp xếp
export type SortOrder = "default" | "price_asc" | "price_desc" | "name_asc";

const PAGE_SIZE = 10;

export default function CategoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Params: id (categoryID hoặc 'all-products'), name (tên danh mục)
  const { id, name } = params;

  // Context Giỏ hàng
  const { cart, addToCart } = useCart();

  // --- STATE ---
  // SỬA: Dùng IProductCard[] thay vì Product[] (Mock)
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter & Sort UI
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // State lọc giá (hiện tại chỉ lưu UI, chờ API update)
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // Tính tổng số lượng item trong giỏ (để hiện badge)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- FETCH DATA FUNCTION ---
  const fetchProducts = useCallback(
    async (pageNum: number, sort: SortOrder, isRefresh = false) => {
      try {
        if (pageNum === 1 && !isRefresh) setLoading(true);

        let response;
        // Kiểm tra logic: Lấy tất cả hay lấy theo category
        if (id === "all-products") {
          response = await getProductCardListAPI(pageNum, PAGE_SIZE, sort);
        } else {
          // Ép kiểu id về number vì params.id là string
          response = await getProductsByCategoryAPI(
            Number(id),
            pageNum,
            PAGE_SIZE,
            sort
          );
        }

        if (response && response.data && response.data.data) {
          const newData = response.data.data.result;
          const meta = response.data.data.meta;

          if (pageNum === 1) {
            setProducts(newData);
          } else {
            setProducts((prev) => [...prev, ...newData]);
          }

          // Kiểm tra còn trang sau không
          setHasMore(pageNum < meta.pages);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  // --- EFFECTS ---
  useEffect(() => {
    setPage(1);
    fetchProducts(1, sortOrder, true);
  }, [id, sortOrder]);

  // --- HANDLERS ---
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, sortOrder);
    }
  };

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleCartPress = () => {
    router.push("/cart/CartScreen");
  };

  const handleBackPress = () => {
    router.back();
  };

  // SỬA: Hàm này nhận object product thay vì productId để khớp với Type
  const handleAddToCart = async (product: IProductCard) => {
    await addToCart(product);
  };

  // Sort Handlers
  const handleSelectSort = (order: SortOrder) => {
    setSortOrder(order);
    setIsSortModalVisible(false);
  };

  // Filter Handlers
  const handleApplyFilters = (min: number | null, max: number | null) => {
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setIsFilterModalVisible(false);
    Alert.alert(
      "Thông báo",
      "Tính năng lọc giá đang được cập nhật phía server."
    );
  };

  const handleResetFiltersAndSort = () => {
    setSortOrder("default");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
  };

  // --- UI ---
  const displayCategoryName = name
    ? (name as string)
    : id === "all-products"
      ? "Tất cả sản phẩm"
      : "Danh mục";

  const isFilteredOrSorted =
    sortOrder !== "default" ||
    appliedMinPrice !== null ||
    appliedMaxPrice !== null;

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {loading && page === 1 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <CategoryDetailView
          // Data lấy từ API
          products={products}
          categoryName={displayCategoryName}
          cartItemCount={cartItemCount}
          // State
          isFilteredOrSorted={isFilteredOrSorted}
          sortOrder={sortOrder}
          appliedMinPrice={appliedMinPrice}
          appliedMaxPrice={appliedMaxPrice}
          isSortModalVisible={isSortModalVisible}
          isFilterModalVisible={isFilterModalVisible}
          // Actions
          onBackPress={handleBackPress}
          onCartPress={handleCartPress}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart} // Đã sửa type
          onFilterPress={() => setIsFilterModalVisible(true)}
          onCloseFilterModal={() => setIsFilterModalVisible(false)}
          onApplyFilters={handleApplyFilters}
          onSortPress={() => setIsSortModalVisible(true)}
          onCloseSortModal={() => setIsSortModalVisible(false)}
          onSelectSort={handleSelectSort}
          onResetFiltersAndSort={handleResetFiltersAndSort}
          // Infinite Scroll
          onEndReached={handleLoadMore}
        />
      )}

      {loading && page > 1 && (
        <View className="py-2 items-center bg-transparent">
          <ActivityIndicator size="small" color="#10B981" />
        </View>
      )}
    </View>
  );
}
