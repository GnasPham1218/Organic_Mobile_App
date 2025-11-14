import ProductCard from "@/components/screens/product/ProductCard";
import { mockProducts } from "@/data/mockData"; // Import để lấy kiểu dữ liệu
import React, { useMemo } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";

// ✨ BƯỚC 1: Cập nhật kiểu dữ liệu để khớp với mockData mới
type Product = (typeof mockProducts)[0];

type Props = {
  products: Product[];
  rowsPerColumn?: number;
  cardWidth?: number;
  columnGap?: number;
  rowGap?: number;
  contentPaddingHorizontal?: number;
  showsHorizontalScrollIndicator?: boolean;
  // ✨ BƯỚC 2: Sửa kiểu dữ liệu của ID thành number
  onPressProduct?: (id: number) => void;
  onAddToCart?: (id: number) => void;
};

// Hàm chunkIntoColumns không thay đổi
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

  const renderColumn = ({ item: colItems }: ListRenderItemInfo<Product[]>) => {
    return (
      <View>
        {colItems.map((p, rowIdx) => {
          const isLast = rowIdx === colItems.length - 1;
          return (
            // ✨ BƯỚC 3: Sửa key từ 'id' thành 'product_id'
            <View
              key={p.product_id}
              style={{ marginBottom: isLast ? 0 : rowGap }}
            >
              <View style={{ width: cardWidth }}>
                <ProductCard
                  // Truyền tất cả props của sản phẩm vào ProductCard
                  // Quan trọng: Component ProductCard cũng cần được cập nhật để dùng product_id
                  id={p.product_id}
                  name={p.name}
                  image={p.image}
                  price={p.price}
                  salePrice={p.salePrice}
                  // ✨ BƯỚC 4: Truyền `product_id` vào các hàm callback
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
