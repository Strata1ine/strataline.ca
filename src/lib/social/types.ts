export const socialPlatforms = [
	'googleBusiness',
	'facebook',
	'instagram',
	'linkedin',
	'pinterest',
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];
export type SocialStatus =
	| 'pending'
	| 'scheduled'
	| 'publishing'
	| 'published'
	| 'failed'
	| 'skipped'
	| 'not-configured';
export type SocialErrorClass =
	| 'configuration'
	| 'authentication'
	| 'rate-limit'
	| 'invalid-media'
	| 'invalid-content'
	| 'transient-server'
	| 'permanent-rejection';

export interface SocialMediaAsset {
	url: string;
	filename: string;
	alt: string;
	width: number;
	height: number;
	rights: 'owned' | 'licensed' | 'third-party';
	socialApproved: boolean;
	peopleVisible: boolean;
	peopleApproved: boolean;
	thirdPartySocialUseApproved: boolean;
	socialFit: 'contain' | 'cover';
	focalPoint?: { x: number; y: number };
	background?: string;
}

export interface PlatformManifest {
	enabled: boolean;
	copy: string;
	title?: string;
	description?: string;
	board?: string;
	destinationUrl: string;
	media: SocialMediaAsset[];
	eligibility: { eligible: boolean; reasons: string[] };
}

export interface SocialManifestEntry {
	slug: string;
	canonicalUrl: string;
	contentType: 'project-story' | 'renovation-guide' | 'archive-project';
	qualityTier: 'A' | 'B' | 'C';
	socialVersion: number;
	publishedAt: string;
	publishAt: string | null;
	campaign: string;
	title: string;
	description: string;
	location?: string;
	primaryService: string;
	problems: string[];
	solutions: string[];
	specialConditions: string[];
	hero: SocialMediaAsset | null;
	carousel: SocialMediaAsset[];
	platforms: Record<SocialPlatform, PlatformManifest>;
}

export interface SocialManifest {
	generatedAt: string;
	mode: 'manifest';
	canonicalHost: 'https://strataline.ca';
	entries: SocialManifestEntry[];
}

export interface ConfigurationResult {
	configured: boolean;
	missing: string[];
}

export interface SocialPreview {
	platform: SocialPlatform;
	copy: string;
	title?: string;
	description?: string;
	board?: string;
	destinationUrl: string;
	media: SocialMediaAsset[];
}

export interface PublishResult {
	platformPostId: string;
	platformPostUrl?: string;
	destinationUrl: string;
}

export interface SocialPlatformAdapter {
	validateConfiguration(): Promise<ConfigurationResult>;
	buildPreview(entry: SocialManifestEntry): Promise<SocialPreview>;
	publish(entry: SocialManifestEntry): Promise<PublishResult>;
}

export interface SocialPublicationRecord {
	idempotencyKey: string;
	status: SocialStatus;
	payloadHash: string;
	attemptCount: number;
	platformPostId?: string;
	platformPostUrl?: string;
	destinationUrl: string;
	queuedAt: string;
	publishedAt?: string;
	lastError?: { class: SocialErrorClass; message: string };
	retryAt?: string;
	updatedAt: string;
}
