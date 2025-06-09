import { Resolution } from '../../types/videos';

export type CreateInputModel = {
  /**
   * Body for new video
   */
  title: string; // maxLength: 40

  author: string; // maxLength: 20

  availableResolutions: Resolution[]; // At least one resolution should be added
};
