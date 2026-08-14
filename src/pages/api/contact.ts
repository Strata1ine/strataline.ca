import { getStore, type Store } from '@netlify/blobs';
import type { APIRoute } from 'astro';

import {
	CONTACT_ATTACHMENT_FIELD,
	CONTACT_ATTACHMENT_MAX_FILES,
	CONTACT_ATTACHMENT_MAX_REQUEST_BYTES,
	CONTACT_ATTACHMENT_MAX_TOTAL_BYTES,
	CONTACT_ATTACHMENT_STORE,
	ContactAttachmentError,
	createLeadReference,
	storeContactAttachment,
	type StoredContactAttachment,
	type ValidatedContactAttachment,
	validateContactAttachment,
} from '../../lib/server/contactAttachments.ts';

export const prerender = false;

const FORMSPARK_ENDPOINT =
	process.env.FORMSPARK_ENDPOINT?.trim() || 'https://submit-form.com/jReRE2JLR';
const SUCCESS_REDIRECT = 'https://strataline.ca/submissions/talk';
const MAX_STANDARD_FIELD_LENGTH = 500;

export interface ContactSubmissionDependencies {
	getAttachmentStore: () => Store;
	relay: typeof fetch;
	formsparkEndpoint: string;
}

const DEFAULT_DEPENDENCIES: ContactSubmissionDependencies = {
	getAttachmentStore: () => getStore(CONTACT_ATTACHMENT_STORE),
	relay: fetch,
	formsparkEndpoint: FORMSPARK_ENDPOINT,
};

const REQUIRED_FIELDS = [
	'Project Type',
	'Property City',
	'Occupancy',
	'Preferred Start Window',
	'Approximate Budget',
	'Name',
	'Email',
	'Project Details',
] as const;

const RELAY_FIELDS = [
	'_redirect',
	'Contact Form Source',
	'Project Type',
	'Property City',
	'Occupancy',
	'Preferred Start Window',
	'Approximate Budget',
	'Name',
	'Email',
	'Phone',
	'Property Address',
	'Project Details',
] as const;

const getText = (formData: FormData, name: string) => {
	const value = formData.get(name);
	return typeof value === 'string' ? value.trim() : '';
};

const wantsJson = (request: Request) => request.headers.get('accept')?.includes('application/json');

