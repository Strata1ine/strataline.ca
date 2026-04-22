import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const stairsPhotosRoot = path.join(root, 'content', 'services', 'stairs', 'photos');
const stairsContentRoot = path.join(root, 'content', 'services', 'stairs');

const cityMeta = [
	{ slug: 'ajax', name: 'Ajax' },
	{ slug: 'aurora', name: 'Aurora' },
	{ slug: 'bolton', name: 'Bolton' },
	{ slug: 'bradford', name: 'Bradford' },
	{ slug: 'burlington', name: 'Burlington' },
	{ slug: 'caledon', name: 'Caledon' },
	{ slug: 'etobicoke', name: 'Etobicoke' },
	{ slug: 'forest-hill', name: 'Forest Hill' },
	{ slug: 'innisfil', name: 'Innisfil' },
	{ slug: 'king-city', name: 'King City' },
	{ slug: 'kleinburg', name: 'Kleinburg' },
	{ slug: 'leaside', name: 'Leaside' },
	{ slug: 'markham', name: 'Markham' },
	{ slug: 'mississauga', name: 'Mississauga' },
	{ slug: 'newmarket', name: 'Newmarket' },
	{ slug: 'oakville', name: 'Oakville' },
	{ slug: 'oshawa', name: 'Oshawa' },
	{ slug: 'pickering', name: 'Pickering' },
	{ slug: 'richmond-hill', name: 'Richmond Hill' },
	{ slug: 'rosedale', name: 'Rosedale' },
	{ slug: 'stouffville', name: 'Stouffville' },
	{ slug: 'the-beaches', name: 'The Beaches' },
	{ slug: 'toronto', name: 'Toronto' },
	{ slug: 'vaughan', name: 'Vaughan' },
	{ slug: 'whitby', name: 'Whitby' },
	{ slug: 'woodbridge', name: 'Woodbridge' },
];

const nearbyMap = {
	ajax: ['pickering', 'whitby', 'oshawa'],
	aurora: ['newmarket', 'king-city', 'richmond-hill'],
	bolton: ['caledon', 'kleinburg', 'woodbridge'],
	bradford: ['innisfil', 'newmarket', 'aurora'],
	burlington: ['oakville', 'mississauga'],
	caledon: ['bolton', 'kleinburg', 'woodbridge'],
	etobicoke: ['toronto', 'mississauga', 'oakville'],
	'forest-hill': ['toronto', 'rosedale', 'leaside'],
	innisfil: ['bradford', 'newmarket'],
	'king-city': ['aurora', 'richmond-hill', 'vaughan'],
	kleinburg: ['woodbridge', 'vaughan', 'caledon'],
	leaside: ['toronto', 'forest-hill', 'rosedale'],
	markham: ['richmond-hill', 'stouffville', 'vaughan'],
	mississauga: ['oakville', 'etobicoke', 'burlington'],
	newmarket: ['aurora', 'bradford', 'richmond-hill'],
	oakville: ['mississauga', 'burlington'],
	oshawa: ['whitby', 'ajax', 'pickering'],
	pickering: ['ajax', 'whitby', 'oshawa'],
	'richmond-hill': ['markham', 'aurora', 'vaughan'],
	rosedale: ['toronto', 'forest-hill', 'leaside'],
	stouffville: ['markham', 'richmond-hill'],
	'the-beaches': ['toronto', 'leaside'],
	toronto: ['forest-hill', 'rosedale', 'the-beaches'],
	vaughan: ['woodbridge', 'kleinburg', 'richmond-hill'],
	whitby: ['ajax', 'pickering', 'oshawa'],
	woodbridge: ['vaughan', 'kleinburg', 'caledon'],
};

function isImageFile(name) {
	return /\.(jpg|jpeg|png|webp)$/i.test(name);
}

function safeReadDir(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true });
}

function getFiles(dir) {
	return safeReadDir(dir)
		.filter((entry) => entry.isFile() && isImageFile(entry.name))
		.map((entry) => entry.name)
		.sort((a, b) => a.localeCompare(b));
}

function getDirectories(dir) {
	return safeReadDir(dir)
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort((a, b) => a.localeCompare(b));
}

