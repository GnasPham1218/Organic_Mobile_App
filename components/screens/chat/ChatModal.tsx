// components/features/chat/ChatModal.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { mockChatHistory, type ChatMessage } from "../../../data/mockData";
import { COLORS } from "../../../theme/tokens";

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
}

// Component nhỏ cho mỗi bong bóng chat
const ChatMessageBubble: React.FC<{ item: ChatMessage }> = ({ item }) => {
  const isUser = item.sender === "user";
  return (
    <View
      className={`my-2 max-w-[80%] rounded-2xl px-4 py-2.5 ${
        isUser
          ? "self-end rounded-br-none bg-PRIMARY"
          : "self-start rounded-bl-none bg-gray-200"
      }`}
    >
      <Text className={isUser ? "text-white" : "text-TEXT_PRIMARY"}>
        {item.text}
      </Text>
    </View>
  );
};

const ChatModal: React.FC<ChatModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim().length === 0) return;

    const userMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      text: newMessage.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");
    // Trong ứng dụng thực tế, bạn sẽ gửi tin nhắn này đến server ở đây
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-BACKGROUND"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-BORDER bg-white p-4">
          <Text className="text-lg font-bold text-TEXT_PRIMARY">
            Hỗ trợ khách hàng
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <FontAwesome name="close" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Message List */}
        <FlatList
          data={messages}
          renderItem={({ item }) => <ChatMessageBubble item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          className="flex-1"
        />

        {/* Input Area */}
        <View className="flex-row items-center border-t border-BORDER bg-white p-4">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Nhập tin nhắn..."
            className="flex-1 rounded-full bg-INPUT_BG py-2.5 px-4 text-base"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
          <TouchableOpacity
            onPress={handleSend}
            className="ml-3 h-12 w-12 items-center justify-center rounded-full bg-PRIMARY"
          >
            <FontAwesome name="paper-plane" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChatModal;