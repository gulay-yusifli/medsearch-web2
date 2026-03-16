import { Response } from 'express';
import ChatMessage from '../models/ChatMessage';
import { AuthRequest } from '../middleware/auth.middleware';
import env from '../config/env';

const getAIResponse = async (userMessage: string): Promise<string> => {
  if (!env.OPENAI_API_KEY) {
    return `Sualınız qeydə alındı: "${userMessage}". Hazırda AI servisi konfiqurasiya edilməyib. Həkiminizlə məsləhətləşin.`;
  }

  try {
    // Dynamic import to avoid build errors when openai is not installed
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Siz MedSearch platformasının tibbi köməkçisisiniz. Azərbaycan dilində cavab verin. Dərmanlar, dozalar və sağlamlıq haqqında məlumat verin, lakin hər zaman həkimə müraciəti tövsiyə edin.',
        },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
    });
    return completion.choices[0].message.content || 'Cavab verilə bilmədi.';
  } catch (err) {
    console.error('OpenAI error:', err);
    return 'AI servisi ilə əlaqə qurularkən xəta baş verdi. Bir az sonra yenidən cəhd edin.';
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, conversationId = 'ai-consultation' } = req.body;
    if (!content?.trim()) { res.status(400).json({ success: false, message: 'Mesaj boş ola bilməz' }); return; }

    // Save user message
    await ChatMessage.create({
      userId: req.user?._id,
      role: 'user',
      content,
      conversationId,
    });

    // Get AI response
    const aiContent = await getAIResponse(content);

    // Save AI message
    const aiMsg = await ChatMessage.create({
      userId: req.user?._id,
      role: 'assistant',
      content: aiContent,
      conversationId,
    });

    res.json({ success: true, data: aiMsg });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversationId = String(req.query.conversationId || 'ai-consultation');
    const messages = await ChatMessage.find({ userId: req.user?._id, conversationId }).sort({ createdAt: 1 }).limit(100);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getAdminChats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversations = await ChatMessage.aggregate([
      { $group: { _id: '$conversationId', userId: { $first: '$userId' }, lastMessage: { $last: '$content' }, updatedAt: { $last: '$createdAt' } } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $sort: { updatedAt: -1 } },
    ]);
    res.json({ success: true, data: conversations.map((c) => ({ conversationId: c._id, user: c.user, lastMessage: c.lastMessage, updatedAt: c.updatedAt })) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const sendAdminMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, content } = req.body;
    if (!conversationId || !content) { res.status(400).json({ success: false, message: 'conversationId və content tələb olunur' }); return; }

    // Find the user associated with the conversation
    const userMsg = await ChatMessage.findOne({ conversationId });
    if (!userMsg) { res.status(404).json({ success: false, message: 'Söhbət tapılmadı' }); return; }

    const msg = await ChatMessage.create({
      userId: userMsg.userId,
      role: 'admin',
      content,
      conversationId,
    });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};
