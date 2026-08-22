import type { SocialPlatform, SocialPlatformAdapter } from '../types.ts';
import { facebookAdapter } from './facebook.ts';
import { googleBusinessAdapter } from './google-business.ts';
import { instagramAdapter } from './instagram.ts';
import { linkedinAdapter } from './linkedin.ts';
import { pinterestAdapter } from './pinterest.ts';

export const socialPlatformAdapters: Record<SocialPlatform, SocialPlatformAdapter> = {
	googleBusiness: googleBusinessAdapter,
	facebook: facebookAdapter,
	instagram: instagramAdapter,
	linkedin: linkedinAdapter,
	pinterest: pinterestAdapter,
};
