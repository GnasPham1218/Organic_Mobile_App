// HomeScreen.tsx đã được cải thiện

import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

// Giả sử các component này đã được tạo
import CartDropdown from "@/components/features/cart/CartDropdown";
import ProductHorizontalGrid from "@/components/features/product/ProductHorizontalGrid";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import BannerSlider from "@/components/ui/BannerSlider";
import SectionHeader from "@/components/ui/SectionHeader"; // Component mới
// 1. Kết nối với CartContext
import { useCart } from "@/context/CartContext";

// 2. Dữ liệu được import từ file riêng
import { mockBanners, mockProducts } from "@/data/mockData";

const HomeScreen = () => {
  const [q, setQ] = useState("");

  // 3. Lấy state và hàm từ context
  const { cart, addToCart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const handleSearchSubmit = useCallback(() => {
    const s = q.trim();
    if (!s) return;
    console.log("Searching for:", s);
    // Logic điều hướng đến trang tìm kiếm...
  }, [q]);
  const handleToggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };
  const handleAddToCart = useCallback(
    (productId: string) => {
      const productToAdd = mockProducts.find((p) => p.id === productId);
      if (productToAdd) {
        // SỬA LẠI: Truyền thẳng productToAdd vào
        addToCart(productToAdd);
        console.log("Added to cart:", productToAdd.name);
      }
    },
    [addToCart]
  );

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="bg-gray-50" // Thêm màu nền cho toàn bộ scrollview
    >
      {/* Sticky Header Section */}
      <View className="bg-white shadow-sm">
        <HomeHeader
          // Dữ liệu từ context
          cartItemCount={cartItemCount}
          messageCount={1} // Sẽ thay bằng state message sau
          onCartPress={handleToggleCartVisibility}
          onMessagePress={() => console.log("Go to messages")}
          logoSource={require("@/assets/logo_organic.png")}
        />
        <View className="px-3 pt-1 pb-3">
          <SearchBar
            value={q}
            onChangeText={setQ}
            onSubmit={handleSearchSubmit}
          />
        </View>
      </View>

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
            onPressProduct={(id) => console.log("Go to product detail", id)}
            onAddToCart={handleAddToCart} // Kết nối hàm add to cart
          />
        </View>

        {/* Có thể thêm các section khác ở đây */}
        {/* <SectionHeader title="Sản phẩm bán chạy" ... /> */}
        {/* <ProductHorizontalGrid ... /> */}

        <View className="h-6" />
      </View>
      <CartDropdown
        visible={isCartVisible} // <-- Nối "công tắc" vào đây
        onClose={() => setIsCartVisible(false)} // Để có thể đóng khi nhấn ra ngoài
      />
    </ScrollView>
  );
};

export default HomeScreen;
