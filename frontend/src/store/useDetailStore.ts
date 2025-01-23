import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

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
    setSelectedDetailPage: () => void;
    // addFriend: (userId: string) => Promise<void>;
    getFriends: () => Promise<void>;
    getBlockUsers: () => Promise<void>;
    removeFriend: (userId: string) => Promise<void>;
    blockUser: (userId: string) => Promise<void>;
    unblockUser: (userId: string) => Promise<void>;
    acceptFriendRequest: (friendId: string) => Promise<void>;
    sendFriendRequest: (friendId: string) => Promise<void>;
    declineFriendRequest: (friendId: string) => Promise<void>;
    getRequestList: () => Promise<void>;
    friendRequestStatus: "none" | "pending" | "accepted";
    setFriendRequestStatus: (status: "none" | "pending" | "accepted") => void;
    checkFriendRequestStatus: (userId: string) => Promise<void>;
    setupSocketListeners: () => void;
    wrapupSocketListeners: () => void;
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
    friendRequestStatus: "none",

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
            await get().getBlockUsers();
            await get().getFriends();
            toast.success("User blocked successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to block user.");
        } finally {
            set({ isBlocking: false });
        }
    },
    unblockUser: async (userId) => {
        set({ isBlocking: true });
        try {
            await axiosInstance.post(`/users/unblock/${userId}`);
            await get().getBlockUsers();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to unblock user.");
        } finally {
            set({ isBlocking: false });
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
            await get().getRequestList();
            await get().getFriends();
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
            await get().getRequestList();
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
        // Add socket listeners here to handle real-time updates
        // socket.on("friendRequestStatusChange", (friendId, status) => {
        //     const updatedFriendList = get().friendList.map((friend) =>
        //         friend.id === friendId? {...friend, requestStatus: status } : friend
        //     );
        //     set({ friendList: updatedFriendList });
        // });  

        const socket = useAuthStore.getState().socket;
        socket.on("new-friend-request", () => {
            get().getRequestList();
        });


        socket.on("friend-request-accepted", (data: any) => {
            const { by } = data; // `by` is the user who accepted the request (User1)
            const selectedUser = useChatStore.getState().selectedUser;

            // Check if the accepted request is for the currently selected user (User2)
            if (by === selectedUser?._id) {
                set({ friendRequestStatus: "accepted" }); // Update the UI in real-time
            }
            get().getRequestList();
            get().getFriends();
        });

        socket.on("friendRequestRejected", (data: any) => {
            const { by } = data; // `by` is the user who rejected the request
            if (by === useChatStore().selectedUser?._id) {
                get().checkFriendRequestStatus(by);
            }
            get().getRequestList();
        });
        
        socket.on("friendRemoved", (data: any) => {
            const { by } = data; // `by` is the user who removed the friend
            if (by === useChatStore().selectedUser?._id) {
                set({ friendRequestStatus: "none" }); // Update the UI in real-time
            }
            get().getFriends();
        });
    },
    wrapupSocketListeners: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("new-friend-request");
        socket.off("friend-request-accept");
        socket.off("friendRequestRejected");
        socket.off("friendRemoved");

    }
}));