import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const clerk_key: any = import.meta.env.VITE_CLERK_KEY;

if (!clerk_key) {
  throw new Error("CLERK_KEY is not defined");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerk_key}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
