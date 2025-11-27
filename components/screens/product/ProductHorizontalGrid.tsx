import ProductCard from "@/components/screens/product/ProductCard";
import React, { useMemo } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";

// 1. Định nghĩa Type linh hoạt hơn (Union Type)
// Chấp nhận cả Mock Product cũ HOẶC IBestPromotionProduct mới
type GridProduct = any; // Hoặc định nghĩa chính xác: IProduct | IBestPromotionProduct

type Props = {
  products: GridProduct[];
  rowsPerColumn?: number;
  cardWidth?: number;
  columnGap?: number;
  rowGap?: number;
  contentPaddingHorizontal?: number;
  showsHorizontalScrollIndicator?: boolean;
  onPressProduct?: (id: number) => void;
  onAddToCart?: (id: number) => void;
};

function chunkIntoColumns<T>(arr: T[], rowsPerCol: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += rowsPerCol) {
    out.push(arr.slice(i, i + rowsPerCol));
  }
  return out;
}

const ProductHorizontalGrid: React.FC<Props> = ({
  products,
  rowsPerColumn = 2,
  cardWidth = 180,
  columnGap = 12,
  rowGap = 12,
  contentPaddingHorizontal = 16,
  showsHorizontalScrollIndicator = false,
  onPressProduct,
  onAddToCart,
}) => {
  const columns = useMemo(
    () => chunkIntoColumns(products, rowsPerColumn),
    [products, rowsPerColumn]
  );

  const renderColumn = ({
    item: colItems,
  }: ListRenderItemInfo<GridProduct[]>) => {
    return (
      <View>
        {colItems.map((p, rowIdx) => {
          const isLast = rowIdx === colItems.length - 1;
          return (
            <View
              key={p.product_id}
              style={{ marginBottom: isLast ? 0 : rowGap }}
            >
              <View style={{ width: cardWidth }}>
                <ProductCard
                  id={p.product_id}
                  name={p.name}
                  image={p.image}
                  price={p.price}
                  salePrice={p.salePrice}
                  // Truyền các props khác
                  inStock={p.inStock}
                  onPress={(id) => onPressProduct?.(id)}
                  onAdd={(id) => onAddToCart?.(id)}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <FlatList
      horizontal
      data={columns}
      keyExtractor={(_, i) => `col-${i}`}
      renderItem={renderColumn}
      ItemSeparatorComponent={() => <View style={{ width: columnGap }} />}
      contentContainerStyle={{ paddingHorizontal: contentPaddingHorizontal }}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      initialNumToRender={3}
      windowSize={5}
      removeClippedSubviews
    />
  );
};

export default ProductHorizontalGrid;
