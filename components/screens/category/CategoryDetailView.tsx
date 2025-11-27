import { SortOrder } from "@/app/category/[id]";
import React from "react";

// Import các component con

import SortBottomSheet from "@/components/screens/category/SortBottomSheet"; // Check path
import ProductVerticalGrid from "@/components/screens/product/ProductVerticalGrid";
import CategoryHeader from "./CategoryHeader";
import CategoryListEmpty from "./CategoryListEmpty";
import CategoryListHeader from "./CategoryListHeader";
import FilterBottomSheet from "./FilterBottomSheet";

// Interface Props cập nhật
interface CategoryDetailViewProps {
  products: IProductCard[]; // Dùng interface global
  categoryName: string;
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
  onAddToCart: (product: IProductCard) => void;

  onFilterPress: () => void;
  onCloseFilterModal: () => void;
  onApplyFilters: (min: number | null, max: number | null) => void;

  onSortPress: () => void;
  onCloseSortModal: () => void;
  onSelectSort: (order: SortOrder) => void;
  onResetFiltersAndSort: () => void;

  onEndReached?: () => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  products,
  categoryName,
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
  onEndReached,
}) => {
  // Header cho FlatList
  const ListHeader = () => (
    <CategoryListHeader
      categoryName={categoryName}
      productCount={products.length} // Số lượng đã load
      isFilteredOrSorted={isFilteredOrSorted}
      onFilterPress={onFilterPress}
      onSortPress={onSortPress}
      onResetFiltersAndSort={onResetFiltersAndSort}
    />
  );

  return (
    <>
      <CategoryHeader
        onBackPress={onBackPress}
        onCartPress={onCartPress}
        cartItemCount={cartItemCount}
      />

      <ProductVerticalGrid
        products={products}
        onPressProduct={onProductPress}
        onAddToCart={onAddToCart}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={CategoryListEmpty}
        numColumns={2}
        contentPaddingHorizontal={16}
        columnGap={12}
        rowGap={12}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />

      <SortBottomSheet
        visible={isSortModalVisible}
        onClose={onCloseSortModal}
        onSelectSort={onSelectSort}
        currentSort={sortOrder}
      />

      {/* Tạm thời truyền mảng rỗng vào allProducts vì API phân trang không trả về hết */}
      <FilterBottomSheet
        visible={isFilterModalVisible}
        onClose={onCloseFilterModal}
        onApply={onApplyFilters}
        currentMinPrice={appliedMinPrice}
        currentMaxPrice={appliedMaxPrice}
        allProducts={[]}
      />
    </>
  );
};

export default CategoryDetailView;
