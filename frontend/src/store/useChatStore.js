import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const MESSAGE_POLL_INTERVAL = 2000;
let messagePollInterval = null;

const stopMessagePolling = () => {
  if (messagePollInterval) {
    clearInterval(messagePollInterval);
    messagePollInterval = null;
  }
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId, { silent = false } = {}) => {
    if (!silent) set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (!silent) toast.error(error.response?.data?.message || "Unable to load messages");
    } finally {
      if (!silent) set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    stopMessagePolling();

    if (socket) {
      socket.off("newMessage");
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });
    }

    messagePollInterval = setInterval(() => {
      const activeUser = get().selectedUser;
      if (activeUser?._id) {
        get().getMessages(activeUser._id, { silent: true });
      }
    }, MESSAGE_POLL_INTERVAL);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
    stopMessagePolling();
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
