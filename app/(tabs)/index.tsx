// app/index.tsx (hoặc HomeScreen.tsx)

// --- 1. React & React Native ---
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// --- 2. Expo (Routing) ---
import { useRouter } from "expo-router";

// --- 3. UI Components ---
import BannerSlider from "@/components/common/BannerSlider";
import SectionHeader from "@/components/common/SectionHeader";
import ChatModal from "@/components/screens/chat/ChatModal";
import HomeHeader from "@/components/screens/home/HomeHeader";
import SearchBar from "@/components/screens/home/SearchBar";
import NotificationModal from "@/components/screens/notifications/NotificationModal";
import AddToCartModal from "@/components/screens/product/AddToCartModal";
import ProductHorizontalGrid from "@/components/screens/product/ProductHorizontalGrid";

// --- 4. Context & Hooks ---
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";

// --- 5. Data & API ---
import { AppConfig } from "@/constants/AppConfig";
import { mockBanners, mockProducts } from "@/data/mockData";
import {
  getBestPromotionProductsAPI,
  getNewArrivalsAPI,
  searchProductsAPI,
} from "@/service/api";
import { COLORS } from "@/theme/tokens";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomeScreen = () => {
  // --- States ---
  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  // State sản phẩm
  const [promotionProducts, setPromotionProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Add to Cart
  const [productToAdd, setProductToAdd] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // --- Hooks ---
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Handlers Modal ---
  const openChat = () => setIsChatVisible(true);
  const closeChat = () => setIsChatVisible(false);
  const openNotifications = () => setIsNotificationsVisible(true);
  const closeNotifications = () => setIsNotificationsVisible(false);

  // --- 1. Gọi API lấy dữ liệu trang chủ ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [resPromo, resNew] = await Promise.all([
          getBestPromotionProductsAPI(1, 10),
          getNewArrivalsAPI(1, 10),
        ]);

        const promoData = resPromo.data?.data?.result;
        if (promoData) {
          const mappedPromo = promoData.map((item: any) => ({
            product_id: item.id,
            id: item.id,
            name: item.name,
            image: item.image || "",
            price: item.originalPrice,
            salePrice: item.finalPrice,
            quantity: item.quantity,
            inStock: true,
          }));
          setPromotionProducts(mappedPromo);
        }

        const newData = resNew.data?.data?.result;
        if (newData) {
          const mappedNew = newData.map((item: any) => ({
            product_id: item.id,
            id: item.id,
            name: item.name,
            image: item.image || "",
            price: item.originalPrice,
            salePrice: item.finalPrice,
            quantity: item.quantity,
            inStock: true,
          }));
          setNewArrivals(mappedNew);
        }
      } catch (error) {
        console.log("Lỗi tải trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // --- 2. LOGIC TÌM KIẾM (DEBOUNCE) ---
  useEffect(() => {
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const delayDebounce = setTimeout(async () => {
      try {
        const data = await searchProductsAPI(q);
        setSearchResults(data || []);
      } catch (error) {
        console.log("Lỗi tìm kiếm:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [q]);

  // --- Handlers Nghiệp vụ ---
  const handleSelectSearchItem = (productId: number) => {
    setQ("");
    setSearchResults([]);
    Keyboard.dismiss();
    router.push(`/product/${productId}`);
  };

  const handleOpenAddModal = useCallback(
    (productId: number) => {
      const allProducts = [...promotionProducts, ...newArrivals];
      const target = allProducts.find((p) => p.id === productId);
      if (target) {
        setProductToAdd(target);
        setShowAddModal(true);
      }
    },
    [promotionProducts, newArrivals]
  );

  const handleConfirmAddToCart = useCallback(
    async (quantity: number) => {
      if (!productToAdd) return;
      const success = await addToCart(productToAdd, quantity);
      if (success)
        showToast("success", `Đã thêm ${quantity} sản phẩm vào giỏ!`);
      setProductToAdd(null);
    },
    [productToAdd, addToCart, showToast]
  );

  const handleAddToCart = useCallback(
    (productId: number) => {
      const allProducts = [...promotionProducts, ...newArrivals];
      const productFromApi = allProducts.find(
        (p) => p.product_id === productId
      );

      if (productFromApi) {
        if (productFromApi.quantity <= 0) {
          showToast("error", "Sản phẩm tạm thời hết hàng!");
          return;
        }
        const itemInCart = cart.find((item) => item.id === productId);
        const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;

        if (currentQtyInCart + 1 > productFromApi.quantity) {
          showToast("error", `Chỉ còn ${productFromApi.quantity} sản phẩm!`);
          return;
        }
        addToCart(productFromApi);
        showToast("success", "Đã thêm sản phẩm vào giỏ hàng!");
      } else {
        const mockItem = mockProducts.find((p) => p.product_id === productId);
        if (mockItem) addToCart(mockItem);
      }
    },
    [addToCart, showToast, promotionProducts, newArrivals, cart]
  );

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleCartPress = () => {
    router.push("/cart/CartScreen");
  };

  // --- RENDER ITEM CHO DROPDOWN SEARCH ---
  // --- RENDER ITEM CHO DROPDOWN SEARCH ---
  const renderSearchItem = ({ item }: { item: any }) => {
    // 1. Xử lý đường dẫn ảnh
    let uri = "";
    if (item.image) {
      const baseUrl = AppConfig.PRODUCTS_URL.replace(/\/$/, "");
      const fileName = encodeURIComponent(item.image);
      uri = `${baseUrl}/${fileName}`;
    }

    const imageUrl =
      item.image && uri ? { uri: uri } : require("@/assets/logo_organic.png");

    const hasPromotion = !!item.bestPromotion;
    const finalPrice = hasPromotion
      ? item.bestPromotion.finalPrice
      : item.price;

    return (
      <TouchableOpacity
        onPress={() => handleSelectSearchItem(item.id)}
        className="flex-row items-center p-3 border-b border-gray-100 bg-white active:bg-gray-50"
      >
        <Image
          source={imageUrl}
          className="w-12 h-12 rounded bg-gray-100 mr-3"
          resizeMode="cover"
          onError={(e) =>
            console.log(`Lỗi tải ảnh ID ${item.id}:`, e.nativeEvent.error)
          }
        />

        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>
            {item.name}
          </Text>

          <View className="flex-row items-baseline mt-1">
            <Text
              className={`font-bold text-sm ${
                hasPromotion ? "text-red-600" : "text-primary"
              }`}
              style={{ color: hasPromotion ? "#DC2626" : COLORS.PRIMARY }}
            >
              {finalPrice.toLocaleString("vi-VN")}đ
            </Text>

            {hasPromotion && (
              <Text className="text-[10px] text-gray-400 line-through ml-2">
                {item.price.toLocaleString("vi-VN")}đ
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View className="flex-1 bg-white">
      {/* --- 1. Header & Search --- */}
      <View className="bg-STATUS_BAR z-50">
        <HomeHeader
          cartItemCount={cartItemCount}
          messageCount={1}
          notificationCount={3}
          onCartPress={handleCartPress}
          onMessagePress={openChat}
          onNotificationPress={openNotifications}
          logoSource={require("@/assets/logo_organic.png")}
        />

        {/* Search Bar Container */}
        <View className="px-3 pt-2 bg-gray-50 pb-2 relative z-50">
          <SearchBar
            value={q}
            onChangeText={setQ}
            onSubmit={() => {}}
            placeholder="Tìm rau, củ, quả..."
          />

          {/* ✅ DROPDOWN KẾT QUẢ TÌM KIẾM */}
          {q.length > 0 && (
            <View
              className="absolute top-[60px] left-3 right-3 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
              style={{ maxHeight: SCREEN_HEIGHT * 0.4 }} // Giới hạn chiều cao
            >
              {isSearching ? (
                <View className="p-4 items-center">
                  <Text className="text-gray-500 text-sm">Đang tìm...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderSearchItem}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true} // ✅ Hiển thị thanh cuộn
                />
              ) : (
                <View className="p-4 items-center">
                  <Text className="text-gray-500 text-sm">
                    Không tìm thấy sản phẩm nào
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* --- 2. Body ScrollView --- */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="space-y-4 pb-20">
            {/* Banner */}
            <View className="px-3 mt-3">
              <BannerSlider
                images={mockBanners}
                height={170}
                autoPlay
                loop
                onPressItem={(i) => console.log("Tapped banner", i)}
              />
            </View>

            {/* Section: Ưu đãi hôm nay */}
            {promotionProducts.length > 0 && (
              <View>
                <SectionHeader
                  title="Ưu đãi hôm nay"
                  onSeeAllPress={() => console.log("Xem tất cả ưu đãi")}
                />
                <ProductHorizontalGrid
                  products={promotionProducts}
                  rowsPerColumn={2}
                  cardWidth={180}
                  onPressProduct={handleProductPress}
                  onAddToCart={handleOpenAddModal}
                />
              </View>
            )}

            {/* Section: Sản phẩm mới về */}
            {newArrivals.length > 0 && (
              <View>
                <SectionHeader
                  title="Sản phẩm mới về"
                  onSeeAllPress={() => console.log("Xem tất cả hàng mới")}
                />
                <ProductHorizontalGrid
                  products={newArrivals}
                  rowsPerColumn={2}
                  cardWidth={180}
                  onPressProduct={handleProductPress}
                  onAddToCart={handleOpenAddModal}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* --- 3. Modals --- */}
      <ChatModal visible={isChatVisible} onClose={closeChat} />
      <NotificationModal
        visible={isNotificationsVisible}
        onClose={closeNotifications}
      />
      <AddToCartModal
        visible={showAddModal}
        product={productToAdd}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleConfirmAddToCart}
      />
    </View>
  );
};

export default HomeScreen;
