import { GoogleGenAI, Type } from '@google/genai';

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

    return res.status(200).json({ debrief: debriefData });
  } catch (err: any) {
    console.error('Error in /api/rehearsal/debrief:', err);

    return res.status(500).json({
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
}
