import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";

import IconButton from "@/components/common/IconButton";
import ProductDetailView from "@/components/features/product/ProductDetail";
import { useCart } from "@/context/cart/CartContext";
import { mockProducts, mockReviews, mockUsers } from "@/data/mockData";

import { COLORS } from "@/theme/tokens";
import { FontAwesome } from "@expo/vector-icons";

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { cart, addToCart } = useCart();

  const productIdAsNumber = id ? parseInt(id, 10) : NaN;

  // --- product lookup
  const product = mockProducts.find((p) => p.product_id === productIdAsNumber);

  // --- reviews
  const productReviews = useMemo(() => {
    if (Number.isNaN(productIdAsNumber)) return [];
    return mockReviews
      .filter((r) => r.product_id === productIdAsNumber)
      .map((r) => {
        const user = mockUsers.find((u) => u.user_id === r.customer_user_id);
        return {
          ...r,
          user_name: user?.name ?? "Ẩn danh",
          user_avatar: user?.avatar_url ?? "https://i.pravatar.cc/150",
        };
      });
  }, [productIdAsNumber]);

  const averageRating = product?.rating_avg ?? 0;

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Không tìm thấy sản phẩm!</Text>
      </View>
    );
  }

  const handleAddToCart = (quantity: number) => {
    addToCart(product, quantity);
    Alert.alert(
      "Thành công",
      `Đã thêm ${quantity} "${product.name}" vào giỏ hàng.`
    );
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const ReviewItem: React.FC<{
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: string;
  }> = ({ userName, userAvatar, rating, comment, date }) => {
    return (
      <View className="flex-row bg-white p-4 rounded-2xl mb-3 shadow-sm">
        <Image
          source={{ uri: userAvatar }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-base font-semibold text-gray-800">
              {userName}
            </Text>
            <View className="flex-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesome
                  key={i}
                  name={i < rating ? "star" : "star-o"}
                  size={16}
                  color="#FACC15"
                  style={{ marginLeft: i === 0 ? 0 : 4 }}
                />
              ))}
            </View>
          </View>

          <Text className="text-sm text-gray-700 mb-1">{comment}</Text>
          <Text className="text-xs text-gray-500">{date}</Text>
        </View>
      </View>
    );
  };

  const ReviewSection = () => {
    return (
      <View className="px-4 pb-6">
        {/* Header: average rating + count */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Text className="text-xl font-semibold mr-2">Đánh giá</Text>
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold mr-2">
                {averageRating?.toFixed
                  ? averageRating.toFixed(1)
                  : averageRating || "0.0"}
              </Text>
              <View className="flex-row">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FontAwesome
                    key={i}
                    name={i < Math.round(averageRating) ? "star" : "star-o"}
                    size={16}
                    color="#FACC15"
                    style={{ marginLeft: i === 0 ? 0 : 4 }}
                  />
                ))}
              </View>
            </View>
          </View>

          <Text className="text-sm text-gray-500">
            {productReviews.length} lượt
          </Text>
        </View>

        {productReviews.length === 0 ? (
          <View className="py-6 items-center">
            <Text className="text-gray-500">
              Chưa có đánh giá nào cho sản phẩm này.
            </Text>
          </View>
        ) : (
          <FlatList
            data={productReviews}
            keyExtractor={(item) => item.review_id.toString()}
            renderItem={({ item }) => (
              <ReviewItem
                userName={item.user_name}
                userAvatar={item.user_avatar}
                rating={item.rating}
                comment={item.comment}
                date={item.create_at}
              />
            )}
            scrollEnabled={false} // scroll bằng ScrollView của ProductDetailView
            ListFooterComponent={<View className="h-4" />}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProductDetailView
        product={product}
        onBackPress={router.back}
        onAddToCart={handleAddToCart}
        headerRight={
          <IconButton
            icon="shopping-cart"
            onPress={() => router.push("/cart/CartScreen")} // ✨ chuyển sang trang CartScreen
            color={COLORS.PRIMARY}
            badge={cartItemCount > 0}
            badgeContent={cartItemCount > 99 ? "99+" : cartItemCount}
          />
        }
      >
        <ReviewSection />
      </ProductDetailView>
    </View>
  );
};

export default ProductDetailScreen;
