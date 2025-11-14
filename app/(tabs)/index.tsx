// HomeScreen.tsx

// --- 1. React & React Native ---
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

// --- 2. Expo (Routing) ---
import { useRouter } from "expo-router";

// --- 3. UI Components (Các thành phần giao diện) ---
import BannerSlider from "@/components/common/BannerSlider";
import SectionHeader from "@/components/common/SectionHeader";
import ChatModal from "@/components/screens/chat/ChatModal";
import HomeHeader from "@/components/screens/home/HomeHeader";
import SearchBar from "@/components/screens/home/SearchBar";
import NotificationModal from "@/components/screens/notifications/NotificationModal";
import ProductHorizontalGrid from "@/components/screens/product/ProductHorizontalGrid";

// --- 4. Context & Hooks (Quản lý trạng thái) ---
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";

// --- 5. Data (Dữ liệu mock) ---
import { mockBanners, mockProducts } from "@/data/mockData";

const HomeScreen = () => {
  // --- States ---
  const [q, setQ] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  // --- Hooks ---
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();

  // --- Biến đã tính toán (Memoized/Derived) ---
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Handlers cho Modal & Overlay ---
  const openChat = () => setIsChatVisible(true);
  const closeChat = () => setIsChatVisible(false);

  const openNotifications = () => setIsNotificationsVisible(true);
  const closeNotifications = () => setIsNotificationsVisible(false);

  // --- Handlers cho Logic nghiệp vụ (Business Logic) ---
  const handleSearchSubmit = useCallback(() => {
    const s = q.trim();
    if (!s) return;
    console.log("Searching for:", s);
    // Logic điều hướng đến trang tìm kiếm...
  }, [q]);

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

  // --- Handlers cho Điều hướng (Navigation) ---
  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleCartPress = () => {
    router.push("/cart/CartScreen"); // Điều hướng đến trang giỏ hàng
  };

  return (
    <View className="flex-1 ">
      {/* --- 1. Phần Header (Cố định) --- */}
      <View className="bg-STATUS_BAR">
        {/* 1.1. Home Header (Logo, Icons) */}
        <HomeHeader
          cartItemCount={cartItemCount}
          messageCount={1}
          notificationCount={3}
          onCartPress={handleCartPress} // Chuyển hướng thay vì mở modal
          onMessagePress={openChat}
          onNotificationPress={openNotifications}
          logoSource={require("@/assets/logo_organic.png")}
        />
        {/* 1.2. Thanh tìm kiếm */}
        <View className="px-3 pt-2 bg-gray-50">
          <SearchBar
            value={q}
            onChangeText={setQ}
            onSubmit={handleSearchSubmit}
          />
        </View>
      </View>

      {/* --- 2. Phần Body (Nội dung cuộn được) --- */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {/* 2.1. Banner quảng cáo */}
          <View className="px-3 mt-3">
            <BannerSlider
              images={mockBanners}
              height={170}
              autoPlay
              loop
              onPressItem={(i) => console.log("Tapped banner", i)}
            />
          </View>

          {/* 2.2. Section: Ưu đãi hôm nay */}
          <View>
            <SectionHeader
              title="Ưu đãi hôm nay"
              onSeeAllPress={() => console.log("Go to all deals page")}
            />
            <ProductHorizontalGrid
              products={mockProducts}
              rowsPerColumn={2}
              cardWidth={180}
              onPressProduct={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          </View>

          {/* 2.3. Section: Sản phẩm bán chạy */}
          <View>
            <SectionHeader
              title="Sản phẩm bán chạy"
              onSeeAllPress={() => console.log("Go to all best-selling page")}
            />
            <ProductHorizontalGrid
              products={mockProducts}
              rowsPerColumn={2}
              cardWidth={180}
              onPressProduct={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          </View>
        </View>
      </ScrollView>

      {/* --- 3. Các thành phần Overlay (Modals) --- */}
      <ChatModal visible={isChatVisible} onClose={closeChat} />
      <NotificationModal
        visible={isNotificationsVisible}
        onClose={closeNotifications}
      />
    </View>
  );
};

export default HomeScreen;