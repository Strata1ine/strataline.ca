import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

if (!process.argv.includes('--dry-run')) {
	throw new Error('Archive backfill is intentionally dry-run only. Pass --dry-run.');
}
const root = path.resolve('content/blog');
const entries = fs
	.readdirSync(root)
	.filter((name) => /\.mdx?$/.test(name))
	.map((name) => {
		const source = fs.readFileSync(path.join(root, name), 'utf8');
		const frontmatter = source.match(/^---\s*([\s\S]*?)\s*---/)?.[1];
		return frontmatter ? parse(frontmatter) : null;
	})
	.filter(
		(data) =>
			data &&
			!data.draft &&
			data.indexable !== false &&
			data.type === 'case-study' &&
			data.qualityTier !== 'C' &&
			data.contentType !== 'archive-project',
	)
	.map((data) => ({
		slug: data.slug,
		tier: data.qualityTier ?? (data.mediaRich ? 'A' : 'B'),
		service: data.primaryService ?? data.category,
		mediaStrength:
			(data.gallery?.length ?? 0) +
			(data.contentBlocks?.filter((block) => /image|gallery|before-after/.test(block.type))
				.length ?? 0),
		searchPriority: /stair|popcorn/i.test(`${data.slug} ${data.category}`) ? 2 : 0,
		distinctivePriority: /condo|bathroom/i.test(`${data.slug} ${data.category}`) ? 1 : 0,
	}))
	.sort(
		(a, b) =>
			Number(b.tier === 'A') - Number(a.tier === 'A') ||
			b.searchPriority - a.searchPriority ||
			b.distinctivePriority - a.distinctivePriority ||
			b.mediaStrength - a.mediaStrength ||
			a.slug.localeCompare(b.slug),
	);

const plan = [];
const lastServices = [];
for (const entry of entries) {
	if (plan.length >= 12) break;
	if (lastServices.at(-1) === entry.service) continue;
	plan.push({
		week: Math.floor(plan.length / 3) + 1,
		slot: (plan.length % 3) + 1,
		...entry,
		maximum: 'One backfill item per platform that day',
	});
	lastServices.push(entry.service);
}
console.log(
	JSON.stringify(
		{
			mode: 'dry-run',
			enabled: false,
			timeZone: 'America/Toronto',
			policy: {
				projectsPerWeek: 3,
				perPlatformPerDay: 1,
				tierCExcluded: true,
				serviceRotation: true,
			},
			plan,
		},
		null,
		2,
	),
);
