import * as FileSystem from "expo-file-system/legacy";

const INTRO_FILE_PATH = FileSystem.documentDirectory + "intro_seen.txt";

// Kiểm tra xem file tồn tại
export async function hasSeenIntro(): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(INTRO_FILE_PATH);
    // return info.exists;
    return false;
  } catch (err) {
    console.log("Error checking intro file:", err);
    return false;
  }
}

// Ghi file để đánh dấu đã xem intro
export async function markIntroAsSeen(): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(INTRO_FILE_PATH, "1");
  } catch (err) {
    console.log("Error writing intro file:", err);
  }
}
