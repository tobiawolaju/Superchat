
import { Message } from '../types';
import { db } from './firebase';
import { ref, onValue, set, push, update, remove, get } from 'firebase/database';

/**
 * SuperChat Firebase RTDB Service.
 */
class FirebaseRTDB {
  // Subscribe to path changes
  onValue(path: string, callback: (data: any) => void) {
    const dbRef = ref(db, path);
    return onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  // Write data to path
  async set(path: string, data: any) {
    const dbRef = ref(db, path);
    await set(dbRef, data);
  }

  // Push to a list at path
  async push(path: string, data: any) {
    const dbRef = ref(db, path);
    const newRef = push(dbRef);
    await set(newRef, { ...data, id: newRef.key });
  }

  // Update a message in a list at path
  async updateMessage(path: string, messageId: string, updates: Partial<Message>) {
    const dbRef = ref(db, `${path}/${messageId}`);
    await update(dbRef, updates);
  }

  // Remove data at path
  async remove(path: string) {
    const dbRef = ref(db, path);
    await remove(dbRef);
  }

  // Remove a message from a list at path
  async removeMessage(path: string, messageId: string) {
    await this.remove(`${path}/${messageId}`);
  }

  async get(path: string) {
    const dbRef = ref(db, path);
    const snapshot = await get(dbRef);
    return snapshot.val();
  }
}

export const rtdb = new FirebaseRTDB();

// Helper to get chat ID from two addresses
export const getChatPath = (addr1: string, addr2: string) => {
  const sorted = [addr1, addr2].sort();
  return `chats/${sorted[0]}_${sorted[1]}`;
};
