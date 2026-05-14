import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const baseDir = path.join(projectRoot, 'content', 'services', 'popcorn-removal');
const hubPath = path.join(baseDir, 'index.yaml');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const SYSTEM_FOLDERS = new Set(['images', 'media']);

const IGNORED_FOLDERS = new Set([
	'.git',
	'.astro',
	'dist',
	'node_modules',
	'thumbnails',
	'thumbnail',
	'thumbs',
	'cache',
	'.cache',
]);

const fallbackImages = ['cover.jpg', 'before.jpg', 'removal.jpg', 'cleanup.jpg'];

const CITY_NAMES = {
	ajax: 'Ajax',
	aurora: 'Aurora',
	bolton: 'Bolton',
	burlington: 'Burlington',
	caledon: 'Caledon',
	etobicoke: 'Etobicoke',
	'forest-hill': 'Forest Hill',
	innisfil: 'Innisfil',
	'king-city': 'King City',
	kleinburg: 'Kleinburg',
	leaside: 'Leaside',
	markham: 'Markham',
	mississauga: 'Mississauga',
	newmarket: 'Newmarket',
	oakville: 'Oakville',
	oshawa: 'Oshawa',
	pickering: 'Pickering',
	'richmond-hill': 'Richmond Hill',
	rosedale: 'Rosedale',
	stouffville: 'Stouffville',
	'the-beaches': 'The Beaches',
	toronto: 'Toronto',
	vaughan: 'Vaughan',
	whitby: 'Whitby',
	woodbridge: 'Woodbridge',
};

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function dedupe(arr) {
	return [...new Set(arr.filter(Boolean))];
}

function titleCaseSlug(slug) {
	return slug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function isImageFile(filePath) {
	return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function toPosix(filePath) {
	return String(filePath || '').replace(/\\/g, '/');
}

function relativeToCity(cityDir, filePath) {
	return toPosix(path.relative(cityDir, filePath));
}

function cleanRelativeImagePath(imagePath) {
	return toPosix(imagePath)
		.replace(/^(\.\/)+/, '')
		.replace(/^\/+/, '');
}

function imageRef(imagePath) {
	if (!imagePath) return '../cover.jpg';

	const clean = cleanRelativeImagePath(imagePath);

	if (fallbackImages.includes(clean)) {
		return `../${clean}`;
	}

	return `./${clean}`;
}

function imageRefFromHub(city, imagePath) {
	if (!imagePath) return './cover.jpg';

	const clean = cleanRelativeImagePath(imagePath);

	if (fallbackImages.includes(clean)) {
		return `./${clean}`;
	}

	return `./${city.slug}/${clean}`;
}

function siblingCityImageRef(city, imagePath) {
	if (!imagePath) return '../cover.jpg';

	const clean = cleanRelativeImagePath(imagePath);

	if (fallbackImages.includes(clean)) {
		return `../${clean}`;
	}

	return `../${city.slug}/${clean}`;
}

function yamlText(value) {
	return String(value || '')
		.replace(/\t/g, '  ')
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n');
}

function getNumericSuffix(filePath, type) {
	const name = path.basename(filePath).toLowerCase();
	const match = name.match(new RegExp(`${type}[-_ ]?(\\d+)`));

	if (match) return Number(match[1]);

	const anyNumber = name.match(/(\d+)(?=\.[a-z0-9]+$)/);
	return anyNumber ? Number(anyNumber[1]) : 9999;
}

function naturalSortByNumber(type) {
	return (a, b) => {
		const aNum = getNumericSuffix(a, type);
		const bNum = getNumericSuffix(b, type);

		if (aNum !== bNum) return aNum - bNum;

		return a.localeCompare(b);
	};
}

function scanImagesRecursive(dir) {
	if (!fs.existsSync(dir)) return [];

	const results = [];

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (IGNORED_FOLDERS.has(entry.name)) continue;

			results.push(...scanImagesRecursive(fullPath));
		} else if (entry.isFile() && isImageFile(fullPath)) {
			results.push(fullPath);
		}
	}

	return results;
}

function classifyImage(relativePath) {
	const p = toPosix(relativePath).toLowerCase();

	if (p.includes('/before/')) return 'before';
	if (p.includes('/after/')) return 'after';
	if (p.includes('/process/')) return 'process';
	if (p.includes('/gallery/')) return 'gallery';

	if (p.includes('before')) return 'before';
	if (p.includes('after')) return 'after';
	if (p.includes('process')) return 'process';
	if (p.includes('removal')) return 'process';
	if (p.includes('cleanup')) return 'process';

	return 'gallery';
}

function getProjectName(relativePath) {
	const parts = toPosix(relativePath).split('/');
	const projectPart = parts.find((part) => /^project-\d+$/i.test(part));

	return projectPart || 'project-1';
}

