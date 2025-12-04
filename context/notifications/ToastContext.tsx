// context/notifications/ToastContext.tsx
import Toast, { ToastType } from "@/components/common/Toast";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated } from "react-native";

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 1. Giữ nguyên State quản lý nội dung Toast
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  // 2. Animation Value
  const opacity = useRef(new Animated.Value(0)).current;

  // 3. Dùng useCallback để tránh tạo lại hàm này mỗi lần render
  const showToast = useCallback(
    (type: ToastType, message: string, duration = 2000) => {
      // Set nội dung trước
      setToast({ type, message });

      // Fade In
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Hẹn giờ tắt
      setTimeout(() => {
        // Fade Out
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // QUAN TRỌNG: Không cần setToast(null) ở đây nếu không cần thiết
          // Hoặc nếu muốn reset sạch, hãy chấp nhận nó re-render nhẹ.
          // Nhưng thường thì chỉ cần ẩn đi (opacity=0) là đủ về mặt thị giác.
          // Nếu bạn muốn dọn sạch state thì giữ dòng này, nhưng hãy xem giải pháp bên dưới.
          setToast(null);
        });
      }, duration);
    },
    [opacity]
  );

  // 4. QUAN TRỌNG NHẤT: useMemo cho value context
  // Điều này ngăn các component con (như ProductDetail) bị re-render chỉ vì ToastContext render lại
  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {/* 5. Tách biệt Children và Toast Component 
         Việc setToast(null) sẽ làm ToastProvider re-render.
         Nhưng nhờ useMemo ở trên, các component con bên trong 'children' sẽ không bị ảnh hưởng 
         nếu chúng được bọc kỹ (React.memo) hoặc cơ chế React nhận diện props không đổi.
      */}
      {children}

      {/* Phần hiển thị Toast nằm đè lên trên */}
      {toast && (
        <Toast type={toast.type} message={toast.message} opacity={opacity} />
      )}
    </ToastContext.Provider>
  );
};
