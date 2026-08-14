import { randomBytes } from 'node:crypto';

import type { Store } from '@netlify/blobs';

export const CONTACT_ATTACHMENT_STORE = 'contact-attachments';
export const CONTACT_ATTACHMENT_FIELD = 'Attachments';
export const CONTACT_ATTACHMENT_MAX_FILES = 10;
export const CONTACT_ATTACHMENT_MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const CONTACT_ATTACHMENT_MAX_REQUEST_BYTES = CONTACT_ATTACHMENT_MAX_TOTAL_BYTES + 256 * 1024;

export type ContactAttachmentKind = 'jpeg' | 'png' | 'webp' | 'heic' | 'heif' | 'pdf';

interface AttachmentType {
	kind: ContactAttachmentKind;
	mime: string;
	extensions: readonly string[];
	declaredMimes: readonly string[];
}

export interface ValidatedContactAttachment {
	file: File;
	filename: string;
	kind: ContactAttachmentKind;
	mime: string;
	size: number;
}

export interface StoredContactAttachment extends ValidatedContactAttachment {
	token: string;
	url: string;
}

export interface ContactAttachmentMetadata extends Record<string, unknown> {
	filename: string;
	contentType: string;
	size: number;
	uploadedAt: string;
	leadReference: string;
}

export class ContactAttachmentError extends Error {
	status: number;

	constructor(message: string, status = 400) {
		super(message);
		this.name = 'ContactAttachmentError';
		this.status = status;
	}
}

const ACCEPTED_TYPES: Record<ContactAttachmentKind, AttachmentType> = {
	jpeg: {
		kind: 'jpeg',
		mime: 'image/jpeg',
		extensions: ['jpg', 'jpeg'],
		declaredMimes: ['image/jpeg', 'image/jpg'],
	},
	png: {
		kind: 'png',
		mime: 'image/png',
		extensions: ['png'],
		declaredMimes: ['image/png'],
	},
	webp: {
		kind: 'webp',
		mime: 'image/webp',
		extensions: ['webp'],
		declaredMimes: ['image/webp'],
	},
	heic: {
		kind: 'heic',
		mime: 'image/heic',
		extensions: ['heic'],
		declaredMimes: ['image/heic', 'image/heif'],
	},
	heif: {
		kind: 'heif',
		mime: 'image/heif',
		extensions: ['heif'],
		declaredMimes: ['image/heif', 'image/heic'],
	},
	pdf: {
		kind: 'pdf',
		mime: 'application/pdf',
		extensions: ['pdf'],
		declaredMimes: ['application/pdf'],
	},
};

const GENERIC_MIMES = new Set(['', 'application/octet-stream']);
const HEIC_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis']);
const HEIF_BRANDS = new Set(['heif', 'mif1', 'msf1']);

const hasBytes = (bytes: Uint8Array, offset: number, expected: readonly number[]) =>
	expected.every((byte, index) => bytes[offset + index] === byte);

const ascii = (bytes: Uint8Array, start: number, length: number) =>
	String.fromCharCode(...bytes.slice(start, start + length));

export const detectContactAttachmentType = (bytes: Uint8Array): AttachmentType | null => {
	if (bytes.length >= 3 && hasBytes(bytes, 0, [0xff, 0xd8, 0xff])) return ACCEPTED_TYPES.jpeg;
	if (bytes.length >= 8 && hasBytes(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
		return ACCEPTED_TYPES.png;
	}
	if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
		return ACCEPTED_TYPES.webp;
	}
	if (bytes.length >= 12 && ascii(bytes, 4, 4) === 'ftyp') {
		const brands: string[] = [];
		for (let offset = 8; offset + 4 <= bytes.length; offset += 4) {
			if (offset !== 12) brands.push(ascii(bytes, offset, 4));
		}
		if (brands.some((brand) => HEIC_BRANDS.has(brand))) return ACCEPTED_TYPES.heic;
		if (brands.some((brand) => HEIF_BRANDS.has(brand))) return ACCEPTED_TYPES.heif;
	}
	if (bytes.length >= 5 && ascii(bytes, 0, 5) === '%PDF-') return ACCEPTED_TYPES.pdf;
	return null;
};

const getExtension = (filename: string) => filename.split('.').pop()?.toLowerCase() ?? '';

