import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import "./index.css";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: authUser ? <HomePage /> : <Navigate to="/login" />,
        },
        {
          path: "login",
          element: !authUser ? <LoginPage /> : <Navigate to="/" />,
        },
        {
          path: "signup",
          element: !authUser ? <SignupPage /> : <Navigate to="/" />,
        },
        {
          path: "profile",
          element: authUser ? <ProfilePage /> : <Navigate to="/login" />,
        },
        {
          path: "setting",
          element: <SettingsPage />,
        },
        {
          path: "*",
          element: <div>Page Not Found</div>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