function emptyProject() {
	return {
		before: [],
		after: [],
		gallery: [],
		process: [],
	};
}

function loadAssets() {
	if (!fs.existsSync(baseDir)) {
		throw new Error(`Popcorn base directory not found: ${baseDir}`);
	}

	const cityMap = new Map();

	for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		if (SYSTEM_FOLDERS.has(entry.name)) continue;
		if (IGNORED_FOLDERS.has(entry.name)) continue;

		const slug = entry.name;
		const cityDir = path.join(baseDir, slug);
		const files = scanImagesRecursive(cityDir);

		if (!files.length) continue;

		const city = {
			slug,
			name: CITY_NAMES[slug] || titleCaseSlug(slug),
			dir: cityDir,
			projects: new Map(),
			all: [],
		};

		for (const file of files) {
			const relativePath = relativeToCity(cityDir, file);
			const projectName = getProjectName(relativePath);
			const type = classifyImage(relativePath);

			if (!city.projects.has(projectName)) {
				city.projects.set(projectName, emptyProject());
			}

			const assets = city.projects.get(projectName);

			assets[type].push(relativePath);
			city.all.push(relativePath);
		}

		for (const assets of city.projects.values()) {
			assets.before = dedupe(assets.before).sort(naturalSortByNumber('before'));
			assets.after = dedupe(assets.after).sort(naturalSortByNumber('after'));
			assets.gallery = dedupe(assets.gallery).sort(naturalSortByNumber('gallery'));
			assets.process = dedupe(assets.process).sort(naturalSortByNumber('process'));
		}

		city.all = dedupe(city.all);
		cityMap.set(slug, city);
	}

	const cities = [...cityMap.values()].sort((a, b) => a.name.localeCompare(b.name));

	if (!cities.length) {
		throw new Error(`No city image folders found under ${baseDir}`);
	}

	return cities;
}

function heroImage(city) {
	for (const assets of city.projects.values()) {
		if (assets.after[0]) return assets.after[0];
		if (assets.gallery[0]) return assets.gallery[0];
		if (assets.process[0]) return assets.process[0];
		if (assets.before[0]) return assets.before[0];
	}

	return fallbackImages[0];
}

function cityGallery(city, count = 16) {
	const images = [];

	for (const assets of city.projects.values()) {
		images.push(...assets.after, ...assets.gallery, ...assets.process, ...assets.before);
	}

	return dedupe(images).slice(0, count);
}

function processImages(city, count = 6) {
	const images = [];

	for (const assets of city.projects.values()) {
		images.push(...assets.process, ...assets.gallery, ...assets.after);
	}

	return dedupe([...images, ...fallbackImages]).slice(0, count);
}

function afterImages(city, count = 6) {
	const images = [];

	for (const assets of city.projects.values()) {
		images.push(...assets.after, ...assets.gallery);
	}

	return dedupe([...images, ...fallbackImages]).slice(0, count);
}

function beforeAfterPairs(city, count = 12) {
	const pairs = [];

	for (const [projectName, assets] of city.projects.entries()) {
		const before = assets.before;
		const after = assets.after;
		const max = Math.min(before.length, after.length);

		for (let i = 0; i < max; i++) {
			pairs.push({
				title: `${city.name} ${projectName.replace(/-/g, ' ')} ceiling transformation ${i + 1}`,
				before: before[i],
				after: after[i],
				projectName,
			});
		}
	}

	return pairs.slice(0, count);
}

function hasMultipleProjects(city) {
	return city.projects.size >= 2;
}

function cityDesc(city) {
	return `Professional dust-free popcorn ceiling removal in ${city.name} with HEPA extraction, skim coating, ceiling smoothing, and a clean modern finish for finished and occupied homes.`;
}

function cityPositioning(city) {
	const luxuryCities = new Set([
		'forest-hill',
		'king-city',
		'kleinburg',
		'leaside',
		'rosedale',
		'woodbridge',
		'vaughan',
		'caledon',
	]);

	if (luxuryCities.has(city.slug)) {
		return `In ${city.name}, many homes have larger rooms, detailed trim, premium flooring, open-to-above areas, and finished interiors that need a careful, controlled ceiling refinishing process. Our approach is built around protecting the home while removing outdated texture and producing a smooth ceiling finish that fits higher-end interiors.`;
	}

	if (city.slug === 'toronto' || city.slug === 'the-beaches' || city.slug === 'etobicoke') {
		return `In ${city.name}, popcorn ceiling removal often involves finished homes, condos, older drywall, tight access, elevators, shared hallways, and careful protection of occupied spaces. We plan the work so the ceiling can be modernized without turning the property into a dusty construction site.`;
	}

	return `In ${city.name}, popcorn ceiling removal is one of the most effective ways to update older rooms, brighten the home, and create a cleaner finished look. The key is not just removing texture, but correcting the ceiling surface so it looks smooth once painted.`;
}

