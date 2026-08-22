import { platformApiVersions } from '../config.ts';
import { responseJson } from './adapter-utils.ts';

export const metaEndpoint = (path: string) =>
	`https://graph.facebook.com/${platformApiVersions.metaGraph}/${path.replace(/^\//, '')}`;

export const metaPost = async (path: string, values: Record<string, string>) => {
	const token = process.env.META_ACCESS_TOKEN;
	if (!token) throw new Error('Meta adapter is not configured.');
	const body = new URLSearchParams({ ...values, access_token: token });
	return responseJson(
		await fetch(metaEndpoint(path), {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body,
		}),
	);
};
