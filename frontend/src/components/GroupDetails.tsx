import { Ban, Dot, LogOut, Mail, User, UserPlus, X } from "lucide-react";
import avatar from "../../public/avatar.png";
import { useGroupState } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useDetailStore } from "../store/useDetailStore";

const GroupDetails = ({ onClose }: { onClose: () => void }) => {
  const { selectedGroup } = useGroupState();
  // const { sendFriendRequest } = useDetailStore();

  const { users } = useChatStore();
  const { authUser } = useAuthStore();

  const allUsers = [...users, authUser];

  // const handleSendFriendRequest = (friendId: string) => {
  //   sendFriendRequest(friendId);
  // };

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
            <p className="mt-2 ">
              <span className="flex items-center justify-center">
                Group
                <Dot /> {selectedGroup?.members.length} Members
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedGroup.groupImage || avatar}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 bg-base-100 px-3 py-2 rounded-lg border text-white">
              <span>
                <LogOut />
              </span>
              <span>Exit Group</span>
            </button>
            {/* <button className="flex items-center gap-2 bg-base-100 px-4 py-2.5 rounded-lg border text-white">
              <span>
                <Ban />
              </span>
              <span>Block User</span>
            </button> */}
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedGroup?.groupName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Group Description
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedGroup?.description}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-3">
            <h2 className="text-lg font-medium  mb-4">Members Information</h2>
            <div className="space-y-3 text-sm">
              {selectedGroup.members?.map((memberId: string, i: number) => {
                const user = allUsers.find((u) => u._id === memberId);

                if (!user) {
                  return null;
                }

                return (
                  <div
                    key={user._id} // Use the user's _id as the key
                    className={`flex items-center justify-between py-2 flex-wrap ${
                      i !== selectedGroup.members.length - 1
                        ? "border-b border-zinc-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* <span>{user.profilePic}</span>
                       */}
                      <div className="avatar">
                        <div className="w-8 rounded">
                          <img
                            src={user.profilePic || avatar}
                            alt="Tailwind-CSS-Avatar-component"
                          />
                        </div>
                      </div>
                      <span className="sm:w-auto">{user.fullName}</span>
                      {user._id === authUser._id && (
                        <span className="badge badge-primary ml-2 text-xs rounded-lg">
                          admin
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-start gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button className="flex items-center gap-2 bg-base-100 px-3 p-1 rounded-lg border border-zinc-700 hover:bg-base-200 transition-colors w-full sm:w-auto text-white text-sm">
                        <span className="">
                          <UserPlus className="w-4 h-4" />
                        </span>
                        <span>Add friend</span>
                      </button>
                      <button className="flex items-center gap-2 bg-base-100 px-3 p-1 rounded-lg border border-zinc-700 hover:bg-base-200 transition-colors w-full sm:w-auto text-white text-sm">
                        <span className="">
                          <Ban className="w-4 h-4" />
                        </span>
                        <span>Block User</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-3">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Group Since</span>
                <span>{selectedGroup.createdAt?.split("T")[0]}</span>
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

export default GroupDetails;
