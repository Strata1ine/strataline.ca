import type { BlogPost } from '@/data/blog';

export const COMPLETED_PROJECT_ARCHIVE_COUNT = 160;
export const PROJECTS_GUIDES_PAGE_SIZE = 18;
export const MIN_CATEGORY_ITEMS = 2;
export const MIN_CITY_PROJECTS = 3;

export type LibraryContentType = 'project-story' | 'renovation-guide' | 'archive-project';
export type QualityTier = 'A' | 'B' | 'C';

export interface LibraryCategory {
	slug: string;
	label: string;
	title: string;
	description: string;
	introduction: string;
	serviceHref: string;
	serviceLabel: string;
	ctaHeading: string;
	ctaText: string;
}

export const libraryCategories: LibraryCategory[] = [
	{
		slug: 'stairs',
		label: 'Stairs',
		title: 'Stair Renovation Projects & Guides',
		description:
			'Explore real stair refinishing, tread-capping and railing projects across Toronto and the GTA, plus practical planning guides.',
		introduction:
			'These documented stair projects show how existing conditions, tread systems, stain matching, railings and occupied-home logistics shape the finished result.',
		serviceHref: '/services/stairs',
		serviceLabel: 'Stair Renovation',
		ctaHeading: 'Planning a stair renovation?',
		ctaText: 'Share photos of the stair run, landings and railings for a practical scope review.',
	},
	{
		slug: 'ceilings',
		label: 'Ceilings',
		title: 'Ceiling Renovation Projects & Guides',
		description:
			'See popcorn ceiling removal projects, smooth-ceiling finishing work and practical ceiling renovation guidance from Strataline.',
		introduction:
			'This ceiling library documents texture removal, repairs, skim coating, sanding, priming and painting in real Toronto and GTA homes.',
		serviceHref: '/services/popcorn-removal',
		serviceLabel: 'Popcorn Ceiling Removal',
		ctaHeading: 'Need a smooth ceiling scope?',
		ctaText: 'Send ceiling photos and room dimensions so the existing condition can be reviewed.',
	},
	{
		slug: 'bathrooms',
		label: 'Bathrooms',
		title: 'Bathroom Renovation Projects & Guides',
		description:
			'Browse documented bathroom renovations, condo constraints and connected interior planning guidance for Toronto and GTA homes.',
		introduction:
			'Real bathroom work is shaped by existing plumbing, waterproofing, tile layout, ventilation and the way adjacent finishes connect.',
		serviceHref: '/services/bathrooms',
		serviceLabel: 'Bathroom Renovations',
		ctaHeading: 'Planning a bathroom renovation?',
		ctaText:
			'Start with the room dimensions, existing photos and the fixtures you expect to keep or replace.',
	},
	{
		slug: 'condos',
		label: 'Condos',
		title: 'Condo Renovation Projects & Guides',
		description:
			'Explore real Toronto and GTA condo renovation stories, including access, building rules, sequencing and complete interior coordination.',
		introduction:
			'Condo projects require a clear plan for building approvals, deliveries, protection, working hours and the order of connected trades.',
		serviceHref: '/interior-renovations',
		serviceLabel: 'Interior Renovations',
		ctaHeading: 'Renovating a condo?',
		ctaText: 'Share the building requirements and proposed scope before scheduling the work.',
	},
	{
		slug: 'interior-renovations',
		label: 'Interior Renovations',
		title: 'Interior Renovation Projects & Guides',
		description:
			'Browse whole-home, basement and multi-room renovation stories with practical planning guidance for Toronto and the GTA.',
		introduction:
			'These projects show how ceilings, walls, floors, trim, stairs, doors and rooms are coordinated as one connected interior.',
		serviceHref: '/interior-renovations',
		serviceLabel: 'Interior Renovations',
		ctaHeading: 'Planning connected interior work?',
		ctaText:
			'Describe the rooms involved and the result you want so the scope can be reviewed as one project.',
	},
	{
		slug: 'doors-windows',
		label: 'Doors & Windows',
		title: 'Door & Window Projects and Guides',
		description:
			'See real door and window modifications, new openings, trim work and planning considerations from Toronto and GTA renovations.',
		introduction:
			'Opening changes affect structure, weather protection, interior trim, exterior transitions and the way people move through a home.',
		serviceHref: '/services/doors_and_windows',
		serviceLabel: 'Doors & Windows',
		ctaHeading: 'Considering a new or modified opening?',
		ctaText:
			'Send inside and outside photos so the opening and surrounding finishes can be reviewed together.',
	},
	{
		slug: 'flooring',
		label: 'Flooring',
		title: 'Flooring Projects & Renovation Guides',
		description:
			'Explore hardwood, stair and connected flooring work with real project examples and practical finish-planning guidance.',
		introduction:
			'Flooring decisions affect transitions, stair stain matching, trim, sequencing and the visual continuity between rooms.',
		serviceHref: '/services/flooring',
		serviceLabel: 'Flooring',
		ctaHeading: 'Planning new flooring?',
		ctaText:
			'Share photos of the existing floors, transitions and connected stairs for a coordinated review.',
	},
	{
		slug: 'painting',
		label: 'Painting',
		title: 'Interior Painting Projects & Guides',
		description:
			'Browse real interior finishing projects and practical guides covering preparation, repairs, primer and paint.',
		introduction:
			'A durable painted finish depends on the substrate, repair work, surface preparation and the order in which connected work is completed.',
		serviceHref: '/services/painting',
		serviceLabel: 'Interior Painting',
		ctaHeading: 'Planning interior painting?',
		ctaText:
			'Send room photos and note any damage, texture or connected trim work that needs attention.',
	},
	{
		slug: 'basements',
		label: 'Basements',
		title: 'Basement Renovation Projects & Guides',
		description:
			'Explore real basement finishing projects, space-planning decisions and practical renovation guidance from Strataline.',
		introduction:
			'These projects show how layout, ceiling height, utilities, storage, lighting and finish transitions shape a useful basement.',
		serviceHref: '/interior-renovations',
		serviceLabel: 'Interior Renovations',
		ctaHeading: 'Planning a basement renovation?',
		ctaText: 'Share the floor area, current conditions and rooms you want to create.',
	},
	{
		slug: 'planning-costs',
		label: 'Planning & Costs',
		title: 'Renovation Planning & Cost Guides',
		description:
			'Practical Toronto and GTA renovation guides covering scope, quote comparison, sequencing and project planning.',
		introduction:
			'Clear planning starts with existing conditions and a written scope. These guides explain the decisions that affect cost, schedule and responsibility.',
		serviceHref: '/interior-renovations',
		serviceLabel: 'Interior Renovations',
		ctaHeading: 'Need help defining the scope?',
		ctaText:
			'Share the property, priorities and current conditions for an owner-led project review.',
	},
];

