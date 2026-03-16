import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Stethoscope, AlertCircle } from 'lucide-react';
import { sendMessage, getChatHistory } from '../../services/chat';
import { ChatMessage } from '../../types';

const CONV_ID = 'ai-consultation';

const quickQuestions = [
  'Paracetamol neçə mg qəbul etməliyəm?',
  'Antibiotik qəbul edərkən spirt içmək olarmı?',
  'Dərmanı yeməkdən əvvəl yoxsa sonra qəbul etmək lazımdır?',
  'Yüksək qan təzyiqi üçün hansı dərmanlar var?',
];

const AIConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatHistory(CONV_ID).then(setMessages).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || sending) return;
    setInput('');
    setSending(true);

    const tempUserMsg: ChatMessage = {
      _id: `temp-${Date.now()}`,
      userId: '',
      role: 'user',
      content,
      conversationId: CONV_ID,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    setIsTyping(true);
    try {
      const aiMsg = await sendMessage(content, CONV_ID);
      setMessages((prev) => [...prev.filter((m) => m._id !== tempUserMsg._id), tempUserMsg, aiMsg]);
    } catch {
      const errMsg: ChatMessage = {
        _id: `err-${Date.now()}`,
        userId: '',
        role: 'assistant',
        content: 'Üzr istəyirəm, cavab verə bilmədim. Bir az sonra yenidən cəhd edin.',
        conversationId: CONV_ID,
        isRead: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-4 py-3 text-white">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">AI Tibbi Köməkçi</p>
              <p className="text-xs text-purple-200">Onlayn · Hazır</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
        <div className="max-w-2xl mx-auto flex items-center gap-2 text-xs text-amber-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Bu məlumat tibbi məsləhəti əvəz etmir. Ciddi problemlər üçün həkimə müraciət edin.
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">AI Tibbi Köməkçi</p>
              <p className="text-sm text-gray-500 mb-6">Sağlamlıq və dərmanlar haqqında suallarınızı soruşun</p>
              <div className="space-y-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="w-full text-left bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-sm text-gray-700 px-4 py-3 rounded-xl transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m._id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role !== 'user' && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Stethoscope className="w-4 h-4 text-purple-600" />
                </div>
              )}
              <div
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <Stethoscope className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick questions (collapsed) */}
      {messages.length > 0 && (
        <div className="px-4 pb-2 max-w-2xl mx-auto w-full">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickQuestions.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors flex-shrink-0"
              >
                {q.length > 30 ? q.slice(0, 30) + '...' : q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Sualınızı yazın..."
            className="flex-1 input-field"
            disabled={sending}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 disabled:opacity-60 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultation;
