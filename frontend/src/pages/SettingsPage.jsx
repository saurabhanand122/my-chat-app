import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, CheckCheck, Smile, Image } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { playThemeChangeSound } from "../lib/sound";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's the new redesign looking?", isSent: false },
  { id: 2, content: "It looks absolutely stunning! Glassmorphism, smooth animations, and a rich dark mode.", isSent: true },
];

const THEME_GROUPS = {
  "Dark & Sleek": ["dark", "dim", "night", "luxury", "business", "black", "forest", "dracula", "coffee", "sunset", "synthwave", "halloween"],
  "Light & Clean": ["light", "cupcake", "emerald", "corporate", "lofi", "pastel", "winter", "nord", "wireframe", "garden"],
  "Vibrant & Fun": ["bumblebee", "retro", "cyberpunk", "valentine", "aqua", "fantasy", "cmyk", "autumn", "acid", "lemonade"]
};

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();

  return (
    <div className={`min-h-screen container mx-auto px-4 pb-16 max-w-5xl ${authUser ? "pt-8" : "pt-20"}`}>
      <div className="space-y-8 bg-base-100/40 backdrop-blur-xl border border-base-300/50 p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight">App Theme Settings</h2>
          <p className="text-sm text-base-content/60">Choose a design aesthetic for your chat dashboard</p>
        </div>

        {/* Categorized Theme selector */}
        <div className="space-y-6">
          {Object.entries(THEME_GROUPS).map(([groupName, themes]) => (
            <div key={groupName} className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 px-1">{groupName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {themes.map((t) => (
                  <button
                    key={t}
                    className={`
                      group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 border
                      ${theme === t 
                        ? "bg-base-200 border-primary shadow-sm" 
                        : "bg-base-200/30 border-transparent hover:bg-base-200/70"
                      }
                    `}
                    onClick={() => {
                      playThemeChangeSound();
                      setTheme(t);
                    }}
                  >
                    <div className="relative h-8 w-full rounded-lg overflow-hidden" data-theme={t}>
                      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1 bg-base-300">
                        <div className="rounded bg-primary"></div>
                        <div className="rounded bg-secondary"></div>
                        <div className="rounded bg-accent"></div>
                        <div className="rounded bg-neutral"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold truncate w-full text-center text-base-content/80 group-hover:text-base-content">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview Section */}
        <div className="pt-6 border-t border-base-300/60">
          <div className="flex flex-col gap-1 mb-4">
            <h3 className="text-lg font-bold tracking-tight">Live Preview</h3>
            <p className="text-xs text-base-content/60">See how your active messages and inputs look</p>
          </div>

          <div className="rounded-2xl border border-base-300/60 overflow-hidden bg-base-200/50 p-4 sm:p-6 backdrop-blur-md">
            <div className="max-w-lg mx-auto bg-base-100/40 backdrop-blur-2xl rounded-2xl border border-base-300/60 shadow-xl overflow-hidden" data-theme={theme}>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-base-300/60 bg-base-100/35 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
                      JD
                    </div>
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-base-content/90 leading-tight">John Doe</h3>
                    <p className="text-[10px] text-green-500 font-medium">Active now</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 min-h-[180px] max-h-[180px] overflow-y-auto bg-base-100/10">
                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[85%] rounded-2xl p-3 shadow-sm text-xs relative
                        ${message.isSent 
                          ? "bg-gradient-to-br from-primary to-primary/85 text-primary-content rounded-tr-none shadow-primary/5" 
                          : "bg-base-200/85 backdrop-blur-sm border border-base-300/40 text-base-content rounded-tl-none"
                        }
                      `}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      
                      <div className="mt-1 flex items-center justify-end text-[8px] opacity-50 select-none">
                        <span>12:00 PM</span>
                        {message.isSent && <CheckCheck className="size-3 text-primary-content/80 ml-1" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-base-300/60 bg-base-100/35 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1.5 bg-base-200/50 border border-base-300/80 rounded-2xl px-2.5 py-0.5">
                    <Smile className="size-4 text-zinc-400" />
                    <input
                      type="text"
                      className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs h-8 flex-1 placeholder:text-zinc-500/80"
                      placeholder="Type a message..."
                      value="This is a gorgeous theme preview!"
                      readOnly
                    />
                    <Image className="size-4 text-zinc-400" />
                  </div>
                  <button className="btn btn-primary btn-circle btn-xs sm:btn-sm shadow-md shadow-primary/20">
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
