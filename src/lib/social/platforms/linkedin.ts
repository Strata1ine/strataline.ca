import { LINKEDIN_API_VERSION } from '../config.ts';
import type { SocialManifestEntry, SocialPlatformAdapter } from '../types.ts';
import {
	configuration,
	platformPreview,
	responseJson,
	SocialPublishError,
} from './adapter-utils.ts';

const headers = () => ({
	authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
	'content-type': 'application/json',
	'Linkedin-Version': LINKEDIN_API_VERSION,
	'X-Restli-Protocol-Version': '2.0.0',
});

const uploadImage = async (owner: string, imageUrl: string) => {
	const initialized = await responseJson(
		await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify({ initializeUploadRequest: { owner } }),
		}),
	);
	const value = initialized.value as { uploadUrl?: string; image?: string } | undefined;
	if (!value?.uploadUrl || !value.image)
		throw new SocialPublishError(
			'LinkedIn image upload could not be initialized.',
			'invalid-media',
		);
	const source = await fetch(imageUrl);
	if (!source.ok)
		throw new SocialPublishError('LinkedIn source image was not reachable.', 'invalid-media');
	const upload = await fetch(value.uploadUrl, {
		method: 'PUT',
		headers: { authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}` },
		body: await source.arrayBuffer(),
	});
	if (!upload.ok) throw new SocialPublishError('LinkedIn image upload failed.', 'invalid-media');
	return value.image;
};

export const linkedinAdapter: SocialPlatformAdapter = {
	async validateConfiguration() {
		return configuration(['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_ORGANIZATION_URN']);
	},
	async buildPreview(entry) {
		return platformPreview(entry, 'linkedin');
	},
	async publish(entry: SocialManifestEntry) {
		const preview = await this.buildPreview(entry);
		const owner = process.env.LINKEDIN_ORGANIZATION_URN!;
		const image = preview.media[0] ? await uploadImage(owner, preview.media[0].url) : undefined;
		const response = await fetch('https://api.linkedin.com/rest/posts', {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify({
				author: owner,
				commentary: preview.copy,
				visibility: 'PUBLIC',
				distribution: {
					feedDistribution: 'MAIN_FEED',
					targetEntities: [],
					thirdPartyDistributionChannels: [],
				},
				...(image ? { content: { media: { id: image, title: entry.title } } } : {}),
				lifecycleState: 'PUBLISHED',
				isReshareDisabledByAuthor: false,
			}),
		});
		await responseJson(response);
		const id = response.headers.get('x-restli-id') ?? '';
		return {
			platformPostId: id,
			platformPostUrl: id
				? `https://www.linkedin.com/feed/update/${encodeURIComponent(id)}`
				: undefined,
			destinationUrl: preview.destinationUrl,
		};
	},
};
