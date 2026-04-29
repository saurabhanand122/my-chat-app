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
  unreadCounts: {},
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      const unreadCounts = res.data.reduce((counts, user) => {
        counts[user._id] = user.unreadCount || 0;
        return counts;
      }, {});

      set({ users: res.data, unreadCounts });
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
      get().clearUnreadCount(userId);
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
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    stopMessagePolling();

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const activeUser = get().selectedUser;
      const isMessageSentFromSelectedUser = newMessage.senderId === activeUser?._id;

      if (isMessageSentFromSelectedUser) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
        get().clearUnreadCount(newMessage.senderId);
        return;
      }

      get().incrementUnreadCount(newMessage.senderId);
    });

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

  incrementUnreadCount: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),

  clearUnreadCount: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: 0,
      },
      users: state.users.map((user) =>
        user._id === userId ? { ...user, unreadCount: 0 } : user
      ),
    })),

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser?._id) get().clearUnreadCount(selectedUser._id);
  },
}));
