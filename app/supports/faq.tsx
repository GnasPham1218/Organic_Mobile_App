import FAQView, { FAQItem } from "@/components/screens/supports/FAQView";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

// Dữ liệu mẫu (Bạn có thể fetch từ API)
export const FAQS_DATA: FAQItem[] = [
  // --- Nhóm 1: Qui định & Chứng nhận ---
  {
    id: "1",
    question: 'Sản phẩm "hữu cơ" (organic) có nghĩa là gì?',
    answer:
      "Sản phẩm được dán logo chứng nhận hữu cơ nghĩa là chúng được sản xuất và chế biến bằng các biện pháp an toàn, thân thiện với môi trường và phải đáp ứng các tiêu chí như: không dùng giống biến đổi gen (GMO), tuyệt đối không dùng thuốc trừ sâu, diệt cỏ, chất kích thích tăng trưởng, và đảm bảo đa dạng sinh học.",
  },
  {
    id: "2",
    question: "Chứng nhận VietGAP là gì?",
    answer:
      "VietGAP (Vietnamese Good Agricultural Practices) là chứng nhận của Bộ Nông nghiệp và Phát triển nông thôn. VietGAP tập trung vào quy trình sản xuất an toàn, hạn chế sử dụng thuốc trừ sâu và phân bón hóa học, đảm bảo vệ sinh môi trường và an toàn lao động.",
  },
  {
    id: "3",
    question: "Chứng nhận USDA Organic và EU Organic là gì?",
    answer:
      "Đây là các chứng nhận hữu cơ của Bộ Nông nghiệp Hoa Kỳ (USDA) và Liên minh châu Âu (EU). Chúng yêu cầu sản phẩm phải được sản xuất mà không sử dụng phân bón hóa học, thuốc trừ sâu tổng hợp, hoặc giống biến đổi gen (GMO) và trải qua quy trình kiểm tra nghiêm ngặt.",
  },

  // --- Nhóm 2: Chính sách giao hàng ---
  {
    id: "4",
    question: "Organicfood sử dụng đơn vị vận chuyển nào?",
    answer:
      "ORGANIC FOODS sử dụng đối tác Giao Hàng Nhanh (GHN) để thực hiện vận chuyển các đơn hàng đến khách hàng.",
  },
  {
    id: "5",
    question: "Phí giao hàng và thời gian giao hàng dự kiến?",
    answer:
      "Phí giao hàng là 30.000đ (nội thành TP.HCM), 35.000đ (ngoại thành TP.HCM) và 40.000đ (khu vực khác). Thời gian giao hàng dự kiến là trong ngày (nội thành) và từ 1 đến 5 ngày làm việc (khu vực còn lại).",
  },
  {
    id: "6",
    question: "Nếu không thể liên hệ với tôi khi giao hàng thì sao?",
    answer:
      "Nếu không thể liên hệ với khách hàng trong vòng 3 ngày, đơn hàng sẽ bị hủy và số tiền đã thanh toán sẽ được hoàn lại trong vòng 30 ngày làm việc.",
  },
  {
    id: "7",
    question: "Tôi có cần kiểm tra hàng khi nhận không?",
    answer:
      "Có. Khách hàng vui lòng kiểm tra kỹ sản phẩm, số lượng và hóa đơn trước khi ký nhận. ORGANIC FOODS không chịu trách nhiệm đối với những khiếu nại phát sinh sau khi khách hàng đã ký nhận hàng hóa.",
  },

  // --- Nhóm 3: Chính sách đổi trả ---
  {
    id: "8",
    question: "Tôi có thể đổi trả hàng trong trường hợp nào?",
    answer:
      "Chúng tôi chấp nhận đổi/trả hàng nếu sản phẩm bị hư hỏng, lỗi kỹ thuật, lỗi sản xuất, giao sai sản phẩm, sai số lượng, cận hạn sử dụng, hoặc giao trễ so với thời gian cam kết.",
  },
  {
    id: "9",
    question: "Thời hạn để yêu cầu đổi/trả là bao lâu?",
    answer:
      "Thời hạn được tính từ lúc bạn nhận hàng, cụ thể: hàng tươi sống (trong vòng 24–48 giờ) và hàng đóng gói (trong vòng 3–7 ngày).",
  },
  {
    id: "10",
    question: "Làm thế nào để tôi yêu cầu đổi trả?",
    answer:
      "Bạn vui lòng liên hệ cửa hàng qua hotline, email hoặc tin nhắn. Khi liên hệ, vui lòng cung cấp mã đơn hàng, mô tả chi tiết vấn đề và hình ảnh hoặc video rõ nét về sản phẩm và bao bì.",
  },
  {
    id: "11",
    question: "Tôi có cần gửi trả lại hàng tươi sống bị hỏng không?",
    answer:
      "Không. Với hàng tươi sống, khách hàng chỉ cần chụp hình làm bằng chứng và hủy bỏ an toàn, không cần gửi lại sản phẩm cho cửa hàng.",
  },
  {
    id: "12",
    question: "Tôi nhận lại tiền hoàn bằng cách nào và trong bao lâu?",
    answer:
      "Việc hoàn tiền được thực hiện theo phương thức thanh toán ban đầu (hoặc chuyển khoản nếu là COD). Thời gian hoàn tiền là 1–3 ngày làm việc (ví điện tử) hoặc 3–7 ngày làm việc (thẻ ngân hàng).",
  },
];

/**
 * Component "thông minh" quản lý logic cho màn hình FAQ
 */
const FAQScreen: React.FC = () => {
  const navigation = useNavigation();

  // State để theo dõi xem mục nào đang được mở
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // --- PHẦN LOGIC ---

  const handleBackPress = (): void => {
    navigation.goBack();
  };

  // Hàm này xử lý việc mở/đóng một mục
  const handleToggleItem = (id: string): void => {
    // Nếu nhấn vào mục đang mở, thì đóng nó lại (set về null)
    // Nếu nhấn vào mục đang đóng, thì mở nó ra (set id của nó)
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // --- PHẦN GIAO DIỆN ---
  return (
    <FAQView
      items={FAQS_DATA}
      expandedId={expandedId}
      onToggleItem={handleToggleItem}
      onBackPress={handleBackPress}
    />
  );
};

export default FAQScreen;