function cityLinks(cities, currentSlug, page) {
	return cities
		.filter((city) => city.slug !== currentSlug)
		.map(
			(city) => `      - title: Popcorn ceiling removal ${city.name}
        desc: |-
          ${cityDesc(city)}
        image:
          src: ${page === 'hub' ? imageRefFromHub(city, heroImage(city)) : siblingCityImageRef(city, heroImage(city))}
          alt: Popcorn ceiling removal in ${city.name} with smooth ceiling finish.
        link: /services/popcorn-removal/${city.slug}`,
		)
		.join('\n');
}

function beforeAfterSection(city) {
	const pairs = beforeAfterPairs(city, 12);

	if (!pairs.length) return '';

	return `
  - type: BeforeAfter
    title: Real popcorn ceiling removal before and after in ${city.name}
    intro: |-
      These before and after comparisons show the difference between dated popcorn texture and a smoother, brighter ceiling after professional removal, skim coating, sanding, and finishing.
    content:
${pairs
	.map(
		(pair) => `      - title: ${pair.title}
        desc: |-
          A real ${city.name} ceiling transformation showing popcorn texture removal, surface correction, smoothing, and finishing.
        before: ${imageRef(pair.before)}
        after: ${imageRef(pair.after)}`,
	)
	.join('\n')}
`;
}

function projectSections(city) {
	if (!hasMultipleProjects(city)) return '';

	return [...city.projects.entries()]
		.map(([projectName, assets]) => {
			const images = dedupe([
				...assets.after,
				...assets.gallery,
				...assets.process,
				...assets.before,
			]).slice(0, 6);

			if (images.length < 3) return '';

			return `
  - type: ImagePanel
    title: ${city.name} ${projectName.replace(/-/g, ' ')} popcorn ceiling project
    content:
      - title: Existing texture and ceiling condition
        desc: |-
          Every popcorn ceiling behaves differently. Painted texture, old drywall seams, patches, cracks, bulkheads, and previous repairs all affect the amount of preparation and skim coating needed.
        image:
          src: ${imageRef(images[0])}
          alt: Existing popcorn ceiling condition in ${city.name}.

      - title: Controlled removal and sanding
        desc: |-
          The ceiling is handled with a controlled process designed to reduce airborne dust and protect the home. Where texture is painted, sanding and HEPA extraction become especially important.
        image:
          src: ${imageRef(images[1])}
          alt: Dust-controlled popcorn ceiling removal process in ${city.name}.

      - title: Smooth ceiling finish
        desc: |-
          After the texture is removed, the ceiling is corrected, skim coated, sanded, primed, and painted for a cleaner modern finish.
        image:
          src: ${imageRef(images[2])}
          alt: Smooth ceiling finish for ${city.name} ${projectName.replace(/-/g, ' ')}.`;
		})
		.filter(Boolean)
		.join('\n');
}

