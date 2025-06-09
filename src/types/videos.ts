export enum Resolution {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160',
}

export type Video = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean; // default: false
  minAgeRestriction: number | null; // 1–18, null means no restriction
  createdAt: string; // ISO date-time string
  publicationDate: string; // ISO date-time string, default +1 day from createdAt
  availableResolutions: Resolution[];
};
