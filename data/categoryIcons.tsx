// BƯỚC 1: Thay đổi import từ Ionicons sang FontAwesome5
import { FontAwesome5 } from "@expo/vector-icons";

export const CATEGORY_ICON_MAP: Record<
  string,
  // BƯỚC 2: Cập nhật kiểu dữ liệu tại đây
  { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string; bg: string }
> = {
  // --- Các icon này đã được chọn lại từ thư viện FontAwesome5 ---

  "quà tặng trái cây": { name: "gift", color: "#EF4444", bg: "#FEE2E2" },
  
  // Dùng "apple-alt" (quả táo)
  "trái cây theo mùa": { name: "apple-alt", color: "#10B981", bg: "#D1FAE5" }, 
  
  // Dùng "utensils" (bộ dao nĩa)
  "bếp o - ready to eat": { name: "utensils", color: "#F59E0B", bg: "#FEF3C7" }, 
  
  // Dùng "carrot" (cà rốt) - Giờ đã có!
  "rau củ quả": { name: "carrot", color: "#22C55E", bg: "#ECFDF5" }, 
  
  "tươi sống": { name: "fish", color: "#3B82F6", bg: "#DBEAFE" },
  
  // Dùng "fire" (ngọn lửa)
  "bếp o - ready to cook": { name: "fire", color: "#F97316", bg: "#FFF7ED" },
  
  // Dùng "box" (cái hộp)
  "thực phẩm khô": { name: "box", color: "#8B5CF6", bg: "#F3E8FF" }, 
  
  "gia vị & phụ liệu": { name: "flask", color: "#E11D48", bg: "#FCE7F3" }, 
  
  // Dùng "wine-bottle" (giống chai nước) hoặc "seedling" (mầm cây/sức khỏe)
  "đồ uống tốt sức khỏe": { name: "wine-bottle", color: "#6366F1", bg: "#E0E7FF" }, 

  // Dùng "cheese" (phô mai) - Rất hợp cho bơ-sữa!
  "bơ - sữa": { name: "cheese", color: "#FBBF24", bg: "#FEF3C7" }, 

  // Dùng "baby" (em bé)
  "mẹ & bé": { name: "baby", color: "#EC4899", bg: "#FCE7F3" },
};

// Icon mặc định cho danh mục con (có thể giữ nguyên "pricetag" của Ionicons nếu muốn,
// hoặc đổi sang "tag" của FontAwesome5)
export const DEFAULT_CHILD_ICON = { name: "angle-right" as const, color: "#6B7280", bg: "#E5E7EB" };