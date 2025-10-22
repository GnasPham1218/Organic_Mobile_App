// app/product/[id].tsx

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Text, View } from "react-native";

// ✨ SỬA 1: Đảm bảo đường dẫn import đúng tên file component
import ProductDetailView from "@/components/features/product/ProductDetail"; 
import { useCart } from "@/context/CartContext";
import { mockProducts } from "@/data/mockData";

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  // ✨ SỬA 2: Chuyển đổi ID từ string (trong URL) sang number
  const productIdAsNumber = id ? parseInt(id, 10) : NaN;

  // ✨ SỬA 3: Tìm sản phẩm bằng 'product_id' và ID đã được chuyển đổi
  const product = mockProducts.find(
    (p) => p.product_id === productIdAsNumber
  );

  // Xử lý khi không tìm thấy sản phẩm
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Không tìm thấy sản phẩm!</Text>
      </View>
    );
  }

  // Hàm handleAddToCart không đổi
  const handleAddToCart = (quantity: number) => {
    addToCart(product, quantity);
    Alert.alert(
      "Thành công",
      `Đã thêm ${quantity} "${product.name}" vào giỏ hàng.`
    );
  };

  return (
    <>
      {/* Ẩn header mặc định vì đã có header tùy chỉnh */}
      <Stack.Screen options={{ headerShown: false }} />
      <ProductDetailView
        product={product}
        onBackPress={router.back}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductDetailScreen;