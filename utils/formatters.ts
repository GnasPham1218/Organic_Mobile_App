//Hàm format tiền
export const formatCurrency = (amount: number) => {
  const numberPart = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
  }).format(amount);

  return `${numberPart} VNĐ`;
};

//Hàm format ngày
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};
