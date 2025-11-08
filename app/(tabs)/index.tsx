// HomeScreen.tsx

import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import ChatModal from "@/components/features/chat/ChatModal";
import BannerSlider from "@/components/common/BannerSlider";
import SectionHeader from "@/components/common/SectionHeader";
import NotificationModal from "@/components/features/notifications/NotificationModal";
import ProductHorizontalGrid from "@/components/features/product/ProductHorizontalGrid";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";
import { mockBanners, mockProducts } from "@/data/mockData";

const HomeScreen = () => {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  const { cart, addToCart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openChat = () => setIsChatVisible(true);
  const closeChat = () => setIsChatVisible(false);

  const openNotifications = () => setIsNotificationsVisible(true);
  const closeNotifications = () => setIsNotificationsVisible(false);

  const handleSearchSubmit = useCallback(() => {
    const s = q.trim();
    if (!s) return;
    console.log("Searching for:", s);
    // Logic điều hướng đến trang tìm kiếm...
  }, [q]);

  const { showToast } = useToast();
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

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  // 🔹 Khi bấm vào giỏ hàng, chuyển sang trang CartScreen
  const handleCartPress = () => {
    router.push("/cart/CartScreen"); // trang CartScreen
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white shadow-sm">
        <HomeHeader
          cartItemCount={cartItemCount}
          messageCount={1}
          notificationCount={3}
          onCartPress={handleCartPress} // 🔹 Chuyển hướng thay vì mở modal
          onMessagePress={openChat}
          onNotificationPress={openNotifications}
          logoSource={require("@/assets/logo_organic.png")}
        />
        <View className="px-3 py-2">
          <SearchBar
            value={q}
            onChangeText={setQ}
            onSubmit={handleSearchSubmit}
          />
        </View>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
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

          {/* Today's Deals */}
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

          {/* Các section khác */}
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

      {/* Overlay components */}
      <ChatModal visible={isChatVisible} onClose={closeChat} />
      <NotificationModal visible={isNotificationsVisible} onClose={closeNotifications} />
    </View>
  );
};

export default HomeScreen;
