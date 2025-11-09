// components/category/CategoryDetailView.tsx
import IconButton from "@/components/common/IconButton";
import ProductVerticalGrid from "@/components/features/product/ProductVerticalGrid";
import { getCategoryById, mockProducts } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SortBottomSheet from "./SortBottomSheet";
// Lấy kiểu dữ liệu từ mockData
type Product = (typeof mockProducts)[0];
type Category = ReturnType<typeof getCategoryById>;
type SortOrder = "default" | "price_asc" | "price_desc" | "name_asc";
// ✨ BƯỚC 1: Định nghĩa tất cả props mà component này cần
type Props = {
  products: Product[];
  currentCategory: Category;
  cartItemCount: number;
  onBackPress: () => void;
  onCartPress: () => void;
  onProductPress: (id: number) => void;
  onAddToCart: (id: number) => void;
  onSortPress: () => void;
  onFilterPress: () => void;
  isSortModalVisible: boolean;
  onCloseSortModal: () => void;
  onSelectSort: (order: SortOrder) => void;
  currentSort: SortOrder;
  isFilterModalVisible: boolean;
  onCloseFilterModal: () => void;
};

// ✨ BƯỚC 2: Di chuyển ListHeader và ListEmpty vào đây
// Chúng là một phần của giao diện
const ListHeader = ({
  categoryName,
  productCount,
  onSortPress,
  onFilterPress,
}: {
  categoryName?: string;
  productCount: number;
  onSortPress: () => void;
  onFilterPress: () => void;
}) => (
  <View
    className="p-4 bg-white mb-3 rounded-2xl"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    }}
  >
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-xl font-bold text-gray-800 mb-1">
        {categoryName}
      </Text>
      <View className="flex-row items-center">
        <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
          <Ionicons name="basket" size={14} color="#16A34A" />
          <Text className="text-xs text-green-700 font-semibold ml-1">
            {productCount} sản phẩm
          </Text>
        </View>
      </View>
    </View>
    <View className="flex-row gap-10">
      <TouchableOpacity
        className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
        onPress={onFilterPress}
      >
        <Ionicons name="funnel-outline" size={14} color="#6B7280" />
        <Text className="text-xs text-gray-600 ml-1 font-medium">Lọc</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
        onPress={onSortPress}
      >
        <Ionicons name="swap-vertical" size={14} color="#6B7280" />
        <Text className="text-xs text-gray-600 ml-1 font-medium">Sắp xếp</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center bg-green-100 px-3 py-2 rounded-lg">
        <Ionicons name="pricetag" size={14} color="#16A34A" />
        <Text className="text-xs text-green-700 ml-1 font-semibold">
          Khuyến mãi
        </Text>
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
    <Text className="text-sm text-gray-400 mt-1">Vui lòng quay lại sau</Text>
  </View>
);

// ✨ BƯỚC 3: Tạo component View, chỉ nhận props
const CategoryDetailView: React.FC<Props> = ({
  products,
  currentCategory,
  cartItemCount,
  onBackPress,
  onCartPress,
  onProductPress,
  onAddToCart,
  onSortPress,
  onFilterPress,
  // Nhận props cho Sort Modal
  isSortModalVisible,
  onCloseSortModal,
  onSelectSort,
  currentSort,

  // Nhận props cho Filter Modal
  isFilterModalVisible,
  onCloseFilterModal,
}) => {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <IconButton
          icon="arrow-back"
          size={22}
          color="#333"
          onPress={onBackPress} // Dùng prop
        />
        <Text className="text-lg font-semibold text-gray-800">Danh mục</Text>
        <IconButton
          icon="cart-outline"
          size={22}
          color="#2E7D32"
          onPress={onCartPress} // Dùng prop
          badge={cartItemCount > 0}
          badgeContent={cartItemCount > 99 ? "99+" : cartItemCount || undefined}
          testID="cart-button"
        />
      </View>

      {/* Product Grid */}
      <ProductVerticalGrid
        products={products} // Dùng prop
        onPressProduct={onProductPress} // Dùng prop
        onAddToCart={onAddToCart} // Dùng prop
        ListHeaderComponent={
          <ListHeader
            categoryName={currentCategory?.name}
            productCount={products.length}
            onSortPress={onSortPress}
            onFilterPress={onFilterPress}
          />
        }
        ListEmptyComponent={ListEmpty}
        numColumns={2}
        contentPaddingHorizontal={16}
        columnGap={12}
        rowGap={12}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
        }}
      />
      <SortBottomSheet
        visible={isSortModalVisible}
        onClose={onCloseSortModal}
        onSelectSort={onSelectSort}
        currentSort={currentSort}
      />

      {/* TODO: Render Filter Modal tại đây (tương tự) */}
      {/* <FilterBottomSheet visible={isFilterModalVisible} ... /> */}
    </View>
  );
};

export default CategoryDetailView;
