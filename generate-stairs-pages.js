import fs from 'fs';
import path from 'path';

const ROOT = './content/services/stairs';
const PHOTOS = `${ROOT}/photos`;

/* -----------------------------
   HELPERS
----------------------------- */

const toTitle = (slug) =>
	slug
		.split('-')
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join(' ');

const isImage = (name) => /\.(jpg|jpeg|png|webp)$/i.test(name);

const getCities = () =>
	fs.readdirSync(PHOTOS).filter((f) => fs.statSync(path.join(PHOTOS, f)).isDirectory());

function yamlQuote(str) {
	return `"${String(str ?? '')
		.replace(/\\/g, '\\\\')
		.replace(/"/g, '\\"')}"`;
}

const nearbyMap = {
	ajax: ['Pickering', 'Whitby', 'Oshawa'],
	aurora: ['Newmarket', 'King City', 'Richmond Hill'],
	bolton: ['Caledon', 'Kleinburg', 'Woodbridge'],
	bradford: ['Innisfil', 'Newmarket', 'Aurora'],
	burlington: ['Oakville', 'Mississauga'],
	caledon: ['Bolton', 'Kleinburg', 'Woodbridge'],
	etobicoke: ['Toronto', 'Mississauga', 'Oakville'],
	'forest-hill': ['Toronto', 'Rosedale', 'Leaside'],
	innisfil: ['Bradford', 'Newmarket'],
	'king-city': ['Aurora', 'Richmond Hill', 'Vaughan'],
	kleinburg: ['Woodbridge', 'Vaughan', 'Caledon'],
	leaside: ['Toronto', 'Forest Hill', 'Rosedale'],
	markham: ['Richmond Hill', 'Stouffville', 'Vaughan'],
	mississauga: ['Oakville', 'Etobicoke', 'Burlington'],
	newmarket: ['Aurora', 'Bradford', 'Richmond Hill'],
	oakville: ['Mississauga', 'Burlington'],
	oshawa: ['Whitby', 'Ajax', 'Pickering'],
	pickering: ['Ajax', 'Whitby', 'Oshawa'],
	'richmond-hill': ['Markham', 'Aurora', 'Vaughan'],
	rosedale: ['Toronto', 'Forest Hill', 'Leaside'],
	stouffville: ['Markham', 'Richmond Hill'],
	'the-beaches': ['Toronto', 'Leaside'],
	toronto: ['Forest Hill', 'Rosedale', 'The Beaches'],
	vaughan: ['Woodbridge', 'Kleinburg', 'Richmond Hill'],
	whitby: ['Ajax', 'Pickering', 'Oshawa'],
	woodbridge: ['Vaughan', 'Kleinburg', 'Caledon'],
};

function getImages(city) {
	const dir = path.join(PHOTOS, city);

	if (!fs.existsSync(dir)) return [];

	// Only Woodbridge has project subfolders
	if (city === 'woodbridge') {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		const nestedFiles = entries
			.filter((e) => e.isDirectory())
			.flatMap((subdir) => {
				const subPath = path.join(dir, subdir.name);
				return fs
					.readdirSync(subPath, { withFileTypes: true })
					.filter((e) => e.isFile() && isImage(e.name))
					.map((e) => ({
						file: e.name,
						rel: `../photos/${city}/${subdir.name}/${e.name}`,
					}));
			});

		return nestedFiles.sort((a, b) => a.file.localeCompare(b.file));
	}

	// All other cities are flat
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((e) => e.isFile() && isImage(e.name))
		.map((e) => ({
			file: e.name,
			rel: `../photos/${city}/${e.name}`,
		}))
		.sort((a, b) => a.file.localeCompare(b.file));
}

const pickHero = (images) => {
	return (
		images.find((i) => i.file.toLowerCase().includes('main')) ||
		images.find((i) => i.file.toLowerCase().includes('full-view')) ||
		images.find((i) => i.file.toLowerCase().includes('full-run')) ||
		images.find((i) => i.file.toLowerCase().includes('overview')) ||
		images[0]
	);
};

