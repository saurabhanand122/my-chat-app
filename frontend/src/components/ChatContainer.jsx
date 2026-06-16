import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { CheckCheck, Copy, Maximize2, X, Lock, Unlock } from "lucide-react";
import toast from "react-hot-toast";
import { playReceiveSound, playDecryptSound } from "../lib/sound";

const DecryptedText = ({ text }) => {
  const isEnigma = text.startsWith("[ENIGMA] ");
  const encryptedText = isEnigma ? text.replace("[ENIGMA] ", "") : text;

  const [isDecrypted, setIsDecrypted] = useState(!isEnigma);
  const [displayText, setDisplayText] = useState(isEnigma ? encryptedText : text);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = () => {
    if (isDecrypting || isDecrypted) return;
    setIsDecrypting(true);
    playDecryptSound();

    let raw;
    try {
      raw = decodeURIComponent(escape(atob(encryptedText)));
    } catch (e) {
      raw = "Decryption Failed (Invalid Cipher)";
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    let cycles = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => {
        return raw
          .split("")
          .map((char, index) => {
            if (index < cycles) return raw[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });

      cycles += 1;
      if (cycles >= raw.length + 1) {
        clearInterval(interval);
        setDisplayText(raw);
        setIsDecrypted(true);
        setIsDecrypting(false);
      }
    }, 30);
  };

  if (!isEnigma) return <p className="text-[14px] leading-relaxed break-words">{text}</p>;

  return (
    <div className="flex flex-col gap-1">
      <div className={`font-mono text-[11px] p-1 rounded break-all tracking-wider leading-normal max-w-full overflow-hidden ${isDecrypted ? "text-[14px] font-sans tracking-normal leading-relaxed" : "bg-black/20 text-emerald-400 select-none"}`}>
        {displayText}
      </div>
      {!isDecrypted && (
        <button
          onClick={handleDecrypt}
          disabled={isDecrypting}
          className={`btn btn-xs rounded-lg self-start mt-1 flex items-center gap-1 shadow-sm font-semibold tracking-wide border-none ${isDecrypting ? "loading animate-pulse bg-emerald-500 text-black" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/35 border border-emerald-500/30"}`}
        >
          {isDecrypting ? (
            <>
              <span className="size-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Decrypting...</span>
            </>
          ) : (
            <>
              <Lock className="size-3" />
              <span>Decrypt Secret</span>
            </>
          )}
        </button>
      )}
      {isDecrypted && (
        <div className="flex items-center gap-1 text-[9px] text-emerald-400/80 mt-1 select-none">
          <Unlock className="size-3 text-emerald-400" />
          <span className="font-semibold tracking-wide uppercase">Decrypted Message</span>
        </div>
      )}
    </div>
  );
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [reactions, setReactions] = useState({}); // messageId -> emoji[]
  const [lightboxImage, setLightboxImage] = useState(null);
  const [wallpaper, setWallpaper] = useState(localStorage.getItem(`wallpaper_${selectedUser._id}`) || "default");

  useEffect(() => {
    const handleWpChange = () => {
      setWallpaper(localStorage.getItem(`wallpaper_${selectedUser._id}`) || "default");
    };

    window.addEventListener("wallpaperChanged", handleWpChange);
    handleWpChange();

    return () => {
      window.removeEventListener("wallpaperChanged", handleWpChange);
    };
  }, [selectedUser._id]);

  const prevMessagesLengthRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.senderId !== authUser._id) {
        playReceiveSound();
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, authUser._id]);

  const getWallpaperClass = () => {
    switch (wallpaper) {
      case "sunset":
        return "bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-base-200/50";
      case "emerald":
        return "bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-base-200/50";
      case "indigo":
        return "bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-base-200/50";
      case "aurora":
        return "bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-base-200/50";
      case "default":
      default:
        return "bg-base-100/10";
    }
  };

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleCopyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { duration: 1500, position: "bottom-center" });
  };

  const handleAddReaction = (messageId, emoji) => {
    setReactions((prev) => {
      const current = prev[messageId] || [];
      if (current.includes(emoji)) {
        return { ...prev, [messageId]: current.filter((e) => e !== emoji) };
      }
      return { ...prev, [messageId]: [...current, emoji] };
    });
  };

  if (isMessagesLoading) {
    return (
      <div className={`flex-1 flex flex-col overflow-auto transition-all duration-300 ${getWallpaperClass()}`}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div 
      className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${getWallpaperClass()}`}
    >
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"} group relative mb-2`}
              ref={messageEndRef}
            >
              {/* Hover Actions Toolbar */}
              <div 
                className={`absolute -top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex items-center gap-1.5 bg-base-100 border border-base-300/80 rounded-xl p-1 shadow-md
                  ${isSender ? "right-12" : "left-12"}
                `}
              >
                {/* Emoji Reactions Picker */}
                <div className="flex items-center gap-0.5 border-r border-base-300/60 pr-1.5 mr-0.5">
                  {["👍", "❤️", "😂", "😮", "😢", "🎉"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleAddReaction(message._id, emoji)}
                      className="hover:scale-125 transition-transform duration-100 px-0.5 text-xs select-none"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {/* Copy Text Action */}
                <button
                  onClick={() => handleCopyText(message.text)}
                  className="p-1 hover:bg-base-200 rounded-lg text-base-content/60 hover:text-base-content transition-colors duration-150"
                  title="Copy message"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>

              {/* Chat Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border border-base-300">
                  <img
                    src={
                      isSender
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Message Bubble */}
              <div 
                className={`chat-bubble flex flex-col p-3 rounded-2xl relative
                  ${isSender 
                    ? "bg-gradient-to-br from-primary to-primary/85 text-primary-content rounded-tr-none shadow-md shadow-primary/5 border border-primary/10" 
                    : "bg-base-200/85 backdrop-blur-sm border border-base-300/40 text-base-content rounded-tl-none shadow-sm"
                  }
                `}
              >
                {message.image && (
                  <div 
                    className="relative cursor-pointer group/image overflow-hidden rounded-lg mb-1.5 border border-base-300/20"
                    onClick={() => setLightboxImage(message.image)}
                  >
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-h-[220px] max-w-[260px] sm:max-w-[320px] object-cover transition-transform duration-300 group-hover/image:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Maximize2 className="size-5 text-white" />
                    </div>
                  </div>
                )}
                
                {message.text && <DecryptedText text={message.text} />}

                {/* Render Selected Reactions inside the bubble */}
                {reactions[message._id] && reactions[message._id].length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {reactions[message._id].map((emoji, idx) => (
                      <span 
                        key={idx} 
                        onClick={() => handleAddReaction(message._id, emoji)}
                        className={`text-[10px] cursor-pointer hover:scale-105 active:scale-95 transition-all select-none px-2 py-0.5 rounded-full border 
                          ${isSender
                            ? "bg-primary-focus/40 border-primary-focus/30 text-primary-content"
                            : "bg-base-300/60 border-base-300/40 text-base-content"
                          }
                        `}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Timestamp & Status */}
              <div className="chat-header mb-1 text-[10px] opacity-50 flex items-center mt-1 select-none">
                <time className="mx-1">
                  {formatMessageTime(message.createdAt)}
                </time>
                {isSender && (
                  <CheckCheck className="size-3.5 text-primary/80" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />

      {/* Lightbox Overlay Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center cursor-default animate-float-slow" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage} 
              alt="Full size attachment" 
              className="max-w-full max-h-[85vh] rounded-xl object-contain border border-white/10 shadow-2xl" 
            />
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors active:scale-95"
              title="Close image"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatContainer;
