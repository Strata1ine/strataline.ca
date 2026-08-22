import type { SocialManifestEntry, SocialPlatformAdapter } from '../types.ts';
import { pinterestBoardEnvironment } from '../config.ts';
import {
	configuration,
	platformPreview,
	responseJson,
	SocialPublishError,
} from './adapter-utils.ts';

export const pinterestAdapter: SocialPlatformAdapter = {
	async validateConfiguration() {
		return configuration(['PINTEREST_ACCESS_TOKEN']);
	},
	async buildPreview(entry) {
		return platformPreview(entry, 'pinterest');
	},
	async publish(entry: SocialManifestEntry) {
		const preview = await this.buildPreview(entry);
		const media = preview.media[0];
		if (!media)
			throw new SocialPublishError('Pinterest requires one approved image.', 'invalid-media');
		const serviceBoardVariable = pinterestBoardEnvironment[entry.primaryService];
		const boardId =
			preview.board ??
			(serviceBoardVariable ? process.env[serviceBoardVariable] : undefined) ??
			process.env.PINTEREST_BOARD_ID;
		if (!boardId)
			throw new SocialPublishError('Pinterest board is not configured.', 'configuration');
		const payload = await responseJson(
			await fetch('https://api.pinterest.com/v5/pins', {
				method: 'POST',
				headers: {
					authorization: `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					board_id: boardId,
					title: preview.title?.slice(0, 100),
					description: preview.description?.slice(0, 800) ?? preview.copy.slice(0, 800),
					link: preview.destinationUrl,
					alt_text: media.alt.slice(0, 500),
					media_source: { source_type: 'image_url', url: media.url },
				}),
			}),
		);
		const id = String(payload.id ?? '');
		return {
			platformPostId: id,
			platformPostUrl: id ? `https://www.pinterest.com/pin/${id}/` : undefined,
			destinationUrl: preview.destinationUrl,
		};
	},
};
