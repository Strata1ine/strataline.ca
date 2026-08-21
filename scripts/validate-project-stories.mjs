import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const root = process.cwd();
const blogRoot = path.join(root, 'content', 'blog');
const contentFiles = fs
	.readdirSync(blogRoot, { recursive: true, withFileTypes: true })
	.filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
	.map((entry) => path.join(entry.parentPath ?? entry.path, entry.name));

const failures = [];
const warnings = [];
const fillerCaption =
	/^(?:image|photo|supporting image|another angle|finished result(?: photo)?|project photo|before|after|before and after)\.?$/i;
const bakedComposite = /(?:before[-_ ]?after|composite|collage|montage)/i;
const assertSharedComparisonContract = () => {
	const viewerPath = path.join(root, 'src', 'components', 'prototype', 'BeforeAfterViewer.astro');
	const galleryPath = path.join(root, 'src', 'components', 'blog', 'CaseStudyGallery.astro');
	const blogCssPath = path.join(root, 'src', 'styles', 'blog.css');
	const prototypeCssPath = path.join(root, 'src', 'styles', 'interior-renovations-prototype.css');
	const contractPaths = [viewerPath, galleryPath, blogCssPath, prototypeCssPath];
	if (contractPaths.some((contractPath) => !fs.existsSync(contractPath))) {
		failures.push('shared comparison contract files are missing');
		return;
	}

	const viewer = fs.readFileSync(viewerPath, 'utf8');
	const gallery = fs.readFileSync(galleryPath, 'utf8');
	const blogCss = fs.readFileSync(blogCssPath, 'utf8');
	const prototypeCss = fs.readFileSync(prototypeCssPath, 'utf8');
	if (
		!viewer.includes('proto-before-after__image proto-before-after__image--after') ||
		!viewer.includes('proto-before-after__image proto-before-after__image--before')
	)
		failures.push('shared slider must render before and after as layers in one frame');
	if (
		!/\.proto-before-after__image\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;/s.test(
			prototypeCss,
		)
	)
		failures.push('shared slider layers must occupy identical absolute stage dimensions');
	if (
		!/\.case-comparison--portrait \.proto-before-after__frame\s*\{[^}]*max-height:\s*min\(68svh,\s*720px\);[^}]*aspect-ratio:\s*13\s*\/\s*10;/s.test(
			blogCss,
		)
	)
		failures.push('portrait slider must retain the 68svh/720px height cap and common 13:10 stage');
	if (
		!/\.case-comparison--portrait \.proto-before-after__image img\s*\{[^}]*object-fit:\s*cover;/s.test(
			blogCss,
		)
	)
		failures.push('portrait before/after layers must use the same controlled cover crop');
	if (
		!gallery.includes("'case-gallery--matched-pair': matched") ||
		!blogCss.includes('aspect-ratio: var(--case-pair-aspect-ratio);')
	)
		failures.push('matched editorial pairs must share one visual-stage aspect ratio');

	const portraitStage = (viewportWidth, viewportHeight) => {
		const heightLimit = Math.min(viewportHeight * 0.68, 720);
		const width = Math.min(viewportWidth, 920, heightLimit * 1.3);
		return { width, height: width / 1.3, heightLimit };
	};
	const desktopStages = [
		{ viewport: '1366x768', ...portraitStage(1366, 768), widthRange: [650, 820], heightRange: [480, 540] },
		{ viewport: '1920x1080', ...portraitStage(1920, 1080), widthRange: [850, 920], heightRange: [650, 720] },
	];
	for (const stage of desktopStages) {
		const inRange =
			stage.width >= stage.widthRange[0] &&
			stage.width <= stage.widthRange[1] &&
			stage.height >= stage.heightRange[0] &&
			stage.height <= stage.heightRange[1] &&
			stage.height <= stage.heightLimit;
		if (!inRange)
			failures.push(
				`portrait slider contract exceeds ${stage.viewport}: ${stage.width.toFixed(1)}x${stage.height.toFixed(1)}`,
			);
	}
};

assertSharedComparisonContract();

const words = (value) =>
	String(value ?? '')
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;

const paragraphText = (paragraph) =>
	typeof paragraph === 'string'
		? paragraph
		: `${paragraph?.before ?? ''} ${paragraph?.label ?? ''} ${paragraph?.after ?? ''}`;

const countAuditSources = (source) =>
	String(source)
		.replace(/\s+and\s+/gi, ',')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean).length;

