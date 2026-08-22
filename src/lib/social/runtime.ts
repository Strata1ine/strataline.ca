import { createHash } from 'node:crypto';
import {
	SOCIAL_CANONICAL_ORIGIN,
	SOCIAL_DEFAULT_DELAY_MS,
	platformStaggerMinutes,
} from './config.ts';
import type { SocialManifest, SocialManifestEntry, SocialPlatform } from './types.ts';
import { assertCanonicalSocialUrl } from './security.ts';

export const isProductionAutoMode = () =>
	process.env.CONTEXT === 'production' &&
	process.env.SOCIAL_PUBLISH_MODE === 'auto' &&
	process.env.SOCIAL_PUBLISH_ENABLED === 'true' &&
	(process.env.URL ?? SOCIAL_CANONICAL_ORIGIN).replace(/\/$/, '') === SOCIAL_CANONICAL_ORIGIN;

export const fetchProductionManifest = async (): Promise<SocialManifest> => {
	const response = await fetch(`${SOCIAL_CANONICAL_ORIGIN}/social-manifest.json`, {
		headers: { accept: 'application/json' },
		cache: 'no-store',
	});
	if (!response.ok) throw new Error(`Production social manifest returned HTTP ${response.status}.`);
	const manifest = (await response.json()) as SocialManifest;
	if (manifest.canonicalHost !== SOCIAL_CANONICAL_ORIGIN || !Array.isArray(manifest.entries))
		throw new Error('Production social manifest failed canonical validation.');
	for (const entry of manifest.entries) validateManifestEntry(entry);
	return manifest;
};

export const validateManifestEntry = (entry: SocialManifestEntry) => {
	assertCanonicalSocialUrl(entry.canonicalUrl);
	if (!entry.slug || !Number.isInteger(entry.socialVersion) || entry.socialVersion < 1)
		throw new Error('Invalid social manifest identity.');
	if (entry.qualityTier === 'C' || entry.contentType === 'archive-project')
		throw new Error('Tier C/archive content cannot enter automatic social publishing.');
	for (const platform of Object.values(entry.platforms)) {
		assertCanonicalSocialUrl(platform.destinationUrl);
		for (const media of platform.media)
			assertCanonicalSocialUrl(media.url, process.env.SOCIAL_APPROVED_ASSET_ORIGIN);
	}
};

export const scheduledTime = (entry: SocialManifestEntry, platform: SocialPlatform) => {
	const liveDelay = new Date(entry.publishedAt).getTime() + SOCIAL_DEFAULT_DELAY_MS;
	const explicit = entry.publishAt ? new Date(entry.publishAt).getTime() : liveDelay;
	return Math.max(liveDelay, explicit) + platformStaggerMinutes[platform] * 60 * 1000;
};

export const payloadHash = (entry: SocialManifestEntry, platform: SocialPlatform) =>
	createHash('sha256')
		.update(
			JSON.stringify({
				id: `${platform}:${entry.slug}:v${entry.socialVersion}`,
				payload: entry.platforms[platform],
			}),
		)
		.digest('hex');

export const verifyPublishedResources = async (
	entry: SocialManifestEntry,
	platform: SocialPlatform,
) => {
	const urls = [entry.canonicalUrl, ...entry.platforms[platform].media.map((media) => media.url)];
	for (const url of urls) {
		assertCanonicalSocialUrl(url, process.env.SOCIAL_APPROVED_ASSET_ORIGIN);
		const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
		if (!response.ok)
			throw new Error(
				`Published resource returned HTTP ${response.status}: ${new URL(url).pathname}`,
			);
	}
};
