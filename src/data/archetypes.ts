import { Archetype } from '../types';

export const ARCHETYPES: Archetype[] = [
  {
    id: 'avoider',
    name: 'The Avoider',
    tagline: 'Deflects, changes the subject, minimizes the issue',
    description:
      'Avoids direct confrontation at all costs. Uses humor, subject changes, superficial agreement, or fake urgency to escape uncomfortable conversations without resolving anything.',
    traits: ['Deflects uncomfortable topics', 'Minimizes seriousness', 'Suggests talking later'],
    sampleDialogue: '"Oh, is that still on your mind? Honestly things have been crazy this week—let\'s grab coffee sometime next month and catch up properly!"'
  },
  {
    id: 'defensive',
    name: 'The Defensive One',
    tagline: 'Gets immediately defensive, counter-accuses',
    description:
      'Perceives feedback as an attack. Immediately turns the spotlight back onto you, brings up past grievances, and focuses on tone or timing rather than the issue itself.',
    traits: ['Counter-accuses', 'Focuses on tone or timing', 'Denies fault immediately'],
    sampleDialogue: '"Why are you bringing this up right now? If we\'re talking about fairness, what about last Tuesday when you left everything for me to clean?"'
  },
  {
    id: 'guilt_tripper',
    name: 'The Guilt-Tripper',
    tagline: 'Makes you feel responsible for their feelings',
    description:
      'Responds with deep hurt, self-pity, or emotional fragility. Frames your request or boundary as ungrateful, cruel, or heartless, making you feel guilty for speaking up.',
    traits: ['Acts deeply hurt or fragile', 'Frames request as ungrateful', 'Weaponizes self-pity'],
    sampleDialogue: '"After everything I\'ve done to support you this past year, I can\'t believe you\'d talk to me like I\'m some burden to you."'
  },
  {
    id: 'cold_negotiator',
    name: 'The Cold Negotiator',
    tagline: 'Unemotional, transactional, hard to move',
    description:
      'Treats personal or professional issues as cold business transactions. Demands logical proof, precise metrics, or strict leverage before yielding even an inch.',
    traits: ['Demands hard evidence', 'Unmoved by emotion', 'Transactional mindset'],
    sampleDialogue: '"I understand your sentiment, but market rates for your position haven\'t shifted that much. Show me specific Q2 deliverables that justify a 15% increase."'
  },
  {
    id: 'over_apologizer',
    name: 'The Over-Apologizer',
    tagline: 'Agrees to everything verbally but won\'t change',
    description:
      'Offers rapid, overwhelming verbal apologies ("I\'m so terrible, you\'re totally right") to defuse the moment, but lacks real commitment or plan for long-term behavioral change.',
    traits: ['Excessive verbal compliance', 'Defuses tension quickly', 'No actionable commitment'],
    sampleDialogue: '"I am so, so sorry! You are 100% right, I\'m completely awful at this. I promise I\'ll be better!"'
  },
  {
    id: 'custom',
    name: 'Custom Personality',
    tagline: 'Describe a specific person\'s communication style',
    description:
      'Write a 1-2 sentence description of this specific person\'s unique habits, triggers, and communication style.',
    traits: ['Tailored to your specific person', 'Custom communication style'],
    sampleDialogue: '"Whatever unique communication habits, triggers, or specific counter-arguments your target person naturally uses."'
  }
];

export function getArchetypeDescription(id: string, customDesc?: string): string {
  if (id === 'custom' && customDesc && customDesc.trim()) {
    return customDesc.trim();
  }
  const match = ARCHETYPES.find((a) => a.id === id);
  if (match) {
    return match.description;
  }
  return customDesc || 'A realistic conversation opponent with natural resistance.';
}
