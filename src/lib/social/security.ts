import { createHmac, timingSafeEqual } from 'node:crypto';
import { SOCIAL_CANONICAL_ORIGIN } from './config.ts';

export const assertCanonicalSocialUrl = (value: string, approvedAssetOrigin?: string) => {
	const url = new URL(value);
	const approved = [SOCIAL_CANONICAL_ORIGIN, approvedAssetOrigin].filter(Boolean);
	if (!approved.includes(url.origin)) throw new Error('Unapproved social URL origin.');
	return url;
};

export const createSocialSignature = (secret: string, timestamp: string, body: string) =>
	createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');

export const verifySocialSignature = (
	secret: string,
	timestamp: string | null,
	body: string,
	signature: string | null,
) => {
	if (!timestamp || !signature || Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000)
		return false;
	const expected = createSocialSignature(secret, timestamp, body);
	if (expected.length !== signature.length) return false;
	return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};
