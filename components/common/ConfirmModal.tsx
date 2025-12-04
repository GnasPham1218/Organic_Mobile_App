import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type ConfirmModalProps = {
  /** Trạng thái hiển thị của modal */
  visible: boolean;
  /** Tiêu đề của modal */
  title: string;
  /** Nội dung thông báo chi tiết */
  message: string;
  /** Callback khi nhấn nút xác nhận */
  onConfirm: () => void;
  /** Callback khi nhấn nút hủy */
  onCancel: () => void;
  /** Text cho nút xác nhận (Mặc định: "Đồng ý") */
  confirmText?: string;
  /** Text cho nút hủy (Mặc định: "Không") */
  cancelText?: string;
  /**
   * Kiểu của nút xác nhận
   * - 'primary': (Mặc định) Màu chính của app
   * - 'destructive': Màu đỏ, dùng cho hành động xóa/hủy nguy hiểm
   */
  confirmVariant?: "primary" | "destructive";
};

/**
 * Component Modal xác nhận (Yes/No) có thể tái sử dụng.
 *
 * @example
 * <ConfirmModal
 * visible={isModalVisible}
 * title="Xác nhận"
 * message="Bạn có chắc chắn không?"
 * onConfirm={handleConfirm}
 * onCancel={handleCancel}
 * confirmText="Đồng ý"
 * cancelText="Hủy"
 * confirmVariant="primary"
 * />
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Đồng ý",
  cancelText = "Không",
  confirmVariant = "primary",
}) => {

  const confirmButtonBg =
    confirmVariant === "destructive" ? "bg-red-600" : "bg-PRIMARY";
  const confirmButtonText = "text-white";

  return (
    <Modal
      visible={visible}
      transparent={true} // Bắt buộc phải true để thấy được overlay
      animationType="fade" // Hiệu ứng mờ dần
      onRequestClose={onCancel} // Xử lý khi bấm nút back trên Android
    >
      {/* Lớp phủ mờ (Backdrop) */}
      <Pressable
        onPress={onCancel} // Bấm ra ngoài để tắt modal
        className="flex-1 items-center justify-center bg-black/50 p-4"
      >
        {/* Hộp nội dung (Không đóng khi bấm vào) */}
        <Pressable
          onPress={() => {}} // Ngăn sự kiện "onPress" lan xuống backdrop
          className="w-full max-w-xs rounded-xl bg-white p-6 shadow-lg"
        >
          {/* Tiêu đề */}
          <Text className="mb-2 text-center text-xl font-bold text-TEXT_PRIMARY">
            {title}
          </Text>

          {/* Nội dung */}
          <Text className="mb-6 text-center text-base text-TEXT_SECONDARY">
            {message}
          </Text>

          {/* Hàng chứa nút bấm */}
          <View className="flex-row gap-x-3">
            {/* Nút Hủy (Không) */}
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 items-center justify-center rounded-lg border border-BORDER bg-white py-3"
            >
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Nút Xác nhận (Đồng ý) */}
            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 items-center justify-center rounded-lg py-3 ${confirmButtonBg}`}
            >
              <Text className={`text-base font-semibold ${confirmButtonText}`}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmModal;