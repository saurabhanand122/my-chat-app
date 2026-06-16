import { MessageSquare, Image, Heart, Sparkles, Smile, User, Video, Phone, Send } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  const icons = [
    { Icon: MessageSquare, label: "Chat" },
    { Icon: Image, label: "Gallery" },
    { Icon: Smile, label: "Emoji" },
    { Icon: Heart, label: "Favorite" },
    { Icon: Sparkles, label: "AI Magic" },
    { Icon: User, label: "Profile" },
    { Icon: Video, label: "Video Call" },
    { Icon: Phone, label: "Voice Call" },
    { Icon: Send, label: "Delivered" },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200/30 p-12 relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[80px]" />

      <div className="max-w-md text-center relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {icons.map(({ Icon, label }, i) => {
            const isCenter = i === 4;
            return (
              <div
                key={i}
                style={{
                  animationDelay: `${i * 150}ms`,
                }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300
                  ${isCenter 
                    ? "bg-primary/20 border-primary/30 text-primary animate-float-slow shadow-lg shadow-primary/10" 
                    : "bg-base-100/40 backdrop-blur-md border-base-300/60 text-base-content/60 hover:text-primary hover:border-primary/40 hover:bg-base-100/70"
                  } 
                  ${i % 2 === 0 ? "animate-float-slow" : "animate-float-slower"}
                `}
              >
                <Icon className={`size-6 ${isCenter ? "size-8 animate-pulse" : "transition-transform group-hover:scale-110"}`} />
                <span className="text-[10px] font-medium tracking-wide mt-1.5 opacity-60 uppercase hidden sm:block">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight">{title}</h2>
        <p className="text-base-content/60 text-sm leading-relaxed max-w-sm mx-auto">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