function scoreFile(filename) {
	const n = filename.toLowerCase();
	let score = 0;

	if (n.includes('hero')) score += 100;
	if (n.includes('full-view')) score += 60;
	if (n.includes('main-view')) score += 55;
	if (n.includes('overview')) score += 50;
	if (n.includes('full-run')) score += 45;
	if (n.includes('open-concept')) score += 35;
	if (n.includes('luxury')) score += 35;
	if (n.includes('curved-staircase')) score += 30;
	if (n.includes('after')) score += 25;

	if (n.includes('detail')) score -= 25;
	if (n.includes('tread-detail')) score -= 30;
	if (n.includes('baluster-detail')) score -= 30;
	if (n.includes('newel-post')) score -= 25;
	if (n.includes('top-view')) score -= 10;
	if (n.includes('down-view')) score -= 10;
	if (n.includes('before')) score -= 60;

	return score;
}

function pickHero(files) {
	if (!files.length) return null;
	return [...files].sort((a, b) => scoreFile(b) - scoreFile(a))[0] ?? files[0];
}

function getProjectFolders(citySlug) {
	const cityPath = path.join(stairsPhotosRoot, citySlug);
	const directFiles = getFiles(cityPath);
	const subdirs = getDirectories(cityPath);

	if (directFiles.length) {
		return [
			{
				id: citySlug,
				folder: citySlug,
				files: directFiles,
			},
		];
	}

	if (subdirs.length) {
		return subdirs
			.map((subdir) => {
				const files = getFiles(path.join(cityPath, subdir));
				return {
					id: subdir,
					folder: `${citySlug}/${subdir}`,
					files,
				};
			})
			.filter((project) => project.files.length > 0);
	}

	const topLevelProjectDirs = getDirectories(stairsPhotosRoot).filter(
		(dir) => dir === `${citySlug}-project-1` || dir === `${citySlug}-project-2`,
	);

	return topLevelProjectDirs
		.map((dir) => {
			const files = getFiles(path.join(stairsPhotosRoot, dir));
			return {
				id: dir.replace(`${citySlug}-`, ''),
				folder: dir,
				files,
			};
		})
		.filter((project) => project.files.length > 0);
}

function buildCity(city) {
	const projects = getProjectFolders(city.slug);

	const allImages = projects.flatMap((project) =>
		project.files.map((file) => ({
			folder: project.folder,
			filename: file,
			project: project.id,
		})),
	);

	const featuredProject =
		projects.find((p) => /project-2|featured|hero/i.test(p.id)) ?? projects[0] ?? null;

	const heroFilename = featuredProject
		? pickHero(featuredProject.files)
		: pickHero(allImages.map((img) => img.filename));

	const featuredFilenames = featuredProject
		? [...featuredProject.files].sort((a, b) => scoreFile(b) - scoreFile(a)).slice(0, 3)
		: [...allImages]
				.sort((a, b) => scoreFile(b.filename) - scoreFile(a.filename))
				.slice(0, 3)
				.map((img) => img.filename);

	return {
		name: city.name,
		slug: city.slug,
		projects,
		heroFilename,
		featuredFilenames,
		nearby: nearbyMap[city.slug] ?? [],
		shortDesc: `Professional staircase refinishing in ${city.name} with dust-controlled sanding, modern railing upgrades, tread refinishing, and custom stair transformations.`,
		allImages,
	};
}

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function yamlQuote(str) {
	return `"${String(str ?? '')
		.replace(/\\/g, '\\\\')
		.replace(/"/g, '\\"')}"`;
}

function toHubImagePath(folder, file) {
	return `./photos/${folder}/${file}`;
}

function toCityImagePath(folder, file) {
	return `../photos/${folder}/${file}`;
}

function getHeroPath(city, pathMode = 'city') {
	if (!city.heroFilename) return '';
	const heroImage = city.allImages.find((img) => img.filename === city.heroFilename);
	if (!heroImage) return '';
	return pathMode === 'hub'
		? toHubImagePath(heroImage.folder, heroImage.filename)
		: toCityImagePath(heroImage.folder, heroImage.filename);
}

