import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSaveName = async () => {
    if (!fullName.trim() || fullName.trim() === authUser.fullName) return;
    await updateProfile({ fullName: fullName.trim() });
    setIsEditingName(false);
  };

  return (
    <div className={`min-h-screen pb-12 ${authUser ? "pt-8" : "pt-20"}`}>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-100/40 backdrop-blur-xl border border-base-300/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Cover photo banner */}
          <div className="h-32 w-full bg-gradient-to-r from-primary/30 via-accent/20 to-secondary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          </div>

          <div className="p-6 sm:p-8 -mt-16 relative z-10 flex flex-col items-center">
            {/* avatar upload section */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="relative group">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-base-100 shadow-xl ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-primary hover:bg-primary/90 hover:scale-105
                    p-2.5 rounded-full cursor-pointer 
                    transition-all duration-200 shadow-lg border border-base-100
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-4 h-4 text-primary-content" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <h1 className="text-xl font-bold tracking-tight mt-2">{authUser?.fullName}</h1>
              <p className="text-xs text-zinc-400">
                {isUpdatingProfile ? "Uploading picture..." : "Click the camera to update your photo"}
              </p>
            </div>

            {/* Profile fields */}
            <div className="w-full space-y-5">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold tracking-wider text-base-content/50 uppercase flex items-center gap-2 px-1">
                  <User className="w-4 h-4 text-primary/70" />
                  Full Name
                </div>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 bg-base-200/50 focus:bg-base-200 focus:ring-2 focus:ring-primary/20 text-sm h-11 px-4 rounded-xl border-base-300"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isUpdatingProfile}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isUpdatingProfile || !fullName.trim() || fullName.trim() === authUser.fullName}
                      className="btn btn-primary h-11 px-4 rounded-xl text-xs font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setIsEditingName(false); setFullName(authUser.fullName); }}
                      disabled={isUpdatingProfile}
                      className="btn btn-ghost h-11 px-3 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3 bg-base-200/50 backdrop-blur-sm rounded-xl border border-base-300/65">
                    <span className="font-medium text-sm text-base-content/95">{authUser?.fullName}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-xs text-primary hover:text-primary-focus font-semibold transition-colors duration-150"
                    >
                      Edit Name
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold tracking-wider text-base-content/50 uppercase flex items-center gap-2 px-1">
                  <Mail className="w-4 h-4 text-primary/70" />
                  Email Address
                </div>
                <div className="px-4 py-3 bg-base-200/50 backdrop-blur-sm rounded-xl border border-base-300/65 font-medium text-sm text-base-content/95">
                  {authUser?.email}
                </div>
              </div>

              {/* Account details */}
              <div className="mt-8 bg-base-200/35 rounded-xl p-5 border border-base-300/40">
                <h2 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4">Account Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-base-300/50">
                    <span className="text-base-content/60">Member Since</span>
                    <span className="font-semibold text-base-content/85">{authUser.createdAt?.split("T")[0]}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-base-content/60">Account Status</span>
                    <span className="flex items-center gap-1.5 font-semibold text-green-500">
                      <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
