import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.";
import { useAuthStore } from "./useAuthStore";
// import { useAuthStore } from "./useAuthStore";

interface GroupState {
    groupMessages: any[];
    groupUsers: any[];
    groups: any[];
    selectedGroup: any | null;
    getGroupMessages: (groupId: string) => Promise<void>;
    setSelectedGroup: (selectedGroup: any | null) => void;
    sendGroupMessage: (messageData: any) => Promise<void>;
    createGroup: (groupData: any) => Promise<void>;
    getGroups: () => Promise<void>;
    subscribleToGroupMessages: () => void;
    unsubscribleFromGroupMessages: () => void;
};

export const useGroupState = create<GroupState>((set, get) => ({
    groupMessages: [],
    groupUsers: [],
    groups: [],
    selectedGroup: null,

    getGroups: async () => {
        try {
            const res = await axiosInstance.get("/messages/user/groups");
            if (!res.data) return;
            set({ groups: res.data });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch groups.");
        }
    },
    getGroupMessages: async (groupId: string) => {
        try {
            const res = await axiosInstance.get(`/messages/group/${groupId}`);

            set({ groupMessages: res.data });

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch group messages.");
        }
    },
    sendGroupMessage: async (messageData: any) => {
        const { selectedGroup, groupMessages } = get();
        try {
            const res = await axiosInstance.post(`/messages/group/send/${selectedGroup._id}`, messageData);
            
            set({ groupMessages: [...groupMessages, res.data] });

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send message.");
        }
    },

    createGroup: async (groupData: any) => {
        try {
            const res = await axiosInstance.post("/messages/group", groupData);
            set({ groupUsers: res.data });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create group.");
        }
    },

    subscribleToGroupMessages: () => {
        const { selectedGroup } = get();
        if (!selectedGroup) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newGroupMessage", (newMessage: any) => {
            const isMessageSentFromSelectedGroup = newMessage.groupId === selectedGroup._id;
            if (!isMessageSentFromSelectedGroup) return;

            set({ groupMessages: [...get().groupMessages, newMessage] });
        });
    },

    unsubscribleFromGroupMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newGroupMessage");
    },

    setSelectedGroup: (selectedGroup) => {
        set({ selectedGroup });
    },

}));