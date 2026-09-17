import { create } from "zustand";
import { localStorage } from "../core/storage/localStorage";
import type { AppNotification, NotificationType } from "../types/domain";

const NOTIFICATIONS_STORAGE_KEY = "@taxedge_notifications";

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (
    title: string,
    body: string,
    type: NotificationType,
  ) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  loadPersisted: () => Promise<void>;
}

const persistNotifications = async (notifications: AppNotification[]) => {
  try {
    await localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.warn("Failed to persist notifications:", err);
  }
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (title, body, type) => {
    set((state) => {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        title,
        body,
        type,
        read: false,
        timestamp: "Just now",
      };
      const newNotifs = [newNotif, ...state.notifications];
      persistNotifications(newNotifs);
      return {
        notifications: newNotifs,
        unreadCount: newNotifs.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      persistNotifications(updated);
      return {
        notifications: updated,
        unreadCount: 0,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      persistNotifications(updated);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  clearAll: () => {
    persistNotifications([]);
    set({ notifications: [], unreadCount: 0 });
  },

  loadPersisted: async () => {
    try {
      const raw = await localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (raw) {
        const parsed: AppNotification[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const real = parsed.filter(
            (n) => n && n.id && !n.id.startsWith("notif-")
          );
          set({
            notifications: real,
            unreadCount: real.filter((n) => !n.read).length,
          });
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to load notifications from storage:", err);
    }
    set({ notifications: [], unreadCount: 0 });
  },
}));

// Hydrate saved notifications on application start
useNotificationStore.getState().loadPersisted().catch(() => {});

export default useNotificationStore;