function localizedFaq(city) {
	return `  - type: Faq
    title: Popcorn ceiling removal ${city.name} FAQ
    content:
      - title: How much does popcorn ceiling removal cost in ${city.name}?
        desc: |-
          Most popcorn ceiling removal in ${city.name} ranges from about $4 to $9 per square foot. The final price depends on ceiling height, room access, whether the texture is painted, how much skim coating is needed, how much protection is required, and whether ceiling painting is included.

      - title: Why do ${city.name} popcorn ceilings often need skim coating?
        desc: |-
          Popcorn texture usually hides drywall seams, patches, waves, fastener marks, and old repairs. Once the texture is removed, those imperfections become visible. Skim coating is what turns the exposed drywall into a smooth, modern ceiling surface.

      - title: Is dust-free popcorn ceiling removal possible in an occupied ${city.name} home?
        desc: |-
          Yes. The goal is dust control at the source. We use masking, floor protection, containment, Festool Planex sanding equipment, and HEPA extraction to keep the work controlled inside finished and occupied homes.

      - title: Do painted popcorn ceilings cost more to remove in ${city.name}?
        desc: |-
          Usually yes. Painted popcorn texture is harder to remove because paint seals the surface. These ceilings often need controlled sanding, more skim coating, and more finishing time than unpainted texture.

      - title: Can you quote popcorn ceiling removal in ${city.name} from photos?
        desc: |-
          Yes. Send ceiling photos, approximate room sizes, ceiling height, and whether the texture has been painted. For many ${city.name} homes, photos are enough to provide a useful price range before a site visit.

      - title: How long does popcorn ceiling removal take in ${city.name}?
        desc: |-
          Small rooms may take a day. Larger projects, painted ceilings, high ceilings, stairwells, open-to-above areas, and heavy skim coating can take several days because drying, sanding, priming, and painting all affect the schedule.

      - title: Can popcorn ceilings be removed before listing a ${city.name} home for sale?
        desc: |-
          Yes. Smooth ceilings make older homes look cleaner, brighter, and more move-in ready. For sellers in ${city.name}, popcorn ceiling removal is often one of the strongest cosmetic upgrades before listing.

      - title: What is the difference between popcorn removal and ceiling smoothing?
        desc: |-
          Popcorn removal means removing the texture. Ceiling smoothing includes the finishing work afterward: patching, skim coating, sanding, priming, and painting so the ceiling looks flat and modern.

      - title: Can you remove popcorn ceilings around pot lights in ${city.name} homes?
        desc: |-
          Yes. Pot lights, vents, bulkheads, ceiling transitions, crown moulding, and fixtures can be worked around carefully. If new pot lights are planned, it is often best to coordinate them with the ceiling refinishing.

      - title: Do you paint the ceiling after popcorn removal?
        desc: |-
          A complete smooth ceiling project usually includes texture removal, surface correction, skim coating where needed, sanding, primer, and ceiling paint. Painting is what completes the clean modern finish.

      - title: Can you remove popcorn ceilings from high ceilings or stairwells?
        desc: |-
          Yes. High ceilings, stairwells, vaulted spaces, and open-to-above areas can be done, but they require extra setup, access equipment, protection, sanding time, and finishing labour.

      - title: What if the ceiling in my ${city.name} home has cracks or old repairs?
        desc: |-
          Cracks, old patches, uneven seams, and previous drywall repairs can usually be corrected during the smoothing process. Once the popcorn texture is removed, those areas are repaired and blended before primer and paint.

      - title: Will popcorn ceiling removal damage the drywall?
        desc: |-
          The drywall underneath may already be imperfect. Removal exposes what the texture was hiding. The finishing process is designed to correct those imperfections with patching, skim coating, and controlled sanding.

      - title: Should popcorn ceilings be scraped or sanded?
        desc: |-
          It depends on the ceiling. Unpainted texture may scrape more easily. Painted texture often needs controlled sanding because the paint locks the texture together. The right method is chosen after assessing the ceiling.

      - title: Is asbestos a concern with popcorn ceilings in ${city.name}?
        desc: |-
          In older homes, especially those built before the late 1980s, testing may be needed before disturbing ceiling texture. If asbestos is suspected, testing and proper abatement procedures should happen before standard refinishing.

      - title: Can popcorn removal be done room by room?
        desc: |-
          Yes. Some ${city.name} homeowners remove popcorn ceilings one area at a time, while others do the whole main floor or full house at once. Larger combined projects are usually more efficient because setup and protection are shared.

      - title: Do I need to move furniture before work starts?
        desc: |-
          Smaller items, valuables, art, and fragile pieces should be removed. Larger furniture can often be shifted and protected. The cleaner the space is before setup, the faster and safer the ceiling work goes.

      - title: Can popcorn removal be combined with wall painting?
        desc: |-
          Yes. Ceiling smoothing, ceiling painting, wall painting, trim painting, drywall repairs, and pot light work can often be coordinated together for a cleaner final result and fewer separate disruptions.

      - title: Why choose a dust-controlled contractor instead of the cheapest quote?
        desc: |-
          The cheapest quote may not include proper containment, HEPA sanding, surface correction, skim coating quality, primer, painting, or cleanup. A dust-controlled process protects the home and produces a better finished ceiling.

      - title: Are smooth ceilings harder to maintain than popcorn ceilings?
        desc: |-
          Smooth ceilings are usually easier to maintain. They are easier to repaint, easier to repair cleanly, and do not collect dust in the same textured way popcorn ceilings do.

      - title: Can you remove popcorn ceilings in condos in ${city.name}?
        desc: |-
          Yes, where building rules allow the work. Condos may require elevator protection, working-hour coordination, dust containment, and careful planning for hallways and shared access.

      - title: What rooms add the most value when smoothing ceilings?
        desc: |-
          Main floors, living rooms, kitchens, hallways, primary bedrooms, stairwells, and open-concept spaces usually create the biggest visual improvement because those areas are seen most often.

      - title: Can you repair water stains during popcorn ceiling removal?
        desc: |-
          Yes, but the source of the water issue must be fixed first. Once dry and stable, stained or damaged areas can be repaired, sealed, skim coated, primed, and painted.

      - title: Will the ceiling look perfectly flat after popcorn removal?
        desc: |-
          The final result depends on the existing drywall, ceiling framing, previous repairs, and the chosen finish level. Skim coating and sanding can dramatically improve the ceiling, but severe waves or structural issues may still influence the final surface.

      - title: How do I prepare for popcorn ceiling removal in ${city.name}?
        desc: |-
          Remove small furniture, fragile items, wall décor, curtains, valuables, and anything stored close to the work area. Share room sizes, ceiling height, photos, and any known history of painting or repairs before the estimate.

      - title: Do smooth ceilings make ${city.name} homes look more modern?
        desc: |-
          Yes. Removing popcorn texture is one of the fastest ways to make older rooms feel cleaner and more current, especially when paired with fresh paint, updated lighting, and repaired drywall seams.

      - title: Can popcorn ceiling removal be done with pets in the home?
        desc: |-
          Pets should be kept away from the work area because of masking, equipment, sanding noise, and open work zones. For occupied homes in ${city.name}, we recommend keeping pets in a separate closed area until cleanup is complete.

      - title: Why are some popcorn ceilings harder to smooth than others?
        desc: |-
          The difficulty depends on whether the texture was painted, how flat the drywall is underneath, whether previous repairs were done properly, ceiling height, access, and the finish level expected after painting.

      - title: Can you remove popcorn ceilings in older ${city.name} houses?
        desc: |-
          Yes, but older homes often need more surface correction. Texture may be hiding drywall seams, settlement cracks, older patches, or uneven board transitions that need repair after removal.

      - title: What finish level should I expect after popcorn removal?
        desc: |-
          Most homeowners want a smooth painted ceiling, but the exact finish depends on the existing surface and scope. A premium result usually requires removal, repairs, skim coating, sanding, primer, and finish paint.

      - title: Is popcorn ceiling removal messy if HEPA sanding is used?
        desc: |-
          Any drywall work can create dust, but HEPA extraction, masking, and containment make a major difference. The goal is to control dust at the source instead of letting it spread through the home.`;
}

