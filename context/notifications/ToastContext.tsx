// context/notifications/ToastContext.tsx
import React, { createContext, useContext, useState, useRef } from "react";
import { Animated } from "react-native";
import Toast, { ToastType } from "@/components/common/Toast";

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = (type: ToastType, message: string, duration = 2000) => {
    setToast({ type, message });

    // Fade in
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    // Fade out sau duration
    setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setToast(null);
      });
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast type={toast.type} message={toast.message} opacity={opacity} />}
    </ToastContext.Provider>
  );
};
