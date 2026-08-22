import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { buildPlatformCopy } from '../src/lib/social/copy.ts';
import { platformEligibility } from '../src/lib/social/eligibility.ts';
import { platformDimensions } from '../src/lib/social/config.ts';
import { socialPlatforms } from '../src/lib/social/types.ts';

const args = Object.fromEntries(
	process.argv.slice(2).map((value) => {
		const [key, ...rest] = value.replace(/^--/, '').split('=');
		return [key, rest.join('=') || true];
	}),
);
const requested =
	typeof args.slug === 'string'
		? [args.slug]
		: [
				'toronto-star-painted-popcorn-ceiling-removal-2017',
				'piano-stairs-kleinburg-renovation',
				'king-west-condo-bathroom-renovation',
				'popcorn-ceiling-removal-collector-room-toronto',
				'newmarket-condo-renovation-2017',
			];

const contentRoot = path.resolve('content/blog');
const files = fs.readdirSync(contentRoot).filter((name) => /\.mdx?$/.test(name));
const entries = files
	.map((name) => {
		const file = path.join(contentRoot, name);
		const source = fs.readFileSync(file, 'utf8');
		const frontmatter = source.match(/^---\s*([\s\S]*?)\s*---/)?.[1];
		return frontmatter ? { file, data: parse(frontmatter) } : null;
	})
	.filter(Boolean);

for (const slug of requested) {
	const found = entries.find((entry) => entry.data.slug === slug);
	if (!found) throw new Error(`Unknown Project Story slug: ${slug}`);
	const data = found.data;
	const social = data.social ?? {};
	const primaryService =
		data.primaryService ??
		(data.category === 'Stairs'
			? '/services/stairs'
			: data.category === 'Ceilings'
				? '/services/popcorn-removal'
				: String(data.title).toLowerCase().includes('bathroom')
					? '/services/bathrooms'
					: '/interior-renovations');
	const source = {
		slug,
		canonicalUrl: `https://strataline.ca/blog/${slug}`,
		title: data.title,
		description: data.description,
		location: data.location,
		primaryService,
		contentType:
			data.contentType ?? (data.type === 'case-study' ? 'project-story' : 'renovation-guide'),
		qualityTier: data.qualityTier ?? (data.mediaRich ? 'A' : 'B'),
		problems: data.problems ?? (data.challenge ? [data.challenge] : []),
		solutions: data.solutions ?? (data.solution ? [data.solution] : []),
		specialConditions: data.specialConditions ?? [],
		hook: social.hook,
		summary: social.summary,
		callToAction: social.callToAction,
		hashtags: social.hashtags ?? [],
		overrides: social.overrides ?? {},
	};
	const previews = {};
	for (const platform of socialPlatforms) {
		const copy = buildPlatformCopy(source, platform);
		const overrideMedia = social.overrides?.[platform]?.media;
		const selected = overrideMedia
			? Array.isArray(overrideMedia)
				? overrideMedia
				: [overrideMedia]
			: platform === 'instagram' && social.media?.carousel?.length
				? social.media.carousel
				: platform === 'pinterest' && social.media?.pinterest
					? [social.media.pinterest]
					: social.media?.hero
						? [social.media.hero]
						: (social.media?.carousel ?? []).slice(0, 1);
		const media = selected.slice(0, platform === 'instagram' ? 7 : 1).map((item, index) => ({
			source: path.relative(process.cwd(), path.resolve(path.dirname(found.file), item.image)),
			approved:
				item.socialApproved === true &&
				(!item.peopleVisible || item.peopleApproved === true) &&
				(item.rights !== 'third-party' || item.thirdPartySocialUseApproved === true),
			rights: item.rights,
			derivative: `social/${slug}/${platform}-${index === 0 ? 'hero' : String(index + 1).padStart(2, '0')}.jpg`,
			dimensions: platformDimensions[platform],
			fit: item.socialFit ?? 'contain',
		}));
		const eligibility = platformEligibility(source, platform, social.linkedinEligible === true);
		if (!media.length || media.some((item) => !item.approved))
			eligibility.reasons.push('Approved social media selection is incomplete.');
		eligibility.eligible = eligibility.reasons.length === 0;
		previews[platform] = {
			configuredForArticle: social.platforms?.[platform] !== false,
			readyForAutomaticQueue:
				social.enabled === true && social.ready === true && eligibility.eligible,
			eligibility,
			copy: copy.copy,
			title: copy.title,
			destinationUrl: copy.destinationUrl,
			media,
		};
	}
	console.log(
		JSON.stringify(
			{
				slug,
				mode: 'preview',
				liveApiCalls: false,
				socialVersion: social.version ?? null,
				readiness: { enabled: social.enabled === true, ready: social.ready === true },
				previews,
			},
			null,
			2,
		),
	);
}
