// Dán vào file: components/features/product/ProductVerticalGrid.tsx

import ProductCard from "@/components/screens/product/ProductCard";
import { mockProducts } from "@/data/mockData";
import React from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

type Product = (typeof mockProducts)[0];

// Props (không cần GridItem hay DummyItem)
type Props = {
  products: Product[];
  numColumns?: number;
  columnGap?: number;
  rowGap?: number;
  contentPaddingHorizontal?: number;
  showsVerticalScrollIndicator?: boolean;
  onPressProduct?: (id: number) => void;
  onAddToCart?: (id: number) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const ProductVerticalGrid: React.FC<Props> = ({
  products,
  numColumns = 2,
  columnGap = 12,
  rowGap = 12,
  contentPaddingHorizontal = 16,
  showsVerticalScrollIndicator = false,
  onPressProduct,
  onAddToCart,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
}) => {
  // ✨ BƯỚC 2: Tính toán chiều rộng cố định cho mỗi card

  // 2a. Lấy chiều rộng của màn hình thiết bị
  const screenWidth = Dimensions.get("window").width;

  // 2b. Tính tổng không gian "chết" (padding và gap)
  // Ví dụ: 16 (padding trái) + 16 (padding phải) + 12 (gap giữa 2 cột)
  const totalGapSpace =
    contentPaddingHorizontal * 2 + columnGap * (numColumns - 1);

  // 2c. Tính chiều rộng cuối cùng cho mỗi card
  // (Chiều rộng màn hình - Tổng không gian chết) / số cột
  const cardWidth = (screenWidth - totalGapSpace) / numColumns;

  // ✨ BƯỚC 3: Sửa hàm renderProduct (Đơn giản hơn rất nhiều)
  // Không cần logic 'if ("name" in item)' nữa
  const renderProduct = ({ item }: ListRenderItemInfo<Product>) => {
    return (
      // Xóa 'flex: 1' và thay bằng chiều rộng cố định đã tính
      <View style={{ width: cardWidth }}>
        <ProductCard
          id={item.product_id}
          name={item.name}
          image={item.image}
          price={item.price}
          salePrice={item.salePrice}
          onPress={(id) => onPressProduct?.(id)}
          onAdd={(id) => onAddToCart?.(id)}
        />
      </View>
    );
  };

  // ✨ BƯỚC 4: FlatList dùng mảng 'products' gốc (không cần 'gridData')
  return (
    <FlatList
      data={products} // Dùng mảng gốc
      keyExtractor={(item) => item.product_id.toString()}
      renderItem={renderProduct}
      numColumns={numColumns}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      columnWrapperStyle={{
        gap: columnGap,
      }}
      ItemSeparatorComponent={() => <View style={{ height: rowGap }} />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={[
        { paddingHorizontal: contentPaddingHorizontal },
        contentContainerStyle,
      ]}
      initialNumToRender={8}
      windowSize={10}
      removeClippedSubviews
    />
  );
};

export default ProductVerticalGrid;