function keywords(city) {
	return `primary:
  - popcorn ceiling removal ${city.name.toLowerCase()}
  - dust-free popcorn ceiling removal ${city.name.toLowerCase()}
  - smooth ceiling contractor ${city.name.toLowerCase()}

secondary:
  - remove popcorn ceiling ${city.name.toLowerCase()}
  - ceiling skim coating ${city.name.toLowerCase()}
  - popcorn ceiling sanding ${city.name.toLowerCase()}
  - ceiling smoothing ${city.name.toLowerCase()}
  - dustless ceiling removal ${city.name.toLowerCase()}
  - painted popcorn ceiling removal ${city.name.toLowerCase()}
  - smooth ceiling finishing ${city.name.toLowerCase()}
  - ceiling refinishing contractor ${city.name.toLowerCase()}

long_tail:
  - how much does popcorn ceiling removal cost in ${city.name.toLowerCase()}
  - best popcorn ceiling removal contractor in ${city.name.toLowerCase()}
  - remove painted popcorn ceiling in ${city.name.toLowerCase()}
  - smooth ceiling finish after popcorn removal ${city.name.toLowerCase()}
  - dust-free ceiling sanding with HEPA extraction ${city.name.toLowerCase()}
  - popcorn ceiling removal before and after ${city.name.toLowerCase()}
  - ceiling skim coating after popcorn removal ${city.name.toLowerCase()}
  - clean popcorn ceiling removal for occupied homes ${city.name.toLowerCase()}

local:
  - ${city.name}

ai_prompts:
  - who removes popcorn ceilings in ${city.name.toLowerCase()}
  - how much does popcorn ceiling removal cost in ${city.name.toLowerCase()}
  - can popcorn ceilings be removed without dust
  - do ceilings need skim coating after popcorn removal
  - is popcorn ceiling removal worth it before selling a home
  - what is the cleanest way to remove painted popcorn ceilings
`;
}

