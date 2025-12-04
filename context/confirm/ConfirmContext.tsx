import React, { createContext, useContext, useState, ReactNode } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "destructive";
}

interface ConfirmContextValue {
  showConfirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextValue>({
  showConfirm: () => {},
});

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const showConfirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setVisible(true);
  };

  const handleCancel = () => setVisible(false);
  const handleConfirm = () => {
    options?.onConfirm?.();
    setVisible(false);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {options && (
        <ConfirmModal
          visible={visible}
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          confirmVariant={options.confirmVariant}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
