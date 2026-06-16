import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { playSendSound } from "../lib/sound";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [enigmaMode, setEnigmaMode] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const emojis = ["😀", "😂", "🥰", "😍", "👍", "❤️", "🔥", "🎉", "🚀", "💡", "😭", "🙏", "👏", "✨", "👀", "💯"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      playSendSound();

      const rawText = text.trim();
      const sendText = enigmaMode 
        ? `[ENIGMA] ${btoa(unescape(encodeURIComponent(rawText)))}` 
        : rawText;

      await sendMessage({
        text: sendText,
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setEnigmaMode(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const quickReplies = ["Hey! 👋", "Busy right now ⏳", "Awesome! 👍", "Call you later? 📞", "Thanks! ❤️", "On my way! 🚗"];

  return (
    <div className="p-3.5 w-full border-t border-base-300/60 bg-base-100/35 backdrop-blur-md relative z-20">
      {/* Emoji Picker popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 bg-base-100 border border-base-300/80 rounded-2xl p-3 shadow-xl z-30 max-w-[240px] animate-float-slow">
          <div className="grid grid-cols-4 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl hover:scale-125 transition-transform duration-100 active:scale-95 p-1 select-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 hover:bg-base-content hover:text-base-100 transition-colors
              flex items-center justify-center border border-base-300"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Replies row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-1.5 scrollbar-none select-none">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setText(reply)}
            className="text-[11px] font-semibold px-3 py-1 rounded-full border border-base-300 bg-base-200/50 hover:bg-base-250 hover:border-primary/20 transition-all text-base-content/70 hover:text-primary whitespace-nowrap active:scale-95"
          >
            {reply}
          </button>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Capsule Input bar */}
        <div className={`flex-1 flex items-center gap-2 backdrop-blur-sm border rounded-2xl px-3 py-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all duration-200
          ${enigmaMode 
            ? "bg-primary/5 border-primary/50 focus-within:bg-primary/10 shadow-sm shadow-primary/5" 
            : "bg-base-200/50 border-base-300/80 focus-within:bg-base-200"
          }
        `}>
          {/* Enigma Toggle button */}
          <button
            type="button"
            className={`btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-base-300/40 text-zinc-400 hover:text-primary ${enigmaMode ? "text-primary bg-base-300/40 animate-pulse" : ""}`}
            onClick={() => setEnigmaMode(!enigmaMode)}
            title="Toggle Enigma Encryption"
          >
            <Lock size={17} />
          </button>

          {/* Emoji Toggle button */}
          <button
            type="button"
            className={`btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-base-300/40 text-zinc-400 hover:text-primary ${showEmojiPicker ? "text-primary bg-base-300/40" : ""}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji Picker"
          >
            <Smile size={19} />
          </button>

          <input
            type="text"
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm h-10 px-1 text-base-content placeholder:text-zinc-500/85"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Attach Image button */}
          <button
            type="button"
            className={`btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-base-300/40
                     ${imagePreview ? "text-primary" : "text-zinc-400 hover:text-primary"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={19} />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="btn btn-primary btn-circle btn-sm sm:btn-md shadow-md shadow-primary/20 hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-150"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