const errorResponse = (request: Request, message: string, status = 400) =>
	new Response(wantsJson(request) ? JSON.stringify({ ok: false, error: message }) : message, {
		status,
		headers: {
			'Content-Type': wantsJson(request)
				? 'application/json; charset=utf-8'
				: 'text/plain; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});

const successResponse = (request: Request, redirectUrl: string, attachmentCount: number) => {
	if (!wantsJson(request)) {
		return Response.redirect(redirectUrl, 303);
	}
	return Response.json({ ok: true, attachmentCount }, { headers: { 'Cache-Control': 'no-store' } });
};

const cleanupStoredAttachments = async (store: Store, tokens: string[]) => {
	if (!tokens.length) return true;
	const results = await Promise.allSettled(tokens.map((token) => store.delete(token)));
	return results.every((result) => result.status === 'fulfilled');
};

export const handleContactSubmission = async (
	request: Request,
	url: URL,
	dependencies: ContactSubmissionDependencies = DEFAULT_DEPENDENCIES,
) => {
	const origin = request.headers.get('origin');
	if (origin && origin !== url.origin) {
		return errorResponse(request, 'This form must be submitted from the Strataline website.', 403);
	}

	const contentLength = Number(request.headers.get('content-length') ?? 0);
	if (contentLength > CONTACT_ATTACHMENT_MAX_REQUEST_BYTES) {
		return errorResponse(
			request,
			'The selected files are larger than the 4 MB total upload limit. Remove a file and try again.',
			413,
		);
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return errorResponse(request, 'The form data could not be read. Please try again.', 400);
	}

	if (getText(formData, 'Company Website')) {
		return successResponse(request, SUCCESS_REDIRECT, 0);
	}

	for (const field of REQUIRED_FIELDS) {
		if (!getText(formData, field)) {
			return errorResponse(request, 'Please complete all required form fields before submitting.');
		}
	}
	const email = getText(formData, 'Email');
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return errorResponse(request, 'Enter a valid email address before submitting.');
	}
	for (const field of RELAY_FIELDS) {
		if (field === 'Project Details' || field === '_redirect') continue;
		if (getText(formData, field).length > MAX_STANDARD_FIELD_LENGTH) {
			return errorResponse(
				request,
				'One of the form fields is too long. Please shorten it and try again.',
			);
		}
	}
	if (getText(formData, 'Project Details').length > 10_000) {
		return errorResponse(
			request,
			'The project description is too long. Please shorten it and try again.',
		);
	}

	const files = formData
		.getAll(CONTACT_ATTACHMENT_FIELD)
		.filter(
			(value): value is File => value instanceof File && (value.name !== '' || value.size > 0),
		);
	if (files.length > CONTACT_ATTACHMENT_MAX_FILES) {
		return errorResponse(request, 'Attach no more than 10 files at a time.');
	}
	const totalBytes = files.reduce((total, file) => total + file.size, 0);
	if (totalBytes > CONTACT_ATTACHMENT_MAX_TOTAL_BYTES) {
		return errorResponse(
			request,
			'The selected files are larger than the 4 MB total upload limit. Remove a file and try again.',
			413,
		);
	}

	let validatedAttachments: ValidatedContactAttachment[];
	try {
		validatedAttachments = await Promise.all(files.map(validateContactAttachment));
	} catch (error) {
		if (error instanceof ContactAttachmentError) {
			return errorResponse(request, error.message, error.status);
		}
		return errorResponse(request, 'One of the selected files could not be validated.', 400);
	}

	const leadReference = createLeadReference();
	let store: Store | null = null;
	if (validatedAttachments.length) {
		try {
			store = dependencies.getAttachmentStore();
		} catch {
			return errorResponse(
				request,
				'File storage is temporarily unavailable. No files were retained. Please try again.',
				503,
			);
		}
	}
	const storedTokens: string[] = [];
	const productionOrigin =
		process.env.CONTEXT === 'production' ? 'https://strataline.ca' : url.origin;
	const attachmentOrigin = new URL(
		process.env.CONTACT_ATTACHMENT_BASE_URL?.trim() || productionOrigin,
	);

	try {
		const storedAttachments: StoredContactAttachment[] = [];
		for (const attachment of validatedAttachments) {
			if (!store) {
				throw new ContactAttachmentError(
					'File storage is temporarily unavailable. No files were retained. Please try again.',
					503,
				);
			}
			const stored = await storeContactAttachment({
				attachment,
				store,
				leadReference,
				baseUrl: attachmentOrigin,
			});
			storedTokens.push(stored.token);
			storedAttachments.push(stored);
		}

		const relayPayload = Object.fromEntries(
			RELAY_FIELDS.map((field) => [field, getText(formData, field)]),
		);
		relayPayload._redirect = SUCCESS_REDIRECT;
		relayPayload['Contact Form Source'] =
			getText(formData, 'Contact Form Source').toLowerCase() === 'popup' ? 'popup' : 'inline';
		const attachmentSummary = storedAttachments.map(
			(attachment, index) =>
				`${index + 1}. ${attachment.filename} (${Math.ceil(attachment.size / 1024)} KB) - ${attachment.url}`,
		);
		const payload: Record<string, string | number> = {
			...relayPayload,
			'Lead Reference': leadReference,
			'Attachment Count': storedAttachments.length,
		};
		if (attachmentSummary.length) payload.Attachments = attachmentSummary.join('\n');
		storedAttachments.forEach((attachment, index) => {
			payload[`Attachment ${index + 1}`] = attachment.url;
			payload[`Attachment ${index + 1} Filename`] = attachment.filename;
		});

		let relayResponse: Response;
		try {
			relayResponse = await dependencies.relay(dependencies.formsparkEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
		} catch {
			const retainedMessage = storedAttachments.length
				? ` Your uploaded files were retained under reference ${leadReference}.`
				: '';
			return errorResponse(
				request,
				`The form delivery could not be confirmed.${retainedMessage} Please call or text us before trying again.`,
				502,
			);
		}
		if (!relayResponse.ok) {
			throw new ContactAttachmentError(
				'The form could not send. Please try again or call us.',
				502,
			);
		}

		return successResponse(request, SUCCESS_REDIRECT, storedAttachments.length);
	} catch (error) {
		const cleanupSucceeded = store ? await cleanupStoredAttachments(store, storedTokens) : true;
		if (!cleanupSucceeded) {
			return errorResponse(
				request,
				`The form could not send. Some uploaded files may have been retained under reference ${leadReference}. Please call or text us before trying again.`,
				500,
			);
		}
		if (error instanceof ContactAttachmentError) {
			return errorResponse(request, error.message, error.status);
		}
		return errorResponse(request, 'The form could not send. Please try again or call us.', 500);
	}
};

export const POST: APIRoute = ({ request, url }) => handleContactSubmission(request, url);
