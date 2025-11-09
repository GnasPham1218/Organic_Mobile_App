// app/category/[id].tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView, // SỬA: Dùng ScrollView
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  mockProducts,
  getCategoryById,
  getChildCategories,
  ProductType,
} from "@/data/mockData";

// BƯỚC 1: Import component mới
import ProductHorizontalGrid from "@/components/features/product/ProductHorizontalGrid";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const categoryId = parseInt(id as string);

  const currentCategory = getCategoryById(categoryId);

  const products = useMemo(() => {
    const childCategories = getChildCategories(categoryId);

    if (childCategories.length > 0) {
      const childIds = childCategories.map((c) => c.id);
      childIds.push(categoryId);
      return mockProducts.filter((p) => childIds.includes(p.category_id));
    } else {
      return mockProducts.filter((p) => p.category_id === categoryId);
    }
  }, [categoryId]);

  // BƯỚC 2: Xóa hàm `formatPrice` và `renderProduct` (vì không cần nữa)

  // BƯỚC 3: Thêm các hàm handler để truyền vào component grid
  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = (productId: number) => {
    // TODO: Thêm logic add to cart
    console.log("Add to cart:", productId);
  };

  const ListHeader = () => (
    <View
      className="p-4 bg-white mb-3 rounded-2xl mx-3 mt-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
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
        <View className="w-14 h-14 bg-green-50 rounded-2xl items-center justify-center">
          <Ionicons name="leaf" size={28} color="#16A34A" />
        </View>
      </View>

      <View className="flex-row items-center space-x-2">
        <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Ionicons name="funnel-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Ionicons name="swap-vertical" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1 font-medium">Sắp xếp</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-green-100 px-3 py-2 rounded-lg">
          <Ionicons name="pricetag" size={14} color="#16A34A" />
          <Text className="text-xs text-green-700 ml-1 font-semibold">Khuyến mãi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
      </View>
      <Text className="text-base text-gray-400 font-medium">
        Chưa có sản phẩm trong danh mục này
      </Text>
      <Text className="text-sm text-gray-400 mt-1">
        Vui lòng quay lại sau
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-xl bg-gray-100"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">
          Danh mục
        </Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl bg-gray-100">
          <Ionicons name="search" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* BƯỚC 4: Thay thế FlatList bằng ScrollView + Component mới */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ListHeader />

        {products.length > 0 ? (
          <ProductHorizontalGrid
            products={products}
            onPressProduct={handleProductPress}
            onAddToCart={handleAddToCart}
            rowsPerColumn={2} // Hiển thị 2 hàng
            cardWidth={180}     // Giữ chiều rộng card
            contentPaddingHorizontal={16}
          />
        ) : (
          <ListEmpty />
        )}
        <View className="h-5" />
      </ScrollView>
    </View>
  );
}