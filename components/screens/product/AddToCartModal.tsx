import { AppConfig } from "@/constants/AppConfig";
import { formatCurrency } from "@/utils/formatters";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Text,
  TextInput, // ✨ Thêm TextInput
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Định nghĩa lại kiểu Product đơn giản để dùng trong Modal
type ProductData = {
  id: number;
  name: string;
  image: any; // string hoặc require
  price: number;
  salePrice?: number;
  quantity: number; // Tồn kho
};

type Props = {
  visible: boolean;
  product: ProductData | null;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
};

const AddToCartModal: React.FC<Props> = ({
  visible,
  product,
  onClose,
  onConfirm,
}) => {
  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState("1"); // State cho TextInput

  // Reset số lượng về 1 mỗi khi mở modal sản phẩm mới
  useEffect(() => {
    if (visible) {
      setQty(1);
      setQtyInput("1");
    }
  }, [visible, product]);

  if (!product) return null;

  const hasSale =
    product.salePrice &&
    product.salePrice > 0 &&
    product.salePrice < product.price;
  const finalPrice = hasSale ? product.salePrice! : product.price;
  const maxQty = product.quantity || 99; // Giới hạn tồn kho
  const isConfirmDisabled = qty < 1 || qty > maxQty; // Kiểm tra tính hợp lệ

  // --- HANDLERS ---

  const handleIncrease = () => {
    if (qty < maxQty) {
      const newQty = qty + 1;
      setQty(newQty);
      setQtyInput(String(newQty));
    }
  };

  const handleDecrease = () => {
    if (qty > 1) {
      const newQty = qty - 1;
      setQty(newQty);
      setQtyInput(String(newQty));
    }
  };

  const handleQtyInputChange = (text: string) => {
    setQtyInput(text.replace(/[^0-9]/g, "")); // Chỉ cho phép số

    const num = parseInt(text.replace(/[^0-9]/g, "") || "0", 10);

    let newQty = num;
    if (newQty < 1) newQty = 1; // Số lượng tối thiểu là 1
    if (newQty > maxQty) newQty = maxQty; // Số lượng tối đa là tồn kho

    if (num > 0 && num <= maxQty) {
      setQty(num);
    } else if (num > 0) {
      // Nếu nhập quá giới hạn, cập nhật state Qty về maxQty
      setQty(maxQty);
    } else {
      // Nếu nhập 0 hoặc rỗng, tạm thời giữ Qty là 1 để tránh lỗi
      setQty(1);
    }
  };

  // Khi thoát khỏi input, đồng bộ hóa và hiển thị giá trị hợp lệ
  const handleInputBlur = () => {
    let finalQty = qty;

    if (qty < 1) finalQty = 1;
    if (qty > maxQty) finalQty = maxQty;

    setQty(finalQty);
    setQtyInput(String(finalQty));
  };

  const handleConfirm = () => {
    // Đảm bảo số lượng hợp lệ trước khi gọi onConfirm
    if (qty < 1 || qty > maxQty) {
      // Có thể thêm một toast/alert ở đây nếu cần, nhưng logic trên đã ngăn điều này
      return;
    }
    onConfirm(qty);
    onClose();
  };

  // Xử lý ảnh
  const imageSource =
    typeof product.image === "string"
      ? {
          uri: product.image.startsWith("http")
            ? product.image
            : `${AppConfig.PRODUCTS_URL}${product.image}`,
        }
      : product.image;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-2xl p-5 pb-8">
              {/* Header: Ảnh + Thông tin */}
              <View className="flex-row mb-6">
                <Image
                  source={imageSource}
                  className="w-24 h-24 rounded-xl bg-gray-100 border border-gray-200"
                  resizeMode="contain"
                />
                <View className="flex-1 ml-4 justify-between py-1">
                  <View>
                    <Text
                      className="text-lg font-bold text-gray-800 mb-1"
                      numberOfLines={2}
                    >
                      {product.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Kho: {product.quantity}
                    </Text>
                  </View>

                  {/* Giá tiền của 1 sản phẩm */}
                  <View>
                    {hasSale ? (
                      <View className="flex-row items-baseline gap-2">
                        <Text className="text-xl font-bold text-red-600">
                          {formatCurrency(finalPrice)}
                        </Text>
                        <Text className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.price)}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-xl font-bold text-green-700">
                        {formatCurrency(product.price)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Nút đóng */}
                <TouchableOpacity
                  onPress={onClose}
                  className="absolute top-0 right-0"
                >
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Bộ chọn số lượng (Sử dụng TextInput) */}
              <View className="flex-row items-center justify-between mb-4 border-t border-gray-100 py-4">
                <Text className="text-base font-medium text-gray-700">
                  Số lượng
                </Text>

                <View className="flex-row items-center bg-gray-100 rounded-lg p-1">
                  <TouchableOpacity
                    onPress={handleDecrease}
                    className={`w-9 h-9 items-center justify-center rounded bg-white shadow-sm ${qty <= 1 ? "opacity-50" : ""}`}
                    disabled={qty <= 1}
                  >
                    <FontAwesome name="minus" size={12} color="#333" />
                  </TouchableOpacity>

                  {/* ✨ TRƯỜNG NHẬP LIỆU */}
                  <TextInput
                    className="w-12 h-9 text-center text-lg font-bold text-gray-800 bg-white rounded-md mx-1 border border-gray-300"
                    // ✨ THÊM CÁC THUỘC TÍNH STYLE TRỰC TIẾP ĐỂ ĐẢM BẢO CĂN CHỈNH
                    style={{
                      // Đảm bảo chữ được căn giữa theo chiều dọc cho Android
                      textAlignVertical: "center",
                      // Điều chỉnh line height bằng với chiều cao của Input để chữ không bị tràn
                      lineHeight: 22, // Tùy chỉnh giá trị này, thường là fontSize + 4-8px, hoặc bằng height
                      paddingVertical: 0, // Đảm bảo không có padding mặc định làm lệch
                    }}
                    keyboardType="numeric"
                    value={qtyInput}
                    onChangeText={handleQtyInputChange}
                    onBlur={handleInputBlur}
                    textAlign="center" // Đảm bảo căn giữa theo chiều ngang
                    maxLength={String(maxQty).length || 3}
                  />
                  <TouchableOpacity
                    onPress={handleIncrease}
                    className={`w-9 h-9 items-center justify-center rounded bg-white shadow-sm ${qty >= maxQty ? "opacity-50" : ""}`}
                    disabled={qty >= maxQty}
                  >
                    <FontAwesome name="plus" size={12} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ✨ HIỂN THỊ TỔNG TIỀN RIÊNG */}
              <View className="flex-row items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <Text className="text-lg font-bold text-gray-800">
                  Tổng tiền
                </Text>
                <Text className="text-2xl font-extrabold text-green-700">
                  {formatCurrency(finalPrice * qty)}
                </Text>
              </View>

              {/* Nút Thêm */}
              <TouchableOpacity
                onPress={handleConfirm}
                // Khóa nút nếu số lượng không hợp lệ (ví dụ: nhập quá lớn, hoặc bằng 0)
                disabled={isConfirmDisabled}
                className={`w-full py-4 rounded-xl items-center shadow-md ${isConfirmDisabled ? "bg-gray-400" : "bg-green-700 active:bg-green-800"}`}
              >
                <Text className="text-white font-bold text-lg">
                  Thêm vào giỏ hàng ({qty} sản phẩm)
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddToCartModal;