const mediaCaptions = (media) => {
	if (!media) return [];
	if (media.type === 'image' || media.type === 'before-after') return [media.caption];
	if (media.type === 'image-pair' || media.type === 'gallery')
		return (media.items ?? []).map((item) => item.caption);
	return [];
};

for (const file of contentFiles) {
	const source = fs.readFileSync(file, 'utf8');
	const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
	if (!match) continue;

	let data;
	try {
		data = parse(match[1]);
	} catch (error) {
		failures.push(`${path.relative(root, file)}: invalid YAML (${error.message})`);
		continue;
	}

	if (!['case-study', 'guide'].includes(data?.type)) continue;
	const mediaContexts = new Set(
		[...(data?.mediaAudit?.used ?? []), ...(data?.mediaAudit?.excluded ?? [])]
			.flatMap((item) =>
				String(item.source)
					.replace(/\s+and\s+/gi, ',')
					.split(','),
			)
			.map((source) =>
				source
					.trim()
					.replace(/\\/g, '/')
					.split('/')[0]
					.replace(/^(?:before|after|process)\s+/i, '')
					.toLowerCase(),
			)
			.filter(Boolean),
	);
	const inferredMediaRich = (data?.mediaAudit?.discovered ?? 0) >= 8 || mediaContexts.size >= 2;
	if (inferredMediaRich && data?.mediaRich !== true) {
		failures.push(
			path.relative(root, file) + ': mediaAudit discovered ' + data.mediaAudit.discovered + ' files; classify this as mediaRich',
		);
		continue;
	}
	if (data?.mediaRich !== true) continue;

	const relative = path.relative(root, file);
	const blocks = data.contentBlocks ?? [];
	const localFailures = [];
	const visualFailures = [];
	const audit = data.mediaAudit;

	if (!audit) {
		localFailures.push('mediaRich stories require mediaAudit');
	} else {
		const used = audit.used ?? [];
		const excludedCount = (audit.excluded ?? []).reduce(
			(total, item) => total + countAuditSources(item.source),
			0,
		);
		if (used.length + excludedCount !== audit.discovered)
			localFailures.push(
				`mediaAudit accounts for ${used.length + excludedCount}/${audit.discovered} discovered files`,
			);
		if (used.length < Math.ceil(audit.discovered / 2))
			visualFailures.push(
				`only ${used.length}/${audit.discovered} discovered files are used; media-rich stories must use a majority`,
			);
		for (const item of audit.excluded ?? []) {
			if (!item.reason || words(item.reason) < 4)
				localFailures.push(`excluded source "${item.source}" needs a specific reason`);
		}

		const rendered = JSON.stringify({ heroImage: data.heroImage, blocks });
		for (const item of used) {
			if (!rendered.includes(item.asset))
				localFailures.push(`audited asset is not rendered: ${item.asset}`);
		}

		const detected = new Map();
		for (const item of used) {
			const normalized = item.source.replace(/\\/g, '/');
			const parts = normalized.split('/');
			const stem = path.parse(parts.at(-1)).name;
			const ab = stem.match(/^([AB])(\d+)$/i);
			if (!ab) continue;
			const context = parts.slice(0, -1).join('/').replace(/^(?:before|after)\s+/i, '');
			const key = `${context.toLowerCase()}:${Number(ab[2])}`;
			const pair = detected.get(key) ?? { context, number: Number(ab[2]) };
			pair[ab[1].toUpperCase()] = item.asset;
			detected.set(key, pair);
		}

		const declared = new Map(
			(data.manualPairs ?? []).map((pair) => [
				`${pair.context.toLowerCase()}:${Number(pair.number)}`,
				pair,
			]),
		);
		for (const [key, pair] of detected) {
			if (!pair.A || !pair.B) continue;
			const manual = declared.get(key);
			if (!manual)
				localFailures.push(`complete manual pair ${key} is not declared in manualPairs`);
			else if (manual.before !== pair.B || manual.after !== pair.A)
				localFailures.push(`manual pair ${key} must map B to before and A to after exactly`);
		}
	}

	const textMediaBlocks = blocks.filter((block) => block.type === 'text-media');
	if (textMediaBlocks.length < 4)
		visualFailures.push('media-rich stories require at least four text-media sections');
	if (blocks.some((block) => block.type === 'text'))
		visualFailures.push('standalone text blocks are not allowed in media-rich stories');

	for (const [index, block] of blocks.entries()) {
		if (block.type !== 'text-media') continue;
		if (!block.media) localFailures.push(`section ${index + 1} has no owned media`);
		if ((block.paragraphs ?? []).length > 2)
			visualFailures.push(`section ${index + 1} has more than two paragraphs`);
		const sectionWords = (block.paragraphs ?? []).reduce(
			(total, paragraph) => total + words(paragraphText(paragraph)),
			0,
		);
		if (sectionWords > 180)
			visualFailures.push(`section ${index + 1} has ${sectionWords} words; maximum is 180`);
		for (const caption of mediaCaptions(block.media)) {
			if (!caption || fillerCaption.test(caption.trim()))
				visualFailures.push(`section ${index + 1} has a missing or filler caption`);
		}
		const comparisonAssets =
			block.media?.type === 'image-pair'
				? block.media.items.map((item) => item.image)
				: block.media?.type === 'before-after'
					? [block.media.beforeImage, block.media.afterImage]
					: [];
		if (comparisonAssets.some((asset) => bakedComposite.test(String(asset))))
			localFailures.push(`section ${index + 1} comparison appears to use a baked composite asset`);
		if (
			block.media?.type === 'before-after' &&
			block.media.beforeImage === block.media.afterImage
		)
			localFailures.push(`section ${index + 1} comparison must use two individual assets`);
	}
	if (blocks.some((block) => ['spacer', 'divider'].includes(block.type)))
		localFailures.push('empty spacer/divider blocks are prohibited');

	const finishedGallery = blocks.find(
		(block) => block.type === 'gallery' && block.purpose === 'finished-project',
	);
	if (!finishedGallery || (finishedGallery.items ?? []).length < 3)
		visualFailures.push('a Finished Project gallery with at least three images is required');

	const related = blocks.find((block) => block.type === 'related-stories');
	if (!related || (related.items ?? []).length < 2 || related.items.length > 3)
		visualFailures.push('a compact related-stories block with two or three cards is required');

	for (const pair of data.manualPairs ?? []) {
		const isBeforeAfterPresentation = ['slider', 'before-after'].includes(pair.presentation);
		const expectedType = isBeforeAfterPresentation ? 'before-after' : 'image-pair';
		if (
			isBeforeAfterPresentation &&
			textMediaBlocks.some(
				(block) =>
					block.media?.type === 'image-pair' &&
					block.media.pairContext === pair.context &&
					Number(block.media.pairNumber) === Number(pair.number),
			)
		)
			localFailures.push(
				`manual pair ${pair.context}:${pair.number} is marked before-after but rendered as image-pair`,
			);
		const pairBlock = textMediaBlocks.find(
			(block) =>
				block.media?.type === expectedType &&
				block.media.pairContext === pair.context &&
				Number(block.media.pairNumber) === Number(pair.number),
		);
		if (!pairBlock)
			localFailures.push('manual pair ' + pair.context + ':' + pair.number + ' is not rendered as ' + pair.presentation);
		else if (
			isBeforeAfterPresentation &&
			(pairBlock.media.beforeImage !== pair.before || pairBlock.media.afterImage !== pair.after)
		)
			localFailures.push('rendered manual pair ' + pair.context + ':' + pair.number + ' does not match its declaration');
		else if (
			pair.presentation === 'pair' &&
			(pairBlock.media.items?.[0]?.image !== pair.before ||
				 pairBlock.media.items?.[1]?.image !== pair.after)
		)
			localFailures.push('rendered manual pair ' + pair.context + ':' + pair.number + ' does not match its declaration');
	}

	if (visualFailures.length && data.visualValidationOverride) {
		warnings.push(
			`${relative}: visual override reviewed ("${data.visualValidationOverride}")\n  - ${visualFailures.join('\n  - ')}`,
		);
	} else localFailures.push(...visualFailures);

	for (const failure of localFailures) failures.push(`${relative}: ${failure}`);

	const usedCount = audit?.used?.length ?? 0;
	const excludedCount = (audit?.excluded ?? []).reduce(
		(total, item) => total + countAuditSources(item.source),
		0,
	);
	console.log(
		`[project-story] ${data.slug}: discovered ${audit?.discovered ?? 0}, used ${usedCount}, excluded ${excludedCount}, sections ${textMediaBlocks.length}`,
	);
	for (const item of audit?.excluded ?? [])
		console.log(`  excluded ${item.source}: ${item.reason}`);
}

for (const warning of warnings) console.warn(`WARNING ${warning}`);

if (failures.length) {
	console.error('\nProject Story validation failed:');
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log('Project Story validation passed.');
