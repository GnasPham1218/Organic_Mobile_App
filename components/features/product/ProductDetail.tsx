// components/features/product/ProductDetail.tsx

import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";

type ProductFull = {
  product_id: number;
  name: string;
  price: number;
  salePrice?: number;
  rating_avg: number;
  image: any;
  images: { image_id: number; image_url: any }[];
  description: string;
  unit: string;
  origin_address: string;
  quantity: number;
  mfg_date: string;
  exp_date: string;
  certificates: { certificate_id: number; name: string; image_url: any }[];
};

interface ProductDetailViewProps {
  product: ProductFull;
  onBackPress: () => void;
  onAddToCart: (quantity: number) => void;
  headerRight?: React.ReactNode;
  children?: React.ReactNode; // <-- allow children to be rendered inside ScrollView
}

const InfoTab: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ label, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} className="flex-1 items-center py-3">
    <Text
      className={`font-semibold ${isActive ? "text-PRIMARY" : "text-TEXT_SECONDARY"}`}
    >
      {label}
    </Text>
    {isActive && <View className="mt-1 h-1 w-8 rounded-full bg-PRIMARY" />}
  </TouchableOpacity>
);

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBackPress,
  onAddToCart,
  headerRight,
  children, // receive children
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "certs">("desc");
  const { width: screenWidth } = useWindowDimensions();

  const displayPrice = product.salePrice ?? product.price;

  // safe guard: ensure product.images is array
  const imagesArray = Array.isArray(product.images) ? product.images : [];

  const allImages = useMemo(() => {
    const thumbnail = { image_id: 0, image_url: product.image };
    return [thumbnail, ...imagesArray];
  }, [product.image, imagesArray]);

  const handleAddToCartPress = () => {
    onAddToCart(quantity);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveImageIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-white py-3">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 top-0 bottom-0 z-10 flex-row items-center justify-center p-2"
        >
          <FontAwesome name="arrow-left" size={20} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="text-center text-lg font-bold text-TEXT_PRIMARY">
          Chi tiết sản phẩm
        </Text>
        <View className="absolute right-4 top-0 bottom-0 z-10 flex-row items-center justify-center">
          {headerRight}
        </View>
      </View>

      {/* MAIN SCROLL: children will be rendered inside here */}
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Slider ảnh sản phẩm */}
        <View>
          <FlatList
            data={allImages}
            keyExtractor={(item) => item.image_id.toString()}
            renderItem={({ item }) => (
              <Image
                source={item.image_url}
                style={{ width: screenWidth, height: screenWidth * 0.9 }}
                resizeMode="contain"
              />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
          {/* Pagination Dots */}
          <View className="absolute bottom-4 w-full flex-row justify-center gap-x-2">
            {allImages.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full ${index === activeImageIndex ? "bg-PRIMARY" : "bg-gray-300"}`}
              />
            ))}
          </View>
        </View>

        {/* Thông tin chi tiết */}
        <View className="bg-white p-4">
          <Text className="text-2xl font-bold text-TEXT_PRIMARY">
            {product.name}
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <View className="mt-3 flex-row items-baseline">
              <Text className="text-3xl font-bold text-PRIMARY">
                {displayPrice.toLocaleString("vi-VN")}đ
              </Text>
              {product.salePrice && (
                <Text className="ml-3 text-lg text-TEXT_SECONDARY line-through">
                  {product.price.toLocaleString("vi-VN")}đ
                </Text>
              )}
            </View>
            <Text className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-TEXT_SECONDARY">
              Đơn vị: {product.unit}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="mt-3 bg-white">
          <View className="flex-row border-b border-BORDER">
            <InfoTab
              label="Mô tả"
              isActive={activeTab === "desc"}
              onPress={() => setActiveTab("desc")}
            />
            <InfoTab
              label="Thông tin"
              isActive={activeTab === "info"}
              onPress={() => setActiveTab("info")}
            />
            <InfoTab
              label="Chứng nhận"
              isActive={activeTab === "certs"}
              onPress={() => setActiveTab("certs")}
            />
          </View>

          <View className="p-4">
            {activeTab === "desc" && (
              <Text className="text-base leading-6 text-TEXT_SECONDARY">
                {product.description}
              </Text>
            )}

            {activeTab === "info" && (
              <View className="space-y-3">
                <View className="flex-row">
                  <Text className="w-28 font-semibold text-TEXT_PRIMARY">
                    Xuất xứ
                  </Text>
                  <Text className="flex-1 text-TEXT_SECONDARY">
                    {product.origin_address}
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="w-28 font-semibold text-TEXT_PRIMARY">
                    Ngày sản xuất
                  </Text>
                  <Text className="flex-1 text-TEXT_SECONDARY">
                    {product.mfg_date}
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="w-28 font-semibold text-TEXT_PRIMARY">
                    Hạn sử dụng
                  </Text>
                  <Text className="flex-1 text-TEXT_SECONDARY">
                    {product.exp_date}
                  </Text>
                </View>
              </View>
            )}

            {activeTab === "certs" && (
              <View className="flex-row flex-wrap">
                {product.certificates.map((cert) => (
                  <View
                    key={cert.certificate_id}
                    className="mr-4 mb-4 items-center"
                  >
                    <Image
                      source={cert.image_url}
                      className="h-20 w-20"
                      resizeMode="contain"
                    />
                    <Text className="mt-1 text-xs font-medium text-TEXT_SECONDARY">
                      {cert.name}
                    </Text>
                  </View>
                ))}
                {product.certificates.length === 0 && (
                  <Text className="text-TEXT_SECONDARY">
                    Sản phẩm không có chứng nhận đi kèm.
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* --- RENDER children HERE so reviews (or any extra content) are inside the same ScrollView --- */}
        {children}
      </ScrollView>

      {/* Footer: quantity + add to cart */}
      <View className="absolute bottom-0 w-full flex-row items-center justify-between border-t border-BORDER bg-white p-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-10 w-10 items-center justify-center rounded-full border border-BORDER"
          >
            <FontAwesome name="minus" size={16} color={"#4B5563"} />
          </TouchableOpacity>
          <Text className="w-14 text-center text-xl font-bold text-TEXT_PRIMARY">
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            className="h-10 w-10 items-center justify-center rounded-full border border-BORDER"
          >
            <FontAwesome name="plus" size={16} color={"#4B5563"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleAddToCartPress}
          className="flex-1 rounded-full bg-PRIMARY py-3 ml-4"
        >
          <Text className="text-center text-base font-bold text-white">
            Thêm vào giỏ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailView;
