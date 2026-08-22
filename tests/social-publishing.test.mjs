import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPlatformCopy } from '../src/lib/social/copy.ts';
import { backfillPolicy } from '../src/lib/social/config.ts';
import { isApprovedSocialMedia, platformEligibility } from '../src/lib/social/eligibility.ts';
import { configuration, platformPreview } from '../src/lib/social/platforms/adapter-utils.ts';
import { isProductionAutoMode } from '../src/lib/social/runtime.ts';
import { postStateKey } from '../src/lib/social/state.ts';
import { assertCanonicalSocialUrl } from '../src/lib/social/security.ts';
import { socialPlatforms } from '../src/lib/social/types.ts';

const source = {
	slug: 'test-project',
	canonicalUrl: 'https://strataline.ca/blog/test-project',
	title: 'A Technical Toronto Stair Project',
	description: 'A documented renovation with a strong destination page.',
	location: 'Toronto',
	primaryService: '/services/stairs',
	contentType: 'project-story',
	qualityTier: 'A',
	problems: ['Occupied-home logistics'],
	solutions: ['Sequenced stair and railing work'],
	specialConditions: ['Occupied-home protection'],
	hashtags: ['StairRenovation'],
};

test('Tier A Project Story is eligible for all destinations', () => {
	for (const platform of socialPlatforms)
		assert.equal(platformEligibility(source, platform).eligible, true);
});

test('Tier B LinkedIn requires a professional angle', () => {
	const simple = {
		...source,
		qualityTier: 'B',
		problems: [],
		solutions: [],
		specialConditions: [],
	};
	assert.equal(platformEligibility(simple, 'linkedin', false).eligible, false);
	assert.equal(platformEligibility(simple, 'linkedin', true).eligible, true);
	assert.equal(platformEligibility(simple, 'facebook', false).eligible, true);
});

test('Renovation Guide with a strong page remains eligible', () => {
	assert.equal(
		platformEligibility({ ...source, contentType: 'renovation-guide' }, 'pinterest').eligible,
		true,
	);
});

test('Tier C/archive entries cannot auto-publish', () => {
	assert.equal(platformEligibility({ ...source, qualityTier: 'C' }, 'facebook').eligible, false);
});

test('ordinary edits retain the same idempotency key while version increments change it', () => {
	assert.equal(
		postStateKey('instagram', source.slug, 1),
		postStateKey('instagram', source.slug, 1),
	);
	assert.notEqual(
		postStateKey('instagram', source.slug, 1),
		postStateKey('instagram', source.slug, 2),
	);
});

test('missing credentials disable only the affected adapter configuration', () => {
	const previous = process.env.TEST_PLATFORM_TOKEN;
	delete process.env.TEST_PLATFORM_TOKEN;
	assert.deepEqual(configuration(['TEST_PLATFORM_TOKEN']), {
		configured: false,
		missing: ['TEST_PLATFORM_TOKEN'],
	});
	if (previous) process.env.TEST_PLATFORM_TOKEN = previous;
});

test('platform failure can be isolated with allSettled', async () => {
	const result = await Promise.allSettled([
		Promise.resolve('facebook'),
		Promise.reject(new Error('instagram')),
	]);
	assert.equal(result[0].status, 'fulfilled');
	assert.equal(result[1].status, 'rejected');
});

test('duplicate key is deterministic for overlapping scheduled invocations', () => {
	const one = postStateKey('pinterest', 'same-slug', 3);
	const two = postStateKey('pinterest', 'same-slug', 3);
	assert.equal(one, two);
});

test('invalid external media origin is rejected', () => {
	assert.throws(() => assertCanonicalSocialUrl('https://example.com/image.jpg'));
});

test('third-party media requires explicit social authorization', () => {
	const media = {
		rights: 'third-party',
		socialApproved: true,
		peopleVisible: false,
		peopleApproved: false,
		thirdPartySocialUseApproved: false,
	};
	assert.equal(isApprovedSocialMedia(media), false);
	assert.equal(isApprovedSocialMedia({ ...media, thirdPartySocialUseApproved: true }), true);
});

test('backfill pacing is bounded', () => {
	assert.equal(backfillPolicy.maxPerPlatformPerDay, 1);
	assert.equal(backfillPolicy.maxProjectsPerWeek, 3);
	assert.equal(backfillPolicy.enabledByDefault, false);
});

test('production auto mode requires every gate', () => {
	const old = {
		CONTEXT: process.env.CONTEXT,
		MODE: process.env.SOCIAL_PUBLISH_MODE,
		ENABLED: process.env.SOCIAL_PUBLISH_ENABLED,
		URL: process.env.URL,
	};
	Object.assign(process.env, {
		CONTEXT: 'deploy-preview',
		SOCIAL_PUBLISH_MODE: 'auto',
		SOCIAL_PUBLISH_ENABLED: 'true',
		URL: 'https://strataline.ca',
	});
	assert.equal(isProductionAutoMode(), false);
	process.env.CONTEXT = 'production';
	assert.equal(isProductionAutoMode(), true);
	for (const [key, value] of Object.entries(old))
		value === undefined
			? delete process.env[
					key === 'MODE'
						? 'SOCIAL_PUBLISH_MODE'
						: key === 'ENABLED'
							? 'SOCIAL_PUBLISH_ENABLED'
							: key
				]
			: (process.env[
					key === 'MODE'
						? 'SOCIAL_PUBLISH_MODE'
						: key === 'ENABLED'
							? 'SOCIAL_PUBLISH_ENABLED'
							: key
				] = value);
});

test('platform-specific templates are not identical and all contain tracked destinations', () => {
	const copies = socialPlatforms.map((platform) => buildPlatformCopy(source, platform).copy);
	assert.equal(new Set(copies).size, socialPlatforms.length);
	for (const platform of socialPlatforms)
		assert.match(buildPlatformCopy(source, platform).destinationUrl, /utm_medium=social/);
});

test('Pinterest board override survives manifest-to-preview payload construction', () => {
	const preview = platformPreview(
		{
			platforms: {
				pinterest: {
					copy: 'Pin copy',
					board: 'approved-board-id',
					destinationUrl: 'https://strataline.ca/blog/test-project',
					media: [],
				},
			},
		},
		'pinterest',
	);
	assert.equal(preview.board, 'approved-board-id');
});
