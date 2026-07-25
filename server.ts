import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory sessions store on server (persists during process lifetime)
const serverSessionsStore = new Map<string, any>();

// Helper to get Gemini client lazily
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

// ------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Roleplay Chat Endpoint
app.post('/api/rehearsal/chat', async (req, res) => {
  try {
    const { situation, archetypeDescription, messages, language } = req.body;
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

    // Format conversation history for Gemini API
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

    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/rehearsal/chat:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate roleplay response',
      fallbackReply: 'Look, I need a second to process what you just said.',
    });
  }
});

// Debrief Analysis Endpoint
app.post('/api/rehearsal/debrief', async (req, res) => {
  try {
    const { situation, archetypeDescription, messages, language } = req.body;
    const selectedLanguage = language || 'English';

    if (!situation || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid parameters provided' });
    }

    const ai = getGeminiClient();

    // Construct full conversation transcript for debrief analysis
    const transcript = messages
      .map((m: any) => `${m.role === 'user' ? 'USER' : 'OPPONENT'}: ${m.content}`)
      .join('\n\n');

    const prompt = `Analyze this difficult conversation rehearsal transcript and provide an honest, structured debrief as an expert conversation coach.

SITUATION:
${situation}

OPPONENT PERSONALITY:
${archetypeDescription}

TRANSCRIPT:
${transcript}

Instructions:
1. "strongMoments": Identify 2-3 specific moments where the user's argument was strong. You MUST quote the exact line from the user's messages and explain why it was effective.
2. "lostGroundMoments": Identify 2-3 specific moments where the user got defensive, vague, unassertive, or lost ground. You MUST quote the exact line from the user's messages and explain precisely why it weakened their position.
3. "alternativePhrasings": Choose the weakest or most vulnerable moments and provide 2-3 concrete alternative phrasings that the user could say instead, along with a brief rationale for why each alternative is stronger.
4. "realWorldPrediction": Give an honest, grounded prediction of how the real conversation is likely to go if they approach it the way they just rehearsed it — no false encouragement, no unnecessary harshness.
5. "overallAssessment": A 1-2 sentence overall summary of the rehearsal performance for historical reference.

Respond entirely in ${selectedLanguage}. Do not respond in English unless ${selectedLanguage} is English. Maintain the same tone, personality behavior, and debrief structure described above, fully translated and natural in ${selectedLanguage}, not a literal word-for-word translation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strongMoments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING, description: 'Exact quote from user' },
                  explanation: { type: Type.STRING, description: 'Why this was effective' },
                },
                required: ['quote', 'explanation'],
              },
            },
            lostGroundMoments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING, description: 'Exact quote from user where ground was lost' },
                  explanation: { type: Type.STRING, description: 'Why this weakened position' },
                },
                required: ['quote', 'explanation'],
              },
            },
            alternativePhrasings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalWeakMoment: { type: Type.STRING, description: 'Original weak line or moment' },
                  alternative: { type: Type.STRING, description: 'Suggested alternative phrasing' },
                  rationale: { type: Type.STRING, description: 'Why this phrasing is better' },
                },
                required: ['originalWeakMoment', 'alternative', 'rationale'],
              },
            },
            realWorldPrediction: {
              type: Type.STRING,
              description: 'Honest prediction of how real conversation would go based on rehearsal',
            },
            overallAssessment: {
              type: Type.STRING,
              description: 'Brief overall summary assessment',
            },
          },
          required: [
            'strongMoments',
            'lostGroundMoments',
            'alternativePhrasings',
            'realWorldPrediction',
            'overallAssessment',
          ],
        },
      },
    });

    const jsonText = response.text || '{}';
    const debriefData = JSON.parse(jsonText);

    res.json({ debrief: debriefData });
  } catch (err: any) {
    console.error('Error in /api/rehearsal/debrief:', err);

    // Fallback structured debrief if AI call encounters issue
    res.status(500).json({
      error: err.message || 'Failed to generate debrief',
      debrief: {
        strongMoments: [
          {
            quote: 'You initiated the conversation directly and named the core issue.',
            explanation: 'Stating your main concern early prevents the other person from derailing or pretending not to understand.',
          },
        ],
        lostGroundMoments: [
          {
            quote: 'Hesitating or softening your request when met with initial resistance.',
            explanation: 'When you immediately soften your boundary after pushback, you teach the other person that resistance works.',
          },
        ],
        alternativePhrasings: [
          {
            originalWeakMoment: 'I know this might be annoying, but maybe we could talk about this?',
            alternative: 'I want to talk through something important to me so we are both on the same page.',
            rationale: 'Removes the preemptive apology and sets a constructive, serious tone.',
          },
        ],
        realWorldPrediction:
          'If you stay firm on your main point and avoid getting dragged into side arguments, you have a solid chance of reaching a workable outcome.',
        overallAssessment: 'Good practice session with clear intent.',
      },
    });
  }
});

// Server Session Management Endpoints
app.get('/api/sessions', (_req, res) => {
  const sessions = Array.from(serverSessionsStore.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  res.json({ sessions });
});

app.post('/api/sessions', (req, res) => {
  const session = req.body;
  if (session && session.id) {
    serverSessionsStore.set(session.id, session);
    res.json({ success: true, session });
  } else {
    res.status(400).json({ error: 'Session ID required' });
  }
});

app.delete('/api/sessions/:id', (req, res) => {
  const { id } = req.params;
  serverSessionsStore.delete(id);
  res.json({ success: true });
});

// ------------------------------------------------------------------
// VITE SETUP / SERVING
// ------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rehearsal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
