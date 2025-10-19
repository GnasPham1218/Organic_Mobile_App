import React, { useMemo } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import ProductCard, { ProductCardProps } from "@/components/features/product/ProductCard";

type Props = {
  products: ProductCardProps[];
  rowsPerColumn?: number;          // số hàng trong 1 cột (mặc định 2)
  cardWidth?: number;              // bề rộng mỗi thẻ (vd: 180)
  columnGap?: number;              // khoảng cách giữa các cột
  rowGap?: number;                 // khoảng cách giữa các hàng
  contentPaddingHorizontal?: number;
  showsHorizontalScrollIndicator?: boolean;
  onPressProduct?: (id: string) => void;
  onAddToCart?: (id: string) => void;
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

  const renderColumn = ({ item: colItems }: ListRenderItemInfo<ProductCardProps[]>) => {
    return (
      <View>
        {colItems.map((p, rowIdx) => {
          const isLast = rowIdx === colItems.length - 1;
          return (
            <View key={p.id} style={{ marginBottom: isLast ? 0 : rowGap }}>
              <View style={{ width: cardWidth }}>
                <ProductCard
                  {...p}
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
