import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const root = path.resolve('content/blog');
const files = fs.readdirSync(root).filter((name) => /\.mdx?$/.test(name));
const errors = [];
const warnings = [];
const entries = [];

for (const name of files) {
	const file = path.join(root, name);
	const source = fs.readFileSync(file, 'utf8');
	const frontmatter = source.match(/^---\s*([\s\S]*?)\s*---/)?.[1];
	if (!frontmatter) {
		errors.push(`${name}: missing frontmatter`);
		continue;
	}
	const data = parse(frontmatter);
	entries.push({ name, file, source, data });
	if (!data.slug) errors.push(`${name}: missing canonical slug`);
	if (data.draft && data.indexable !== false)
		warnings.push(`${name}: draft relies on draft filtering rather than explicit indexable:false`);
	if (
		data.qualityTier === 'C' &&
		(data.indexable !== false || data.contentType !== 'archive-project')
	)
		errors.push(`${name}: Tier C must be archive-project with indexable:false`);
	if (data.type === 'case-study' && Array.isArray(data.projectFacts)) {
		for (const fact of data.projectFacts)
			if (!String(fact?.label ?? '').trim() || !String(fact?.value ?? '').trim())
				errors.push(`${name}: Project Facts cells cannot be empty`);
	}
}

const slugs = new Map();
for (const entry of entries) {
	const slug = entry.data.slug;
	if (!slug) continue;
	if (slugs.has(slug)) errors.push(`duplicate canonical slug: ${slug}`);
	slugs.set(slug, entry.name);
}

const requiredHubs = [
	'stairs',
	'ceilings',
	'bathrooms',
	'condos',
	'interior-renovations',
	'doors-windows',
	'flooring',
	'painting',
	'basements',
	'planning-costs',
];
for (const slug of requiredHubs) {
	const route = path.resolve('src/pages/blog', slug, 'index.astro');
	if (!fs.existsSync(route)) errors.push(`missing category hub route: /blog/${slug}`);
}
const requiredArchitecture = [
	'src/data/projectsGuides.ts',
	'src/components/blog/ProjectsGuidesHub.astro',
	'src/components/blog/BlogConnections.astro',
	'src/components/blog/RealProjects.astro',
	'src/pages/blog/page/[page].astro',
	'src/pages/blog/locations/toronto/index.astro',
];
for (const file of requiredArchitecture)
	if (!fs.existsSync(path.resolve(file))) errors.push(`missing architecture file: ${file}`);

const articleRenderer = fs.readFileSync(
	path.resolve('src/components/blog/CaseStudyArticle.astro'),
	'utf8',
);
const guideRenderer = fs.readFileSync(path.resolve('src/pages/blog/[slug].astro'), 'utf8');
if (!articleRenderer.includes('<BlogConnections post={post} />'))
	errors.push('Project Stories lack automatic connections');
if (!guideRenderer.includes('<BlogConnections post={post} />'))
	errors.push('Renovation Guides lack automatic connections');

for (const base of ['content', 'src']) {
	for (const file of walk(path.resolve(base))) {
		if (!/\.(?:astro|ts|tsx|md|mdx|yaml|json)$/.test(file)) continue;
		const source = fs.readFileSync(file, 'utf8');
		if (/(?:href|item|url):?\s*[={"]*['"]\/(?!\/)[^'"]+\.html(?:['"#?])/i.test(source))
			errors.push(`${path.relative(process.cwd(), file)}: internal .html link found`);
	}
}

function walk(directory) {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(directory, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
}

if (warnings.length) console.warn(warnings.map((warning) => `WARN: ${warning}`).join('\n'));
if (errors.length) {
	console.error(errors.map((error) => `ERROR: ${error}`).join('\n'));
	process.exit(1);
}
console.log(
	`Projects & Guides validation passed for ${entries.length} content entries and ${requiredHubs.length} category hubs.`,
);
