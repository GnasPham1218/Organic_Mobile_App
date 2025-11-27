// components/features/product/ProductDetail.tsx
import IconButton from "@/components/common/IconButton";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput, // Đã sửa vị trí import đúng
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import ImageView from "react-native-image-viewing";

// Import Context
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/notifications/ToastContext";

// --- Types giữ nguyên ---
export type ProductFull = {
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
  certificates: {
    certificate_id: number;
    name: string;
    logo_url: any;
    document_url: any;
    certNo: string;
    date: string;
  }[];
};

interface ProductDetailViewProps {
  product: ProductFull;
  onBackPress: () => void;
  onAddToCart?: (quantity: number) => void;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
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
  children,
}) => {
  // Lấy hàm addToCart từ Context
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // State quản lý số lượng (String để xử lý input rỗng)
  const [quantityStr, setQuantityStr] = useState("1");

  // Các state UI khác
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "certs">("desc");
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isProductViewerVisible, setIsProductViewerVisible] = useState(false);
  const [selectedProductImageIndex, setSelectedProductImageIndex] = useState(0);

  const { width: screenWidth } = useWindowDimensions();

  // Tính toán giá
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  // Xử lý ảnh
  const imagesArray = Array.isArray(product.images) ? product.images : [];
  const allImages = useMemo(() => {
    const thumbnail = { image_id: -1, image_url: product.image };
    return [thumbnail, ...imagesArray];
  }, [product.image, imagesArray]);

  const productImagesForViewer = useMemo(() => {
    return allImages.map((img) => ({ uri: img.image_url.uri }));
  }, [allImages]);

  const imagesForCertViewer = selectedCert
    ? [{ uri: selectedCert.document_url.uri }]
    : [];

  // --- 1. LOGIC XỬ LÝ NHẬP SỐ LƯỢNG ---
  const handleQuantityChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    if (cleanText === "") {
      setQuantityStr("");
      return;
    }

    let val = parseInt(cleanText, 10);
    const maxStock = product.quantity;

    if (val > maxStock) {
      val = maxStock;
      showToast("warning", `Chỉ còn ${maxStock} sản phẩm trong kho`);
    }
    setQuantityStr(val.toString());
  };

  const handleQuantityBlur = () => {
    let val = parseInt(quantityStr || "0", 10);
    if (val <= 0) {
      setQuantityStr("1");
    }
  };

  const updateQuantity = (delta: number) => {
    let currentVal = parseInt(quantityStr || "0", 10);
    let newVal = currentVal + delta;
    const maxStock = product.quantity;

    if (newVal < 1) newVal = 1;
    if (newVal > maxStock) {
      newVal = maxStock;
      showToast("warning", `Chỉ còn ${maxStock} sản phẩm`);
    }
    setQuantityStr(newVal.toString());
  };

  // --- 2. HÀM NÀY CHỈ CHẠY KHI BẤM NÚT "THÊM VÀO GIỎ" ---
  const handleAddToCartPress = async () => {
    Keyboard.dismiss(); // Đóng bàn phím

    const quantity = parseInt(quantityStr, 10);
    const maxStock = product.quantity;

    // Validate lại lần cuối trước khi gọi API
    if (quantity > maxStock) {
      showToast("error", `Không đủ hàng. Kho còn: ${maxStock}`);
      setQuantityStr(maxStock.toString());
      return;
    }
    if (quantity <= 0) {
      showToast("warning", "Số lượng phải lớn hơn 0");
      setQuantityStr("1");
      return;
    }

    // Gọi hàm từ Context
    if (addToCart) {
      // Lưu ý: Việc gọi await addToCart() ở đây sẽ kích hoạt
      // refreshCart() trong Context -> Gây re-render component này.
      // Đây là hành vi bình thường.
      await addToCart(product, quantity);
    } else if (onAddToCart) {
      onAddToCart(quantity);
      showToast("success", "Đã thêm vào giỏ hàng");
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveImageIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const openProductViewer = (index: number) => {
    setSelectedProductImageIndex(index);
    setIsProductViewerVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
        <IconButton
          icon="arrow-back"
          size={22}
          color="#333"
          onPress={onBackPress}
        />
        <Text
          className="text-center text-lg font-bold text-TEXT_PRIMARY max-w-[70%] truncate"
          numberOfLines={1}
        >
          Chi tiết sản phẩm
        </Text>
        <View>{headerRight}</View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        keyboardShouldPersistTaps="handled" // Quan trọng: Giúp bấm nút được ngay cả khi đang mở phím
      >
        {/* Slider Image */}
        <View className="bg-white pb-2">
          <FlatList
            data={allImages}
            keyExtractor={(item) => item.image_id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openProductViewer(index)}
              >
                <Image
                  source={item.image_url}
                  style={{ width: screenWidth, height: screenWidth * 0.65 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
          <View className="absolute bottom-4 w-full flex-row justify-center gap-x-2 pointer-events-none">
            {allImages.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full ${index === activeImageIndex ? "bg-PRIMARY" : "bg-gray-300"}`}
              />
            ))}
          </View>
        </View>

        {/* Thông tin sản phẩm */}
        <View className="bg-white p-4 pt-2">
          <Text className="text-2xl font-bold text-TEXT_PRIMARY">
            {product.name}
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <View className="mt-2 flex-col">
              {hasDiscount && (
                <Text className="text-sm text-TEXT_SECONDARY line-through mb-1">
                  {product.price.toLocaleString("vi-VN")}đ
                </Text>
              )}
              <Text
                className={`text-3xl font-bold ${hasDiscount ? "text-red-600" : "text-PRIMARY"}`}
              >
                {displayPrice.toLocaleString("vi-VN")}đ
              </Text>
            </View>
            <View className="items-end">
              <Text className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-TEXT_SECONDARY">
                Đơn vị: {product.unit}
              </Text>
              <Text className="mt-1 text-xs text-TEXT_SECONDARY">
                Kho: {product.quantity}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs giữ nguyên */}
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

          <View className="p-4 min-h-[150px]">
            {activeTab === "desc" && (
              <Text className="text-base leading-6 text-TEXT_SECONDARY">
                {product.description}
              </Text>
            )}

            {activeTab === "info" && (
              <View className="space-y-3">
                <View className="flex-row">
                  <Text className="w-28 font-semibold text-TEXT_PRIMARY">
                    Đơn vị tính
                  </Text>
                  <Text className="flex-1 text-TEXT_SECONDARY">
                    {product.unit}
                  </Text>
                </View>
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
                    Ngày SX
                  </Text>
                  <Text className="flex-1 text-TEXT_SECONDARY">
                    {product.mfg_date}
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="w-28 font-semibold text-TEXT_PRIMARY">
                    Hạn SD
                  </Text>
                  <Text className="flex-1 text-TEXT_SECONDARY">
                    {product.exp_date}
                  </Text>
                </View>
              </View>
            )}

            {activeTab === "certs" && (
              <View className="flex-row flex-wrap">
                {product.certificates && product.certificates.length > 0 ? (
                  product.certificates.map((cert) => (
                    <TouchableOpacity
                      key={cert.certificate_id}
                      className="mr-4 mb-4 items-center"
                      onPress={() => setSelectedCert(cert)}
                    >
                      <Image
                        source={cert.logo_url}
                        className="h-20 w-20 rounded-md bg-gray-50"
                        resizeMode="contain"
                      />
                      <Text className="mt-1 text-xs font-medium text-TEXT_SECONDARY text-center max-w-[80px]">
                        {cert.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="text-TEXT_SECONDARY italic">
                    Sản phẩm không có chứng nhận đi kèm.
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {children}
      </ScrollView>

      {/* Footer: Thêm vào giỏ hàng */}
      <View className="absolute bottom-0 w-full flex-row items-center justify-between border-t border-BORDER bg-white p-4 pb-6 shadow-2xl">
        <View className="flex-row items-center">
          {/* Nút giảm */}
          <TouchableOpacity
            onPress={() => updateQuantity(-1)}
            className="h-10 w-10 items-center justify-center rounded-full border border-BORDER bg-gray-50 active:bg-gray-200"
          >
            <FontAwesome name="minus" size={14} color={"#4B5563"} />
          </TouchableOpacity>

          {/* Input nhập số lượng */}
          <TextInput
            className="w-14 text-center text-xl font-bold text-TEXT_PRIMARY py-0"
            keyboardType="numeric"
            value={quantityStr}
            onChangeText={handleQuantityChange}
            onBlur={handleQuantityBlur}
            selectTextOnFocus
          />

          {/* Nút tăng */}
          <TouchableOpacity
            onPress={() => updateQuantity(1)}
            className="h-10 w-10 items-center justify-center rounded-full border border-BORDER bg-gray-50 active:bg-gray-200"
          >
            <FontAwesome name="plus" size={14} color={"#4B5563"} />
          </TouchableOpacity>
        </View>

        {/* Nút Submit - Gọi hàm handleAddToCartPress */}
        <TouchableOpacity
          onPress={handleAddToCartPress}
          className="flex-1 rounded-full bg-PRIMARY py-3 ml-4 shadow-sm active:bg-green-700"
        >
          <Text className="text-center text-base font-bold text-white uppercase">
            Thêm vào giỏ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Viewers giữ nguyên */}
      <ImageView
        images={imagesForCertViewer}
        imageIndex={0}
        visible={!!selectedCert}
        onRequestClose={() => setSelectedCert(null)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        FooterComponent={() => (
          <View className="bg-black/60 p-4 w-full items-center pb-8">
            <Text className="text-white font-bold text-lg text-center mb-1">
              {selectedCert?.name}
            </Text>
            <View className="flex-row space-x-4">
              <Text className="text-gray-300 text-sm">
                Số:{" "}
                <Text className="font-bold">
                  {selectedCert?.certNo || "--"}
                </Text>
              </Text>
              <Text className="text-gray-300 text-sm">| </Text>
              <Text className="text-gray-300 text-sm">
                Ngày:{" "}
                <Text className="font-bold">{selectedCert?.date || "--"}</Text>
              </Text>
            </View>
          </View>
        )}
      />

      <ImageView
        images={productImagesForViewer}
        imageIndex={selectedProductImageIndex}
        visible={isProductViewerVisible}
        onRequestClose={() => setIsProductViewerVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        FooterComponent={({ imageIndex }) => (
          <View className="bg-black/60 p-4 w-full items-center pb-8">
            <Text className="text-white font-bold text-base">
              {product.name}
            </Text>
            <Text className="text-gray-300 text-sm mt-1">
              Ảnh {imageIndex + 1} / {productImagesForViewer.length}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ProductDetailView;
