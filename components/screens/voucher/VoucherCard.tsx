import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface VoucherCardProps {
  voucher: IVoucher;
  onCopy: (code: string) => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onCopy }) => {
  // Format tiền tệ
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  // Logic kiểm tra Disabled
  const isExpired = new Date(voucher.endDate) < new Date();
  const isOutOfStock = voucher.usedCount >= voucher.quantity;
  const isDisabled = !voucher.active || isExpired || isOutOfStock;

  // Style dynamic theo loại voucher
  const getStyle = () => {
    switch (voucher.typeVoucher) {
      case "FREESHIP":
        return {
          bg: "bg-blue-500",
          icon: "shipping-fast",
          lib: FontAwesome5,
        };
      case "PERCENT":
        return {
          bg: "bg-orange-500",
          icon: "percent",
          lib: FontAwesome5,
        };
      default: // FIXED_AMOUNT
        return {
          bg: "bg-green-600",
          icon: "attach-money",
          lib: MaterialIcons,
        };
    }
  };

  const style = getStyle();
  const IconLib = style.lib as any;

  // Text hiển thị tiêu đề
  const getTitle = () => {
    if (voucher.typeVoucher === "FREESHIP") return "Miễn phí vận chuyển";
    if (voucher.typeVoucher === "PERCENT") return `Giảm ${voucher.value}%`;
    return `Giảm ${formatCurrency(voucher.value)}`;
  };

  return (
    <View
      className={`flex-row bg-white rounded-xl mb-4 border border-gray-200 overflow-hidden shadow-sm ${isDisabled ? "opacity-60" : ""}`}
    >
      {/* Cột trái: Icon & Màu sắc */}
      <View
        className={`w-24 items-center justify-center ${isDisabled ? "bg-gray-400" : style.bg}`}
      >
        <IconLib name={style.icon} size={28} color="white" />
        <Text className="text-white font-bold text-xs mt-1 text-center px-1">
          {voucher.typeVoucher === "FREESHIP" ? "FREESHIP" : "VOUCHER"}
        </Text>
        {/* Đường răng cưa giả lập */}
        <View className="absolute -right-1.5 top-1/2 -mt-1.5 w-3 h-3 bg-white rounded-full" />
      </View>

      {/* Cột phải: Thông tin */}
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className="font-bold text-base text-gray-800" numberOfLines={1}>
            {getTitle()}
          </Text>
          <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
            {voucher.description}
          </Text>
          <Text className="text-gray-400 text-[10px] mt-1">
            Đơn tối thiểu: {formatCurrency(voucher.minOrderValue)}
          </Text>
        </View>

        <View className="flex-row justify-between items-end mt-2">
          <View>
            <Text className="text-xs text-gray-500">
              HSD: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
            </Text>
            <Text className="text-xs text-gray-400">
              Còn lại:{" "}
              {(
                ((voucher.quantity - voucher.usedCount) / voucher.quantity) *
                100
              ).toFixed(0)}
              %
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onCopy(voucher.code)}
            disabled={isDisabled}
            className={`px-3 py-1.5 rounded-full ${isDisabled ? "bg-gray-300" : "bg-green-600"}`}
          >
            <Text className="text-white text-xs font-bold">
              {isDisabled ? (isExpired ? "Hết hạn" : "Hết mã") : "Lưu mã"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VoucherCard;
