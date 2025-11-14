// components/screens/category/CategoryDetailView.tsx
import { SortOrder } from "@/app/category/[id]"; // Import type từ screen
import { CategoryType, Product } from "@/data/mockData";
import React from "react";

// Import các component con
import FilterBottomSheet from "@/components/screens/category/FilterBottomSheet";
import SortBottomSheet from "@/components/screens/category/SortBottomSheet";
import ProductVerticalGrid from "@/components/screens/product/ProductVerticalGrid";
import CategoryHeader from "./CategoryHeader";
import CategoryListEmpty from "./CategoryListEmpty";
import CategoryListHeader from "./CategoryListHeader";

// Định nghĩa tất cả props mà component này sẽ nhận
interface CategoryDetailViewProps {
  products: Product[];
  categoryProducts: Product[];
  currentCategory: CategoryType | undefined;
  cartItemCount: number;
  isFilteredOrSorted: boolean;
  sortOrder: SortOrder;
  appliedMinPrice: number | null;
  appliedMaxPrice: number | null;
  isSortModalVisible: boolean;
  isFilterModalVisible: boolean;
  onBackPress: () => void;
  onCartPress: () => void;
  onProductPress: (productId: number) => void;
  onAddToCart: (productId: number) => void;
  onFilterPress: () => void;
  onCloseFilterModal: () => void;
  onApplyFilters: (min: number | null, max: number | null) => void;
  onSortPress: () => void;
  onCloseSortModal: () => void;
  onSelectSort: (order: SortOrder) => void;
  onResetFiltersAndSort: () => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  products,
  categoryProducts,
  currentCategory,
  cartItemCount,
  isFilteredOrSorted,
  sortOrder,
  appliedMinPrice,
  appliedMaxPrice,
  isSortModalVisible,
  isFilterModalVisible,
  onBackPress,
  onCartPress,
  onProductPress,
  onAddToCart,
  onFilterPress,
  onCloseFilterModal,
  onApplyFilters,
  onSortPress,
  onCloseSortModal,
  onSelectSort,
  onResetFiltersAndSort,
}) => {
  // Định nghĩa Header cho FlatList (nhận props từ component cha)
  const ListHeader = () => (
    <CategoryListHeader
      categoryName={currentCategory?.name}
      productCount={products.length}
      isFilteredOrSorted={isFilteredOrSorted}
      onFilterPress={onFilterPress}
      onSortPress={onSortPress}
      onResetFiltersAndSort={onResetFiltersAndSort}
    />
  );

  return (
    <>
      {/* Header chính */}
      <CategoryHeader
        onBackPress={onBackPress}
        onCartPress={onCartPress}
        cartItemCount={cartItemCount}
      />

      {/* Lưới sản phẩm */}
      <ProductVerticalGrid
        products={products}
        onPressProduct={onProductPress}
        onAddToCart={onAddToCart}
        ListHeaderComponent={ListHeader} // Dùng component đã định nghĩa ở trên
        ListEmptyComponent={CategoryListEmpty} // Dùng component riêng
        numColumns={2}
        contentPaddingHorizontal={16}
        columnGap={12}
        rowGap={12}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
        }}
      />

      {/* Modal Sắp xếp */}
      <SortBottomSheet
        visible={isSortModalVisible}
        onClose={onCloseSortModal}
        onSelectSort={onSelectSort}
        currentSort={sortOrder}
      />

      {/* Modal Lọc */}
      <FilterBottomSheet
        visible={isFilterModalVisible}
        onClose={onCloseFilterModal}
        onApply={onApplyFilters}
        currentMinPrice={appliedMinPrice}
        currentMaxPrice={appliedMaxPrice}
        allProducts={categoryProducts} // Truyền danh sách CHƯA lọc giá
      />
    </>
  );
};

export default CategoryDetailView;
