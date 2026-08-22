import { SOCIAL_CAMPAIGN, SOCIAL_CANONICAL_ORIGIN } from './config.ts';
import type { SocialPlatform } from './types.ts';

const sources: Record<SocialPlatform, string> = {
	googleBusiness: 'google_business_profile',
	facebook: 'facebook',
	instagram: 'instagram',
	linkedin: 'linkedin',
	pinterest: 'pinterest',
};

export const buildSocialDestinationUrl = (
	canonicalUrl: string,
	platform: SocialPlatform,
	slug: string,
) => {
	const url = new URL(canonicalUrl);
	if (url.origin !== SOCIAL_CANONICAL_ORIGIN || !url.pathname.startsWith('/blog/'))
		throw new Error('Social destinations must use a canonical Strataline blog URL.');
	url.searchParams.set('utm_source', sources[platform]);
	url.searchParams.set('utm_medium', 'social');
	url.searchParams.set('utm_campaign', SOCIAL_CAMPAIGN);
	url.searchParams.set('utm_content', slug);
	return url.toString();
};
