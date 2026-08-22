import { createSocialSignature, verifySocialSignature } from '../../src/lib/social/security.ts';
import {
	fetchProductionManifest,
	isProductionAutoMode,
	scheduledTime,
} from '../../src/lib/social/runtime.ts';
import { getJSON, postStateKey, queueStateKey, setJSON } from '../../src/lib/social/state.ts';
import {
	socialPlatforms,
	type SocialPlatform,
	type SocialPublicationRecord,
} from '../../src/lib/social/types.ts';

export default async (request: Request) => {
	const body = await request.text();
	const secret = process.env.SOCIAL_DISPATCH_SECRET ?? '';
	if (
		request.method !== 'POST' ||
		!secret ||
		!verifySocialSignature(
			secret,
			request.headers.get('x-social-timestamp'),
			body,
			request.headers.get('x-social-signature'),
		)
	)
		return new Response('Unauthorized', { status: 401 });
	if (!isProductionAutoMode()) return new Response('Publishing disabled', { status: 409 });
	const value = JSON.parse(body) as { slug?: string; platform?: SocialPlatform };
	if (!value.slug || !value.platform || !socialPlatforms.includes(value.platform))
		return new Response('Invalid retry selection', { status: 400 });

	const manifest = await fetchProductionManifest();
	const entry = manifest.entries.find((item) => item.slug === value.slug);
	if (!entry || !entry.platforms[value.platform].enabled)
		return new Response('Validated manifest entry not found', { status: 404 });
	const stateKey = postStateKey(value.platform, entry.slug, entry.socialVersion);
	const record = await getJSON<SocialPublicationRecord>(stateKey);
	if (!record || record.status === 'published')
		return new Response('Nothing to retry', { status: 409 });
	const now = Date.now();
	const queueKey = queueStateKey(now, value.platform, entry.slug, entry.socialVersion);
	await setJSON(queueKey, {
		platform: value.platform,
		slug: entry.slug,
		version: entry.socialVersion,
		scheduledAt: now,
	});
	await setJSON(stateKey, {
		...record,
		status: 'scheduled',
		retryAt: new Date(now).toISOString(),
		updatedAt: new Date().toISOString(),
	});
	const publisherBody = JSON.stringify({ queueKey });
	const timestamp = String(Date.now());
	const response = await fetch(`${process.env.URL}/.netlify/functions/social-publish`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-social-timestamp': timestamp,
			'x-social-signature': createSocialSignature(secret, timestamp, publisherBody),
		},
		body: publisherBody,
	});
	return Response.json({
		accepted: response.ok || response.status === 202,
		slug: entry.slug,
		platform: value.platform,
	});
};

export const config = { method: 'POST' };
