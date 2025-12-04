import ProductCard from "@/components/screens/product/ProductCard";
import React from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

// Sử dụng interface IProductCard từ global
type Product = IProductCard;

type Props = {
  products: Product[];
  numColumns?: number;
  columnGap?: number;
  rowGap?: number;
  contentPaddingHorizontal?: number;
  showsVerticalScrollIndicator?: boolean;
  onPressProduct?: (id: number) => void;
  onAddToCart?: (product: Product) => void;

  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  flatListRef?: React.RefObject<FlatList<any> | null>;
  contentContainerStyle?: StyleProp<ViewStyle>;

  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
};

const ProductVerticalGrid: React.FC<Props> = ({
  products,
  numColumns = 2,
  columnGap = 12,
  rowGap = 12,
  contentPaddingHorizontal = 16,
  showsVerticalScrollIndicator = false,
  flatListRef,
  onPressProduct,
  onAddToCart,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListFooterComponent,
}) => {
  // Tính toán kích thước cột
  const screenWidth = Dimensions.get("window").width;
  const totalGapSpace =
    contentPaddingHorizontal * 2 + columnGap * (numColumns - 1);
  const cardWidth = (screenWidth - totalGapSpace) / numColumns;

  const renderProduct = ({ item }: ListRenderItemInfo<Product>) => {
    // --- MAP DỮ LIỆU TỪ API SANG PROPS CỦA PRODUCT CARD MỚI ---

    // 1. Map Discount Type
    let discountType: "percent" | "fixed" | undefined = undefined;
    if (item.discount?.type === "PERCENT") discountType = "percent";
    else if (item.discount?.type === "FIXED_AMOUNT") discountType = "fixed";

    // 2. Map Discount Value
    const discountValue = item.discount?.value;

    // 3. Check Stock
    const inStock = item.quantity > 0;

    return (
      <View style={{ width: cardWidth }}>
        <ProductCard
          id={item.id}
          name={item.name}
          // ProductCard mới tự xử lý việc nối URL nếu cần
          image={item.image}
          price={item.price}
          // Truyền thông tin giảm giá để Card tự tính toán
          discountType={discountType}
          discountValue={discountValue}
          // Truyền trạng thái tồn kho
          inStock={inStock}
          onPress={onPressProduct}
          // Grid nhận callback add với object Product, nhưng Card chỉ trả về ID
          // Ta wrap lại để gọi callback của Grid đúng format
          onAdd={() => onAddToCart?.(item)}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      ref={flatListRef}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderProduct}
      numColumns={numColumns}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      columnWrapperStyle={{
        gap: columnGap,
      }}
      ItemSeparatorComponent={() => <View style={{ height: rowGap }} />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={[
        { paddingHorizontal: contentPaddingHorizontal },
        contentContainerStyle,
      ]}
      initialNumToRender={6}
      windowSize={5}
      removeClippedSubviews={true}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
    />
  );
};

export default ProductVerticalGrid;
