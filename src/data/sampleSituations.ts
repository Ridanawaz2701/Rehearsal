export interface SampleSituation {
  title: string;
  situation: string;
  suggestedArchetype: 'avoider' | 'defensive' | 'guilt_tripper' | 'cold_negotiator' | 'over_apologizer';
}

export const SAMPLE_SITUATIONS: SampleSituation[] = [
  {
    title: 'Salary & Title Review',
    situation: 'I need to ask my manager for a 15% raise and senior title after taking on team lead responsibilities for six months.',
    suggestedArchetype: 'cold_negotiator'
  },
  {
    title: 'Roommate Boundaries',
    situation: 'I need to tell my roommate to stop inviting overnight guests without giving advance notice or asking first.',
    suggestedArchetype: 'avoider'
  },
  {
    title: 'Partner / Relationship',
    situation: 'I need to tell my partner that I feel overwhelmed taking care of all household chores and feel unappreciated.',
    suggestedArchetype: 'defensive'
  },
  {
    title: 'Family Holiday Conflict',
    situation: 'I need to tell my parents that I won\'t be traveling home for the holidays this year because I need rest and space.',
    suggestedArchetype: 'guilt_tripper'
  },
  {
    title: 'Friend Unreliability',
    situation: 'I need to tell a close friend that cancelling our plans at the last minute for the third time in a row hurt my feelings.',
    suggestedArchetype: 'over_apologizer'
  }
];
