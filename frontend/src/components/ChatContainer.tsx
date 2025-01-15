import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import avatar from "../../public/avatar.png";
import { formatMessageTime } from "../lib/utils";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    getMessages,
    messages,
    isMessagesLoading,
    selectedUser,
    subscribleToMessages,
    unsubscribleFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribleToMessages();

    return () => {
      unsubscribleFromMessages();
    };
  }, [
    selectedUser._id,
    getMessages,
    subscribleToMessages,
    unsubscribleFromMessages,
  ]);

  useEffect(() => {
    if (messageRef.current && messages) {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 flex flex-col overflow-auto">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || avatar
                      : selectedUser.profilePic || avatar
                  }
                  alt=""
                />
              </div>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            <div className="chat-footer mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.updatedAt)}
              </time>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