function getFaqItems(citySlug, city) {
	const nearby = nearbyMap[citySlug] || [];
	const nearbyText = nearby.length ? nearby.join(', ') : 'surrounding GTA communities';

	const premiumCities = ['toronto', 'rosedale', 'forest-hill', 'oakville', 'king-city'];
	const heritageCities = ['leaside'];
	const practicalCities = ['oshawa', 'whitby', 'ajax', 'pickering', 'innisfil', 'bradford'];

	const premiumItem = premiumCities.includes(citySlug)
		? [
				{
					title: `Do you work on luxury and curved staircases in ${city}?`,
					desc: `Yes. We regularly work on curved staircases, open-concept foyer stairs, and higher-end staircase upgrades where finish quality, railing details, and colour coordination matter more.`,
				},
			]
		: [];

	const heritageItem = heritageCities.includes(citySlug)
		? [
				{
					title: `Do you handle heritage or institutional staircase work near ${city}?`,
					desc: `Yes. Select projects involve more restoration-focused work, including careful refinishing, wood detailing, and preserving the visual character of older staircases where appropriate.`,
				},
			]
		: [];

	const practicalItem = practicalCities.includes(citySlug)
		? [
				{
					title: `Is staircase refinishing more affordable than replacing the whole staircase?`,
					desc: `In many cases, yes. Refinishing, tread capping, and railing upgrades can deliver a major visual improvement without the cost and disruption of a full staircase rebuild.`,
				},
			]
		: [];

	return [
		{
			title: `How long does staircase refinishing take in ${city}?`,
			desc: `Most staircase refinishing projects in ${city} take about 3 to 7 days depending on whether the work involves refinishing only, stair tread caps, railing upgrades, or a more complete staircase transformation.`,
		},
		{
			title: `Is staircase refinishing dusty?`,
			desc: `No. We use dust-controlled sanding systems designed for finished, occupied homes. That means the work is much cleaner than traditional open sanding and far more practical for families living in the home during the project.`,
		},
		{
			title: `Can you refinish stairs without replacing the whole staircase?`,
			desc: `Yes. In many cases, the existing staircase structure can stay in place while the visible parts are upgraded. That can include sanding and staining the treads, repainting risers, replacing spindles, and updating the handrail or newel posts.`,
		},
		{
			title: `Do you do carpet-to-hardwood stair conversions in ${city}?`,
			desc: `Yes. Carpeted stairs can often be converted using hardwood tread caps and updated risers, creating the look of a new staircase without rebuilding the full structure from scratch.`,
		},
		{
			title: `Can you match my existing hardwood floors?`,
			desc: `Yes. We can stain stair treads to coordinate with nearby hardwood flooring, trim, or millwork. Exact colour behaviour depends on the wood species, existing finish, and lighting, but matching is a standard part of staircase renovation work.`,
		},
		{
			title: `Do you install black metal balusters?`,
			desc: `Yes. Black metal balusters are one of the most requested staircase upgrades because they quickly modernize older stairs and work well with both dark and natural wood finishes.`,
		},
		{
			title: `Can you replace just the railing and keep the stairs?`,
			desc: `Yes. Some projects only need a railing upgrade, while others combine railing work with tread refinishing or stair capping. We can price the staircase in phases depending on what makes the most sense visually and structurally.`,
		},
		{
			title: `What staircase styles do you work on in ${city}?`,
			desc: `We work on straight staircases, curved staircases, builder-grade stairs, carpeted stairs, open-concept staircases, and more decorative feature staircases depending on the home and layout.`,
		},
		{
			title: `Can you update an older oak staircase?`,
			desc: `Yes. Older oak staircases are often great candidates for modernization. Common upgrades include darker stain colours, white risers, black metal balusters, updated posts, and cleaner railing profiles.`,
		},
		{
			title: `Do you repair squeaks, loose treads, or worn areas before refinishing?`,
			desc: `Yes. Basic staircase repair and stabilization can be handled before finishing work begins. Surface damage, loose components, and worn areas should be corrected first so the finished staircase looks and feels solid.`,
		},
		{
			title: `What is better: stair refinishing or tread caps?`,
			desc: `It depends on the starting staircase. If the existing hardwood is in good condition, refinishing may be the most efficient option. If the stairs are carpeted or the visible surfaces are not worth restoring, tread caps may provide a cleaner and more dramatic result.`,
		},
		{
			title: `Can staircase refinishing increase home value in ${city}?`,
			desc: `A staircase is one of the most visible features in the home, so upgrading it can have a strong visual impact. Clean, modern stairs generally improve first impressions and help the overall interior feel more updated and cohesive.`,
		},
		{
			title: `Do you work in occupied homes?`,
			desc: `Yes. Most staircase projects are completed in lived-in homes, so the process is organized around protection, cleanliness, and keeping disruption as controlled as possible.`,
		},
		{
			title: `Can you quote staircase refinishing from photos?`,
			desc: `In many cases, yes. Clear photos from the bottom, side, upper landing, and railing details are often enough for an initial estimate. Final pricing can depend on site conditions, measurements, and the exact upgrade path.`,
		},
		{
			title: `Do you service nearby areas around ${city}?`,
			desc: `Yes. In addition to ${city}, we typically work throughout nearby areas such as ${nearbyText}.`,
		},
		...premiumItem,
		...heritageItem,
		...practicalItem,
	];
}

