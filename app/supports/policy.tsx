import PolicyView, {
  PolicySection,
} from "@/components/screens/supports/PolicyView";
import { useNavigation } from "@react-navigation/native";
import React from "react";

// Dữ liệu mới, đã loại bỏ mục "Qui định & Chứng nhận"
const POLICY_DATA: PolicySection[] = [
  // Thẻ 1: Giao hàng
  {
    id: "shipping",
    title: "Chính sách Giao hàng",
    icon: "truck", // Icon cho giao hàng
    content: [
      {
        id: "s1",
        title: "Đối tác vận chuyển",
        text: "ORGANIC FOODS sử dụng đối tác Giao Hàng Nhanh (GHN) để thực hiện vận chuyển các đơn hàng đến khách hàng.",
      },
      {
        id: "s2",
        title: "Phí và thời gian giao hàng",
        text: "Phí giao hàng là 30.000đ (nội thành TP.HCM), 35.000đ (ngoại thành TP.HCM) và 40.000đ (khu vực khác). Thời gian giao hàng dự kiến là trong ngày (nội thành) và từ 1 đến 5 ngày làm việc (khu vực còn lại).",
      },
      {
        id: "s3",
        title: "Khiếu nại và hủy đơn",
        text: "Trong trường hợp phát sinh chậm trễ, ORGANIC FOODS sẽ chủ động thông báo. Nếu không thể liên hệ với khách hàng trong vòng 3 ngày, đơn hàng sẽ bị hủy và hoàn tiền. Khi nhận hàng, khách hàng vui lòng kiểm tra kỹ trước khi ký nhận.",
      },
    ],
  },
  // Thẻ 2: Đổi trả
  {
    id: "returns",
    title: "Chính sách Đổi trả",
    icon: "exchange", // Icon cho đổi trả
    content: [
      {
        id: "rt1",
        title: "Điều kiện đổi trả",
        text: "ORGANIC FOODS chấp nhận đổi hoặc trả hàng trong các trường hợp sản phẩm bị hư hỏng, lỗi kỹ thuật, giao sai sản phẩm, sai số lượng, cận hạn sử dụng, hoặc giao trễ.",
      },
      {
        id: "rt2",
        title: "Thời hạn đổi trả",
        text: "Thời hạn yêu cầu được tính từ thời điểm khách hàng nhận hàng: hàng tươi sống (trong vòng 24–48 giờ), hàng đóng gói (trong vòng 3–7 ngày).",
      },
      {
        id: "rt3",
        title: "Quy trình yêu cầu",
        text: "Khách hàng liên hệ qua hotline, email hoặc tin nhắn, cung cấp mã đơn hàng, mô tả vấn đề và hình ảnh/video. Yêu cầu sẽ được xem xét trong vòng 24 giờ.",
      },
      {
        id: "rt4",
        title: "Phương án xử lý",
        text: "Tùy vào tình trạng, ORGANIC FOODS sẽ đổi sản phẩm mới, gửi bù, hoặc hoàn tiền (toàn phần/một phần). Với hàng tươi sống, khách hàng chỉ cần chụp hình làm bằng chứng, không cần gửi lại sản phẩm.",
      },
      {
        id: "rt5",
        title: "Quy trình hoàn tiền",
        text: "Việc hoàn tiền được thực hiện theo phương thức thanh toán ban đầu (hoặc chuyển khoản nếu là COD). Thời gian: 1–3 ngày (ví điện tử) hoặc 3–7 ngày (thẻ ngân hàng).",
      },
    ],
  },
];

/**
 * Component "thông minh" quản lý màn hình Policy
 */
const PolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleBackPress = (): void => {
    navigation.goBack();
  };

  return <PolicyView sections={POLICY_DATA} onBackPress={handleBackPress} />;
};

export default PolicyScreen;