function cityPage(city, allCities) {
	const gallery = cityGallery(city, 16);
	const process = processImages(city, 6);
	const afters = afterImages(city, 6);
	const hero = heroImage(city);

	const p1 = process[0] || gallery[0] || hero;
	const p2 = process[1] || gallery[1] || hero;
	const p3 = process[2] || gallery[2] || hero;
	const p4 = process[3] || gallery[3] || hero;
	const p5 = process[4] || gallery[4] || hero;
	const p6 = process[5] || gallery[5] || hero;

	const a1 = afters[0] || gallery[0] || hero;
	const a2 = afters[1] || gallery[1] || hero;
	const a3 = afters[2] || gallery[2] || hero;

	return yamlText(`title: Popcorn ceiling removal ${city.name}
hidden: true
startPos: right

seo: |-
  Popcorn ceiling removal ${city.name}, dust-free popcorn ceiling removal ${city.name}, smooth ceiling finishing ${city.name}, ceiling skim coating ${city.name}, painted popcorn ceiling removal ${city.name}, Festool Planex HEPA ceiling sanding, ceiling refinishing contractor ${city.name}, popcorn ceiling removal before and after ${city.name}, remove popcorn ceiling ${city.name}, smooth ceilings ${city.name}.

desc: |-
  ${cityDesc(city)}

image:
  src: ${imageRef(hero)}
  alt: Popcorn ceiling removal in ${city.name} with smooth modern ceiling finish.

sections:
  - type: Benefits
    title: Dust-free popcorn ceiling removal in ${city.name}
    content:
      - title: Clean process for occupied homes
        desc: |-
          Popcorn ceiling removal does not have to turn your home into a dusty construction zone. We use containment, floor protection, careful masking, Festool Planex sanding equipment, and HEPA extraction to keep the work controlled.

      - title: Smooth ceiling finish, not just texture removal
        desc: |-
          Removing the texture is only the first step. Skim coating, sanding, priming, and surface correction are what create the flat, modern ceiling finish homeowners actually want.

      - title: Better light, cleaner rooms, stronger resale appeal
        desc: |-
          Smooth ceilings make rooms feel brighter, cleaner, and more updated. For many homes in ${city.name}, removing popcorn texture is one of the highest-impact cosmetic upgrades before selling.

      - title: Quote from photos
        desc: |-
          Send ceiling photos, rough room sizes, ceiling height, and whether the texture has been painted. In many cases we can provide a realistic price range before scheduling a site visit.

  - type: Benefits
    title: Popcorn ceiling removal planning for ${city.name}
    content:
      - title: Local ceiling conditions matter
        desc: |-
          ${cityPositioning(city)}

      - title: Painted ceilings need a different approach
        desc: |-
          Painted popcorn texture is usually sealed harder to the drywall surface. That often means controlled sanding, more surface correction, and a more careful finishing sequence.

      - title: Finish quality depends on preparation
        desc: |-
          The visible final result depends on what happens before paint. Proper masking, texture removal, patching, skim coating, drying, and sanding all affect the final ceiling.

      - title: Photos help identify scope
        desc: |-
          Clear photos help identify ceiling height, room layout, texture condition, lighting, furniture protection needs, and whether the ceiling appears painted.

  - type: ImagePanel
    title: Popcorn ceiling removal process in ${city.name}
    content:
      - title: Protect the room first
        desc: |-
          Floors, walls, furniture, trim, light fixtures, and nearby finishes are protected before work begins. The goal is a clean process from setup to final cleanup.
        image:
          src: ${imageRef(p1)}
          alt: Protected room before popcorn ceiling removal in ${city.name}.

      - title: Remove texture with dust control
        desc: |-
          Depending on the ceiling, texture may be scraped or sanded. Painted popcorn ceilings often require controlled sanding with HEPA extraction because the paint seals the texture.
        image:
          src: ${imageRef(p2)}
          alt: Dust-controlled popcorn ceiling removal in ${city.name}.

      - title: Skim coat and finish smooth
        desc: |-
          After removal, the ceiling is corrected, skim coated, sanded, primed, and painted so the final result looks smooth and modern.
        image:
          src: ${imageRef(p3)}
          alt: Smooth ceiling finish after popcorn removal in ${city.name}.

  - type: Benefits
    title: Why ${city.name} homeowners remove popcorn ceilings
    content:
      - title: Outdated texture dates the room
        desc: |-
          Popcorn texture can make a finished room feel older even when the flooring, paint, lighting, and furniture have been updated. Removing the texture gives the whole space a cleaner look.

      - title: Smooth ceilings reflect light better
        desc: |-
          A flat ceiling surface helps rooms feel brighter and more open, especially when paired with fresh ceiling paint, pot lights, or updated wall colour.

      - title: Better finish for resale
        desc: |-
          Buyers notice ceilings. Smooth ceilings make a home feel more move-in ready and reduce the number of visible cosmetic updates a buyer mentally prices into the offer.

      - title: Cleaner long-term appearance
        desc: |-
          Textured ceilings collect dust and are difficult to patch invisibly. A smooth ceiling is easier to repaint, repair, and maintain.

  - type: ImagePanel
    title: Smooth ceiling finishing in ${city.name}
    content:
      - title: Surface correction after removal
        desc: |-
          Popcorn texture often hides seams, old repairs, uneven drywall, and roller marks. Once the texture is removed, those imperfections need to be corrected before painting.
        image:
          src: ${imageRef(a1)}
          alt: Smooth ceiling surface correction in ${city.name}.

      - title: Skim coating for a modern finish
        desc: |-
          Skim coating creates the clean ceiling plane. This step is especially important when the original popcorn texture was painted or when the drywall underneath is uneven.
        image:
          src: ${imageRef(a2)}
          alt: Ceiling skim coating after popcorn removal in ${city.name}.

      - title: Sand, prime, and paint
        desc: |-
          Final sanding, primer, and ceiling paint complete the transformation so the ceiling looks smooth, bright, and professionally finished.
        image:
          src: ${imageRef(a3)}
          alt: Finished smooth ceiling after popcorn removal in ${city.name}.

  - type: ImageCarousel
    title: Popcorn ceiling removal projects in ${city.name}
    content:
${gallery
	.map(
		(img) => `      - src: ${imageRef(img)}
        alt: Popcorn ceiling removal and smooth ceiling finishing project in ${city.name}.`,
	)
	.join('\n')}

${beforeAfterSection(city)}
${projectSections(city)}

  - type: Benefits
    title: What affects popcorn ceiling removal cost in ${city.name}
    content:
      - title: Painted vs unpainted texture
        desc: |-
          Painted popcorn ceilings usually take more labour because the paint seals the texture. These ceilings often require sanding and more skim coating than unpainted texture.

      - title: Ceiling height and access
        desc: |-
          High ceilings, vaulted areas, stairwells, bulkheads, open-to-above spaces, and rooms with many corners increase setup, sanding, and finishing time.

      - title: Amount of skim coating needed
        desc: |-
          Popcorn texture often hides drywall seams, patches, uneven repairs, and old roller marks. The more correction needed, the more finishing labour is required.

      - title: Painting, pot lights, and add-ons
        desc: |-
          Ceiling painting, pot light installation, drywall repairs, crown moulding, and wall touch-ups can be coordinated as part of the same project.

  - type: ImagePanel
    title: Painted popcorn ceilings in ${city.name}
    content:
      - title: Painted texture takes more control
        desc: |-
          Many older ceilings have been painted over one or more times. Once painted, popcorn texture becomes harder to scrape and often needs sanding, skim coating, and careful surface correction.
        image:
          src: ${imageRef(p4)}
          alt: Painted popcorn ceiling removal in ${city.name}.

      - title: Skim coating creates the finish
        desc: |-
          After texture removal, skim coating bridges imperfections and creates the smooth ceiling plane. This is the step that separates a basic removal from a premium finish.
        image:
          src: ${imageRef(p5)}
          alt: Ceiling skim coating after popcorn removal in ${city.name}.

      - title: Clean sanding with HEPA extraction
        desc: |-
          Sanding is controlled with professional equipment and HEPA extraction. This keeps the process cleaner and protects finished homes during ceiling refinishing.
        image:
          src: ${imageRef(p6)}
          alt: HEPA ceiling sanding after popcorn removal in ${city.name}.

  - type: Benefits
    title: Our popcorn ceiling removal standard in ${city.name}
    content:
      - title: Protection before production
        desc: |-
          The quality of a ceiling project starts before removal begins. Proper masking, floor protection, dust control, and work sequencing prevent unnecessary cleanup and protect finished interiors.

      - title: Finish-level thinking
        desc: |-
          We do not treat popcorn ceiling removal as a quick scrape-and-paint job. The final ceiling only looks right when the substrate is corrected, skim coated where needed, and sanded cleanly.

      - title: Designed for lived-in homes
        desc: |-
          Many projects happen while the home is occupied. Our process is planned around containment, careful staging, and minimizing disruption as much as possible.

      - title: Clear expectations
        desc: |-
          Before work begins, we explain what can be determined from photos, what may need inspection, and what finish level is realistic for the existing ceiling.

  - type: Benefits
    title: Best rooms to update with smooth ceilings in ${city.name}
    content:
      - title: Main floors and open-concept areas
        desc: |-
          Main floors usually deliver the biggest visual impact because they are the most visible spaces. Removing texture from living rooms, dining rooms, kitchens, and hallways helps the entire home feel more current.

      - title: Stairwells and open-to-above spaces
        desc: |-
          Stairwells and open-to-above areas often collect attention because they connect multiple levels. These areas need careful access, protection, and dust control.

      - title: Bedrooms and upper halls
        desc: |-
          Bedrooms and hallways benefit from smoother ceilings because the finish looks cleaner in natural light and is easier to repaint later.

      - title: Condos and smaller finished spaces
        desc: |-
          In condos and smaller homes, ceiling texture can make rooms feel visually busy. Smooth ceilings help the space feel cleaner and less dated.

  - type: TextCarousel
    text:
      - Popcorn ceiling removal ${city.name}
      - Dust-free popcorn ceiling removal
      - Smooth ceiling finish ${city.name}
      - Ceiling skim coating ${city.name}
      - Remove painted popcorn ceilings
      - Festool Planex HEPA extraction
      - Popcorn ceiling removal before and after
      - Ceiling refinishing contractor ${city.name}
      - Smooth ceilings before selling
      - Clean ceiling sanding process
      - Modern flat ceilings
      - Popcorn texture removal
      - Painted popcorn ceiling removal
      - Ceiling smoothing contractor
      - Smooth ceiling upgrade
      - Dust-controlled ceiling refinishing

${localizedFaq(city)}

  - type: ZigZag
    title: More popcorn ceiling removal service areas
    content:
${cityLinks(allCities, city.slug, 'city')}

  - type: ImagePanel
    title: Get a quote for popcorn ceiling removal in ${city.name}
    content:
      - title: Send photos and room sizes
        desc: |-
          The fastest way to get pricing is to send a few ceiling photos and rough room dimensions. Ceiling height and whether the texture has been painted are especially important.
        image:
          src: ${imageRef(a1)}
          alt: Popcorn ceiling removal quote photo for ${city.name}.

      - title: Clear scope before work begins
        desc: |-
          We explain the removal method, skim coating requirements, finish level, dust-control approach, and expected timeline before scheduling.
        image:
          src: ${imageRef(a2)}
          alt: Ceiling finishing scope in ${city.name}.

      - title: Clean finish, controlled process
        desc: |-
          The goal is not just removing texture. The goal is a clean, smooth, modern ceiling with minimal disruption to your home.
        image:
          src: ${imageRef(a3)}
          alt: Smooth ceiling after popcorn removal in ${city.name}.

  - type: Services
    exclude:
      - popcorn-removal
`);
}

