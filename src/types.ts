export type ArchetypeId =
  | 'avoider'
  | 'defensive'
  | 'guilt_tripper'
  | 'cold_negotiator'
  | 'over_apologizer'
  | 'custom';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  tagline: string;
  description: string;
  traits: string[];
  sampleDialogue?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'opponent' | 'system';
  content: string;
  timestamp: string;
}

export interface StrongMoment {
  quote: string;
  explanation: string;
}

export interface LostGroundMoment {
  quote: string;
  explanation: string;
}

export interface AlternativePhrasing {
  originalWeakMoment: string;
  alternative: string;
  rationale: string;
}

export interface DebriefData {
  strongMoments: StrongMoment[];
  lostGroundMoments: LostGroundMoment[];
  alternativePhrasings: AlternativePhrasing[];
  realWorldPrediction: string;
  overallAssessment?: string;
}

export interface RehearsalSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  situation: string;
  archetypeId: ArchetypeId;
  customArchetypeDescription?: string;
  archetypeName: string;
  language?: string;
  messages: ChatMessage[];
  debrief?: DebriefData;
  status: 'active' | 'completed';
  summary?: string;
  userId?: string;
}

export type ViewScreen = 'home' | 'setup' | 'rehearsal' | 'debrief' | 'history' | 'about';
