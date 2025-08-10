export interface UserDoc {
  _id?: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface SessionScore {
  name: string; // session name
  scores: number[]; // index matches teams array
  createdAt: Date;
  updatedAt: Date;
}

export interface EventDoc {
  _id?: string;
  name: string; // unique slug
  description?: string;
  creatorId: string; // user _id
  managementPasswordHash?: string; // alternative access
  teams: string[]; // 2..10
  sessions: SessionScore[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicEventDTO {
  name: string;
  description?: string;
  teams: string[];
  sessions: { name: string; scores: number[] }[];
  totals: number[];
  updatedAt: string;
}

export function computeTotals(event: EventDoc): number[] {
  const totals = new Array(event.teams.length).fill(0);
  for (const s of event.sessions) {
    s.scores.forEach((v, i) => {
      totals[i] += v;
    });
  }
  return totals;
}
