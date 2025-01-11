import { create } from "zustand";

interface Theme {
    theme: string;
    setTheme: (theme: string) => void;
}

export const useThemeStore = create<Theme>((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme: string) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    }
}));