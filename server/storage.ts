import { messages, type Message, type InsertMessage } from "@shared/schema";

// Storage interface for chat messages
export interface IStorage {
  getMessages(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private currentId: number;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const timestamp = new Date();
    const message: Message = { 
      id, 
      ...insertMessage, 
      timestamp
    };
    
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
