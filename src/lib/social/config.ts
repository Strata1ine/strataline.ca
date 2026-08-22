import type { SocialPlatform } from './types.ts';

export const SOCIAL_CANONICAL_ORIGIN = 'https://strataline.ca';
export const SOCIAL_DEFAULT_DELAY_MS = 30 * 60 * 1000;
export const SOCIAL_MAX_ATTEMPTS = 5;
export const SOCIAL_TIME_ZONE = 'America/Toronto';
export const SOCIAL_STORE_NAME = 'social-publishing';
export const SOCIAL_CAMPAIGN = 'projects_guides';
export const LINKEDIN_API_VERSION = '202607';

export const platformApiVersions = {
	googleBusiness: 'v4',
	metaGraph: process.env.META_GRAPH_VERSION ?? 'v25.0',
	linkedin: LINKEDIN_API_VERSION,
	pinterest: 'v5',
} as const;

export const platformDimensions: Record<
	SocialPlatform,
	{ width: number; height: number; fit: 'contain' | 'cover' }
> = {
	googleBusiness: { width: 1200, height: 900, fit: 'contain' },
	facebook: { width: 1200, height: 630, fit: 'contain' },
	instagram: { width: 1080, height: 1350, fit: 'contain' },
	linkedin: { width: 1200, height: 627, fit: 'contain' },
	pinterest: { width: 1000, height: 1500, fit: 'contain' },
};

export const platformStaggerMinutes: Record<SocialPlatform, number> = {
	googleBusiness: 0,
	facebook: 8,
	instagram: 18,
	linkedin: 32,
	pinterest: 46,
};

export const backfillPolicy = {
	enabledByDefault: false,
	maxPerPlatformPerDay: 1,
	maxProjectsPerWeek: 3,
	rotateServices: true,
} as const;

export const pinterestBoardEnvironment: Record<string, string> = {
	'/services/stairs': 'PINTEREST_BOARD_STAIRS_ID',
	'/services/popcorn-removal': 'PINTEREST_BOARD_CEILINGS_ID',
	'/services/bathrooms': 'PINTEREST_BOARD_BATHROOMS_ID',
	'/services/doors_and_windows': 'PINTEREST_BOARD_DOORS_WINDOWS_ID',
	'/interior-renovations': 'PINTEREST_BOARD_INTERIORS_ID',
};
