import { create } from "zustand";
import { axiosInstance } from "../lib/axios.";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

interface AuthState {
  checkAuth: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: any) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  authUser: any | null;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  onlineUsers: any[];
  socket: any | null;
  searchQuery: string | null;
  searchResults: any[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  performSearch: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  searchQuery: "",
  searchResults: [],
  isSearching: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: await res.data });
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
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
      get().connectSocket();
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
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  setSearchResults: (results: any[]) => {
    set({ searchResults: results });
  },
  performSearch: async () => {
    const { searchQuery } = get();
    if (!searchQuery || searchQuery.trim() === "") {
      set({ searchResults: [] });
      return;
    }

    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/users/search?q=${searchQuery}`);
      set({ searchResults: res.data });
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results. Please try again.");
    } finally {
      set({ isSearching: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      autoConnect: true,
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
