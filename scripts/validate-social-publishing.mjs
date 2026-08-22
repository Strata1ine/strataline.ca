import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const root = path.resolve('content/blog');
const errors = [];
const warnings = [];
const keys = new Set();
const supportedPlatforms = ['googleBusiness', 'facebook', 'instagram', 'linkedin', 'pinterest'];
const forbiddenCopy =
	/(?:[A-Za-z]:\\|file:\/\/|client[_-]?secret|access[_-]?token|refresh[_-]?token)/i;

for (const name of fs.readdirSync(root).filter((value) => /\.mdx?$/.test(value))) {
	const file = path.join(root, name);
	const source = fs.readFileSync(file, 'utf8');
	const frontmatter = source.match(/^---\s*([\s\S]*?)\s*---/)?.[1];
	if (!frontmatter) continue;
	const data = parse(frontmatter);
	const social = data.social;
	if (!social) continue;
	if (!Number.isInteger(social.version) || social.version < 1)
		errors.push(`${name}: social.version must be a positive integer`);
	if (social.ready && !social.enabled) errors.push(`${name}: social.ready requires social.enabled`);
	if (social.ready && (data.draft || data.indexable === false))
		errors.push(`${name}: drafts/non-indexable content cannot be social-ready`);
	if (social.ready && (data.qualityTier === 'C' || data.contentType === 'archive-project'))
		errors.push(`${name}: Tier C/archive entries cannot be automatic-social ready`);
	const textValues = [
		social.hook,
		social.summary,
		social.callToAction,
		...Object.values(social.overrides ?? {}).flatMap((value) =>
			value
				? [
						value.summary,
						value.copy,
						value.caption,
						value.commentary,
						value.title,
						value.description,
					]
				: [],
		),
	].filter(Boolean);
	if (textValues.some((value) => forbiddenCopy.test(String(value))))
		errors.push(`${name}: social copy contains a local path or secret-like value`);
	const selected = [
		social.media?.hero,
		...(social.media?.carousel ?? []),
		social.media?.pinterest,
		...Object.values(social.overrides ?? {}).flatMap((value) =>
			!value?.media ? [] : Array.isArray(value.media) ? value.media : [value.media],
		),
	].filter(Boolean);
	for (const media of selected) {
		const resolved = path.resolve(path.dirname(file), media.image);
		if (!fs.existsSync(resolved))
			errors.push(`${name}: selected social media not found: ${media.image}`);
		if (!media.rights) errors.push(`${name}: social media lacks rights metadata: ${media.image}`);
		if (media.socialApproved !== true)
			errors.push(`${name}: selected media is not socialApproved: ${media.image}`);
		if (media.peopleVisible && !media.peopleApproved)
			errors.push(`${name}: people are visible without peopleApproved: ${media.image}`);
		if (media.rights === 'third-party' && !media.thirdPartySocialUseApproved)
			errors.push(`${name}: third-party media lacks social authorization: ${media.image}`);
	}
	if (social.ready && !selected.length)
		errors.push(`${name}: social-ready content requires approved media`);
	if (
		social.ready &&
		/toronto-star/.test(data.slug) &&
		selected.some((media) => /article|banner|clipping/i.test(media.image))
	)
		errors.push(`${name}: Toronto Star editorial artwork cannot enter automatic social publishing`);
	for (const platform of supportedPlatforms) {
		if (social.platforms?.[platform] === undefined)
			errors.push(`${name}: destination platform has no explicit toggle: ${platform}`);
		if (social.enabled && social.ready && social.platforms?.[platform]) {
			const key = `${platform}:${data.slug}:v${social.version}`;
			if (keys.has(key)) errors.push(`${name}: duplicate idempotency key ${key}`);
			keys.add(key);
		}
	}
	if (social.enabled && !social.ready)
		warnings.push(`${name}: preview configured; readiness gate remains closed`);
}

const manifest = fs.readFileSync(path.resolve('src/pages/social-manifest.json.ts'), 'utf8');
if (/(?:CLIENT_SECRET|ACCESS_TOKEN|REFRESH_TOKEN|DISPATCH_SECRET)/.test(manifest))
	errors.push('public social manifest source references secret environment variables');
for (const platform of supportedPlatforms)
	if (
		!fs.existsSync(
			path.resolve(
				'src/lib/social/platforms',
				platform === 'googleBusiness' ? 'google-business.ts' : `${platform}.ts`,
			),
		)
	)
		errors.push(`missing payload builder/adapter for ${platform}`);

if (warnings.length) console.warn(warnings.map((warning) => `WARN: ${warning}`).join('\n'));
if (errors.length) {
	console.error(errors.map((error) => `ERROR: ${error}`).join('\n'));
	process.exit(1);
}
console.log(
	`Social publishing validation passed with ${keys.size} automatic idempotency keys; credentials were not required.`,
);