/* -----------------------------
   CITY PAGE BUILDER
----------------------------- */

function buildCityYaml(citySlug) {
	const city = toTitle(citySlug);
	const images = getImages(citySlug);

	if (!images.length) return null;

	const hero = pickHero(images);
	const faqItems = getFaqItems(citySlug, city);

	return `
title: Staircase Renovation in ${city}
hidden: true
desc: |-
  Dust-free staircase refinishing, hardwood stair capping, and custom railing installation in ${city}. Transform your stairs with modern finishes, iron balusters, or glass railings — all completed cleanly in lived-in homes.

seo: |-
  Staircase renovation ${city}, stair refinishing ${city}, stair tread caps ${city}, railing installation ${city}, modern staircase upgrades ${city}.

image:
  src: ${hero.rel}
  alt: Staircase renovation in ${city}

sections:
  - type: Benefits
    title: Why upgrade your staircase in ${city}?
    content:
      - title: Dust-free process
        desc: |-
          We complete staircase renovations using professional dust extraction, keeping your home clean and livable throughout the project.

      - title: Fast transformation
        desc: |-
          Most staircase upgrades in ${city} are completed in under a week, depending on scope and materials.

      - title: Matched to your home
        desc: |-
          Every staircase is custom-finished to match your flooring, trim, and overall interior design.

  - type: ImageCarousel
    content:
${images
	.map(
		(img) => `      - src: ${img.rel}
        alt: Staircase renovation ${city}`,
	)
	.join('\n')}

  - type: ZigZag
    title: Staircase services in ${city}
    content:
      - title: Staircase refinishing
        link: /services/stairs/refinishing
        desc: |-
          Restore your existing stairs with sanding, staining, and durable finishes.
        image:
          src: ${hero.rel}
          alt: Stair refinishing ${city}

      - title: Hardwood stair capping
        link: /services/stairs/tread-caps
        desc: |-
          Convert carpeted stairs into solid hardwood using oak tread caps.
        image:
          src: ${(images[1] || hero).rel}
          alt: Stair tread caps ${city}

      - title: Railing upgrades
        link: /services/stairs/railing-installation
        desc: |-
          Upgrade to iron, glass, or modern railing systems.
        image:
          src: ${(images[2] || hero).rel}
          alt: Stair railing ${city}

  - type: TextCarousel
    text:
      - staircase renovation ${city}
      - stair refinishing ${city}
      - tread caps ${city}
      - railing installation ${city}
      - modern staircase ${city}

  - type: Faq
    title: ${yamlQuote(`Staircase renovation in ${city} – FAQs`)}
    content:
${faqItems
	.map(
		(item) => `      - title: ${yamlQuote(item.title)}
        desc: |-
          ${item.desc}`,
	)
	.join('\n')}

  - type: Services
    exclude:
      - stairs
`;
}

/* -----------------------------
   WRITE FILES
----------------------------- */

function run() {
	const cities = getCities();

	cities.forEach((citySlug) => {
		const yaml = buildCityYaml(citySlug);
		if (!yaml) return;

		const outDir = path.join(ROOT, citySlug);
		if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

		const file = path.join(outDir, 'index.yaml');

		fs.writeFileSync(file, yaml.trim() + '\n');
		console.log('✔ Generated:', citySlug);
	});
}

run();
