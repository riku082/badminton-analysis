export type MatchType = 'singles' | 'doubles';

export interface Match {
  id: string;
  date: string;
  type: MatchType;
  players: {
    player1: string;
    player2?: string;
    opponent1: string;
    opponent2?: string;
  };
  createdAt: number;
} 