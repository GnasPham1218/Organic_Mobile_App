import CategoryDetailView from "@/components/screens/category/CategoryDetailView";
import AddToCartModal from "@/components/screens/product/AddToCartModal";
 // Đảm bảo đường dẫn đúng
import { useCart } from "@/context/cart/CartContext";
import {
  getBestPromotionByProductId,
  getProductCardListAPI,
  getProductsByCategoryAPI,
} from "@/service/api";
import { formatCategoryName } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons"; // Icon cho nút Scroll
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

// Định nghĩa kiểu sắp xếp
export type SortOrder = "default" | "price_asc" | "price_desc" | "name_asc";

const PAGE_SIZE = 10;

export default function CategoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, name } = params;

  // Context Giỏ hàng
  const { cart, addToCart } = useCart();

  // --- REFS ---
  // Ref để điều khiển cuộn trang
  const flatListRef = useRef<FlatList>(null);

  // --- STATE DATA ---
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>(() => {
    if (id === "all-products") return "Tất cả sản phẩm";
    if (name) return Array.isArray(name) ? name[0] : name;
    return "Danh mục";
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // --- STATE UI & FILTER ---
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false); // State hiển thị nút scroll

  // --- STATE MODAL ADD TO CART ---
  const [isAddToCartVisible, setIsAddToCartVisible] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] =
    useState<any>(null); // Type ProductData của Modal

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- EFFECT: CATEGORY NAME ---
  useEffect(() => {
    const resolveCategoryName = async () => {
      if (id === "all-products") {
        setCategoryName("Tất cả sản phẩm");
        return;
      }
      setCategoryName(formatCategoryName(Array.isArray(name) ? name[0] : name));
    };
    resolveCategoryName();
  }, [id, name]);

  // --- EFFECT: FETCH PRODUCTS ---
  const fetchProducts = useCallback(
    async (pageNum: number, sort: SortOrder, isRefresh = false) => {
      try {
        setLoading(true);
        let response;
        if (id === "all-products") {
          response = await getProductCardListAPI(pageNum, PAGE_SIZE, sort);
        } else {
          response = await getProductsByCategoryAPI(
            Number(id),
            pageNum,
            PAGE_SIZE,
            sort
          );
        }

        if (response && response.data && response.data.data) {
          const rawProducts = response.data.data.result;
          const meta = response.data.data.meta;

          const enrichedProducts = await Promise.all(
            rawProducts.map(async (product) => {
              try {
                const promoRes = await getBestPromotionByProductId(product.id);
                const promoData = promoRes.data?.data;
                if (promoData) {
                  return {
                    ...product,
                    discount: {
                      type: promoData.type,
                      value: promoData.value,
                    },
                  };
                }
              } catch (err) {}
              return product;
            })
          );

          if (pageNum === 1) {
            setProducts(enrichedProducts);
          } else {
            setProducts((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const uniqueNewProducts = enrichedProducts.filter(
                (p) => !existingIds.has(p.id)
              );
              return [...prev, ...uniqueNewProducts];
            });
          }
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

  // --- LOGIC SCROLL TO TOP ---
  const handleScrollToTop = () => {
    // Gọi method scrollToOffset của FlatList thông qua ref
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // --- LOGIC ADD TO CART ---

  // 1. Khi bấm nút Add (Giỏ hàng) ở card sản phẩm -> Mở Modal
  const handleOpenAddToCartModal = (product: IProductCard) => {
    // Tính toán giá sale để truyền vào modal
    let salePrice = undefined;
    if (product.discount) {
      if (product.discount.type === "PERCENT") {
        salePrice = product.price * (1 - product.discount.value / 100);
      } else if (product.discount.type === "FIXED_AMOUNT") {
        salePrice = product.price - product.discount.value;
      }
    }

    // Map dữ liệu sang cấu trúc Modal yêu cầu
    const modalData = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      salePrice: salePrice,
      quantity: 100, // Giả định tồn kho hoặc lấy từ API nếu có field quantity
    };

    setSelectedProductForModal(modalData);
    setIsAddToCartVisible(true);
  };

  // 2. Khi xác nhận số lượng trong Modal -> Gọi Context AddToCart
  const handleConfirmAddToCart = async (quantity: number) => {
    if (selectedProductForModal) {
      // Tìm lại product gốc (IProductCard) để đảm bảo đúng type cho Context
      const originalProduct = products.find(
        (p) => p.id === selectedProductForModal.id
      );

      if (originalProduct) {
        // Lưu ý: Hàm addToCart trong context cần hỗ trợ tham số quantity
        // Ví dụ: addToCart(product, quantity)
        await addToCart(originalProduct, quantity);
        // Alert.alert("Thành công", `Đã thêm ${quantity} sản phẩm vào giỏ.`);
      }
    }
    setIsAddToCartVisible(false);
  };

  // --- HANDLERS FILTER & SORT ---
  const handleSelectSort = (order: SortOrder) => {
    setSortOrder(order);
    setIsSortModalVisible(false);
  };

  const handleApplyFilters = (min: number | null, max: number | null) => {
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setIsFilterModalVisible(false);
    Alert.alert("Thông báo", "Tính năng lọc giá đang cập nhật.");
  };

  const handleResetFiltersAndSort = () => {
    setSortOrder("default");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
  };

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
        <>
          <CategoryDetailView
            // Truyền ref xuống View (Quan trọng: View phải gắn ref này vào FlatList)
            flatListRef={flatListRef}
            products={products}
            categoryName={categoryName}
            cartItemCount={cartItemCount}
            isFilteredOrSorted={isFilteredOrSorted}
            sortOrder={sortOrder}
            appliedMinPrice={appliedMinPrice}
            appliedMaxPrice={appliedMaxPrice}
            isSortModalVisible={isSortModalVisible}
            isFilterModalVisible={isFilterModalVisible}
            onBackPress={handleBackPress}
            onCartPress={handleCartPress}
            onProductPress={handleProductPress}
            onAddToCart={handleOpenAddToCartModal} // Đổi handler sang mở modal
            onFilterPress={() => setIsFilterModalVisible(true)}
            onCloseFilterModal={() => setIsFilterModalVisible(false)}
            onApplyFilters={handleApplyFilters}
            onSortPress={() => setIsSortModalVisible(true)}
            onCloseSortModal={() => setIsSortModalVisible(false)}
            onSelectSort={handleSelectSort}
            onResetFiltersAndSort={handleResetFiltersAndSort}
            onEndReached={handleLoadMore}
            // Sự kiện scroll để hiện/ẩn nút (Tùy chọn: cần View hỗ trợ callback onScroll)
          />

          {/* --- BUTTON SCROLL TO TOP --- */}
          <TouchableOpacity
            onPress={handleScrollToTop}
            className="absolute bottom-6 right-6 w-12 h-12 bg-green-600 rounded-full items-center justify-center shadow-lg shadow-green-900/50 z-50"
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-up" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}

      {/* --- ADD TO CART MODAL --- */}
      <AddToCartModal
        visible={isAddToCartVisible}
        product={selectedProductForModal}
        onClose={() => setIsAddToCartVisible(false)}
        onConfirm={handleConfirmAddToCart}
      />

      {loading && page > 1 && (
        <View className="py-2 items-center bg-transparent mb-16">
          <ActivityIndicator size="small" color="#10B981" />
        </View>
      )}
    </View>
  );
}
