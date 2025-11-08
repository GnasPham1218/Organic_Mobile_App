// File: screens/ReturnHistoryScreen.tsx

import ReturnHistoryView from "@/components/features/return/ReturnHistoryView";
import { mockReturnRequests, ReturnStatus } from "@/data/mockData";
import { isSameDay } from "@/utils/dates";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";

// Định nghĩa các bộ lọc trạng thái
const statusFilters: { label: string; value: ReturnStatus | null }[] = [
  { label: "Tất cả", value: null },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Từ chối", value: "rejected" },
  { label: "Đã hủy", value: "canceled" },
];

const ReturnHistoryScreen = () => {
  const router = useRouter();
  // State
  const [selectedStatus, setSelectedStatus] = useState<ReturnStatus | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Logic lọc chính
  const filteredRequests = useMemo(() => {
    let requests = mockReturnRequests;

    // 1. Lọc theo trạng thái
    if (selectedStatus) {
      requests = requests.filter((req) => req.status === selectedStatus);
    }

    // 2. Lọc theo ngày duyệt (resolved_at)
    if (selectedDate) {
      requests = requests.filter((req) => {
        // Nếu chưa được duyệt (pending) thì không có resolved_at
        if (!req.resolved_at) {
          return false;
        }
        const resolvedDate = new Date(req.resolved_at);
        return isSameDay(resolvedDate, selectedDate);
      });
    }
    return requests;
  }, [selectedStatus, selectedDate]);

  // Xử lý khi chọn ngày
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && date) {
      setSelectedDate(date);
    }
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  // Render component View
  return (
    <ReturnHistoryView
      requests={filteredRequests}
      statusFilters={statusFilters}
      selectedStatus={selectedStatus}
      selectedDate={selectedDate}
      showDatePicker={showDatePicker}
      onStatusChange={setSelectedStatus}
      onDateChange={onDateChange}
      onShowDatePicker={() => setShowDatePicker(true)}
      onClearDateFilter={clearDateFilter}
      onBackPress={() => router.back()}
    />
  );
};

export default ReturnHistoryScreen;