function injectHubSection(cities) {
	if (!fs.existsSync(hubPath)) {
		throw new Error(`Hub page not found: ${hubPath}`);
	}

	const existing = fs.readFileSync(hubPath, 'utf8');

	const start = '# AUTO-GENERATED POPCORN CITY LINKS START';
	const end = '# AUTO-GENERATED POPCORN CITY LINKS END';

	const citySection = `${start}
  - type: ZigZag
    title: Popcorn ceiling removal by city
    content:
${cityLinks(cities, null, 'hub')}

${end}`;

	let updated = existing;

	const markerRegex = new RegExp(`\\n?${start}[\\s\\S]*?${end}`, 'm');

	if (markerRegex.test(updated)) {
		updated = updated.replace(markerRegex, `\n${citySection}`);
	} else {
		const servicesMatch = updated.match(/\n  - type: Services\b/);

		if (!servicesMatch || servicesMatch.index === undefined) {
			throw new Error(
				`Could not find final Services block in ${hubPath}. Add markers manually once.`,
			);
		}

		updated =
			updated.slice(0, servicesMatch.index) +
			`\n${citySection}\n` +
			updated.slice(servicesMatch.index);
	}

	fs.writeFileSync(hubPath, yamlText(updated), 'utf8');

	console.log(`Injected ${cities.length} city links into ${hubPath}`);
}