const createSafeFilename = (filename: string, extension: string) => {
	const basename = filename.split(/[\\/]/).pop() ?? '';
	const normalized = basename
		.normalize('NFKC')
		.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, '')
		.replace(/\s+/g, ' ')
		.replace(/^[. ]+|[. ]+$/g, '')
		.trim();
	const fallback = `attachment.${extension}`;
	const candidate = normalized || fallback;
	if (candidate.length <= 120) return candidate;
	const suffix = `.${extension}`;
	return `${candidate.slice(0, Math.max(1, 120 - suffix.length)).replace(/[. ]+$/g, '')}${suffix}`;
};

export const validateContactAttachment = async (
	file: File,
): Promise<ValidatedContactAttachment> => {
	if (!file.name || file.size === 0) {
		throw new ContactAttachmentError(
			'One of the selected files is empty. Remove it and try again.',
		);
	}
	if (file.size > CONTACT_ATTACHMENT_MAX_TOTAL_BYTES) {
		throw new ContactAttachmentError(
			`${file.name} is larger than the 4 MB total upload limit. Remove it and try again.`,
		);
	}

	const signature = new Uint8Array(await file.slice(0, 32).arrayBuffer());
	const detected = detectContactAttachmentType(signature);
	const extension = getExtension(file.name);
	const isHeifFamily = detected?.kind === 'heic' || detected?.kind === 'heif';
	const normalizedType =
		isHeifFamily && (extension === 'heic' || extension === 'heif')
			? ACCEPTED_TYPES[extension]
			: detected;
	const declaredMime = file.type.toLowerCase();
	const mimeMatches =
		normalizedType &&
		(GENERIC_MIMES.has(declaredMime) || normalizedType.declaredMimes.includes(declaredMime));

	if (!normalizedType || !normalizedType.extensions.includes(extension) || !mimeMatches) {
		throw new ContactAttachmentError(
			`${file.name} isn't a supported file. Please use JPG, PNG, WEBP, HEIC, HEIF or PDF.`,
		);
	}

	return {
		file,
		filename: createSafeFilename(file.name, extension),
		kind: normalizedType.kind,
		mime: normalizedType.mime,
		size: file.size,
	};
};

export const createAttachmentToken = () => randomBytes(32).toString('base64url');

export const createLeadReference = () => randomBytes(8).toString('hex').toUpperCase();

export const storeContactAttachment = async ({
	attachment,
	store,
	leadReference,
	baseUrl,
}: {
	attachment: ValidatedContactAttachment;
	store: Store;
	leadReference: string;
	baseUrl: URL;
}): Promise<StoredContactAttachment> => {
	const token = createAttachmentToken();
	const metadata: ContactAttachmentMetadata = {
		filename: attachment.filename,
		contentType: attachment.mime,
		size: attachment.size,
		uploadedAt: new Date().toISOString(),
		leadReference,
	};
	const result = await store.set(token, attachment.file, {
		metadata,
		onlyIfNew: true,
	});
	if (!result.modified) {
		throw new ContactAttachmentError('The attachment could not be stored. Please try again.', 500);
	}

	return {
		...attachment,
		token,
		url: new URL(`/api/contact-attachments/${token}`, baseUrl).href,
	};
};

export const isContactAttachmentMetadata = (value: unknown): value is ContactAttachmentMetadata => {
	if (!value || typeof value !== 'object') return false;
	const metadata = value as Partial<ContactAttachmentMetadata>;
	return (
		typeof metadata.filename === 'string' &&
		typeof metadata.contentType === 'string' &&
		typeof metadata.size === 'number' &&
		typeof metadata.uploadedAt === 'string' &&
		typeof metadata.leadReference === 'string'
	);
};

export const attachmentDisposition = (filename: string) => {
	const asciiFilename = filename
		.normalize('NFKD')
		.replace(/[^\x20-\x7e]/g, '')
		.replace(/["\\]/g, '_')
		.trim();
	const fallback = asciiFilename || 'attachment';
	const encodedFilename = encodeURIComponent(filename).replace(
		/[!'()*]/g,
		(character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
	);
	return 'attachment; filename="' + fallback + "\"; filename*=UTF-8''" + encodedFilename;
};
