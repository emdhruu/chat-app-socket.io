import { Ban, Mail, User, UserPlus, X } from "lucide-react";
import avatar from "../../public/avatar.png";
import { useChatStore } from "../store/useChatStore";
import { useDetailStore } from "../store/useDetailStore";
import toast from "react-hot-toast";
import { useEffect } from "react";

const FriendsDetails = ({ onClose }: { onClose: () => void }) => {
  const { selectedUser } = useChatStore();
  const {
    blockUser,
    sendFriendRequest,
    removeFriend,
    isBlocking,
    isSendRequestLoading,
    isRemoving,
    friendRequestStatus,
    checkFriendRequestStatus,
    setFriendRequestStatus,
    setupSocketListeners,
    wrapupSocketListeners,
  } = useDetailStore();

  useEffect(() => {
    if (selectedUser?._id) {
      checkFriendRequestStatus(selectedUser._id);
    }
  }, [selectedUser?._id, checkFriendRequestStatus]);

  useEffect(() => {
    setupSocketListeners();

    return () => {
      wrapupSocketListeners();
    };
  }, [setupSocketListeners, wrapupSocketListeners]);

  const handleBlockUser = async () => {
    try {
      await blockUser(selectedUser._id);
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(selectedUser._id);
      setFriendRequestStatus("pending");
    } catch (error) {
      setFriendRequestStatus("none");
      toast.error("Failed to send friend request");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await removeFriend(selectedUser._id);
      setFriendRequestStatus("none"); // Update status to "none"
      toast.success("Friend removed successfully");
    } catch (error) {
      toast.error("Failed to remove friend");
    }
  };

  const getButtonConfig = () => {
    switch (friendRequestStatus) {
      case "pending":
        return {
          text: "Pending",
          onClick: () => {},
          disabled: true,
        };
      case "accepted":
        return {
          text: "Remove Friend",
          onClick: handleRemoveFriend,
          disabled: isRemoving,
        };
      default:
        return {
          text: "Add Friend",
          onClick: handleSendFriendRequest,
          disabled: isSendRequestLoading,
        };
    }
  };

  const { text, onClick, disabled } = getButtonConfig();

  return (
    <div className="w-full">
      <div className="mx-auto p-4">
        <div className="rounded-xl p-2 space-y-4">
          <div className="flex justify-end">
            <button onClick={onClose}>
              <X />
            </button>
          </div>
          <div className="text-center ">
            <h1 className="text-2xl font-semibold ">About</h1>
            <p className="mt-2">Profile information</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedUser.profilePic || avatar}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              className={`flex items-center gap-2 bg-base-100 px-3 py-2 rounded-lg border text-white text-sm ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onClick}
              disabled={disabled}
            >
              <span>
                <UserPlus className="w-4 h-4" />
              </span>
              <span>
                {disabled && (friendRequestStatus === "pending" || isRemoving)
                  ? `${text}...`
                  : text}
              </span>
            </button>
            <button
              className={`flex items-center gap-2 bg-base-100 px-3 py-2 rounded-lg border text-white text-sm ${
                isBlocking ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleBlockUser}
              disabled={isBlocking}
            >
              <span>
                <Ban className="w-4 h-4" />
              </span>
              <span>{isBlocking ? "Blocking..." : "Block User"}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-3">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{selectedUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsDetails;
