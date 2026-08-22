import { createSocialSignature } from '../../src/lib/social/security.ts';
import {
	getJSON,
	newPublicationRecord,
	postStateKey,
	queueStateKey,
	setJSON,
} from '../../src/lib/social/state.ts';
import {
	fetchProductionManifest,
	isProductionAutoMode,
	payloadHash,
	scheduledTime,
} from '../../src/lib/social/runtime.ts';
import { socialPlatforms, type SocialPublicationRecord } from '../../src/lib/social/types.ts';

const invokePublisher = async (queueKey: string) => {
	const secret = process.env.SOCIAL_DISPATCH_SECRET;
	if (!secret) throw new Error('SOCIAL_DISPATCH_SECRET is not configured.');
	const body = JSON.stringify({ queueKey });
	const timestamp = String(Date.now());
	const response = await fetch(`${process.env.URL}/.netlify/functions/social-publish`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-social-timestamp': timestamp,
			'x-social-signature': createSocialSignature(secret, timestamp, body),
		},
		body,
	});
	if (!response.ok && response.status !== 202)
		throw new Error(`Background publisher returned HTTP ${response.status}.`);
};

export default async () => {
	if (!isProductionAutoMode()) {
		console.info('Social dispatch skipped: production auto mode is not enabled.');
		return new Response(null, { status: 204 });
	}
	const manifest = await fetchProductionManifest();
	const now = Date.now();
	let queued = 0;
	for (const entry of manifest.entries) {
		for (const platform of socialPlatforms) {
			const target = entry.platforms[platform];
			if (!target.enabled || !target.eligibility.eligible) continue;
			const scheduledAt = scheduledTime(entry, platform);
			const stateKey = postStateKey(platform, entry.slug, entry.socialVersion);
			const queueKey = queueStateKey(scheduledAt, platform, entry.slug, entry.socialVersion);
			let record = await getJSON<SocialPublicationRecord>(stateKey);
			if (!record) {
				record = newPublicationRecord(
					platform,
					entry.slug,
					entry.socialVersion,
					target.destinationUrl,
					payloadHash(entry, platform),
					new Date().toISOString(),
					scheduledAt <= now ? 'pending' : 'scheduled',
				);
				await setJSON(stateKey, record);
				await setJSON(queueKey, {
					platform,
					slug: entry.slug,
					version: entry.socialVersion,
					scheduledAt,
				});
				queued += 1;
			}
			const retryDue =
				record.status === 'failed' && record.retryAt && new Date(record.retryAt).getTime() <= now;
			if (
				((record.status === 'pending' || record.status === 'scheduled') && scheduledAt <= now) ||
				retryDue
			)
				await invokePublisher(queueKey);
		}
	}
	console.info(
		`Social dispatch reviewed ${manifest.entries.length} manifest entries and created ${queued} queue records.`,
	);
	return new Response(null, { status: 204 });
};

export const config = { schedule: '7 * * * *' };
