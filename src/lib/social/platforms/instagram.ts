import type { SocialManifestEntry, SocialPlatformAdapter } from '../types.ts';
import { configuration, platformPreview, SocialPublishError } from './adapter-utils.ts';
import { metaPost } from './meta-client.ts';

const createImageContainer = async (accountId: string, imageUrl: string, carousel = false) =>
	metaPost(`${accountId}/media`, {
		image_url: imageUrl,
		...(carousel ? { is_carousel_item: 'true' } : {}),
	});

export const instagramAdapter: SocialPlatformAdapter = {
	async validateConfiguration() {
		return configuration(['META_ACCESS_TOKEN', 'META_INSTAGRAM_ACCOUNT_ID']);
	},
	async buildPreview(entry) {
		return platformPreview(entry, 'instagram');
	},
	async publish(entry: SocialManifestEntry) {
		const preview = await this.buildPreview(entry);
		const media = preview.media.slice(0, 7);
		if (!media.length)
			throw new SocialPublishError(
				'Instagram requires approved project photography.',
				'invalid-media',
			);
		const accountId = process.env.META_INSTAGRAM_ACCOUNT_ID!;
		let creationId = '';
		if (media.length === 1) {
			const container = await metaPost(`${accountId}/media`, {
				image_url: media[0].url,
				caption: preview.copy,
			});
			creationId = String(container.id ?? '');
		} else {
			const children: string[] = [];
			for (const item of media) {
				const container = await createImageContainer(accountId, item.url, true);
				children.push(String(container.id ?? ''));
			}
			const container = await metaPost(`${accountId}/media`, {
				media_type: 'CAROUSEL',
				children: JSON.stringify(children),
				caption: preview.copy,
			});
			creationId = String(container.id ?? '');
		}
		if (!creationId)
			throw new SocialPublishError(
				'Instagram did not return a creation ID.',
				'transient-server',
				true,
			);
		const published = await metaPost(`${accountId}/media_publish`, { creation_id: creationId });
		const id = String(published.id ?? '');
		return {
			platformPostId: id,
			platformPostUrl: id ? `https://www.instagram.com/p/${id}/` : undefined,
			destinationUrl: preview.destinationUrl,
		};
	},
};