function getFeaturedImages(city, pathMode = 'city') {
	return city.featuredFilenames
		.map((filename) => city.allImages.find((img) => img.filename === filename))
		.filter(Boolean)
		.map((img) =>
			pathMode === 'hub'
				? toHubImagePath(img.folder, img.filename)
				: toCityImagePath(img.folder, img.filename),
		);
}

function getGalleryImages(city, pathMode = 'city') {
	return city.allImages.map((img) =>
		pathMode === 'hub'
			? toHubImagePath(img.folder, img.filename)
			: toCityImagePath(img.folder, img.filename),
	);
}

function buildImagePanelItems(city) {
	const featured = getFeaturedImages(city, 'city');
	const fallback = getGalleryImages(city, 'city');
	const images = [...featured, ...fallback].filter(Boolean).slice(0, 3);

	const labels = [
		{
			title: 'Featured staircase view',
			desc: `A real staircase renovation completed in ${city.name}, showing the overall finish and layout.`,
		},
		{
			title: 'Railing and tread detail',
			desc: `Close-up views of treads, railing upgrades, balusters, and finishing quality from ${city.name} projects.`,
		},
		{
			title: 'Finished transformation',
			desc: `Completed staircase refinishing with modern styling, cleaner lines, and upgraded visual impact.`,
		},
	];

	return images.map((src, i) => ({
		title: labels[i]?.title ?? 'Staircase project view',
		desc: labels[i]?.desc ?? `Completed staircase refinishing project in ${city.name}.`,
		src,
	}));
}

function buildServiceAreasCards(cities, currentSlug, pathMode = 'city') {
	return cities
		.filter((c) => c.slug !== currentSlug)
		.map((c) => {
			const hero = getHeroPath(c, pathMode);
			return {
				title: `Staircase Refinishing ${c.name}`,
				desc: `Professional staircase refinishing in ${c.name} with modern railings, tread refinishing, and real project galleries.`,
				image: hero,
				link: `/services/stairs/${c.slug}`,
			};
		})
		.filter((card) => !!card.image);
}

function buildNearbyZigZag(city, allCities) {
	const nearbyCities = city.nearby
		.map((slug) => allCities.find((c) => c.slug === slug))
		.filter(Boolean);

	const cards = buildServiceAreasCards(nearbyCities, null, 'city');

	return cards
		.map(
			(card) => `      - title: ${yamlQuote(card.title)}
        desc: |-
          ${card.desc}
        image:
          src: ${yamlQuote(card.image)}
          alt: ${yamlQuote(card.title)}
        link: ${yamlQuote(card.link)}`,
		)
		.join('\n');
}

function buildAllCitiesZigZag(cities) {
	return buildServiceAreasCards(cities, null, 'hub')
		.map(
			(card) => `      - title: ${yamlQuote(card.title)}
        desc: |-
          ${card.desc}
        image:
          src: ${yamlQuote(card.image)}
          alt: ${yamlQuote(card.title)}
        link: ${yamlQuote(card.link)}`,
		)
		.join('\n');
}

