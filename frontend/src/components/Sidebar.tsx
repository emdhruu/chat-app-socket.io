import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { EllipsisVertical, Search, Users } from "lucide-react";
import avatar from "../../public/avatar.png";
import groupImg from "../../public/group.png";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupState } from "../store/useGroupStore";

const Sidebar = () => {
  const { getUsers, users, isUsersLoading, selectedUser, setSelectedUser } =
    useChatStore();

  const { setSelectedGroup, selectedGroup, getGroups, groups } =
    useGroupState();

  const {
    onlineUsers,
    searchQuery,
    searchResults,
    setSearchQuery,
    // setSearchResults,
    performSearch,
    isSearching,
  } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  if (isUsersLoading) return <SidebarSkeleton />;

  const filteredUsers = showOnlineOnly
    ? users.filter((u) => onlineUsers.includes(u._id))
    : users;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); 
  };

  const handleSearch = async () => {
    await performSearch();
  }; 

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    modal?.close();
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 ">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <div>
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button">
                <EllipsisVertical className="size-5 cursor-pointer" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-52 p-2 shadow"
              >
                <li>
                  <button
                    onClick={() =>
                      (
                        document.getElementById(
                          "my_modal_3"
                        ) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    Add new Friends
                  </button>
                </li>
                <li>
                  <a>Create new Group</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box h-96">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-7"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                ✕
              </button>
            </form>
            <div>
              <label className="input input-bordered flex items-center w-11/12 rounded-lg">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  value={searchQuery ?? ""}
                  onChange={handleInputChange}
                />
                <button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : <Search size={20} />}
                </button>
              </label>
              <div className="py-4 h-full overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg"
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.profilePic || avatar}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{user.fullName}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-zinc-400">
                    {!searchQuery || searchQuery.trim().length < 2
                      ? "Start typing to search for friends"
                      : "No users found"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </dialog>
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setSelectedGroup(null);
            }}
            className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }
          `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || avatar}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}

        {/* Display groups */}
        {groups && (
          <div>
            {groups?.map((group) => (
              <button
                key={group._id}
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedUser(null);
                }}
                className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                group._id === selectedGroup?._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={group.groupImage || groupImg}
                    alt={group.groupName}
                    className="size-12 object-cover rounded-full"
                  />
                </div>

                {/* Group info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{group.groupName}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
