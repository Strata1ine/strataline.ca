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
const ATTACHMENT_FALLBACK_CAPTURE_FIELD = 'Attachment Fallback Capture';
const ATTACHMENT_UPLOAD_ERROR =
	"We couldn't upload the attachment. Remove it and try again, or text the photos to (416) 471-5999.";

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

const errorResponse = (
	request: Request,
	message: string,
	status = 400,
	details: Record<string, string | number | boolean> = {},
) =>
	new Response(
		wantsJson(request) ? JSON.stringify({ ok: false, error: message, ...details }) : message,
		{
			status,
			headers: {
				'Content-Type': wantsJson(request)
					? 'application/json; charset=utf-8'
					: 'text/plain; charset=utf-8',
				'Cache-Control': 'no-store',
			},
		},
	);

const successResponse = (
	request: Request,
	redirectUrl: string,
	attachmentCount: number,
	leadReference?: string,
) => {
	if (!wantsJson(request)) {
		return Response.redirect(redirectUrl, 303);
	}
	return Response.json(
		{
			ok: true,
			attachmentCount,
			...(leadReference ? { leadCaptured: true, leadReference } : {}),
		},
		{ headers: { 'Cache-Control': 'no-store' } },
	);
};

const buildRelayPayload = (
	formData: FormData,
	leadReference: string,
	storedAttachments: StoredContactAttachment[] = [],
	extraFields: Record<string, string | number> = {},
) => {
	const relayFields = Object.fromEntries(
		RELAY_FIELDS.map((field) => [field, getText(formData, field)]),
	) as Record<string, string | number>;
	relayFields._redirect = SUCCESS_REDIRECT;
	relayFields['Contact Form Source'] =
		getText(formData, 'Contact Form Source').toLowerCase() === 'popup' ? 'popup' : 'inline';

	const attachmentSummary = storedAttachments.map(
		(attachment, index) =>
			`${index + 1}. ${attachment.filename} (${Math.ceil(attachment.size / 1024)} KB) - ${attachment.url}`,
	);
	const payload: Record<string, string | number> = {
		...relayFields,
		'Lead Reference': leadReference,
		'Attachment Count': storedAttachments.length,
		...extraFields,
	};
	if (attachmentSummary.length) payload.Attachments = attachmentSummary.join('\n');
	storedAttachments.forEach((attachment, index) => {
		payload[`Attachment ${index + 1}`] = attachment.url;
		payload[`Attachment ${index + 1} Filename`] = attachment.filename;
	});
	return payload;
};

const relayContactPayload = async (
	dependencies: ContactSubmissionDependencies,
	payload: Record<string, string | number>,
) => {
	try {
		const response = await dependencies.relay(dependencies.formsparkEndpoint, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});
		return { ok: response.ok, status: response.status, errorName: null };
	} catch (error) {
		return {
			ok: false,
			status: 0,
			errorName: error instanceof Error ? error.name : 'UnknownError',
		};
	}
};

