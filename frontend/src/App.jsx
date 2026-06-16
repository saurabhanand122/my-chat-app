import Navbar from "./components/Navbar";
import NavigationRail from "./components/NavigationRail";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div data-theme={theme} className="flex flex-col items-center justify-center h-screen relative overflow-hidden bg-base-300/20">
        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-float-slow" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[120px] animate-float-slower" />
        <div className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-2xl bg-base-100/40 backdrop-blur-md border border-base-300/50 shadow-xl">
          <Loader className="size-10 animate-spin text-primary" />
          <p className="text-sm font-medium tracking-wide text-base-content/70">Authenticating...</p>
        </div>
      </div>
    );

  return (
    <div data-theme={theme} className="min-h-screen relative overflow-hidden transition-colors duration-300 flex">
      {/* Dynamic ambient background gradients that react to theme colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/8 blur-[120px] animate-float-slow" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/8 blur-[120px] animate-float-slower" />
      </div>

      {authUser && <NavigationRail />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen overflow-hidden">
        {!authUser && <Navbar />}

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
};
export default App;
