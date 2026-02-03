
import { Message } from '../types';

/**
 * SuperChat Mock RTDB Service.
 * Mimics Firebase RTDB behavior using LocalStorage for persistence
 * and BroadcastChannel for cross-tab real-time communication.
 */
class MockRTDB {
  private channel: BroadcastChannel;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.channel = new BroadcastChannel('super_chat_rtdb');
    this.channel.onmessage = (event) => {
      const { path, data } = event.data;
      const pathListeners = this.listeners.get(path);
      if (pathListeners) {
        pathListeners.forEach(callback => callback(data));
      }
    };
  }

  // Subscribe to path changes
  onValue(path: string, callback: (data: any) => void) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, []);
    }
    this.listeners.get(path)!.push(callback);

    // Initial data load
    const currentData = this.get(path);
    callback(currentData);

    // Return unsubscribe function
    return () => {
      const list = this.listeners.get(path);
      if (list) {
        this.listeners.set(path, list.filter(c => c !== callback));
      }
    };
  }

  // Write data to path
  set(path: string, data: any) {
    localStorage.setItem(`rtdb_${path}`, JSON.stringify(data));
    this.channel.postMessage({ path, data });

    // Trigger local listeners
    const pathListeners = this.listeners.get(path);
    if (pathListeners) {
      pathListeners.forEach(callback => callback(data));
    }
  }

  // Push to a list at path
  push(path: string, data: any) {
    const current = this.get(path) || [];
    const newData = [...current, { ...data, id: Math.random().toString(36).substring(7) + Date.now().toString() }];
    this.set(path, newData);
  }

  // Update a message in a list at path
  updateMessage(path: string, messageId: string, updates: Partial<Message>) {
    const current: Message[] = this.get(path) || [];
    const newData = current.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    );
    this.set(path, newData);
  }

  // Remove a message from a list at path
  removeMessage(path: string, messageId: string) {
    const current: Message[] = this.get(path) || [];
    const newData = current.filter(msg => msg.id !== messageId);
    this.set(path, newData);
  }

  get(path: string) {
    const raw = localStorage.getItem(`rtdb_${path}`);
    return raw ? JSON.parse(raw) : null;
  }
}

export const rtdb = new MockRTDB();

// Helper to get chat ID from two addresses
export const getChatPath = (addr1: string, addr2: string) => {
  const sorted = [addr1, addr2].sort();
  return `chats/${sorted[0]}_${sorted[1]}`;
};
