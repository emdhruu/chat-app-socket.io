import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupState } from "../store/useGroupStore";
import avatar from "../../public/avatar.png";
import profile from "../../public/group.png";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupState();
  const { onlineUsers } = useAuthStore();

  const isGroupChat = !!selectedGroup;

  const handleClose = () => {
    if (isGroupChat) {
      setSelectedGroup(null);
    } else {
      setSelectedUser(null);
    }
  };

  const displayName = isGroupChat
    ? selectedGroup?.groupName
    : selectedUser?.fullName;

  const displayImage = isGroupChat
    ? selectedGroup?.groupImage || profile
    : selectedUser?.profilePic || avatar;

  const status = isGroupChat
    ? `${selectedGroup.members?.length || 0} members`
    : onlineUsers.includes(selectedUser?._id)
    ? "Online"
    : "Offline";

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={displayImage} alt={displayName} />
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <p className="text-sm text-base-content/70">{status}</p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={handleClose}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
