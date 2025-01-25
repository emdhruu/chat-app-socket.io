import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.";
import { useAuthStore } from "./useAuthStore";

interface DetailState {
    friendList: any[];
    blockUsersList: any[];
    groupList: any[];
    groupMembers: any[];
    requestList: any[];
    isDetailPageLoading: boolean;
    isSendRequestLoading: boolean;
    selectedDetailPage: boolean;
    isBlocking: boolean;
    isUnblocking: boolean;
    isAccepting: boolean;
    isDeclining: boolean;
    isRemoving: boolean;
    friendRequestStatus: "none" | "pending" | "accepted";
    setFriendRequestStatus: (status: "none" | "pending" | "accepted") => void;
    setSelectedDetailPage: () => void;
    getFriends: () => Promise<void>;
    getBlockUsers: () => Promise<void>;
    removeFriend: (userId: string) => Promise<void>;
    blockUser: (userId: string) => Promise<void>;
    unblockUser: (userId: string) => Promise<void>;
    acceptFriendRequest: (friendId: string) => Promise<void>;
    sendFriendRequest: (friendId: string) => Promise<void>;
    declineFriendRequest: (friendId: string) => Promise<void>;
    getRequestList: () => Promise<void>;
    checkFriendRequestStatus: (userId: string) => Promise<void>;
    setupSocketListeners: () => void;
    wrapupSocketListeners: () => void;
    isBlocked: boolean;
    setBlocked: (isBlocked: boolean) => void;
}


export const useDetailStore = create<DetailState>((set, get) => ({
    friendList: [],
    blockUsersList: [],
    groupList: [],
    groupMembers: [],
    requestList: [],
    isDetailPageLoading: false,
    isSendRequestLoading: false,
    selectedDetailPage: false,
    isBlocking: false,
    isUnblocking: false,
    isAccepting: false,
    isDeclining: false,
    isRemoving: false,
    isBlocked: false,
    friendRequestStatus: "none",
    
    setBlocked: (isBlocked: boolean) => set({ isBlocked }),
    setFriendRequestStatus: (status) => set({ friendRequestStatus: status }),

    checkFriendRequestStatus: async (userId) => {
        try {
            const res = await axiosInstance.get(`/users/requestStatus/${userId}`);
            set({ friendRequestStatus: res.data.status });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch friend request status.");
        }
    },


    getFriends: async () => {
        set({ isDetailPageLoading: true });
        try {
            const res = await axiosInstance.get("/users/friends");
            set({ friendList: res.data });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch friends.");
        } finally {
            set({ isDetailPageLoading: false });
        }
    },
    getBlockUsers: async () => {
        try {
            const res = await axiosInstance.get("/users/blockUsers");
            
            set({ blockUsersList: res.data });
            
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch block users.");
        } 
    },
    removeFriend: async (userId) => {
        set({ isRemoving: true });
        try {
            await axiosInstance.post(`/users/removeFriend/${userId}`);
            await get().getFriends();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to remove friend.");
        } finally {
            set({ isRemoving: false });
        }
    },
    blockUser: async (userId) => {
        set({ isBlocking: true });
        try {
          await axiosInstance.post(`/users/block/${userId}`);
          const currentList = get().blockUsersList;
          set({ blockUsersList: [...currentList, userId] });
          await get().getBlockUsers();
          await get().getFriends();
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Failed to block user.");
        } finally {
          set({ isBlocking: false });
        }
      },
      unblockUser: async (userId) => {
        try {
          await axiosInstance.post(`/users/unblock/${userId}`);
          const currentList = get().blockUsersList;
          set({ blockUsersList: currentList.filter((id) => id !== userId) });
          await get().getBlockUsers();
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Failed to unblock user.");
        } 
      },

    setSelectedDetailPage: () => {
        set((state) => ({ ...state, selectedDetailPage: !state.selectedDetailPage }));
    },

    sendFriendRequest: async (friendId) => {
        set({ isSendRequestLoading: true });
        try {
            await axiosInstance.post(`/users/sendRequest/${friendId}`);
            await get().getRequestList();
            toast.success("Friend request sent successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send friend request");
        } finally {
            set({ isSendRequestLoading: false });
        }
    },

    acceptFriendRequest: async (friendId) => {
        set({ isAccepting: true });
        try {
            await axiosInstance.post(`/users/acceptRequest/${friendId}`);

            set((state) => ({
                requestList: state.requestList.filter((req) => req._id !== friendId),
                friendList: [...state.friendList, { _id: friendId }], 
            }));
            set({ friendRequestStatus: "accepted" });

            const socket = useAuthStore.getState().socket;
            socket.emit("friend-request-accepted", { by: friendId });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to accept friend request");
            
        } finally {
            set({ isAccepting: false });
        }
    },

    declineFriendRequest: async (friendId) => {
        set({ isDeclining: true });
        try {
            await axiosInstance.post(`/users/rejectRequest/${friendId}`);
            set((state) => ({
                requestList: state.requestList.filter((req) => req._id !== friendId),
            }));
            set({ friendRequestStatus: "none" });

            const socket = useAuthStore.getState().socket;
            socket.emit("friendRequestRejected", { by: friendId });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to decline friend request");
        } finally {
            set({ isDeclining: false });
        }
    },
    getRequestList: async () => {
        try {
            const res = await axiosInstance.get("/users/requests");
            set({ requestList: res.data });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch request list.");
        }
    },

    setupSocketListeners: () => {

        const socket = useAuthStore.getState().socket;
        socket.on("new-friend-request", () => {
            get().getRequestList();
        });

        socket.on("friend-request-accepted", (data: { by: string; }) => {
            const { by } = data;
            set((state) => ({
                requestList: state.requestList.filter((req) => req.sender._id !== by),
                friendList: [...state.friendList, { _id: by }], 
                friendRequestStatus: "accepted", 
            }));
        });

        socket.on("friendRequestRejected", (data: { by: string; }) => {
            const { by } = data;
            set((state) => ({
                requestList: state.requestList.filter((req) => req.sender._id !== by), 
                friendRequestStatus: "none", 
            }));
        });

        socket.on("friendRemoved", (data: { by: string; }) => {
            const { by } = data;
            set((state) => ({
                friendList: state.friendList.filter((friend) => friend._id !== by), 
                friendRequestStatus: "none",
            }));
        });

        socket.on("userBlocked", (data: { userId: string }) => {
            const {userId } = data;
        
            set((state) => ({
                blockUsersList: [...state.blockUsersList, userId],
                friendList: state.friendList.filter((friend) => friend._id !== userId), 
                friendRequestStatus: "none", 
            }));
        });

        socket.on("userUnblocked", (data: { userId: string }) => {
            const {userId } = data;
            set((state) => ({
                blockUsersList: state.blockUsersList.filter((id) => id !== userId),
              }));
        })
    },
    wrapupSocketListeners: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("new-friend-request");
        socket.off("friend-request-accept");
        socket.off("friendRequestRejected");
        socket.off("friendRemoved");
        socket.off("userBlocked");
        socket.off("userUnblocked");
    }
}));