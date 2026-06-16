import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, Settings, LogOut } from "lucide-react";
import { playTapSound } from "../lib/sound";

const NavigationRail = () => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { icon: MessageSquare, path: "/", label: "Chats" },
    { icon: User, path: "/profile", label: "Profile" },
    { icon: Settings, path: "/settings", label: "Settings" },
  ];

  return (
    <aside className="w-16 sm:w-20 h-screen bg-base-100/35 backdrop-blur-md border-r border-base-300/40 flex flex-col items-center justify-between py-6 z-30 select-none transition-all duration-300 relative">
      {/* Brand logo */}
      <div className="size-10 sm:size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm shadow-primary/5 hover:scale-105 transition-transform duration-200">
        <MessageSquare className="size-5 sm:size-6 text-primary" />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={playTapSound}
              className={`relative size-12 rounded-xl flex items-center justify-center transition-all duration-200 group mx-auto
                ${isActive 
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/10" 
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200/50"
                }
              `}
              title={item.label}
            >
              {/* Active status indicator bar */}
              <span 
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] bg-primary rounded-r-md transition-all duration-250
                  ${isActive ? "h-6" : "h-0 group-hover:h-3"}
                `} 
              />
              <Icon className="size-5 sm:size-5.5" />
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="w-full px-2">
        <button
          onClick={() => {
            playTapSound();
            logout();
          }}
          className="size-12 rounded-xl flex items-center justify-center text-error/70 hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-200 mx-auto"
          title="Logout"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </aside>
  );
};

export default NavigationRail;
