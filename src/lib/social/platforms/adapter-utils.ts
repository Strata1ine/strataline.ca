import type {
	ConfigurationResult,
	SocialErrorClass,
	SocialManifestEntry,
	SocialPlatform,
} from '../types.ts';

export class SocialPublishError extends Error {
	classification: SocialErrorClass;
	transient: boolean;

	constructor(message: string, classification: SocialErrorClass, transient = false) {
		super(message);
		this.classification = classification;
		this.transient = transient;
	}
}

export const configuration = (names: string[]): ConfigurationResult => {
	const missing = names.filter((name) => !process.env[name]);
	return { configured: missing.length === 0, missing };
};

export const platformPreview = (entry: SocialManifestEntry, platform: SocialPlatform) => {
	const value = entry.platforms[platform];
	return {
		platform,
		copy: value.copy,
		title: value.title,
		description: value.description,
		board: value.board,
		destinationUrl: value.destinationUrl,
		media: value.media,
	};
};

export const responseJson = async (response: Response) => {
	const text = await response.text();
	let value: unknown = text;
	try {
		value = text ? JSON.parse(text) : {};
	} catch {}
	if (!response.ok) {
		const classification: SocialErrorClass =
			response.status === 401 || response.status === 403
				? 'authentication'
				: response.status === 429
					? 'rate-limit'
					: response.status >= 500
						? 'transient-server'
						: response.status === 400
							? 'invalid-content'
							: 'permanent-rejection';
		throw new SocialPublishError(
			`Platform request failed with HTTP ${response.status}.`,
			classification,
			response.status === 429 || response.status >= 500,
		);
	}
	return value as Record<string, unknown>;
};
