import { Resolution } from '../../types/videos';

export type UpdateVideoInputModel = {
  /**
   * Title for update existing course
   */
  title: string;
  author: string;
  availableResolutions: Resolution[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
