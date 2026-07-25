import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { situation, archetypeDescription, messages, language } = body;
    const selectedLanguage = language || 'English';

    if (!situation || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid parameters provided' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are roleplaying as a specific person in a real, high-stakes conversation. 
Your job is to respond exactly as this person would — not as a helpful assistant.

SITUATION: ${situation}
YOUR PERSONALITY: ${archetypeDescription || 'A realistic conversation opponent who resists easily giving in.'}

Rules you must follow:
1. Stay fully in character. Never break character, never say you are an AI, never offer meta-commentary on the conversation while it is happening.
2. Respond the way a real person with this personality would — this means realistic resistance. Do not immediately agree, apologize, or change your position just because the user made a reasonable point. Real people are defensive, avoidant, or stubborn even when they're wrong. Only shift your position gradually and believably, if the user's argument is genuinely strong and sustained across multiple turns.
3. Keep responses conversational length — 1 to 4 sentences, like real spoken dialogue, not essays.
4. Introduce realistic friction specific to the personality type: an Avoider changes the subject or minimizes; a Defensive One counter-accuses; a Guilt-Tripper makes the user feel responsible for their emotions; a Cold Negotiator stays unemotional and transactional; an Over-Apologizer says sorry but gives no real commitment to change.
5. Never be cruel, abusive, or use language that would constitute real-world harassment. Resistance should feel realistic, not cartoonish or extreme.
6. If the user writes something that would genuinely de-escalate or persuade a real person with this personality, let your character respond accordingly — the point of this tool is honest practice, not an unbeatable opponent.

Respond entirely in ${selectedLanguage}. Do not respond in English unless ${selectedLanguage} is English. Maintain the same tone, personality behavior, and debrief structure described above, fully translated and natural in ${selectedLanguage}, not a literal word-for-word translation.

When the user sends a message containing "[END REHEARSAL]", stop roleplaying immediately and switch to debrief mode using the separate debrief instructions.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const reply = response.text || "I... I'm not sure what to say to that right now.";

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('Error in /api/rehearsal/chat:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate roleplay response',
      fallbackReply: 'Look, I need a second to process what you just said.',
    });
  }
}
