import { SOCIAL_MAX_ATTEMPTS } from '../../src/lib/social/config.ts';
import { socialPlatformAdapters } from '../../src/lib/social/platforms/index.ts';
import { SocialPublishError } from '../../src/lib/social/platforms/adapter-utils.ts';
import { verifySocialSignature } from '../../src/lib/social/security.ts';
import {
	acquireLock,
	getJSON,
	lockStateKey,
	nextRetryAt,
	postStateKey,
	releaseLock,
	setJSON,
} from '../../src/lib/social/state.ts';
import {
	fetchProductionManifest,
	isProductionAutoMode,
	payloadHash,
	verifyPublishedResources,
} from '../../src/lib/social/runtime.ts';
import type { SocialPlatform, SocialPublicationRecord } from '../../src/lib/social/types.ts';

interface QueueJob {
	platform: SocialPlatform;
	slug: string;
	version: number;
	scheduledAt: number;
}

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

	const requested = JSON.parse(body) as { queueKey?: string };
	if (!requested.queueKey?.startsWith('queue/'))
		return new Response('Invalid queue key', { status: 400 });
	const job = await getJSON<QueueJob>(requested.queueKey);
	if (!job || Date.now() < job.scheduledAt) return new Response('Not due', { status: 409 });

	const manifest = await fetchProductionManifest();
	const entry = manifest.entries.find(
		(item) => item.slug === job.slug && item.socialVersion === job.version,
	);
	if (!entry || !entry.platforms[job.platform]?.enabled)
		return new Response('Validated manifest entry not found', { status: 404 });
	const target = entry.platforms[job.platform];
	const stateKey = postStateKey(job.platform, job.slug, job.version);
	const lockKey = lockStateKey(job.platform, job.slug, job.version);
	let record = await getJSON<SocialPublicationRecord>(stateKey);
	if (!record) return new Response('Publication state not found', { status: 404 });
	if (
		record.status === 'published' ||
		record.status === 'skipped' ||
		record.status === 'not-configured'
	)
		return new Response(null, { status: 204 });
	if (!(await acquireLock(lockKey))) return new Response('Already processing', { status: 202 });

	try {
		if (!target.eligibility.eligible) {
			record = { ...record, status: 'skipped', updatedAt: new Date().toISOString() };
			await setJSON(stateKey, record);
			return new Response(null, { status: 204 });
		}
		const adapter = socialPlatformAdapters[job.platform];
		const configured = await adapter.validateConfiguration();
		if (!configured.configured) {
			record = {
				...record,
				status: 'not-configured',
				lastError: {
					class: 'configuration',
					message: `Missing runtime configuration: ${configured.missing.join(', ')}`,
				},
				updatedAt: new Date().toISOString(),
			};
			await setJSON(stateKey, record);
			return new Response(null, { status: 204 });
		}
		record = {
			...record,
			status: 'publishing',
			attemptCount: record.attemptCount + 1,
			payloadHash: payloadHash(entry, job.platform),
			updatedAt: new Date().toISOString(),
		};
		await setJSON(stateKey, record);
		await verifyPublishedResources(entry, job.platform);
		const result = await adapter.publish(entry);
		record = {
			...record,
			status: 'published',
			platformPostId: result.platformPostId,
			platformPostUrl: result.platformPostUrl,
			destinationUrl: result.destinationUrl,
			publishedAt: new Date().toISOString(),
			retryAt: undefined,
			lastError: undefined,
			updatedAt: new Date().toISOString(),
		};
		await setJSON(stateKey, record);
	} catch (error) {
		const classified =
			error instanceof SocialPublishError
				? error
				: new SocialPublishError(
						error instanceof Error ? error.message : 'Unknown publication error.',
						'transient-server',
						true,
					);
		const canRetry = classified.transient && record.attemptCount < SOCIAL_MAX_ATTEMPTS;
		record = {
			...record,
			status: 'failed',
			lastError: { class: classified.classification, message: classified.message.slice(0, 300) },
			retryAt: canRetry ? nextRetryAt(record.attemptCount) : undefined,
			updatedAt: new Date().toISOString(),
		};
		await setJSON(stateKey, record);
	} finally {
		await releaseLock(lockKey);
	}
	return new Response(null, { status: 204 });
};

export const config = { background: true, method: 'POST' };
