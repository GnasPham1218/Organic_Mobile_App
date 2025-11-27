//Hàm format tiền
export const formatCurrency = (amount: number) => {
  const numberPart = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
  }).format(amount);

  return `${numberPart}đ`;
};

//Hàm format ngày
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};
//Hàm format mã đơn hàng
export const formatOrderId = (id: number) => {
  // padStart(3, '0'): Đảm bảo chuỗi luôn có ít nhất 3 ký tự, thiếu thì điền số 0 vào trước
  return `#DH${id.toString().padStart(3, "0")}`;
};
