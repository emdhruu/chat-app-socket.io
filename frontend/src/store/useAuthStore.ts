import { create } from "zustand";
import { axiosInstance } from "../lib/axios.";

interface AuthState {
    checkAuth: () => Promise<void>;
    authUser: any | null;
    isCheckingAuth: boolean;
    isUpdatingProfile: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,


    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });

        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });
        } finally {
            set({ authUser: false });
        }
    }
}));