function buildCityYaml(city, allCities) {
	const hero = getHeroPath(city, 'city');
	const gallery = getGalleryImages(city, 'city');
	const imagePanelItems = buildImagePanelItems(city);
	const zigzag = buildNearbyZigZag(city, allCities);

	const galleryLines = gallery
		.map(
			(src) => `      - src: ${yamlQuote(src)}
        alt: ${yamlQuote(`Staircase refinishing in ${city.name}`)}`,
		)
		.join('\n');

	const imagePanelLines = imagePanelItems
		.map(
			(item) => `      - title: ${yamlQuote(item.title)}
        desc: |-
          ${item.desc}
        image:
          src: ${yamlQuote(item.src)}
          alt: ${yamlQuote(`Staircase refinishing ${city.name}`)}`,
		)
		.join('\n');

	return `title: ${yamlQuote(`Staircase Refinishing ${city.name}`)}
startPos: right

seo: |-
  staircase refinishing ${city.slug}, stair renovation ${city.slug}, stair sanding ${city.slug}, railing upgrades ${city.slug}, black balusters ${city.slug}, stair refinishing gta

desc: |-
  Professional staircase refinishing in ${city.name} including tread refinishing, railing upgrades, and modern stair transformations using dust-controlled sanding systems.

image:
  src: ${yamlQuote(hero)}
  alt: ${yamlQuote(`Staircase refinishing in ${city.name}`)}

sections:
  - type: Benefits
    title: Staircase refinishing done properly
    content:
      - title: Clean sanding with dust control
        desc: |-
          Our process keeps your home cleaner while restoring your staircase with professional sanding and finishing.

      - title: Modern railing upgrades
        desc: |-
          Upgrade dated spindles to black metal balusters and refresh the entire look of your staircase.

      - title: Real transformation results
        desc: |-
          These are actual staircase projects completed in ${city.name}, not stock images.

      - title: Built for occupied homes
        desc: |-
          Work is carefully contained and controlled so the home stays livable during the project.

  - type: ImagePanel
    title: Featured staircase projects in ${city.name}
    content:
${imagePanelLines}

  - type: ImageCarousel
    content:
${galleryLines}

  - type: Benefits
    title: What we upgrade on your staircase
    content:
      - title: Treads and risers
        desc: |-
          Refinish worn treads, update stain colour, and modernize the staircase.

      - title: Spindles and railings
        desc: |-
          Replace wood spindles with black metal balusters and update railing profiles.

      - title: Colour and finish
        desc: |-
          Match or contrast with your flooring for a cohesive modern look.

      - title: Full staircase transformation
        desc: |-
          Turn outdated builder-grade stairs into a modern focal point.

  - type: ZigZag
    title: Nearby staircase refinishing service areas
    content:
${zigzag}

  - type: Faq
    title: Staircase refinishing FAQ
    content:
      - title: Can you refinish stairs without replacing them?
        desc: |-
          Yes. Most staircases can be refinished and upgraded without full replacement.

      - title: Do you install black metal balusters?
        desc: |-
          Yes. This is one of the most popular upgrades for modernizing stairs.

      - title: Can you match my flooring?
        desc: |-
          Yes. We stain and finish treads to match or complement your flooring.

      - title: Is the process dusty?
        desc: |-
          No. We use dust-controlled sanding systems designed for occupied homes.

  - type: Services
    exclude:
      - stairs
`;
}

