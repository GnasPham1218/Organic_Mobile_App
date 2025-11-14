// @/constants/categoryIcons.ts

import { FontAwesome5 } from "@expo/vector-icons";
import React from "react"; // Cần import React để dùng ComponentProps

// 1. ĐỊNH NGHĨA VÀ EXPORT TYPE ICONCONFIG
export type IconConfig = {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
  bg: string;
};

// 2. SỬ DỤNG TYPE MỚI CHO CATEGORY_ICON_MAP
export const CATEGORY_ICON_MAP: Record<string, IconConfig> = {
  "quà tặng trái cây": { name: "gift", color: "#EF4444", bg: "#FEE2E2" },
  "trái cây theo mùa": { name: "apple-alt", color: "#10B981", bg: "#D1FAE5" },
  "bếp o - ready to eat": { name: "utensils", color: "#F59E0B", bg: "#FEF3C7" },
  "rau củ quả": { name: "carrot", color: "#22C55E", bg: "#ECFDF5" },
  "tươi sống": { name: "fish", color: "#3B82F6", bg: "#DBEAFE" },
  "bếp o - ready to cook": { name: "fire", color: "#F97316", bg: "#FFF7ED" },
  "thực phẩm khô": { name: "box", color: "#8B5CF6", bg: "#F3E8FF" },
  "gia vị & phụ liệu": { name: "flask", color: "#E11D48", bg: "#FCE7F3" },
  "đồ uống tốt sức khỏe": {
    name: "wine-bottle",
    color: "#6366F1",
    bg: "#E0E7FF",
  },
  "bơ - sữa": { name: "cheese", color: "#FBBF24", bg: "#FEF3C7" },
  "mẹ & bé": { name: "baby", color: "#EC4899", bg: "#FCE7F3" },
};

// 3. SỬ DỤNG TYPE MỚI CHO DEFAULT_CHILD_ICON (để nhất quán)
export const DEFAULT_CHILD_ICON: IconConfig = {
  name: "angle-right", // không cần "as const" nữa vì type đã rõ ràng
  color: "#6B7280",
  bg: "#E5E7EB",
};
