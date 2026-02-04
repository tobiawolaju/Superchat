
export interface UserProfile {
  id: string;
  username: string;
  avatar: string; // Can be a URL or 'sprite:INDEX'
  hashingKey: string;
}

export interface Contact {
  id: string;
  username: string;
  hashingKey: string;
  avatar: string; // Can be a URL or 'sprite:INDEX'
  lastMessage?: string;
  lastTimestamp?: number;
  pinned?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  reactions?: Record<string, string[]>; // emoji -> list of userIds
}

export interface ChatSession {
  contact: Contact;
  messages: Message[];
}

export type View = 'HOME' | 'CHAT' | 'DASHBOARD' | 'ADD_CONTACT';
