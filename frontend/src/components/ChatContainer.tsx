import { useEffect, useRef, useMemo, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupState } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import avatar from "../../public/avatar.png";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    getMessages,
    messages,
    isMessagesLoading,
    selectedUser,
    subscribleToMessages,
    unsubscribleFromMessages,
  } = useChatStore();

  const {
    getGroupMessages,
    groupMessages,
    selectedGroup,
    subscribleToGroupMessages,
    unsubscribleFromGroupMessages,
  } = useGroupState();
  const { authUser } = useAuthStore();
  const messageRef = useRef<HTMLDivElement>(null);

  // Determine if it's a group chat
  const isGroupChat = Boolean(selectedGroup);

  // Active messages based on chat type
  const activeMessages = useMemo(
    () => (isGroupChat ? groupMessages : messages),
    [isGroupChat, groupMessages, messages]
  );

  // Fetch messages based on selected user or group
  const fetchMessages = useCallback(async () => {
    if (selectedUser?._id) {
      await getMessages(selectedUser._id);
    } else if (selectedGroup?._id) {
      await getGroupMessages(selectedGroup._id);
    }
  }, [selectedUser?._id, selectedGroup?._id, getMessages, getGroupMessages]);

  // Subscribe to messages
  useEffect(() => {
    fetchMessages();
    if (isGroupChat) {
      subscribleToGroupMessages();
    } else {
      subscribleToMessages();
    }

    if (isGroupChat) {
      return () => {
        unsubscribleFromGroupMessages();
      };
    } else {
      return () => {
        unsubscribleFromMessages();
      };
    }
  }, [
    fetchMessages,
    subscribleToMessages,
    unsubscribleFromMessages,
    unsubscribleFromGroupMessages,
  ]);

  // Scroll to the latest message
  useEffect(() => {
    if (messageRef.current && activeMessages.length > 0) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages]);

  // Loading state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const groupMessageData = (messages: Array<any>) => {
    const groupedMessages: { [key: string]: Array<any> } = {};
    messages.forEach((message: any) => {
      const date = new Date(message.updatedAt).toDateString();
      if (!groupedMessages[date]) {
        groupedMessages[date] = [message];
      }
      groupedMessages[date].push(message);
    });
    return groupedMessages;
  };

  const formatBadgeDate = (dateString: string) => {
    const today = new Date().toDateString();
    const yesterday = new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toDateString();

    if (dateString === today) {
      return "Today";
    } else if (dateString === yesterday) {
      return "Yesterday";
    } else {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 flex flex-col overflow-auto">
        {Object.entries(groupMessageData(activeMessages)).map(
          ([date, messages]) => (
            <div key={date}>
              <div className="flex justify-center mt-2">
                <span className="badge badge-neutral">
                  {formatBadgeDate(date)}
                </span>
              </div>
              {(messages as Array<any>).map((message: any, i) => {
                return (
                  <div
                    key={i}
                    className={`chat ${
                      isGroupChat
                        ? message.senderId._id.toString() ===
                          authUser._id.toString()
                          ? "chat-end"
                          : "chat-start"
                        : message.senderId === authUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                    ref={messageRef}
                  >
                    <div className="chat-image avatar">
                      <div className="size-10 rounded-full border">
                        <img
                          src={
                            isGroupChat
                              ? message.senderId.profilePic || avatar
                              : message.senderId === authUser._id
                              ? authUser.profilePic || avatar
                              : selectedUser.profilePic || avatar
                          }
                          alt="profile pic"
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
                );
              })}
            </div>
          )
        )}

        {activeMessages.length === 0 && (
          <p className="text-center text-zinc-500 py-4">
            No messages yet in this {isGroupChat ? "group" : "chat"}.
          </p>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
