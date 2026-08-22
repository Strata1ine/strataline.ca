import { socialStore } from '../../src/lib/social/state.ts';
import { verifySocialSignature } from '../../src/lib/social/security.ts';
import type { SocialPublicationRecord } from '../../src/lib/social/types.ts';

export default async (request: Request) => {
	const secret = process.env.SOCIAL_DISPATCH_SECRET ?? '';
	if (
		request.method !== 'GET' ||
		!secret ||
		!verifySocialSignature(
			secret,
			request.headers.get('x-social-timestamp'),
			'',
			request.headers.get('x-social-signature'),
		)
	)
		return new Response('Unauthorized', { status: 401 });
	const store = socialStore();
	const listed = await store.list({ prefix: 'posts/' });
	const records = await Promise.all(
		listed.blobs.map(async (blob) => ({
			key: blob.key,
			record: (await store.get(blob.key, { type: 'json' })) as SocialPublicationRecord,
		})),
	);
	return Response.json({
		mode: process.env.SOCIAL_PUBLISH_MODE ?? 'preview',
		enabled: process.env.SOCIAL_PUBLISH_ENABLED === 'true',
		records,
	});
};

export const config = { method: 'GET' };
