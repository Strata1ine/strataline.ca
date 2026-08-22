import { getStore } from '@netlify/blobs';
import { SOCIAL_MAX_ATTEMPTS, SOCIAL_STORE_NAME } from './config.ts';
import type { SocialPlatform, SocialPublicationRecord, SocialStatus } from './types.ts';

export const socialStore = () => getStore({ name: SOCIAL_STORE_NAME, consistency: 'strong' });

export const postStateKey = (platform: SocialPlatform, slug: string, version: number) =>
	`posts/${platform}/${slug}/v${version}`;
export const lockStateKey = (platform: SocialPlatform, slug: string, version: number) =>
	`locks/${platform}/${slug}/v${version}`;
export const queueStateKey = (
	scheduledAt: number,
	platform: SocialPlatform,
	slug: string,
	version: number,
) => `queue/${String(scheduledAt).padStart(13, '0')}/${platform}/${slug}/v${version}`;

export const getJSON = async <T>(key: string) =>
	(await socialStore().get(key, { type: 'json' })) as T | null;

export const setJSON = async (key: string, value: unknown) => socialStore().setJSON(key, value);

export const acquireLock = async (key: string) => {
	try {
		await socialStore().setJSON(key, { acquiredAt: new Date().toISOString() }, { onlyIfNew: true });
		return true;
	} catch {
		return false;
	}
};

export const releaseLock = async (key: string) => socialStore().delete(key);

export const nextRetryAt = (attempt: number) => {
	const bounded = Math.min(attempt, SOCIAL_MAX_ATTEMPTS);
	const delayMinutes = Math.min(6 * 60, 5 * 2 ** Math.max(0, bounded - 1));
	return new Date(Date.now() + delayMinutes * 60 * 1000).toISOString();
};

export const newPublicationRecord = (
	platform: SocialPlatform,
	slug: string,
	version: number,
	destinationUrl: string,
	payloadHash: string,
	queuedAt: string,
	status: SocialStatus,
): SocialPublicationRecord => ({
	idempotencyKey: `${platform}:${slug}:v${version}`,
	status,
	payloadHash,
	attemptCount: 0,
	destinationUrl,
	queuedAt,
	updatedAt: new Date().toISOString(),
});
