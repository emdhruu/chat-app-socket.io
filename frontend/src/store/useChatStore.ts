import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.";

interface ChatState {
    messages: any[];
    users: any[];
    selectedUser: any | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    setSelectedUser: (selectedUser: any | null) => void;
    sendMessages: (messageData: any | null) => Promise<void>;
}


export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch users.");
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch messages.");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessages: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch messages data.");
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));