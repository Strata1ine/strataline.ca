import { buildSocialDestinationUrl } from './utm.ts';
import type { SocialManifestEntry, SocialPlatform } from './types.ts';

export interface SocialCopySource {
	slug: string;
	canonicalUrl: string;
	title: string;
	description: string;
	location?: string;
	primaryService: string;
	contentType: SocialManifestEntry['contentType'];
	qualityTier: SocialManifestEntry['qualityTier'];
	problems: string[];
	solutions: string[];
	specialConditions: string[];
	hook?: string;
	summary?: string;
	callToAction?: string;
	hashtags?: string[];
	overrides?: Record<string, Record<string, unknown> | undefined>;
}

const clean = (value?: string) => value?.trim();
const first = (values: string[], fallback: string) => clean(values[0]) ?? fallback;
const serviceLabel = (path: string) =>
	path
		.split('/')
		.filter(Boolean)
		.at(-1)
		?.replaceAll('_', ' ')
		.replaceAll('-', ' ')
		.replace(/\b\w/g, (character) => character.toUpperCase()) ?? 'Interior Renovation';
const locationLine = (source: SocialCopySource) =>
	source.location
		? `${serviceLabel(source.primaryService)} · ${source.location}`
		: serviceLabel(source.primaryService);
const tags = (source: SocialCopySource) =>
	(source.hashtags ?? [])
		.map((tag) => `#${tag.replace(/^#/, '').replace(/\s+/g, '')}`)
		.filter(Boolean)
		.slice(0, 8)
		.join(' ');

export const buildPlatformCopy = (source: SocialCopySource, platform: SocialPlatform) => {
	const destinationUrl = buildSocialDestinationUrl(source.canonicalUrl, platform, source.slug);
	const problem = first(source.problems, source.description);
	const solution = first(
		source.solutions,
		'The work was planned around the verified conditions in the home.',
	);
	const hook = clean(source.hook) ?? source.title;
	const cta = clean(source.callToAction) ?? 'See the full project story and photographs.';
	const override = source.overrides?.[platform] ?? {};

	if (platform === 'googleBusiness') {
		return {
			copy:
				clean(override.summary as string) ??
				`${locationLine(source).toUpperCase()}\n\n${problem}\n\n${cta}`,
			destinationUrl,
		};
	}
	if (platform === 'facebook') {
		return {
			copy:
				clean(override.copy as string) ??
				`${hook}\n\nThis ${locationLine(source).toLowerCase()} began with ${problem.charAt(0).toLowerCase() + problem.slice(1)} The completed approach: ${solution}\n\n${cta}\n${destinationUrl}`,
			destinationUrl,
		};
	}
	if (platform === 'instagram') {
		const hashtagLine = tags(source);
		return {
			copy:
				clean(override.caption as string) ??
				[
					hook,
					locationLine(source),
					`The starting point: ${problem}`,
					`The approach: ${solution}`,
					'Planning lesson: define the existing conditions and connected finish work before the scope is finalized.',
					cta,
					hashtagLine,
				]
					.filter(Boolean)
					.join('\n\n'),
			destinationUrl,
		};
	}
	if (platform === 'linkedin') {
		const angle = first(
			source.specialConditions,
			first(source.problems, 'coordinating the existing conditions and finish sequence'),
		);
		return {
			copy:
				clean(override.commentary as string) ??
				`${source.title}\n\nThis Strataline project shows why ${angle.charAt(0).toLowerCase() + angle.slice(1)} matters during renovation planning. The response was ${solution.charAt(0).toLowerCase() + solution.slice(1)}\n\nThe complete project story documents the scope, sequencing and finished result.\n${destinationUrl}`,
			destinationUrl,
		};
	}
	return {
		copy:
			clean(override.description as string) ??
			`${source.description} ${source.location ? `Completed in ${source.location}. ` : ''}See the project conditions, renovation decisions and finished result.`,
		title: clean(override.title as string) ?? source.title.slice(0, 100),
		destinationUrl,
	};
};