const categoryBySlug = new Map(libraryCategories.map((category) => [category.slug, category]));

const normalizedText = (post: BlogPost) =>
	[
		post.data.slug,
		post.data.title,
		post.data.description,
		post.data.category,
		post.data.service,
		post.data.location,
		post.data.propertyType,
		...post.data.problems,
		...post.data.solutions,
		...post.data.materials,
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

export const getContentType = (post: BlogPost): LibraryContentType =>
	post.data.contentType ?? (post.data.type === 'case-study' ? 'project-story' : 'renovation-guide');

export const getQualityTier = (post: BlogPost): QualityTier =>
	post.data.qualityTier ?? (post.data.mediaRich ? 'A' : 'B');

export const getPrimaryService = (post: BlogPost) => {
	if (post.data.primaryService) return post.data.primaryService;
	const text = normalizedText(post);
	if (post.data.category === 'Stairs') return '/services/stairs';
	if (post.data.category === 'Ceilings' || text.includes('popcorn ceiling'))
		return '/services/popcorn-removal';
	if (text.includes('bathroom')) return '/services/bathrooms';
	if (post.data.category === 'Doors & Windows') return '/services/doors_and_windows';
	if (post.data.category === 'Painting') return '/services/painting';
	if (text.includes('flooring') || text.includes('hardwood')) return '/services/flooring';
	return '/interior-renovations';
};

export const getCity = (post: BlogPost) => {
	if (post.data.city) return post.data.city;
	const location = (post.data.location ?? '').toLowerCase();
	if (/toronto|etobicoke|north york|king west|bayview|yonge/.test(location)) return 'Toronto';
	if (location.includes('richmond hill')) return 'Richmond Hill';
	if (location.includes('vaughan') || location.includes('kleinburg')) return 'Vaughan';
	if (location.includes('oakville')) return 'Oakville';
	if (location.includes('aurora')) return 'Aurora';
	if (location.includes('newmarket')) return 'Newmarket';
	if (location.includes('thornhill')) return 'Thornhill';
	return undefined;
};

export const getCategorySlugs = (post: BlogPost) => {
	const text = normalizedText(post);
	const slugs = new Set<string>();
	if (post.data.category === 'Stairs' || /stair|railing|tread|baluster/.test(text))
		slugs.add('stairs');
	if (post.data.category === 'Ceilings' || /ceiling|popcorn/.test(text)) slugs.add('ceilings');
	if (post.data.category === 'Kitchens & Bathrooms' || /bathroom|washroom/.test(text))
		slugs.add('bathrooms');
	if (/condo|apartment/.test(text)) slugs.add('condos');
	if (
		post.data.category === 'Interior Renovations' ||
		/interior renovation|whole.home|multi.room|basement/.test(text)
	)
		slugs.add('interior-renovations');
	if (post.data.category === 'Doors & Windows' || /door|window|opening/.test(text))
		slugs.add('doors-windows');
	if (/floor|hardwood|tread|stain matching/.test(text)) slugs.add('flooring');
	if (post.data.category === 'Painting' || /paint|primer|skim coat|finish/.test(text))
		slugs.add('painting');
	if (/basement/.test(text)) slugs.add('basements');
	if (
		post.data.category === 'Planning & Costs' ||
		/quote|cost|planning|separate trades|stay in/.test(text)
	)
		slugs.add('planning-costs');
	return [...slugs];
};

export const getProblemTags = (post: BlogPost) => {
	const explicit = post.data.problems;
	if (explicit.length) return explicit;
	const text = normalizedText(post);
	const tags: string[] = [];
	if (/dated|carpet|stair|railing/.test(text)) tags.push('Dated stairs and railings');
	if (/popcorn|texture|ceiling/.test(text)) tags.push('Textured or damaged ceilings');
	if (/layout|space|basement/.test(text)) tags.push('Space planning');
	if (/occupied|stay in|dust|containment/.test(text)) tags.push('Occupied-home renovation');
	if (/door|window|opening|access/.test(text)) tags.push('Access and openings');
	if (/match|finish|floor|paint/.test(text)) tags.push('Finish coordination');
	return [...new Set(tags)].slice(0, 3);
};

export const getCategory = (slug: string) => categoryBySlug.get(slug);

export const getCategoryPosts = (posts: BlogPost[], slug: string) =>
	posts.filter((post) => getCategorySlugs(post).includes(slug));

export const getEligibleCategories = (posts: BlogPost[]) =>
	libraryCategories.filter(
		(category) => getCategoryPosts(posts, category.slug).length >= MIN_CATEGORY_ITEMS,
	);

export const getEligibleCities = (posts: BlogPost[]) => {
	const projects = posts.filter((post) => getContentType(post) === 'project-story');
	const counts = new Map<string, number>();
	for (const post of projects) {
		const city = getCity(post);
		if (city) counts.set(city, (counts.get(city) ?? 0) + 1);
	}
	return [...counts.entries()]
		.filter(([, count]) => count >= MIN_CITY_PROJECTS)
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.map(([city, count]) => ({
			city,
			slug: city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			count,
		}));
};

const scoreRelated = (source: BlogPost, candidate: BlogPost) => {
	let score = 0;
	if (getPrimaryService(source) === getPrimaryService(candidate)) score += 12;
	const categories = getCategorySlugs(source);
	score += getCategorySlugs(candidate).filter((slug) => categories.includes(slug)).length * 5;
	const problems = getProblemTags(source);
	score += getProblemTags(candidate).filter((problem) => problems.includes(problem)).length * 3;
	if (getCity(source) && getCity(source) === getCity(candidate)) score += 2;
	if (source.data.propertyType && source.data.propertyType === candidate.data.propertyType)
		score += 2;
	return score;
};

const selectCurated = (slugs: string[], candidates: BlogPost[]) =>
	slugs
		.map((slug) => candidates.find((post) => post.data.slug === slug))
		.filter(Boolean) as BlogPost[];

export const getRelatedContent = (source: BlogPost, posts: BlogPost[]) => {
	const candidates = posts.filter((post) => post.id !== source.id);
	const projects = candidates.filter((post) => getContentType(post) === 'project-story');
	const guides = candidates.filter((post) => getContentType(post) === 'renovation-guide');
	const ranked = (items: BlogPost[]) =>
		[...items].sort(
			(a, b) =>
				scoreRelated(source, b) - scoreRelated(source, a) ||
				b.data.publishedDate.getTime() - a.data.publishedDate.getTime() ||
				a.data.slug.localeCompare(b.data.slug),
		);
	const curatedProjects = selectCurated(source.data.relatedProjects, projects);
	const curatedGuides = selectCurated(source.data.relatedGuides, guides);
	return {
		projects: [
			...curatedProjects,
			...ranked(projects).filter((post) => !curatedProjects.includes(post)),
		].slice(0, 3),
		guides: [
			...curatedGuides,
			...ranked(guides).filter((post) => !curatedGuides.includes(post)),
		].slice(0, 1),
	};
};

export const getServiceProjects = (posts: BlogPost[], serviceHref: string) =>
	posts.filter(
		(post) =>
			getContentType(post) === 'project-story' &&
			(getPrimaryService(post) === serviceHref ||
				post.data.secondaryServices.includes(serviceHref)),
	);

export const getArchiveStories = (posts: BlogPost[]) => {
	const explicit = posts.filter(
		(post) => post.data.archiveId || post.data.hubProminence === 'archive',
	);
	const historic = posts.filter(
		(post) => /2017|archive|toronto-star/.test(normalizedText(post)) && !explicit.includes(post),
	);
	return [...explicit, ...historic].slice(0, 4);
};

export const paginate = <T>(items: T[], page: number, pageSize = PROJECTS_GUIDES_PAGE_SIZE) => ({
	items: items.slice((page - 1) * pageSize, page * pageSize),
	page,
	pageCount: Math.max(1, Math.ceil(items.length / pageSize)),
	total: items.length,
});
