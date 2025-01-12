import { create } from "zustand";
import { axiosInstance } from "../lib/axios.";
import toast from "react-hot-toast";

interface AuthState {
    checkAuth: () => Promise<void>;
    signUp: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    login: (data: any) => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    authUser: any | null;
    isCheckingAuth: boolean;
    isUpdatingProfile: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    onlineUsers: any[];
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log(res);
            set({ authUser: await res.data });
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: await res.data });
            toast.success("Account created successfully.");
        } catch (error) {
            console.log("Error during signup: ", error);
            toast.error("Failed to create an account. Please try again.");
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged Successfully.");
        } catch (error) {
            console.log("Error during logout", error);
            toast.error("Failed to logout. Please try again.");
        }
    },


    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: await res.data });
            toast.success("Login Successfully.");
        } catch (error: any) {
            console.log("Error during login", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: await res.data });
            toast.success("Profile updated successfully.");
        } catch (error: any) {
            console.log("Error during updateProfile", error);
            console.log(error.response.data.message);

            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    }


}));


