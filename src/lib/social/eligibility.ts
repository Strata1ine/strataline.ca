import type { SocialManifestEntry, SocialMediaAsset, SocialPlatform } from './types.ts';

export const isApprovedSocialMedia = (media: SocialMediaAsset) =>
	media.socialApproved &&
	(!media.peopleVisible || media.peopleApproved) &&
	(media.rights !== 'third-party' || media.thirdPartySocialUseApproved);

export const platformEligibility = (
	entry: Pick<
		SocialManifestEntry,
		'contentType' | 'qualityTier' | 'problems' | 'solutions' | 'specialConditions'
	>,
	platform: SocialPlatform,
	linkedinEligible = false,
) => {
	const reasons: string[] = [];
	if (entry.qualityTier === 'C' || entry.contentType === 'archive-project')
		reasons.push('Tier C/archive entries require controlled manual backfill.');
	if (
		platform === 'linkedin' &&
		entry.qualityTier === 'B' &&
		!linkedinEligible &&
		![...entry.problems, ...entry.solutions, ...entry.specialConditions].some((value) =>
			/planning|logistics|sequencing|technical|occupied|condo|coordination/i.test(value),
		)
	)
		reasons.push('Tier B LinkedIn requires a verified professional or technical angle.');
	return { eligible: reasons.length === 0, reasons };
};
