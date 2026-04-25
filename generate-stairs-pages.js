import fs from 'fs';
import path from 'path';

const ROOT = './content/services/stairs';
const PHOTOS = `${ROOT}/photos`;

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

const toTitle = (slug) =>
	slug
		.split('-')
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join(' ');

const isImage = (name) => /\.(jpg|jpeg|png|webp)$/i.test(name);

function yamlQuote(str) {
	return `"${String(str ?? '')
		.replace(/\\/g, '\\\\')
		.replace(/"/g, '\\"')}"`;
}

function getCities() {
	return fs
		.readdirSync(PHOTOS)
		.filter((f) => fs.statSync(path.join(PHOTOS, f)).isDirectory())
		.filter((f) => !f.includes('-project-'));
}

function getImages(city) {
	const dir = path.join(PHOTOS, city);
	if (!fs.existsSync(dir)) return [];

	if (city === 'woodbridge') {
		return fs
			.readdirSync(dir, { withFileTypes: true })
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
			})
			.sort((a, b) => a.file.localeCompare(b.file));
	}

	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((e) => e.isFile() && isImage(e.name))
		.map((e) => ({
			file: e.name,
			rel: `../photos/${city}/${e.name}`,
		}))
		.sort((a, b) => a.file.localeCompare(b.file));
}

function pickHero(images) {
	return (
		images.find((i) => i.file.toLowerCase().includes('main')) ||
		images.find((i) => i.file.toLowerCase().includes('full-view')) ||
		images.find((i) => i.file.toLowerCase().includes('full-run')) ||
		images.find((i) => i.file.toLowerCase().includes('overview')) ||
		images[0]
	);
}

function getTrustLine(citySlug) {
	if (citySlug === 'leaside') {
		return 'Includes heritage and institutional staircase restoration experience, including Sunnybrook Hospital-style restoration work.';
	}

	if (['toronto', 'rosedale', 'forest-hill', 'oakville', 'king-city'].includes(citySlug)) {
		return 'Premium staircase work for higher-end homes, curved stairs, feature staircases, and detailed railing upgrades.';
	}

	if (citySlug === 'aurora') {
		return 'Includes HGTV / featured-home style staircase renovation experience and luxury open-concept stair projects.';
	}

	return 'Dust-controlled stair refinishing, railing upgrades, and real local project experience across the GTA.';
}

function getCtaItems(citySlug, city) {
	const trustLine = getTrustLine(citySlug);

	return {
		title: `Get a staircase quote in ${city}`,
		items: [
			{
				title: 'Text photos to 4164715999 for a faster estimate',
				desc: `Send photos of your staircase from the bottom, side, upper landing, and railing close-ups. For most ${city} staircase projects, photos are enough to give an initial direction before an in-home visit.`,
			},
			{
				title: 'Choose the right upgrade path',
				desc: 'We help determine whether your staircase needs refinishing, hardwood tread caps, black metal balusters, railing replacement, repairs, or a full visual transformation.',
			},
			{
				title: 'Clear scope before pricing',
				desc: 'Your quote is broken down by scope so you know what is included: sanding, staining, risers, tread caps, railings, balusters, repairs, protection, and finishing.',
			},
			{
				title: 'Built around clean, occupied-home work',
				desc: `${trustLine} The process is planned around protection, dust control, and keeping the home as livable as possible while the work is underway.`,
			},
		],
	};
}

