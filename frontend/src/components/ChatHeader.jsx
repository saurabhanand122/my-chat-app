import { X, Palette } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showSelector, setShowSelector] = useState(false);
  const isOnline = onlineUsers.includes(selectedUser._id);

  const wallpapers = [
    { id: "default", name: "Atmosphere", bg: "bg-base-200" },
    { id: "sunset", name: "Sunset Glow", bg: "bg-gradient-to-tr from-orange-500/20 to-purple-600/20" },
    { id: "emerald", name: "Emerald Oasis", bg: "bg-gradient-to-tr from-emerald-500/20 to-teal-600/20" },
    { id: "indigo", name: "Deep Nebula", bg: "bg-gradient-to-tr from-indigo-950/50 to-purple-950/50" },
    { id: "aurora", name: "Aurora", bg: "bg-gradient-to-tr from-cyan-500/20 to-blue-600/20" }
  ];

  const handleSelectWallpaper = (id) => {
    localStorage.setItem(`wallpaper_${selectedUser._id}`, id);
    window.dispatchEvent(new Event("wallpaperChanged"));
    setShowSelector(false);
  };

  return (
    <div className="p-3 border-b border-base-300/60 bg-base-100/35 backdrop-blur-md relative z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="size-10 rounded-full overflow-hidden border border-base-300">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100 animate-pulse" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-semibold text-sm text-base-content/90 leading-tight">{selectedUser.fullName}</h3>
            <p className="text-xs text-base-content/50 mt-0.5 flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <span className="inline-block size-1.5 rounded-full bg-green-500 animate-pulse-slow" />
                  <span className="text-green-500 font-medium">Active now</span>
                </>
              ) : (
                <>
                  <span className="inline-block size-1.5 rounded-full bg-zinc-400" />
                  <span>Offline</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 relative">
          {/* Wallpaper selector button */}
          <button
            onClick={() => setShowSelector(!showSelector)}
            className={`p-1.5 rounded-full hover:bg-base-200 text-base-content/60 hover:text-base-content transition-all duration-200 active:scale-95 ${showSelector ? "bg-base-200 text-primary" : ""}`}
            title="Chat wallpaper"
          >
            <Palette className="size-4.5" />
          </button>

          {/* Wallpaper selector dropdown */}
          {showSelector && (
            <div className="absolute right-0 top-10 w-44 bg-base-100 border border-base-300/80 rounded-2xl p-2.5 shadow-xl z-50 animate-float-slow">
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 mb-2 px-1">Chat Wallpaper</p>
              <div className="flex flex-col gap-1">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => handleSelectWallpaper(wp.id)}
                    className="flex items-center gap-2 w-full p-1.5 rounded-lg text-left hover:bg-base-200 transition-colors text-xs"
                  >
                    <span className={`size-4 rounded-full border border-base-300 ${wp.bg}`} />
                    <span className="font-medium text-base-content/85">{wp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Close button */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="p-1.5 hover:bg-base-200 rounded-full text-base-content/60 hover:text-base-content transition-all duration-200 active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
