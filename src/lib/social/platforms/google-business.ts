import type { SocialManifestEntry, SocialPlatformAdapter } from '../types.ts';
import {
	configuration,
	platformPreview,
	responseJson,
	SocialPublishError,
} from './adapter-utils.ts';

const getAccessToken = async () => {
	const required = configuration([
		'GOOGLE_CLIENT_ID',
		'GOOGLE_CLIENT_SECRET',
		'GOOGLE_REFRESH_TOKEN',
	]);
	if (!required.configured)
		throw new SocialPublishError('Google Business OAuth is not configured.', 'configuration');
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
			grant_type: 'refresh_token',
		}),
	});
	const payload = await responseJson(response);
	if (typeof payload.access_token !== 'string')
		throw new SocialPublishError('Google OAuth did not return an access token.', 'authentication');
	return payload.access_token;
};

export const googleBusinessAdapter: SocialPlatformAdapter = {
	async validateConfiguration() {
		return configuration([
			'GOOGLE_CLIENT_ID',
			'GOOGLE_CLIENT_SECRET',
			'GOOGLE_REFRESH_TOKEN',
			'GOOGLE_BUSINESS_ACCOUNT_ID',
			'GOOGLE_BUSINESS_LOCATION_ID',
		]);
	},
	async buildPreview(entry) {
		return platformPreview(entry, 'googleBusiness');
	},
	async publish(entry: SocialManifestEntry) {
		const preview = await this.buildPreview(entry);
		const media = preview.media[0];
		if (!media)
			throw new SocialPublishError('Google Business requires one approved image.', 'invalid-media');
		const accessToken = await getAccessToken();
		const parent = `accounts/${process.env.GOOGLE_BUSINESS_ACCOUNT_ID}/locations/${process.env.GOOGLE_BUSINESS_LOCATION_ID}`;
		const payload = await responseJson(
			await fetch(`https://mybusiness.googleapis.com/v4/${parent}/localPosts`, {
				method: 'POST',
				headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
				body: JSON.stringify({
					languageCode: 'en-CA',
					topicType: 'STANDARD',
					summary: preview.copy.slice(0, 1500),
					callToAction: { actionType: 'LEARN_MORE', url: preview.destinationUrl },
					media: [{ mediaFormat: 'PHOTO', sourceUrl: media.url }],
				}),
			}),
		);
		const id = String(payload.name ?? '');
		return { platformPostId: id, destinationUrl: preview.destinationUrl };
	},
};