function buildMasterYaml(cities) {
	const firstCity = cities.find((c) => getHeroPath(c, 'hub'));
	const firstHero = firstCity ? getHeroPath(firstCity, 'hub') : '';

	const galleryLines = cities
		.filter((c) => getHeroPath(c, 'hub'))
		.slice(0, 12)
		.map(
			(c) => `      - src: ${yamlQuote(getHeroPath(c, 'hub'))}
        alt: ${yamlQuote(`Staircase refinishing ${c.name}`)}`,
		)
		.join('\n');

	const zigzag = buildAllCitiesZigZag(cities);

	return `title: ${yamlQuote('Staircase Refinishing Toronto & GTA')}
startPos: right

seo: |-
  staircase refinishing toronto, stair renovation gta, stair sanding, black balusters, railing upgrades, tread refinishing toronto, staircase refinishing vaughan, staircase refinishing richmond hill

desc: |-
  Professional staircase refinishing across Toronto and the GTA. Real staircase transformations, black metal baluster upgrades, tread refinishing, dust-controlled sanding, and modern stair renovation.

image:
  src: ${yamlQuote(firstHero)}
  alt: ${yamlQuote('Staircase refinishing projects')}

sections:
  - type: Benefits
    title: Staircase refinishing done properly
    content:
      - title: Dust-controlled sanding in occupied homes
        desc: |-
          Stair work is done carefully with containment and dust-controlled sanding methods designed for finished, lived-in homes.

      - title: Modern railing and baluster upgrades
        desc: |-
          We replace dated wood spindles with black metal balusters, refresh railings, and modernize the overall staircase look.

      - title: Real project experience across the GTA
        desc: |-
          The staircase photos on this page come from real projects completed in Toronto and surrounding service areas.

      - title: Builder-grade to premium transformation
        desc: |-
          A staircase upgrade can completely change the feel of the home without the cost and disruption of a full renovation.

  - type: ImagePanel
    title: What a staircase upgrade can change
    content:
      - title: Dark treads, white risers, cleaner lines
        desc: |-
          One of the most popular staircase upgrades is the shift from dated finishes to darker treads, brighter risers, and sharper railing lines.
        image:
          src: ${yamlQuote(firstHero)}
          alt: ${yamlQuote('Modern staircase refinishing')}

      - title: Railing upgrades that modernize the home
        desc: |-
          Replacing spindles and refining the railing profile often creates the biggest visual impact in the shortest amount of time.
        image:
          src: ${yamlQuote(cities[1] ? getHeroPath(cities[1], 'hub') : firstHero)}
          alt: ${yamlQuote('Stair railing upgrade')}

      - title: Curved and architectural staircase work
        desc: |-
          We also work on curved staircases and feature stairs where detailing, flow, and finish quality matter even more.
        image:
          src: ${yamlQuote(cities[2] ? getHeroPath(cities[2], 'hub') : firstHero)}
          alt: ${yamlQuote('Curved staircase refinishing')}

  - type: ImageCarousel
    content:
${galleryLines}

  - type: Benefits
    title: What affects staircase refinishing quality
    content:
      - title: Surface preparation
        desc: |-
          Good stair refinishing starts with proper prep, careful sanding, edge work, and making sure the staircase is ready for a clean finish.

      - title: Railing and spindle selection
        desc: |-
          The staircase should feel cohesive. Baluster style, post details, and stain colour all affect the final result.

      - title: Colour matching and flooring transitions
        desc: |-
          Staircases need to work with the surrounding flooring, trim, and layout so they look integrated rather than patched together.

      - title: Final finish and durability
        desc: |-
          Clean coats, strong adhesion, and careful finishing are what separate a sharp-looking staircase from a rushed one.

  - type: ZigZag
    title: Staircase refinishing by city
    content:
${zigzag}

  - type: Faq
    title: Staircase refinishing FAQ
    content:
      - title: Can you refinish existing stairs without replacing the whole staircase?
        desc: |-
          Yes. In many cases the existing staircase can be refinished and upgraded without full replacement.

      - title: Do you install black metal balusters?
        desc: |-
          Yes. Black metal balusters are one of the most popular railing upgrades for modernizing an older staircase.

      - title: Can you match new flooring?
        desc: |-
          Yes. Tread colour and finish can often be selected to coordinate closely with nearby hardwood or new flooring.

      - title: Is staircase refinishing dusty?
        desc: |-
          Our process uses dust-controlled sanding methods intended for occupied homes and finished interiors.

  - type: ImagePanel
    title: Get a quote for staircase refinishing
    content:
      - title: Send photos of your staircase
        desc: |-
          The fastest way to get pricing is to send clear staircase photos from the bottom, side, top landing, and any railing details.
        image:
          src: ${yamlQuote(firstHero)}
          alt: ${yamlQuote('Staircase quote request')}

      - title: Builder-grade or full transformation
        desc: |-
          Some clients want a straightforward refinishing job, while others want a full visual transformation with new balusters and updated railings.
        image:
          src: ${yamlQuote(cities[3] ? getHeroPath(cities[3], 'hub') : firstHero)}
          alt: ${yamlQuote('Builder grade staircase transformation')}

      - title: Real results, not stock images
        desc: |-
          Every gallery shown here is based on real staircase work, which makes it easier to understand the level of finish and style we deliver.
        image:
          src: ${yamlQuote(cities[4] ? getHeroPath(cities[4], 'hub') : firstHero)}
          alt: ${yamlQuote('Real staircase refinishing project')}

  - type: Services
    exclude:
      - stairs
`;
}

function writeFile(filePath, contents) {
	ensureDir(path.dirname(filePath));
	fs.writeFileSync(filePath, contents, 'utf8');
	console.log(`Wrote: ${path.relative(root, filePath)}`);
}

function main() {
	const cities = cityMeta.map(buildCity).filter((city) => city.allImages.length > 0);

	const masterYaml = buildMasterYaml(cities);
	writeFile(path.join(stairsContentRoot, 'index.yaml'), masterYaml);

	for (const city of cities) {
		const cityDir = path.join(stairsContentRoot, city.slug);
		const cityYaml = buildCityYaml(city, cities);
		writeFile(path.join(cityDir, 'index.yaml'), cityYaml);
	}

	console.log(`Done. Generated ${cities.length} city index.yaml files + stairs/index.yaml`);
}

main();
