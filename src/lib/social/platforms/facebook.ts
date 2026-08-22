import type { SocialManifestEntry, SocialPlatformAdapter } from '../types.ts';
import { configuration, platformPreview, SocialPublishError } from './adapter-utils.ts';
import { metaPost } from './meta-client.ts';

export const facebookAdapter: SocialPlatformAdapter = {
	async validateConfiguration() {
		return configuration(['META_ACCESS_TOKEN', 'META_FACEBOOK_PAGE_ID']);
	},
	async buildPreview(entry) {
		return platformPreview(entry, 'facebook');
	},
	async publish(entry: SocialManifestEntry) {
		const preview = await this.buildPreview(entry);
		const media = preview.media[0];
		if (!media)
			throw new SocialPublishError('Facebook requires one approved image.', 'invalid-media');
		const payload = await metaPost(`${process.env.META_FACEBOOK_PAGE_ID}/photos`, {
			url: media.url,
			message: `${preview.copy}\n\n${preview.destinationUrl}`,
			published: 'true',
		});
		return {
			platformPostId: String(payload.post_id ?? payload.id ?? ''),
			platformPostUrl:
				typeof payload.post_id === 'string'
					? `https://www.facebook.com/${payload.post_id}`
					: undefined,
			destinationUrl: preview.destinationUrl,
		};
	},
};
