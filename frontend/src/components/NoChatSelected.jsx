import { MessageSquare, Shield, Image, Palette } from "lucide-react";

const NoChatSelected = () => {
  const features = [
    { Icon: MessageSquare, title: "Real-time Chat", desc: "Send and receive messages instantly with WebSocket integration." },
    { Icon: Image, title: "Media Sharing", desc: "Share photos and attachments with friends seamlessly." },
    { Icon: Palette, title: "30+ Custom Themes", desc: "Change the look and feel of the app to match your mood." },
    { Icon: Shield, title: "Secure Sessions", desc: "Your conversations are protected and encrypted using JWT auth." },
  ];

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-6 sm:p-16 bg-base-100/30 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-xl text-center space-y-8 relative z-10">
        {/* Animated Icon Display */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Glowing aura */}
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:bg-primary/30 transition-all duration-500 scale-110" />
            <div className="relative w-20 h-20 rounded-3xl bg-base-100/80 border border-base-300 shadow-xl flex items-center justify-center animate-float-slow group-hover:scale-105 transition-transform duration-300">
              <MessageSquare className="w-10 h-10 text-primary animate-pulse-slow" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2.5">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Welcome to Aether!
          </h2>
          <p className="text-base-content/60 text-sm max-w-sm mx-auto leading-relaxed">
            Select a conversation from the sidebar to start chatting, share files, and catch up with friends.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto pt-4">
          {features.map(({ Icon, title, desc }, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-base-100/40 border border-base-300/40 hover:bg-base-100/60 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="size-4" />
                </div>
                <h3 className="font-semibold text-sm text-base-content/85">{title}</h3>
              </div>
              <p className="text-xs text-base-content/60 leading-normal">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