const logContactFailure = ({
	stage,
	leadReference,
	fileCount,
	totalBytes,
	status,
	error,
	errorName,
	fallbackRelayStatus,
}: {
	stage: string;
	leadReference: string;
	fileCount: number;
	totalBytes: number;
	status: number;
	error?: unknown;
	errorName?: string | null;
	fallbackRelayStatus?: number;
}) => {
	console.error(
		'[contact-submission]',
		JSON.stringify({
			event: 'contact_submission_failure',
			stage,
			leadReference,
			fileCount,
			totalBytes,
			status,
			errorName: errorName ?? (error instanceof Error ? error.name : error ? 'UnknownError' : null),
			fallbackRelayStatus: fallbackRelayStatus ?? null,
		}),
	);
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
	const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
	const contentLength = Number(request.headers.get('content-length') ?? 0);
	if (
		contentType.includes('multipart/form-data') &&
		contentLength > CONTACT_ATTACHMENT_MAX_REQUEST_BYTES
	) {
		logContactFailure({
			stage: 'request-limit',
			leadReference: 'unavailable',
			fileCount: 0,
			totalBytes: contentLength,
			status: 413,
		});
		return errorResponse(request, ATTACHMENT_UPLOAD_ERROR, 413, {
			attachmentFailure: true,
			leadCaptured: false,
		});
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch (error) {
		logContactFailure({
			stage: 'parse',
			leadReference: 'unavailable',
			fileCount: 0,
			totalBytes: 0,
			status: 400,
			error,
		});
		return errorResponse(
			request,
			contentType.includes('multipart/form-data')
				? ATTACHMENT_UPLOAD_ERROR
				: 'The form data could not be read. Please try again.',
			400,
			contentType.includes('multipart/form-data')
				? { attachmentFailure: true, leadCaptured: false }
				: {},
		);
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

	const suppliedLeadReference = getText(formData, 'Lead Reference').toUpperCase();
	const leadReference = /^[A-F0-9]{16}$/.test(suppliedLeadReference)
		? suppliedLeadReference
		: createLeadReference();

	const files = formData
		.getAll(CONTACT_ATTACHMENT_FIELD)
		.filter(
			(value): value is File => typeof value !== 'string' && (value.name !== '' || value.size > 0),
		);
	const totalBytes = files.reduce((total, file) => total + file.size, 0);
	const sendAttachmentFailure = async ({
		stage,
		status,
		error,
		storedAttachments = [],
	}: {
		stage: string;
		status: number;
		error?: unknown;
		storedAttachments?: StoredContactAttachment[];
	}) => {
		const fallbackPayload = buildRelayPayload(formData, leadReference, storedAttachments, {
			'Attachment Status': 'Upload failed — customer was asked to remove or text the files.',
			'Attachment Failure Stage': stage,
		});
		const fallbackRelay = await relayContactPayload(dependencies, fallbackPayload);
		logContactFailure({
			stage,
			leadReference,
			fileCount: files.length,
			totalBytes,
			status,
			error,
			fallbackRelayStatus: fallbackRelay.status,
		});
		if (!fallbackRelay.ok) {
			logContactFailure({
				stage: 'fallback-relay',
				leadReference,
				fileCount: files.length,
				totalBytes,
				status: fallbackRelay.status || 502,
				errorName: fallbackRelay.errorName,
			});
		}
		return errorResponse(request, ATTACHMENT_UPLOAD_ERROR, status, {
			attachmentFailure: true,
			leadCaptured: fallbackRelay.ok,
			leadReference,
		});
	};

	if (getText(formData, ATTACHMENT_FALLBACK_CAPTURE_FIELD)) {
		return sendAttachmentFailure({ stage: 'client-fallback', status: 502 });
	}
	if (files.length > CONTACT_ATTACHMENT_MAX_FILES) {
		return sendAttachmentFailure({ stage: 'file-count', status: 400 });
	}
	if (totalBytes > CONTACT_ATTACHMENT_MAX_TOTAL_BYTES) {
		return sendAttachmentFailure({ stage: 'file-size', status: 413 });
	}

	let validatedAttachments: ValidatedContactAttachment[];
	try {
		validatedAttachments = await Promise.all(files.map(validateContactAttachment));
	} catch (error) {
		return sendAttachmentFailure({
			stage: 'file-validation',
			status: error instanceof ContactAttachmentError ? error.status : 400,
			error,
		});
	}

	let store: Store | null = null;
	if (validatedAttachments.length) {
		try {
			store = dependencies.getAttachmentStore();
		} catch (error) {
			return sendAttachmentFailure({ stage: 'storage-init', status: 503, error });
		}
	}
	const productionOrigin =
		process.env.CONTEXT === 'production' ? 'https://strataline.ca' : url.origin;
	const attachmentOrigin = new URL(
		process.env.CONTACT_ATTACHMENT_BASE_URL?.trim() || productionOrigin,
	);

	const storedAttachments: StoredContactAttachment[] = [];
	for (const attachment of validatedAttachments) {
		if (!store) {
			return sendAttachmentFailure({
				stage: 'storage-init',
				status: 503,
				storedAttachments,
			});
		}
		try {
			const stored = await storeContactAttachment({
				attachment,
				store,
				leadReference,
				baseUrl: attachmentOrigin,
			});
			storedAttachments.push(stored);
		} catch (error) {
			return sendAttachmentFailure({
				stage: 'storage-write',
				status: error instanceof ContactAttachmentError ? error.status : 503,
				error,
				storedAttachments,
			});
		}
	}

	const payload = buildRelayPayload(formData, leadReference, storedAttachments);
	const relayResult = await relayContactPayload(dependencies, payload);
	if (!relayResult.ok) {
		logContactFailure({
			stage: 'relay',
			leadReference,
			fileCount: files.length,
			totalBytes,
			status: relayResult.status || 502,
			errorName: relayResult.errorName,
		});
		let leadCaptured = false;
		if (storedAttachments.length) {
			const fallbackPayload = buildRelayPayload(formData, leadReference, storedAttachments, {
				'Attachment Status':
					'Initial notification delivery could not be confirmed; attachment links are included again.',
			});
			const fallbackRelay = await relayContactPayload(dependencies, fallbackPayload);
			leadCaptured = fallbackRelay.ok;
			if (fallbackRelay.ok) {
				return successResponse(request, SUCCESS_REDIRECT, storedAttachments.length, leadReference);
			}
			if (!fallbackRelay.ok) {
				logContactFailure({
					stage: 'fallback-relay',
					leadReference,
					fileCount: files.length,
					totalBytes,
					status: fallbackRelay.status || 502,
					errorName: fallbackRelay.errorName,
				});
			}
		}
		return errorResponse(
			request,
			storedAttachments.length
				? ATTACHMENT_UPLOAD_ERROR
				: 'The form could not send. Please try again or call or text us.',
			502,
			storedAttachments.length
				? {
						attachmentFailure: true,
						leadCaptured,
						leadReference,
					}
				: { leadCaptured: false, leadReference },
		);
	}

	return successResponse(request, SUCCESS_REDIRECT, storedAttachments.length, leadReference);
};

export const POST: APIRoute = ({ request, url }) => handleContactSubmission(request, url);
