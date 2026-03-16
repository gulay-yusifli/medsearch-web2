import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { getAdminChats, sendAdminReply, getChatHistory } from '../../services/chat';
import { ChatMessage } from '../../types';

interface Conversation {
  conversationId: string;
  user: { name: string; email: string };
  lastMessage: string;
  updatedAt: string;
}

const AdminChat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAdminChats().then(setConversations).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    getChatHistory(selected).then(setMessages).catch(() => {});
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      const msg = await sendAdminReply(selected, reply);
      setMessages((prev) => [...prev, msg]);
      setReply('');
    } finally {
      setSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c.conversationId === selected);

  return (
    <div className="p-8 h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dəstək Çatı</h1>
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 card overflow-y-auto">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm">Aktiv Söhbətlər</h2>
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Söhbət yoxdur</p>
          ) : conversations.map((c) => (
            <button
              key={c.conversationId}
              onClick={() => setSelected(c.conversationId)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                selected === c.conversationId ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-sm">{c.user?.name || 'İstifadəçi'}</p>
              <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(c.updatedAt).toLocaleDateString('az')}</p>
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="flex-1 card flex flex-col overflow-hidden p-0">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Söhbət seçin</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{selectedConv?.user?.name}</p>
                <p className="text-xs text-gray-500">{selectedConv?.user?.email}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m._id} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      m.role === 'user' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex gap-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                  placeholder="Cavab yazın..."
                  className="input-field flex-1"
                  disabled={sending}
                />
                <button onClick={handleReply} disabled={sending || !reply.trim()} className="btn-primary px-4 disabled:opacity-60">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
