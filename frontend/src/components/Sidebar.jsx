import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";
import { playTapSound } from "../lib/sound";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnline;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300/60 flex flex-col transition-all duration-200 bg-base-100/20">
      <div className="border-b border-base-300/60 w-full p-5 space-y-3">
        <div className="flex items-center gap-2 text-base-content/85">
          <Users className="size-5 text-primary" />
          <span className="font-semibold hidden lg:block tracking-wide">Contacts</span>
        </div>
        
        {/* Contact Search Input */}
        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder="Search contacts..."
            className="input input-sm input-bordered w-full pl-8 bg-base-200/40 focus:bg-base-200/80 transition-all duration-200 text-sm placeholder:text-zinc-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
        </div>

        {/* Online filter toggle */}
        <div className="flex items-center justify-between mt-1 hidden lg:flex">
          <label className="cursor-pointer flex items-center gap-2 group select-none">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded transition-all"
            />
            <span className="text-xs text-base-content/70 group-hover:text-base-content transition-colors">Show online only</span>
          </label>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full font-medium">
            {Math.max(0, onlineUsers.length - 1)} Online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 flex-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              playTapSound();
              setSelectedUser(user);
            }}
            className={`
              w-full p-3 flex items-center gap-3 relative
              hover:bg-base-200/50 transition-all duration-200 group
              ${selectedUser?._id === user._id ? "bg-base-200/80" : ""}
            `}
          >
            {/* Active selection bar */}
            <div 
              className={`absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-all duration-200
                ${selectedUser?._id === user._id ? "h-full" : "h-0 group-hover:h-1/2 group-hover:top-1/4"}
              `} 
            />

            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full border border-base-300 group-hover:scale-105 transition-transform duration-200"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3.5 bg-green-500 
                  rounded-full ring-2 ring-base-100 animate-pulse"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-semibold text-sm truncate text-base-content/90 group-hover:text-primary transition-colors">
                {user.fullName}
              </div>
              <div className="text-xs text-base-content/60 truncate flex items-center gap-1 mt-0.5">
                {onlineUsers.includes(user._id) ? (
                  <>
                    <span className="inline-block size-1.5 rounded-full bg-green-500" />
                    <span>Active Now</span>
                  </>
                ) : (
                  <>
                    <span className="inline-block size-1.5 rounded-full bg-zinc-400" />
                    <span>Offline</span>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-10 flex flex-col items-center justify-center gap-2">
            <Users className="size-8 opacity-25" />
            <span className="text-xs font-medium">No contacts found</span>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
