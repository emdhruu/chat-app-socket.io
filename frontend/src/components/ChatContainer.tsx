import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { getMessages, messages, isMessagesLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <p>messages...</p>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