function getFaqItems(citySlug, city) {
	const nearby = nearbyMap[citySlug] || [];
	const nearbyText = nearby.length ? nearby.join(', ') : 'surrounding GTA communities';

	const premiumCities = ['toronto', 'rosedale', 'forest-hill', 'oakville', 'king-city'];
	const heritageCities = ['leaside'];
	const practicalCities = ['oshawa', 'whitby', 'ajax', 'pickering', 'innisfil', 'bradford'];

	const isPremium = premiumCities.includes(citySlug);
	const isHeritage = heritageCities.includes(citySlug);
	const isPractical = practicalCities.includes(citySlug);

	return [
		{
			title: `How long does staircase refinishing take in ${city}?`,
			desc: `Most staircase projects in ${city} take between 3 and 7 days depending on whether the work involves refinishing, tread caps, railing upgrades, or a full transformation.`,
		},
		{
			title: 'Is staircase refinishing messy or dusty?',
			desc: 'No. We use dust-controlled sanding systems designed for finished homes, which keeps the process significantly cleaner compared to traditional open sanding.',
		},
		{
			title: 'Can you refinish stairs without replacing them?',
			desc: 'Yes. In many homes, the existing staircase structure is solid and only the visible surfaces need updating. This allows for a full visual transformation without rebuilding.',
		},
		{
			title: 'Should I refinish my stairs or install tread caps?',
			desc: 'It depends on the condition of the existing staircase. If the wood is in good shape, refinishing is often the best option. If the stairs are carpeted or heavily worn, tread caps usually produce a cleaner, more consistent result.',
		},
		{
			title: 'Can you match my hardwood floors?',
			desc: 'Yes. Stair treads are stained to coordinate with your existing flooring, trim, and interior finishes so the staircase feels intentional and integrated.',
		},
		{
			title: 'Do you install black metal balusters?',
			desc: 'Yes. Black metal balusters are one of the most effective upgrades for modernizing a staircase and are commonly paired with both dark and natural wood finishes.',
		},
		{
			title: 'Can you upgrade just the railing?',
			desc: 'Yes. Some projects focus only on railing upgrades, while others combine railing work with tread refinishing or stair capping depending on the condition and design goals.',
		},
		{
			title: 'Do you repair squeaks or loose stairs before refinishing?',
			desc: 'Yes. Any structural or surface issues are addressed before finishing to ensure the final result is both solid and visually clean.',
		},
		{
			title: 'How disruptive is the process in a lived-in home?',
			desc: 'Most projects are completed in occupied homes. Work is staged carefully to maintain access where possible while keeping the site clean and controlled.',
		},
		{
			title: `Can staircase renovation increase home value in ${city}?`,
			desc: 'Yes. A staircase is often one of the first interior features people notice, so upgrading it can significantly improve how the entire home presents.',
		},
		{
			title: `How do I get a quote for staircase work in ${city}?`,
			desc: 'Most estimates can start with photos. Images from the bottom, side, top landing, and railing details help determine the scope before confirming on site.',
		},
		{
			title: `Do you work in areas around ${city}?`,
			desc: `Yes. In addition to ${city}, we work in nearby areas such as ${nearbyText}.`,
		},
		...(isPremium
			? [
					{
						title: `Do you handle high-end or curved staircases in ${city}?`,
						desc: `Yes. Many projects in ${city} involve curved staircases, open foyers, and feature stairs where detail work, railing design, and finish quality are especially important.`,
					},
					{
						title: 'Can you help choose a modern staircase style?',
						desc: 'Yes. We guide decisions on stain direction, railing style, and proportions so the finished staircase works with the architecture of the home rather than feeling like a patchwork upgrade.',
					},
				]
			: []),
		...(isHeritage
			? [
					{
						title: `Do you restore older or heritage staircases near ${city}?`,
						desc: 'Yes. Some projects involve restoring existing woodwork while preserving the original character, rather than fully modernizing the staircase.',
					},
				]
			: []),
		...(isPractical
			? [
					{
						title: 'Is refinishing more cost-effective than replacing stairs?',
						desc: 'In most cases, yes. Refinishing or upgrading the existing structure provides a major visual improvement at a lower cost than full replacement.',
					},
					{
						title: 'What’s the most impactful upgrade for the cost?',
						desc: 'Replacing spindles with black metal balusters and updating the tread finish typically creates the biggest visual improvement for the least disruption.',
					},
				]
			: []),
	];
}

function buildCityYaml(citySlug) {
	const city = toTitle(citySlug);
	const images = getImages(citySlug);

	if (!images.length) return null;

	const hero = pickHero(images);
	const faqItems = getFaqItems(citySlug, city);
	const cta = getCtaItems(citySlug, city);

	return `
title: Staircase Renovation in ${city}
hidden: true
desc: |-
  Professional staircase refinishing, stair capping, and railing upgrades in ${city}. Clean, dust-controlled work designed for lived-in homes.

seo: |-
  Staircase renovation ${city}, stair refinishing ${city}, stair tread caps ${city}, railing installation ${city}, modern staircase upgrades ${city}, dust free stair sanding ${city}.

image:
  src: ${hero.rel}
  alt: Staircase renovation in ${city}

sections:

  - type: Benefits
    title: Why upgrade your staircase in ${city}?
    content:
      - title: Clean, dust-controlled process
        desc: |-
          We use professional sanding systems designed for finished homes. Your space stays clean and livable during the project.

      - title: Fast turnaround
        desc: |-
          Most staircase projects in ${city} are completed within a week, depending on scope and access.

      - title: Real transformation
        desc: |-
          From outdated oak to modern finishes, stair upgrades dramatically change how your home feels.

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
          Sand, stain, and restore existing stairs without rebuilding.
        image:
          src: ${hero.rel}
          alt: Stair refinishing ${city}

      - title: Hardwood stair capping
        link: /services/stairs/tread-caps
        desc: |-
          Convert carpet stairs into clean, solid hardwood.
        image:
          src: ${(images[1] || hero).rel}
          alt: Stair tread caps ${city}

      - title: Railing upgrades
        link: /services/stairs/railing-installation
        desc: |-
          Upgrade to black metal, glass, or modern railings.
        image:
          src: ${(images[2] || hero).rel}
          alt: Stair railing ${city}

  - type: TextCarousel
    text:
      - staircase renovation ${city}
      - stair refinishing ${city}
      - tread caps ${city}
      - railing installation ${city}
      - dust free stair sanding ${city}
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

  - type: ImagePanel
    title: ${yamlQuote(cta.title)}
    content:
${cta.items
	.map(
		(item, index) => `      - title: ${yamlQuote(item.title)}
        desc: |-
          ${item.desc}
        image:
          src: ${(images[index] || hero).rel}
          alt: ${yamlQuote(`${item.title} in ${city}`)}`,
	)
	.join('\n')}

  - type: TextCarousel
    text:
      - send staircase photos ${city}
      - staircase quote ${city}
      - stair refinishing contractor ${city}
      - dust free stair sanding ${city}
      - stair upgrade options ${city}

  - type: Services
    exclude:
      - stairs
`;
}

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
