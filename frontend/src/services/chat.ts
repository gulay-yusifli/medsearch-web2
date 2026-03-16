import api from './api';
import { ChatMessage } from '../types';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || '', {
      auth: { token: localStorage.getItem('token') },
    });
  }
  return socket;
};

export const sendMessage = async (content: string, conversationId: string): Promise<ChatMessage> => {
  const res = await api.post<{ success: boolean; data: ChatMessage }>('/chat/message', { content, conversationId });
  if (!res.data.data) throw new Error('No message data returned');
  return res.data.data;
};

export const getChatHistory = async (conversationId: string): Promise<ChatMessage[]> => {
  const res = await api.get<{ success: boolean; data: ChatMessage[] }>('/chat/history', {
    params: { conversationId },
  });
  return res.data.data ?? [];
};

interface Conversation {
  conversationId: string;
  user: { name: string; email: string };
  lastMessage: string;
  updatedAt: string;
}

export const getAdminChats = async (): Promise<Conversation[]> => {
  const res = await api.get<{ success: boolean; data: Conversation[] }>('/chat/admin/all');
  return res.data.data ?? [];
};

export const sendAdminReply = async (conversationId: string, content: string): Promise<ChatMessage> => {
  const res = await api.post<{ success: boolean; data: ChatMessage }>('/chat/admin/reply', {
    conversationId,
    content,
  });
  if (!res.data.data) throw new Error('No message data returned');
  return res.data.data;
};
