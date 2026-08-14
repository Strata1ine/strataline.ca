import { getStore } from '@netlify/blobs';
import type { APIRoute } from 'astro';

import {
	CONTACT_ATTACHMENT_STORE,
	attachmentDisposition,
	isContactAttachmentMetadata,
} from '../../../lib/server/contactAttachments.ts';

export const prerender = false;

const privateHeaders = {
	'Cache-Control': 'private, no-store, max-age=0',
	'Content-Security-Policy': "default-src 'none'; sandbox",
	'X-Content-Type-Options': 'nosniff',
	'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

export const GET: APIRoute = async ({ params }) => {
	const token = params.token ?? '';
	if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
		return new Response('Attachment not found.', { status: 404, headers: privateHeaders });
	}

	const stored = await getStore(CONTACT_ATTACHMENT_STORE).getWithMetadata(token, {
		type: 'blob',
		consistency: 'strong',
	});
	if (!stored || !isContactAttachmentMetadata(stored.metadata)) {
		return new Response('Attachment not found.', { status: 404, headers: privateHeaders });
	}

	return new Response(stored.data, {
		status: 200,
		headers: {
			...privateHeaders,
			'Content-Type': stored.metadata.contentType,
			'Content-Length': String(stored.metadata.size),
			'Content-Disposition': attachmentDisposition(stored.metadata.filename),
		},
	});
};