function writeRootKeywords(cities) {
	const content = `primary:
  - popcorn ceiling removal toronto
  - popcorn ceiling removal gta
  - dust-free popcorn ceiling removal

secondary:
  - smooth ceiling finishing
  - ceiling skim coating
  - remove popcorn ceiling
  - painted popcorn ceiling removal
  - Festool Planex HEPA ceiling sanding

long_tail:
  - how much does popcorn ceiling removal cost
  - remove popcorn ceiling without dust
  - best popcorn ceiling removal contractor toronto
  - ceiling skim coating after popcorn removal
  - dust-free popcorn ceiling removal near me
  - popcorn ceiling removal before and after

local:
${cities.map((city) => `  - ${city.name}`).join('\n')}

ai_prompts:
  - who removes popcorn ceilings in toronto
  - how much does popcorn ceiling removal cost
  - can popcorn ceilings be removed without dust
  - do ceilings need skim coating after popcorn removal
  - is popcorn ceiling removal worth it before selling
`;

	fs.writeFileSync(path.join(baseDir, 'keywords.yaml'), yamlText(content), 'utf8');
}

function validateGeneratedContent(content, label) {
	if (content.includes('\t')) {
		throw new Error(`Generated content contains tab characters: ${label}`);
	}

	if (!content.trim().startsWith('title:') && !label.endsWith('keywords.yaml')) {
		throw new Error(`Generated content does not start with title: ${label}`);
	}
}

const cities = loadAssets();

ensureDir(baseDir);
injectHubSection(cities);
writeRootKeywords(cities);

for (const city of cities) {
	const cityDir = path.join(baseDir, city.slug);
	ensureDir(cityDir);

	const pageContent = cityPage(city, cities);
	validateGeneratedContent(pageContent, `${city.slug}/index.yaml`);

	fs.writeFileSync(path.join(cityDir, 'index.yaml'), pageContent, 'utf8');
	fs.writeFileSync(path.join(cityDir, 'keywords.yaml'), yamlText(keywords(city)), 'utf8');
}

console.log(
	`Generated ${cities.length} popcorn city pages with maximum SEO depth and city-specific images.`,
);
