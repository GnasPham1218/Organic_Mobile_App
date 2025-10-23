// HomeScreen.tsx

import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

// Giả sử các component này đã được tạo
import CartDropdown from "@/components/features/cart/CartDropdown";
import ChatModal from "@/components/features/chat/ChatModal";
import ProductHorizontalGrid from "@/components/features/product/ProductHorizontalGrid";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import BannerSlider from "@/components/ui/BannerSlider";
import SectionHeader from "@/components/ui/SectionHeader";
// 1. Kết nối với CartContext
import { useCart } from "@/context/cart/CartContext";

// 2. Dữ liệu được import từ file riêng
import { mockBanners, mockProducts } from "@/data/mockData";

const HomeScreen = () => {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Lấy state và hàm từ context
  const { cart, addToCart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Các hàm xử lý sự kiện
  const openChat = () => setIsChatVisible(true);
  const closeChat = () => setIsChatVisible(false);
  const handleToggleCartVisibility = () => setIsCartVisible(!isCartVisible);

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
        console.log("Added to cart:", productToAdd.name);
      }
    },
    [addToCart]
  );

  // Hàm điều hướng đến trang chi tiết sản phẩm
  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    // Cấu trúc lại với View gốc để quản lý các lớp overlay tốt hơn

    <View className="flex-1 bg-gray-50">
      <View className="bg-white shadow-sm">
        <HomeHeader
          cartItemCount={cartItemCount}
          messageCount={1}
          onCartPress={handleToggleCartVisibility}
          onMessagePress={openChat}
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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky Header Section */}

        {/* Main Content */}
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

          {/* Today's Deals Section */}
          <View>
            <SectionHeader
              title="Ưu đãi hôm nay"
              onSeeAllPress={() => console.log("Go to all deals page")}
            />
            <ProductHorizontalGrid
              products={mockProducts}
              rowsPerColumn={2}
              cardWidth={180}
              // ✨ SỬA LỖI Ở ĐÂY: Sử dụng hàm handleProductPress
              onPressProduct={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          </View>

          {/* Có thể thêm các section khác ở đây */}
          {/* <SectionHeader title="Sản phẩm bán chạy" ... /> */}
          {/* <ProductHorizontalGrid ... /> */}
          <View>
            <SectionHeader
              title="Ưu đãi hôm nay"
              onSeeAllPress={() => console.log("Go to all deals page")}
            />
            <ProductHorizontalGrid
              products={mockProducts}
              rowsPerColumn={2}
              cardWidth={180}
              // ✨ SỬA LỖI Ở ĐÂY: Sử dụng hàm handleProductPress
              onPressProduct={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          </View>
        </View>
      </ScrollView>

      {/* Các component overlay đặt ở đây để hiển thị đè lên trên */}
      <CartDropdown
        visible={isCartVisible}
        onClose={() => setIsCartVisible(false)}
      />
      <ChatModal visible={isChatVisible} onClose={closeChat} />
    </View>
  );
};

export default HomeScreen;
