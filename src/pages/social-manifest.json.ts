import type { APIRoute, ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { getPublishedBlogPosts } from '@/data/blog';
import { buildPlatformCopy } from '@/lib/social/copy';
import { isApprovedSocialMedia, platformEligibility } from '@/lib/social/eligibility';
import { platformDimensions, SOCIAL_CANONICAL_ORIGIN } from '@/lib/social/config';
import {
	getContentType,
	getPrimaryService,
	getProblemTags,
	getQualityTier,
} from '@/data/projectsGuides';
import {
	socialPlatforms,
	type SocialManifest,
	type SocialMediaAsset,
	type SocialPlatform,
} from '@/lib/social/types';

export const prerender = true;

type SocialSelection = {
	image: ImageMetadata;
	alt?: string;
	rights: 'owned' | 'licensed' | 'third-party';
	socialApproved: boolean;
	peopleVisible: boolean;
	peopleApproved: boolean;
	thirdPartySocialUseApproved: boolean;
	focalPoint?: { x: number; y: number };
	socialFit: 'contain' | 'cover';
	background?: string;
};

const mediaForPlatform = (
	social: NonNullable<Awaited<ReturnType<typeof getPublishedBlogPosts>>[number]['data']['social']>,
	platform: SocialPlatform,
) => {
	const override = social.overrides[platform]?.media;
	if (override) return Array.isArray(override) ? override : [override];
	if (platform === 'instagram' && social.media.carousel.length)
		return social.media.carousel.slice(0, 7);
	if (platform === 'pinterest' && social.media.pinterest) return [social.media.pinterest];
	return social.media.hero ? [social.media.hero] : social.media.carousel.slice(0, 1);
};

const renderMedia = async (
	selection: SocialSelection,
	platform: SocialPlatform,
	slug: string,
	index: number,
): Promise<SocialMediaAsset> => {
	const dimensions = platformDimensions[platform];
	const image = await getImage({
		src: selection.image,
		width: dimensions.width,
		height: dimensions.height,
		fit: selection.socialFit ?? dimensions.fit,
		format: 'jpg',
		quality: 88,
	});
	const role = index === 0 ? 'hero' : String(index + 1).padStart(2, '0');
	return {
		url: `${SOCIAL_CANONICAL_ORIGIN}${image.src}`,
		filename: `social/${slug}/${platform}-${role}.jpg`,
		alt: selection.alt ?? '',
		width: image.attributes.width,
		height: image.attributes.height,
		rights: selection.rights,
		socialApproved: selection.socialApproved,
		peopleVisible: selection.peopleVisible,
		peopleApproved: selection.peopleApproved,
		thirdPartySocialUseApproved: selection.thirdPartySocialUseApproved,
		socialFit: selection.socialFit,
		focalPoint: selection.focalPoint,
		background: selection.background,
	};
};

export const GET: APIRoute = async () => {
	const posts = await getPublishedBlogPosts();
	const entries = await Promise.all(
		posts
			.filter((post) => post.data.social?.enabled && post.data.social.ready)
			.map(async (post) => {
				const social = post.data.social!;
				const canonicalUrl = `${SOCIAL_CANONICAL_ORIGIN}/blog/${post.data.slug}`;
				const contentType = getContentType(post);
				const qualityTier = getQualityTier(post);
				const problems = post.data.problems.length
					? post.data.problems
					: post.data.challenge
						? [post.data.challenge]
						: getProblemTags(post);
				const solutions = post.data.solutions.length
					? post.data.solutions
					: post.data.solution
						? [post.data.solution]
						: [];
				const source = {
					slug: post.data.slug,
					canonicalUrl,
					title: post.data.title,
					description: post.data.description,
					location: post.data.location,
					primaryService: getPrimaryService(post),
					contentType,
					qualityTier,
					problems,
					solutions,
					specialConditions: post.data.specialConditions,
					hook: social.hook,
					summary: social.summary,
					callToAction: social.callToAction,
					hashtags: social.hashtags,
					overrides: social.overrides,
				};
				const platforms = Object.fromEntries(
					await Promise.all(
						socialPlatforms.map(async (platform) => {
							const selected = mediaForPlatform(social, platform);
							const media = await Promise.all(
								selected.map((item, index) => renderMedia(item, platform, post.data.slug, index)),
							);
							const eligibility = platformEligibility(source, platform, social.linkedinEligible);
							if (!media.length)
								eligibility.reasons.push('No explicitly approved social media was selected.');
							if (media.some((item) => !isApprovedSocialMedia(item)))
								eligibility.reasons.push(
									'Selected media does not pass rights, privacy and social-approval rules.',
								);
							eligibility.eligible = eligibility.reasons.length === 0;
							const copy = buildPlatformCopy(source, platform);
							return [
								platform,
								{
									enabled: social.platforms[platform],
									copy: copy.copy,
									title: copy.title,
									description: platform === 'pinterest' ? copy.copy : undefined,
									board: social.overrides.pinterest?.board,
									destinationUrl: copy.destinationUrl,
									media: media.filter(isApprovedSocialMedia),
									eligibility,
								},
							];
						}),
					),
				);
				const genericHero = social.media.hero
					? await renderMedia(social.media.hero, 'googleBusiness', post.data.slug, 0)
					: null;
				const carousel = await Promise.all(
					social.media.carousel.map((item, index) =>
						renderMedia(item, 'instagram', post.data.slug, index),
					),
				);
				return {
					slug: post.data.slug,
					canonicalUrl,
					contentType,
					qualityTier,
					socialVersion: social.version,
					publishedAt: post.data.publishedDate.toISOString(),
					publishAt: social.publishAt?.toISOString() ?? null,
					campaign: social.campaign,
					title: post.data.title,
					description: post.data.description,
					location: post.data.location,
					primaryService: getPrimaryService(post),
					problems,
					solutions,
					specialConditions: post.data.specialConditions,
					hero: genericHero && isApprovedSocialMedia(genericHero) ? genericHero : null,
					carousel: carousel.filter(isApprovedSocialMedia),
					platforms,
				};
			}),
	);
	const manifest: SocialManifest = {
		generatedAt: new Date().toISOString(),
		mode: 'manifest',
		canonicalHost: SOCIAL_CANONICAL_ORIGIN,
		entries: entries.filter(
			(entry) => entry.qualityTier !== 'C' && entry.contentType !== 'archive-project',
		),
	};
	return new Response(JSON.stringify(manifest, null, 2), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'public, max-age=0, must-revalidate',
			'x-content-type-options': 'nosniff',
		},
	});
};
