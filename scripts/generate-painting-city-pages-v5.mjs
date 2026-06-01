#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const servicesRoot = path.join(root, 'content', 'services');
const paintingRoot = path.join(servicesRoot, 'painting');
const publicRoot = path.join(root, 'public');
const reportPath = path.join(root, 'painting-city-generation-report.json');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function fail(message) {
  console.error(`\nPainting city generator failed: ${message}\n`);
  process.exit(1);
}

if (!fs.existsSync(paintingRoot)) fail(`Missing folder: ${paintingRoot}`);

const cityDataPath = path.join(root, 'src', 'data', 'cities.ts');
if (!fs.existsSync(cityDataPath)) fail(`Missing city data file: ${cityDataPath}`);

const citySource = fs.readFileSync(cityDataPath, 'utf8');
const cityModule = ts.transpileModule(citySource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;

const { cities } = await import(`data:text/javascript;base64,${Buffer.from(cityModule).toString('base64')}`);
if (!Array.isArray(cities) || cities.length === 0) fail('src/data/cities.ts did not export a non-empty cities array.');

const priorityCitySlugs = [
  'toronto',
  'vaughan',
  'woodbridge',
  'richmond-hill',
  'markham',
  'north-york',
  'etobicoke',
  'mississauga',
  'oakville',
  'burlington',
  'forest-hill',
  'rosedale',
  'leaside',
  'the-beaches',
  'kleinburg',
  'king-city',
  'aurora',
  'newmarket',
  'thornhill',
  'caledon',
  'bolton',
  'stouffville',
];

const supplementalCities = [
  {
    name: 'North York',
    slug: 'north-york',
    region: 'Toronto',
    nearbyCities: ['toronto', 'vaughan', 'thornhill', 'forest-hill', 'leaside', 'etobicoke'],
  },
  {
    name: 'Thornhill',
    slug: 'thornhill',
    region: 'York',
    nearbyCities: ['vaughan', 'richmond-hill', 'markham', 'north-york', 'toronto', 'woodbridge'],
  },
];

for (const city of supplementalCities) {
  if (!cities.some((candidate) => candidate.slug === city.slug)) cities.push(city);
}

const cityBySlug = Object.fromEntries(cities.map((city) => [city.slug, city]));
const citySlugs = new Set(cities.map((city) => city.slug));
const priorityCitySet = new Set(priorityCitySlugs);
const archetypeBySlug = new Map(
  Object.entries({
    toronto: 'toronto-core',
    'downtown-toronto': 'toronto-core',
    'north-york': 'toronto-core',
    'forest-hill': 'luxury-heritage',
    rosedale: 'luxury-heritage',
    leaside: 'luxury-heritage',
    'the-beaches': 'luxury-heritage',
    oakville: 'upscale-suburban',
    kleinburg: 'upscale-suburban',
    'king-city': 'upscale-suburban',
    vaughan: 'family-home-refresh',
    woodbridge: 'family-home-refresh',
    'richmond-hill': 'family-home-refresh',
    markham: 'family-home-refresh',
    aurora: 'family-home-refresh',
    newmarket: 'family-home-refresh',
    thornhill: 'family-home-refresh',
    bradford: 'newer-subdivisions',
    stouffville: 'newer-subdivisions',
    ajax: 'newer-subdivisions',
    pickering: 'newer-subdivisions',
    whitby: 'newer-subdivisions',
    mississauga: 'mixed-housing-practical',
    burlington: 'mixed-housing-practical',
    etobicoke: 'mixed-housing-practical',
    oshawa: 'mixed-housing-practical',
    caledon: 'country-estate',
    bolton: 'country-estate',
    innisfil: 'country-estate',
  }),
);

const archetypes = {
  'toronto-core': {
    label: 'Toronto core',
    template: 'D',
    imageTerms: ['modern', 'feature-wall', 'open-concept', 'living-room', 'dining-room', 'premium-finish'],
    heroDesc: (city) => `Interior painting in ${city.name} for condos, compact homes, designer colour changes, elevator bookings, parking limits, feature walls, and photo-based quote planning.`,
    storyTitle: 'Condo painting with real building logistics',
    storyFocus: 'condo access, elevator windows, parking restrictions, hallway protection, loading rules, designer finishes, rental turnovers, and clean room sequencing',
    processTitle: 'Painting around condo access and daily life',
    scenarioTitles: ['Condo repaint before listing', 'Occupied downtown condo', 'Dark accent wall removal', 'Rental turnover repaint', 'Designer colour refresh', 'Move-in repaint with elevator rules'],
    projectTitles: ['Condo painting logistics', 'Painting before listing a condo', 'Feature walls and modern interiors', 'Elevator booking and building rules', 'Rental turnover painting', 'Occupied condo repainting'],
  },
  'luxury-heritage': {
    label: 'Luxury heritage',
    template: 'C',
    imageTerms: ['luxury', 'dining-room', 'wainscoting', 'coffered', 'trim', 'millwork'],
    heroDesc: (city) => `Interior painting in ${city.name} for older luxury homes, renovated detached homes, plaster walls, detailed trim, built-ins, formal rooms, and careful protection.`,
    storyTitle: 'Painting older luxury homes with finish-level care',
    storyFocus: 'plaster movement, crown moulding, casing, baseboards, built-ins, hardwood floors, stair halls, formal rooms, and discreet work in occupied homes',
    processTitle: 'Protecting hardwood, plaster and millwork',
    scenarioTitles: ['Older plaster wall refresh', 'Formal dining room repaint', 'Built-in shelving repaint', 'Luxury home move-in refresh', 'Stair hall and trim repaint', 'Colour update after renovation'],
    projectTitles: ['Painting older luxury homes', 'Plaster repair before painting', 'Protecting hardwood and millwork', 'Formal living and dining rooms', 'Built-ins, crown and casing', 'Premium repainting before move-in'],
  },
  'upscale-suburban': {
    label: 'Upscale suburban',
    template: 'A',
    imageTerms: ['foyer', 'luxury', 'open-concept', 'coffered', 'trim', 'staircase'],
    heroDesc: (city) => `Interior painting in ${city.name} for custom homes, large foyers, open-concept main floors, stair halls, premium trim packages, and polished move-in refreshes.`,
    storyTitle: 'Painting large open-concept homes',
    storyFocus: 'custom-home scale, large foyers, tall stair walls, premium trim, colour transitions, open main floors, and move-in timing',
    processTitle: 'Sequencing large rooms, stair halls and trim',
    scenarioTitles: ['Custom home repaint', 'Open-concept main floor refresh', 'Large foyer repaint', 'Trim and millwork update', 'Move-in colour change', 'Two-storey stair hall repaint'],
    projectTitles: ['Painting large open-concept homes', 'Stair halls and two-storey foyers', 'Trim and millwork packages', 'Preparing a home before move-in', 'Colour transitions between rooms', 'Premium paint specification'],
  },
  'family-home-refresh': {
    label: 'Family home refresh',
    template: 'B',
    imageTerms: ['open-concept', 'living-room', 'bright', 'trim', 'foyer', 'bedroom'],
    heroDesc: (city) => `Interior painting in ${city.name} for detached family homes, builder-paint upgrades, stairwells, trim and doors, move-in refreshes, and clean work in occupied homes.`,
    storyTitle: 'Family-home painting that works around real life',
    storyFocus: 'detached homes, busy main floors, builder paint, stair halls, trim and doors, bedrooms, pets, children, and staged room access',
    processTitle: 'Painting around family life',
    scenarioTitles: ['Builder-home upgrade', 'Main floor refresh', 'Stair hall repaint', 'Trim and door modernization', 'Interior modernization before sale', 'Bedroom refresh around family schedules'],
    projectTitles: ['Builder home painting upgrades', 'Main floor repainting', 'Stair hall painting', 'Door and trim modernization', 'Painting around family life', 'Move-in and pre-sale refreshes'],
  },
  'newer-subdivisions': {
    label: 'Newer subdivisions',
    template: 'B',
    imageTerms: ['open-concept', 'bright', 'bedroom', 'level-5', 'drywall', 'living-room'],
    heroDesc: (city) => `Interior painting in ${city.name} for newer homes, builder paint upgrades, finished basements, nail pops, move-in colour changes, and drywall imperfections before finish coats.`,
    storyTitle: 'Newer-home painting after builder paint',
    storyFocus: 'builder deficiencies, nail pops, drywall seams, finished basements, move-in timing, colour upgrades, and practical room sequencing',
    processTitle: 'Fixing builder paint issues before colour goes on',
    scenarioTitles: ['Common builder paint issues', 'Painting before moving in', 'Finished basement repainting', 'Fixing nail pops and drywall imperfections', 'Bedroom colour upgrade', 'Main floor repaint after possession'],
    projectTitles: ['Common builder paint issues', 'Painting before moving in', 'Finished basement repainting', 'Fixing nail pops and drywall imperfections', 'Colour changes over builder beige', 'Touch-ups that need more than touch-up paint'],
  },
  'mixed-housing-practical': {
    label: 'Mixed housing and practical',
    template: 'D',
    imageTerms: ['open-concept', 'living-room', 'dining-room', 'trim', 'bright', 'modern'],
    heroDesc: (city) => `Interior painting in ${city.name} for condos, detached homes, townhomes, practical room-by-room repainting, resale preparation, trim, doors, ceilings, and drywall repair.`,
    storyTitle: 'Choosing the right painting scope',
    storyFocus: 'mixed housing, condos, townhomes, detached homes, room-by-room priorities, resale timing, access, furniture, and value-focused finish choices',
    processTitle: 'Condo, townhome and house painting plans',
    scenarioTitles: ['Choosing the right scope', 'Condo versus house painting', 'Room-by-room repainting', 'Preparing for resale', 'Townhome stair and hallway repaint', 'Move-in refresh with furniture in place'],
    projectTitles: ['Choosing the right scope', 'Condo vs house painting', 'Room-by-room repainting', 'Preparing for resale', 'Trim and doors where they matter most', 'Drywall repair before repainting'],
  },
  'country-estate': {
    label: 'Country and estate',
    template: 'A',
    imageTerms: ['luxury', 'foyer', 'coffered', 'trim', 'open-concept', 'staircase'],
    heroDesc: (city) => `Interior painting in ${city.name} for larger homes, estate properties, mudrooms, stair halls, long access routes, durable finishes, and staged multi-room repainting.`,
    storyTitle: 'Painting larger properties without losing control of the schedule',
    storyFocus: 'larger homes, estate properties, mudrooms, long drive access, seasonal occupancy, high-traffic rooms, stair halls, and multi-day staging',
    processTitle: 'Managing larger home repaints',
    scenarioTitles: ['Painting larger properties', 'Mudroom and high-traffic refresh', 'Seasonal occupancy repaint', 'Managing large home repaints', 'Stair hall and foyer update', 'Durable repaint before a busy season'],
    projectTitles: ['Painting larger properties', 'Mudrooms and high-traffic areas', 'Seasonal occupancy considerations', 'Managing large home repaints', 'Stair halls and large rooms', 'Durable finishes for daily wear'],
  },
};

const repeatedPhraseTargets = [
  'occupied homes',
  'finished homes',
  'protection',
  'prep',
  'painting project',
  'careful preparation',
  'daily cleanup',
  'trim and doors',
];

const args = process.argv.slice(2);
const onlyArg = args.find((arg) => arg.startsWith('--only='));
const all = args.includes('--all');
const confirm = args.includes('--confirm');
const priorityOnly = args.includes('--priority-only');
const dryRun = args.includes('--dry-run');
const similarityWarningThreshold = 0.35;

if (all && !confirm) fail('Use --all --confirm to generate non-priority painting city pages.');
if (all && priorityOnly) fail('Use either --all --confirm or --priority-only, not both.');

function toTitle(slug) {
  return String(slug)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function first(value, fallback = '') {
  return Array.isArray(value) && value.length ? value[0] : fallback;
}

function capitalise(value) {
  const text = String(value ?? '').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function sentenceCase(value) {
  return capitalise(String(value ?? '').toLowerCase());
}

function repaintPhrase(room) {
  const text = String(room ?? 'room').trim();
  return `Painting ${text}`;
}

function isPluralPhrase(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return /\b(condos|homes|townhomes|semis|rooms|areas|spaces|floors|halls|offices|basements|bedrooms|doors|stairs|interiors|properties)\b/.test(text);
}

function livedInPhrase(home) {
  const text = String(home ?? 'home').trim();
  return isPluralPhrase(text) ? `lived-in ${text}` : `a lived-in ${text}`;
}

function listSentence(items) {
  const cleaned = [...new Set((items ?? []).filter(Boolean))];
  if (cleaned.length === 0) return '';
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(', ')}, and ${cleaned.at(-1)}`;
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function block(text, indent = 2) {
  const pad = ' '.repeat(indent);
  return `|-\n${String(text ?? '')
    .trim()
    .split('\n')
    .map((line) => `${pad}${line.trimEnd()}`)
    .join('\n')}`;
}

function countWords(value) {
  return String(value)
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[`*_#:[\]()/|>{}\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function visibleItemText(items) {
  return (items ?? []).flatMap((item) => [item.title, item.desc]).join('\n');
}

function visibleDescText(items) {
  return (items ?? []).map((item) => item.desc).join('\n');
}

function normalizeForSimilarity(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, ' ')
    .replace(/\b(ajax|aurora|bolton|bradford|burlington|caledon|etobicoke|forest hill|innisfil|king city|kleinburg|leaside|markham|mississauga|newmarket|north york|oakville|oshawa|pickering|richmond hill|rosedale|stouffville|the beaches|thornhill|toronto|vaughan|whitby|woodbridge)\b/g, 'CITY')
    .replace(/\s+/g, ' ')
    .trim();
}

function paragraphSet(value) {
  return new Set(
    normalizeForSimilarity(value)
      .split(/\.+\s+/)
      .map((part) => part.trim())
      .filter((part) => part.split(/\s+/).length >= 8),
  );
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const item of a) if (b.has(item)) shared += 1;
  return shared / Math.max(a.size, b.size);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function isImage(file) {
  return imageExtensions.has(path.extname(file).toLowerCase());
}

function asContentRelative(fromDir, file) {
  return path.relative(fromDir, file).replaceAll(path.sep, '/');
}

function asPublicSrc(file) {
  return `/${path.relative(publicRoot, file).replaceAll(path.sep, '/')}`;
}

function cityArchetype(city, profile) {
  if (archetypeBySlug.has(city.slug)) return archetypeBySlug.get(city.slug);
  const text = `${city.name} ${profile?.angle ?? ''} ${profile?.homeTypes?.join(' ') ?? ''} ${profile?.logistics ?? ''}`.toLowerCase();
  if (/\bcondo|elevator|downtown|parking|rental\b/.test(text)) return 'toronto-core';
  if (/\bplaster|heritage|built-ins|millwork|formal\b/.test(text)) return 'luxury-heritage';
  if (/\bcustom|estate|large foyer|two-storey|premium trim\b/.test(text)) return 'upscale-suburban';
  if (/\bbuilder|newer|nail pops|subdivision\b/.test(text)) return 'newer-subdivisions';
  if (/\bcondos|townhomes|mixed|resale\b/.test(text)) return 'mixed-housing-practical';
  if (/\bcountry|mudroom|larger properties|cottage\b/.test(text)) return 'country-estate';
  return 'family-home-refresh';
}

function cityTemplate(city, archetypeKey) {
  const optionsByType = {
    'toronto-core': ['D', 'B', 'A'],
    'luxury-heritage': ['C', 'A', 'D'],
    'upscale-suburban': ['A', 'C', 'B'],
    'family-home-refresh': ['B', 'D', 'A'],
    'newer-subdivisions': ['B', 'A', 'D'],
    'mixed-housing-practical': ['D', 'B', 'C'],
    'country-estate': ['A', 'D', 'C'],
  };
  const options = optionsByType[archetypeKey] ?? ['A', 'B', 'C', 'D'];
  return options[variationIndex(city, options.length, 309)];
}

function rankImagesForArchetype(images, archetypeKey) {
  const terms = archetypes[archetypeKey]?.imageTerms ?? [];
  const weakTerms = ['reserved', 'faucet', 'shower', 'sink', 'hardware', 'handle', 'before-green', 'process', 'swatch'];
  return [...images].sort((a, b) => {
    const score = (item) => {
      const src = item.src.toLowerCase();
      let total = item.local ? 30 : 0;
      terms.forEach((term, index) => {
        if (src.includes(term)) total += 40 - index;
      });
      weakTerms.forEach((term) => {
        if (src.includes(term)) total -= 80;
      });
      if (src.endsWith('.webp')) total += 5;
      return total;
    };
    return score(b) - score(a) || a.src.localeCompare(b.src);
  });
}

function repeatedPhraseCounts(text) {
  const normalized = String(text).toLowerCase();
  return Object.fromEntries(
    repeatedPhraseTargets.map((phrase) => {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return [phrase, (normalized.match(new RegExp(`\\b${escaped}\\b`, 'g')) ?? []).length];
    }),
  );
}

function findImages(citySlug) {
  const pageDir = path.join(paintingRoot, citySlug);
  const bestFinishedRooms = [
    '../photos/open-concept-home-painting-gta.webp',
    '../photos/luxury-home-interior-painting.webp',
    '../photos/interior-painting-toronto-premium-finish.webp',
    '../photos/bright-living-room-interior-painting.webp',
    '../photos/living-room-interior-painting-neutral-finish.webp',
    '../photos/toronto-modern-living-room-interior-painting.webp',
    '../photos/dining-room-painting-toronto.webp',
    '../photos/toronto-dining-room-interior-painting.webp',
    '../photos/toronto-feature-wall-interior-painting.webp',
    '../photos/luxury-home-painting-toronto.webp',
  ];
  const detailSupport = [
    '../photos/coffered-ceiling-painting-toronto.webp',
    '../photos/foyer-ceiling-painting-gta.webp',
    '../photos/wainscoting-painting-satin-finish.webp',
    '../photos/trim-painting-baseboard-finishing.webp',
    '../photos/feature-wall-painting-dark-accent-wall.webp',
    '../photos/level-5-drywall-finish-painted-wall.webp',
    '../photos/smooth-wall-finishing-before-painting.webp',
    '../photos/drywall-repair-before-painting.webp',
  ];
  const preferredByCity = {
    toronto: bestFinishedRooms,
    'north-york': bestFinishedRooms,
    etobicoke: bestFinishedRooms,
    'forest-hill': ['../photos/luxury-home-painting-toronto.webp', '../photos/luxury-home-interior-painting.webp', '../photos/wainscoting-painting-satin-finish.webp', ...bestFinishedRooms],
    rosedale: ['../photos/luxury-home-painting-toronto.webp', '../photos/luxury-home-interior-painting.webp', '../photos/coffered-ceiling-painting-toronto.webp', ...bestFinishedRooms],
    vaughan: ['../photos/open-concept-home-painting-gta.webp', '../photos/coffered-ceiling-painting-toronto.webp', '../photos/foyer-ceiling-painting-gta.webp', '../photos/trim-painting-baseboard-finishing.webp', ...bestFinishedRooms],
    woodbridge: ['../photos/open-concept-home-painting-gta.webp', '../photos/trim-painting-baseboard-finishing.webp', '../photos/foyer-ceiling-painting-gta.webp', ...bestFinishedRooms],
    kleinburg: ['../photos/luxury-home-interior-painting.webp', '../photos/open-concept-home-painting-gta.webp', '../photos/foyer-ceiling-painting-gta.webp', ...bestFinishedRooms],
    'king-city': ['../photos/luxury-home-painting-toronto.webp', '../photos/luxury-home-interior-painting.webp', '../photos/coffered-ceiling-painting-toronto.webp', ...bestFinishedRooms],
  };
  const local = walk(pageDir)
    .filter((file) => isImage(file) && path.basename(file).toLowerCase() !== 'cover.jpg')
    .map((file) => ({ src: asContentRelative(pageDir, file), local: true }));

  const photoCity = walk(path.join(paintingRoot, 'photos', citySlug))
    .filter(isImage)
    .map((file) => ({ src: asContentRelative(pageDir, file), local: true }));

  const publicCity = walk(path.join(publicRoot, 'images', 'painting', citySlug))
    .filter(isImage)
    .map((file) => ({ src: asPublicSrc(file), local: true }));

  const fallbackContent = walk(paintingRoot)
    .filter((file) => {
      if (!isImage(file)) return false;
      const rel = path.relative(paintingRoot, file).replaceAll(path.sep, '/');
      if (rel.split('/').includes('reserved')) return false;
      const top = rel.split('/')[0];
      return !citySlugs.has(top) && path.basename(file).toLowerCase() !== 'cover.jpg';
    })
    .map((file) => ({ src: asContentRelative(pageDir, file), local: false }));

  const fallbackPublic = walk(path.join(publicRoot, 'images', 'painting'))
    .filter((file) => {
      if (!isImage(file)) return false;
      const rel = path.relative(path.join(publicRoot, 'images', 'painting'), file).replaceAll(path.sep, '/');
      const top = rel.split('/')[0];
      return !citySlugs.has(top);
    })
    .map((file) => ({ src: asPublicSrc(file), local: false }));

  const seen = new Set();
  const preferWebp = (item) => item.src.endsWith('.webp') ? 0 : 1;
  const preferNamed = (item) => /\/\d|^\d/.test(item.src) ? 1 : 0;
  const preferred = [...(preferredByCity[citySlug] ?? bestFinishedRooms), ...detailSupport];
  const preferCity = (item) => {
    const index = preferred.indexOf(item.src);
    return index === -1 ? 100 : index;
  };

  return [...local, ...photoCity, ...publicCity, ...fallbackContent, ...fallbackPublic]
    .sort((a, b) => preferCity(a) - preferCity(b) || preferWebp(a) - preferWebp(b) || preferNamed(a) - preferNamed(b) || a.src.localeCompare(b.src))
    .filter((item) => {
      if (!item.src || item.src.includes('undefined') || seen.has(item.src)) return false;
      seen.add(item.src);
      return true;
    })
    .slice(0, 10);
}

const profileOverrides = {
  'forest-hill': {
    angle: 'premium repainting for older finished homes with plaster, detailed trim, built-ins, and careful protection needs',
    homeTypes: ['older detached homes', 'renovated luxury homes', 'heritage-style interiors'],
    logistics: 'protecting hardwood, stairs, built-ins, artwork, older casing, and finished millwork before the first wall is opened up',
    prepConcerns: ['plaster cracks', 'settlement lines', 'older glossy trim paint', 'previous patch marks', 'delicate millwork edges'],
    rooms: ['formal living rooms', 'stair halls', 'bedrooms', 'main floor walls and trim'],
    buyerIntent: 'homeowners who care more about prep, cleanliness, and finish quality than the lowest possible painting price',
    tone: 'quiet, premium, careful',
  },
  toronto: {
    angle: 'condo and house painting where access, elevators, parking, tight staging, and designer finish expectations matter',
    homeTypes: ['condos', 'townhomes', 'older Toronto houses'],
    logistics: 'working around elevators, parking limits, loading rules, narrow halls, fixed fixtures, and compact staging areas',
    prepConcerns: ['drywall dents', 'previous tenant patches', 'scuffed trim', 'accent colour coverage', 'condo hallway protection'],
    rooms: ['condo living areas', 'bedrooms', 'entry halls', 'feature walls'],
    buyerIntent: 'owners who want a clean repaint without turning a condo or busy home into a construction zone',
    tone: 'organized, efficient, polished',
  },
  'the-beaches': {
    angle: 'fresh, clean interior painting for character homes, family spaces, and bright rooms near the lake',
    homeTypes: ['character homes', 'semis', 'renovated family homes'],
    logistics: 'protecting stairs, older floors, narrow entries, beach-area parking constraints, and rooms used daily by the household',
    prepConcerns: ['older plaster movement', 'trim gaps', 'sun-faded walls', 'patched bedrooms', 'front-entry wear'],
    rooms: ['main floors', 'stairwells', 'bedrooms', 'family rooms'],
    buyerIntent: 'homeowners who want a calm, bright refresh with good prep and tidy daily cleanup',
    tone: 'warm, fresh, relaxed',
  },
  rosedale: {
    angle: 'refined painting for older luxury homes with finished floors, trim, plaster details, and careful staging needs',
    homeTypes: ['large older homes', 'renovated detached homes', 'traditional interiors'],
    logistics: 'protecting staircases, millwork, art, hardwood, and formal rooms while keeping the project orderly',
    prepConcerns: ['plaster cracks', 'trim buildup', 'uneven older repairs', 'high walls', 'detailed casing'],
    rooms: ['formal rooms', 'stair halls', 'bedrooms', 'home offices'],
    buyerIntent: 'clients who expect the prep and protection to feel as professional as the final paint finish',
    tone: 'discreet, premium, methodical',
  },
  leaside: {
    angle: 'careful interior painting for renovated family homes, older trim details, and busy main floors',
    homeTypes: ['detached family homes', 'renovated semis', 'older homes with additions'],
    logistics: 'staging the work around kids, pets, furniture, stair traffic, and rooms that need to stay usable',
    prepConcerns: ['trim caulking gaps', 'wall dents', 'patched drywall', 'door wear', 'older casing paint'],
    rooms: ['main floors', 'kids bedrooms', 'stair halls', 'trim and doors'],
    buyerIntent: 'families who need the home protected, cleaned daily, and finished without endless disruption',
    tone: 'practical, warm, tidy',
  },
  vaughan: {
    angle: 'wall, trim, and door painting for detached family homes, staircase updates, and modern colour refreshes',
    homeTypes: ['detached family homes', 'newer subdivisions', 'renovated main floors'],
    logistics: 'protecting hardwood, staircases, kitchens, furniture, and high-traffic rooms while the family keeps living in the home',
    prepConcerns: ['scuffed trim', 'builder paint touch-ups', 'drywall dents', 'colour changes', 'stairwell wall marks'],
    rooms: ['main floors', 'stairwells', 'bedrooms', 'doors and trim'],
    buyerIntent: 'homeowners who want a sharper modern interior with durable trim and clean lines',
    tone: 'clean, modern, family-friendly',
  },
  woodbridge: {
    angle: 'interior painting for detached homes, upgraded stairs, trim-heavy spaces, and occupied family homes',
    homeTypes: ['detached homes', 'larger family homes', 'renovated interiors'],
    logistics: 'protecting floors, stair railings, kitchens, furniture, and entry areas while moving efficiently through the house',
    prepConcerns: ['orange oak trim updates', 'door scuffs', 'drywall damage', 'old caulking gaps', 'stair hall marks'],
    rooms: ['main floors', 'stair halls', 'doors', 'baseboards and casing'],
    buyerIntent: 'clients who want painting to coordinate with stair, flooring, or trim upgrades',
    tone: 'polished, practical, upgrade-focused',
  },
  'richmond-hill': {
    angle: 'clean interior repainting for larger homes, finished basements, stair halls, and trim updates',
    homeTypes: ['detached homes', 'townhomes', 'renovated family homes'],
    logistics: 'protecting open main floors, stairs, furniture, built-ins, and finished basement spaces',
    prepConcerns: ['settlement cracks', 'scuffed baseboards', 'patch marks', 'high stair walls', 'colour coverage'],
    rooms: ['main floors', 'stairwells', 'finished basements', 'bedrooms'],
    buyerIntent: 'homeowners looking for a tidy, durable refresh that feels complete rather than rushed',
    tone: 'clean, detailed, composed',
  },
  markham: {
    angle: 'interior painting for family homes, townhomes, move-in refreshes, and trim/door updates',
    homeTypes: ['detached homes', 'townhomes', 'newer family homes'],
    logistics: 'staging rooms around furniture, stairs, kitchens, home offices, and busy household schedules',
    prepConcerns: ['builder paint', 'drywall dents', 'trim scuffs', 'nail pops', 'previous patches'],
    rooms: ['living rooms', 'bedrooms', 'home offices', 'trim and doors'],
    buyerIntent: 'owners who want a clean repaint before moving in, listing, or settling into a renovation',
    tone: 'organized, practical, neat',
  },
  mississauga: {
    angle: 'whole-home and room-by-room painting for detached homes, condos, townhomes, and move-in refreshes',
    homeTypes: ['detached homes', 'condos', 'townhomes'],
    logistics: 'planning parking, access, furniture movement, stair protection, and daily cleanup across different home types',
    prepConcerns: ['drywall patches', 'trim wear', 'door scuffs', 'colour changes', 'ceiling touch-ups'],
    rooms: ['main floors', 'bedrooms', 'condo living areas', 'doors and trim'],
    buyerIntent: 'clients who want the project scoped clearly and finished with minimal mess',
    tone: 'straightforward, clean, reliable',
  },
  oakville: {
    angle: 'premium interior painting for larger homes, main floor refreshes, trim-heavy rooms, and move-in updates',
    homeTypes: ['larger detached homes', 'renovated homes', 'townhomes'],
    logistics: 'protecting hardwood, open main floors, kitchens, staircases, furniture, and finished trim during multi-room painting',
    prepConcerns: ['trim gaps', 'wall dents', 'builder paint', 'high walls', 'colour transition lines'],
    rooms: ['main floors', 'primary bedrooms', 'stair halls', 'trim and doors'],
    buyerIntent: 'homeowners who want a polished repaint that supports a higher-end interior',
    tone: 'premium, calm, finished',
  },
  burlington: {
    angle: 'fresh interior painting for detached homes, main floor updates, bedrooms, trim, and family spaces',
    homeTypes: ['detached homes', 'townhomes', 'renovated family homes'],
    logistics: 'sequencing rooms around furniture, family schedules, entry protection, and clean access paths',
    prepConcerns: ['wall dents', 'trim caulking', 'door wear', 'patch marks', 'colour changes'],
    rooms: ['main floors', 'bedrooms', 'family rooms', 'trim and doors'],
    buyerIntent: 'homeowners looking for a clean, organized refresh without sloppy prep',
    tone: 'fresh, practical, tidy',
  },
  etobicoke: {
    angle: 'interior painting for bungalows, detached homes, condos, and older trim-heavy spaces',
    homeTypes: ['bungalows', 'detached homes', 'condos'],
    logistics: 'protecting finished floors, stairs, basement access, condo corridors, and tight older-home work areas',
    prepConcerns: ['older trim paint', 'plaster cracks', 'drywall patches', 'door wear', 'basement wall marks'],
    rooms: ['main floors', 'basements', 'bedrooms', 'condo spaces'],
    buyerIntent: 'clients who need a careful repaint across mixed older and newer spaces',
    tone: 'careful, practical, clean',
  },
  'north-york': {
    angle: 'condo, bungalow, family-home, rental-turnover, stairwell, plaster, and drywall repair painting across mixed older and newer interiors',
    homeTypes: ['condos', 'older bungalows', 'family homes'],
    logistics: 'planning elevator access, parking, basement access, stair protection, furniture movement, and older-home work zones',
    prepConcerns: ['plaster cracks', 'drywall dents', 'rental turnover patches', 'scuffed trim', 'stairwell wall marks'],
    rooms: ['condo living areas', 'older bungalows', 'stairwells', 'basements'],
    buyerIntent: 'owners who need a practical repaint that respects condo rules, older-home surfaces, and family schedules',
    tone: 'organized, careful, adaptable',
  },
  thornhill: {
    angle: 'clean repainting for detached homes, townhomes, finished basements, trim packages, and move-in updates near the Toronto and York Region boundary',
    homeTypes: ['detached family homes', 'townhomes', 'finished basements'],
    logistics: 'protecting stairs, kitchens, furniture, trim, basement access, and rooms that need to stay usable',
    prepConcerns: ['settlement cracks', 'builder paint', 'trim scuffs', 'drywall dents', 'colour changes'],
    rooms: ['main floors', 'finished basements', 'stair halls', 'doors and trim'],
    buyerIntent: 'homeowners who want a complete repaint with clean prep, durable trim, and clear room-by-room scope',
    tone: 'clean, detailed, practical',
  },
};

const defaultProfilesByRegion = {
  York: {
    angle: 'clean interior repainting for detached homes, townhomes, trim updates, and busy occupied spaces',
    homeTypes: ['detached homes', 'townhomes', 'renovated family homes'],
    logistics: 'protecting floors, stairs, furniture, kitchens, and high-traffic rooms while the home remains in use',
    prepConcerns: ['wall dents', 'trim scuffs', 'drywall patches', 'nail pops', 'colour changes'],
    rooms: ['main floors', 'bedrooms', 'stair halls', 'doors and trim'],
    buyerIntent: 'homeowners who want clean work, reliable scheduling, and a sharper finished look',
    tone: 'clean, practical, detail-focused',
  },
  Peel: {
    angle: 'room-by-room and whole-home painting for detached homes, townhomes, condos, and move-in refreshes',
    homeTypes: ['detached homes', 'townhomes', 'condos'],
    logistics: 'planning access, furniture shifting, stair protection, material staging, and daily cleanup',
    prepConcerns: ['drywall dents', 'trim wear', 'previous patches', 'door scuffs', 'ceiling touch-ups'],
    rooms: ['living rooms', 'bedrooms', 'main floors', 'trim and doors'],
    buyerIntent: 'clients who want a clear scope and a clean finish without disruption dragging on',
    tone: 'organized, straightforward, tidy',
  },
  Durham: {
    angle: 'interior painting for family homes, newer subdivisions, finished basements, and move-in updates',
    homeTypes: ['detached family homes', 'townhomes', 'newer interiors'],
    logistics: 'sequencing rooms around furniture, family schedules, stairs, and finished basement areas',
    prepConcerns: ['builder paint', 'nail pops', 'trim scuffs', 'drywall dents', 'colour coverage'],
    rooms: ['main floors', 'bedrooms', 'finished basements', 'doors and trim'],
    buyerIntent: 'homeowners who want a practical, durable repaint with better prep than the original builder finish',
    tone: 'fresh, efficient, neat',
  },
  Halton: {
    angle: 'premium interior painting for larger homes, main floor refreshes, trim-heavy spaces, and move-in updates',
    homeTypes: ['larger detached homes', 'townhomes', 'renovated family homes'],
    logistics: 'protecting hardwood, open main floors, staircases, furniture, and finished trim during multi-room work',
    prepConcerns: ['trim gaps', 'wall dents', 'builder paint', 'high walls', 'colour transition lines'],
    rooms: ['main floors', 'primary bedrooms', 'stair halls', 'trim and doors'],
    buyerIntent: 'homeowners who want a polished repaint that supports a finished, higher-end interior',
    tone: 'premium, calm, finished',
  },
};

const fallbackProfile = {
  angle: 'interior painting planned around real home conditions, surface prep, protection, and a clean finished result',
  homeTypes: ['detached homes', 'townhomes', 'condos'],
  logistics: 'protecting floors, furniture, stairs, trim, access paths, and rooms that may still be used during the work',
  prepConcerns: ['wall dents', 'drywall patches', 'trim scuffs', 'caulking gaps', 'colour changes'],
  rooms: ['main floors', 'bedrooms', 'stair halls', 'doors and trim'],
  buyerIntent: 'homeowners who want the project planned, protected, and finished properly',
  tone: 'clean, careful, practical',
};

function paintingProfile(city) {
  const byRegion = defaultProfilesByRegion[city.region] ?? fallbackProfile;
  return {
    ...byRegion,
    ...(profileOverrides[city.slug] ?? {}),
    cityHousingNotes: city.housingNotes ?? byRegion.angle,
    cityProjectLogistics: city.projectLogistics ?? byRegion.logistics,
    cityLocalPositioning: city.localPositioning ?? '',
    cityCommonHomeTypes: city.commonHomeTypes ?? byRegion.homeTypes,
  };
}

const additionalProfileOverrides = {
  aurora: {
    angle: 'polished repainting for established family homes, renovated main floors, stair halls, and rooms with strong natural light',
    homeTypes: ['established detached homes', 'renovated family homes', 'townhomes'],
    logistics: 'protecting open foyers, hardwood, stair rails, furniture, and rooms that stay in use during the week',
    prepConcerns: ['settlement cracks', 'sunlit wall waves', 'scuffed trim', 'nail pops', 'old patch edges'],
    rooms: ['main floors', 'stair halls', 'bedrooms', 'home offices'],
    buyerIntent: 'homeowners who want a calm, well-prepped repaint without shortcuts around the visible details',
    tone: 'calm, tidy, family-focused',
  },
  'king-city': {
    angle: 'premium painting for larger homes where scale, protection, trim detail, and a quiet work sequence matter',
    homeTypes: ['large detached homes', 'estate homes', 'custom interiors'],
    logistics: 'protecting wide plank floors, staircases, built-ins, tall walls, furniture, and long access routes',
    prepConcerns: ['high wall imperfections', 'trim gaps', 'drywall seams', 'door wear', 'colour transition lines'],
    rooms: ['large main floors', 'stairwells', 'primary suites', 'formal rooms'],
    buyerIntent: 'clients who expect careful setup, mature communication, and a finish that suits a higher-end home',
    tone: 'premium, orderly, discreet',
  },
  kleinburg: {
    angle: 'refined interior painting for custom homes, upgraded trim packages, open foyers, and modern colour updates',
    homeTypes: ['custom homes', 'newer detached homes', 'luxury family homes'],
    logistics: 'working around large entries, staircases, kitchens, finished floors, railings, and designer finishes',
    prepConcerns: ['builder paint issues', 'trim caulking gaps', 'stair wall marks', 'door scuffs', 'high ceiling cut lines'],
    rooms: ['open main floors', 'stair halls', 'bedrooms', 'trim and doors'],
    buyerIntent: 'homeowners who want the repaint to match the level of the home instead of looking like basic maintenance',
    tone: 'modern, premium, composed',
  },
  stouffville: {
    angle: 'fresh interior painting for newer family homes, move-in refreshes, finished basements, and main floor updates',
    homeTypes: ['newer detached homes', 'townhomes', 'family homes'],
    logistics: 'sequencing rooms around furniture, kids, pets, stair access, remote work, and daily household routines',
    prepConcerns: ['builder paint', 'nail pops', 'drywall dents', 'baseboard scuffs', 'colour coverage'],
    rooms: ['main floors', 'finished basements', 'kids rooms', 'doors and trim'],
    buyerIntent: 'families who want a reliable refresh with clean prep and manageable disruption',
    tone: 'fresh, practical, neat',
  },
  newmarket: {
    angle: 'organized repainting for family homes, townhomes, older rooms, and practical move-in updates',
    homeTypes: ['detached homes', 'townhomes', 'older family homes'],
    logistics: 'protecting floors, stairs, furniture, entry areas, and rooms that need to stay accessible between coats',
    prepConcerns: ['old patches', 'door wear', 'trim scuffs', 'wall dents', 'nail pops'],
    rooms: ['bedrooms', 'main floors', 'stair halls', 'basements'],
    buyerIntent: 'homeowners who want a clear scope, clean daily setup, and a repaint that looks finished in normal light',
    tone: 'organized, practical, clean',
  },
  bradford: {
    angle: 'clean painting for newer subdivisions, move-in homes, finished basements, and busy family spaces',
    homeTypes: ['newer detached homes', 'townhomes', 'finished basement spaces'],
    logistics: 'moving through rooms efficiently while protecting stairs, floors, furniture, and freshly renovated surfaces',
    prepConcerns: ['builder paint', 'nail pops', 'drywall dents', 'trim scuffs', 'colour changes'],
    rooms: ['main floors', 'bedrooms', 'finished basements', 'doors and trim'],
    buyerIntent: 'homeowners who want better prep than the original builder finish and a durable everyday result',
    tone: 'efficient, fresh, tidy',
  },
  innisfil: {
    angle: 'interior painting for lakeside-area homes, newer builds, cottages, and relaxed family spaces that still need clean prep',
    homeTypes: ['newer detached homes', 'cottages', 'family homes'],
    logistics: 'planning around furniture, access, seasonal schedules, flooring protection, and rooms used on weekends or holidays',
    prepConcerns: ['sun fading', 'drywall dents', 'trim gaps', 'door wear', 'previous touch-ups'],
    rooms: ['living areas', 'bedrooms', 'entry spaces', 'family rooms'],
    buyerIntent: 'owners who want a bright, clean refresh without a messy jobsite feel',
    tone: 'relaxed, clean, practical',
  },
  caledon: {
    angle: 'careful painting for larger homes, country properties, mudrooms, stair halls, and trim-heavy interiors',
    homeTypes: ['larger detached homes', 'country properties', 'family homes'],
    logistics: 'protecting longer access paths, hardwood, stairs, mudrooms, furniture, and high-use entry areas',
    prepConcerns: ['settlement cracks', 'trim gaps', 'mudroom scuffs', 'high wall marks', 'door wear'],
    rooms: ['main floors', 'mudrooms', 'stair halls', 'bedrooms'],
    buyerIntent: 'homeowners who value durability, prep, and a calm process in a lived-in home',
    tone: 'steady, careful, practical',
  },
  bolton: {
    angle: 'interior painting for family homes, older trim updates, main floor refreshes, and rooms with everyday wear',
    homeTypes: ['detached homes', 'family homes', 'older renovated interiors'],
    logistics: 'staging rooms around furniture, kids, pets, kitchens, stairs, and work-from-home schedules',
    prepConcerns: ['scuffed baseboards', 'door wear', 'wall dents', 'caulking gaps', 'colour changes'],
    rooms: ['main floors', 'bedrooms', 'stair halls', 'doors and trim'],
    buyerIntent: 'families who want the home to look sharper without dragging the project through the whole house for weeks',
    tone: 'practical, tidy, family-friendly',
  },
  ajax: {
    angle: 'fresh painting for family homes, townhomes, finished basements, and move-in refreshes near the east GTA',
    homeTypes: ['detached homes', 'townhomes', 'newer family homes'],
    logistics: 'protecting stairs, furniture, floors, basement access, and rooms that still need to be used during the work',
    prepConcerns: ['builder paint', 'drywall dents', 'door scuffs', 'baseboard wear', 'patch marks'],
    rooms: ['main floors', 'bedrooms', 'finished basements', 'doors and trim'],
    buyerIntent: 'homeowners who want a clean, practical refresh with good prep and no sloppy edges',
    tone: 'fresh, practical, clean',
  },
  pickering: {
    angle: 'organized interior painting for family homes, older rooms, townhomes, and main floor colour updates',
    homeTypes: ['detached homes', 'townhomes', 'older family homes'],
    logistics: 'protecting floors, entry paths, furniture, stairs, and rooms with mixed older and newer finishes',
    prepConcerns: ['older trim paint', 'drywall patches', 'door wear', 'wall dents', 'colour coverage'],
    rooms: ['main floors', 'bedrooms', 'family rooms', 'trim and doors'],
    buyerIntent: 'clients who want the painting to feel tidy, planned, and finished instead of rushed',
    tone: 'organized, clean, steady',
  },
  whitby: {
    angle: 'interior painting for detached homes, newer rooms, finished basements, and durable family-home finishes',
    homeTypes: ['detached family homes', 'newer homes', 'townhomes'],
    logistics: 'sequencing rooms around furniture, stairs, basement spaces, kids, pets, and everyday household traffic',
    prepConcerns: ['nail pops', 'builder paint', 'trim scuffs', 'drywall dents', 'door wear'],
    rooms: ['main floors', 'bedrooms', 'finished basements', 'doors and trim'],
    buyerIntent: 'homeowners who want a durable repaint that stands up to regular family use',
    tone: 'fresh, durable, tidy',
  },
  oshawa: {
    angle: 'practical interior painting for older homes, newer subdivisions, rental turnovers, and family spaces',
    homeTypes: ['older homes', 'newer detached homes', 'townhomes'],
    logistics: 'planning room access, furniture movement, stair protection, basement spaces, and efficient cleanup',
    prepConcerns: ['older plaster marks', 'drywall dents', 'trim wear', 'patch edges', 'colour changes'],
    rooms: ['bedrooms', 'main floors', 'basements', 'entry halls'],
    buyerIntent: 'owners who want a clean, reliable repaint with the right amount of prep for the budget and home condition',
    tone: 'straightforward, clean, efficient',
  },
};
Object.assign(profileOverrides, additionalProfileOverrides);

const titlePatterns = [
  ({ city }) => `Interior Painting ${city.name} - Premium Wall, Trim & Door Painting`,
  ({ city }) => `Interior Painting in ${city.name} - Clean Work for Finished Homes`,
  ({ city }) => `${city.name} Interior Painting - Walls, Trim, Doors & Prep`,
  ({ city }) => `House Painting ${city.name} - Interior Walls, Trim & Doors`,
  ({ city }) => `${city.name} Painters for Interior Walls, Trim & Finished Homes`,
  ({ city }) => `Interior Painters ${city.name} - Clean Prep, Trim & Doors`,
];

const h1Patterns = [
  ({ city, profile }) => `Interior Painting in ${city.name} for ${first(profile.homeTypes, 'Finished Homes')}`,
  ({ city }) => `${city.name} Interior Painting with Careful Protection and Prep`,
  ({ city, profile }) => `Clean Interior Painting for ${listSentence(profile.rooms.slice(0, 2))} in ${city.name}`,
  ({ city }) => `Wall, Trim and Door Painting in ${city.name}`,
  ({ city, profile }) => `${city.name} Painting for ${listSentence([...profile.homeTypes.slice(0, 2), ...profile.rooms.slice(0, 2)])}`,
  ({ city, profile }) => `A Cleaner Way to Repaint ${listSentence(profile.homeTypes.slice(0, 2))} in ${city.name}`,
];

const metaPatterns = [
  ({ city, profile }) => `Interior painting in ${city.name} for ${listSentence(profile.rooms.slice(0, 3))}. Wall prep, trim and door painting, careful protection, cleanup, and photo-based quotes.`,
  ({ city, profile }) => `${city.name} interior painting for ${listSentence(profile.homeTypes.slice(0, 2))}: walls, trim, doors, repairs, protection, and a clean finished-home process.`,
  ({ city, profile }) => `Strataline paints ${city.name} homes with better prep, clean protection, trim and door detail, drywall touch-ups, and organized scheduling for ${profile.tone} results.`,
  ({ city, profile }) => `Premium interior painting in ${city.name} for ${profile.angle}. Walls, trim, doors, repairs, masking, cleanup, and clear quote planning.`,
];

function variationIndex(city, length, offset = 0) {
  const total = String(city.slug).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + offset;
  return total % length;
}

function pick(city, values, offset = 0) {
  return values[variationIndex(city, values.length, offset)];
}

function choose(city, patterns, offset = 0) {
  return pick(city, patterns, offset);
}

function nearbyCitySlugs(city) {
  const nearby = (city.nearbyCities ?? [])
    .filter((slug) => slug !== city.slug && cityBySlug[slug])
    .slice(0, 6);
  if (nearby.length) return nearby;
  return cities
    .filter((candidate) => candidate.slug !== city.slug && candidate.region === city.region)
    .map((candidate) => candidate.slug)
    .slice(0, 6);
}

function existingRelatedLinks() {
  return [
    ['painting', 'Interior painting hub'],
    ['drywall-repair-skim-coating', 'Drywall repair and skim coating'],
    ['trim-and-millwork-painting', 'Trim and millwork painting'],
    ['smooth-ceiling-finishing', 'Smooth ceiling finishing'],
    ['popcorn-removal', 'Popcorn ceiling removal'],
    ['stairs', 'Stair refinishing and stairs'],
    ['cabinet-painting', 'Cabinet painting'],
  ].filter(([slug]) => fs.existsSync(path.join(servicesRoot, slug, 'index.yaml')));
}

function renderImageCarousel(images, city) {
  if (images.length < 2) return '';
  return `  - type: ImageCarousel\n    content:\n${images
    .slice(0, 6)
    .map((item) => `      - src: ${item.src}\n        alt: ${yamlString(item.local ? `${city.name} interior painting photo.` : 'Premium interior painting example.')}`)
    .join('\n')}`;
}

function renderImagePanel(title, images, city, offset = 0) {
  const selected = images.slice(offset, offset + 3);
  if (selected.length < 2) return '';

  const labels = [
    `Finished rooms`,
    'Trim and ceilings',
    'Smooth walls',
  ];

  return `  - type: ImagePanel\n    title: ${yamlString(title)}\n    content:\n${selected
    .map((item, index) => `      - title: ${yamlString(labels[index] ?? `Interior painting example ${index + 1}`)}\n        image:\n          src: ${item.src}\n          alt: ${yamlString(item.local ? `${city.name} interior painting project.` : 'Premium painting finish example.')}`)
    .join('\n')}`;
}

function renderZigZag(title, items) {
  return `  - type: ZigZag\n    title: ${yamlString(title)}\n    content:\n${items
    .map((item) => `      - title: ${yamlString(item.title)}\n        desc: ${block(item.desc, 10)}\n        image:\n          src: ${item.image.src}\n          alt: ${yamlString(item.image.alt)}`)
    .join('\n\n')}`;
}

function renderBenefits(title, items) {
  return `  - type: Benefits\n    title: ${yamlString(title)}\n    content:\n${items
    .map((item) => `      - title: ${yamlString(item.title)}\n        desc: ${block(item.desc, 10)}`)
    .join('\n')}`;
}

function renderFaq(title, items) {
  return `  - type: Faq\n    title: ${yamlString(title)}\n    showMoreLabel: View more interior painting questions\n    content:\n${items
    .map((item) => `      - title: ${yamlString(item.title)}\n        desc: ${block(item.desc, 10)}`)
    .join('\n')}`;
}

function renderQuoteCta(city, profile, image) {
  const quoteDesc = `Send room photos, close-ups of ${listSentence(profile.prepConcerns.slice(0, 2))}, trim and door condition, ceiling height, access notes, furniture constraints, and the rooms you want painted. We will reply with scope, timing, product notes, and what needs to be handled before paint.`;
  return `  - type: QuoteCta\n    title: ${yamlString(`Get a clear ${city.name} painting quote from photos`)}\n    desc: ${yamlString(quoteDesc)}\n    phone: (416) 471-5999\n    phoneHref: sms:+14164715999\n    image:\n      src: ${image?.src ?? '../photos/luxury-home-painting-toronto.webp'}\n      alt: ${yamlString(`${city.name} painting quote.`)}\n    steps:\n      - title: Send the rooms\n        desc: Show room photos, trim, doors, ceilings, stair halls, and problem areas.\n      - title: Review the scope\n        desc: We note repairs, primer, trim sanding, ceiling work, access constraints, and finish expectations.\n      - title: Book the sequence\n        desc: Rooms are staged, painted, cleaned, and handed back in a sensible order.`;
}

function archetypeStoryItems(city, profile, archetypeKey, images) {
  const archetype = archetypes[archetypeKey];
  return [
    {
      title: archetype.storyTitle,
      desc: `${city.name} painting decisions are shaped by ${archetype.storyFocus}. That changes how we quote, what photos we ask for, which surfaces get reviewed first, and how the room sequence is planned.

Instead of treating the job as a generic repaint, we separate walls, ceilings, trim, doors, repairs, furniture handling, access, and cleanup. The goal is a cleaner finish and a scope that makes sense for the home type.`,
      image: {
        src: images[0]?.src ?? '../photos/open-concept-home-painting-gta.webp',
        alt: `${city.name} interior painting suited to ${archetype.label.toLowerCase()} homes.`,
      },
    },
    {
      title: `What changes the finish in ${city.name}`,
      desc: `${capitalise(listSentence(profile.homeTypes.slice(0, 3)))} can look simple until light catches ${listSentence(profile.prepConcerns.slice(0, 4))}. We check those details before paint goes on, then choose products and sequencing by surface.

That means wall colour, ceiling flatness, trim sheen, door durability, primer, skim coating, and touch-up expectations are discussed as separate decisions instead of being hidden inside one line item.`,
      image: {
        src: images[1]?.src ?? '../photos/luxury-home-interior-painting.webp',
        alt: `Finished ${city.name} room with smooth walls and clean painted details.`,
      },
    },
  ];
}

function problemItems(city, profile, archetypeKey) {
  const archetype = archetypes[archetypeKey];
  return archetype.projectTitles.slice(0, 6).map((title, index) => ({
    title,
    desc: pick(city, [
      `${title} is scoped around ${archetype.storyFocus}. We review room condition, access, repairs, trim, ceilings, furniture, and finish expectations before deciding whether the work is a simple repaint or a more detailed preparation job.`,
      `This work often starts with ${listSentence(profile.prepConcerns.slice(0, 3))}. The quote should explain what is included for repair, primer, sanding, caulking, masking, coats, and cleanup so the final room does not feel rushed.`,
      `For ${listSentence(profile.homeTypes.slice(0, 2))}, this usually comes down to sequencing. We decide which rooms open first, which surfaces need separate finish systems, and where extra care will matter most.`,
    ], 210 + index),
  }));
}

function projectScenarioItems(city, profile, archetypeKey) {
  const archetype = archetypes[archetypeKey];
  return archetype.scenarioTitles.slice(0, 6).map((title, index) => {
    const room = profile.rooms[index % profile.rooms.length] ?? 'main rooms';
    const concern = profile.prepConcerns[index % profile.prepConcerns.length] ?? 'surface marks';
    return {
      title,
      desc: pick(city, [
        `${title} usually starts with a clear priority: make ${room} look finished without opening up unnecessary work. We look at ${concern}, furniture, trim, ceiling lines, colour coverage, and timing before recommending the scope.`,
        `For this situation, the useful quote separates what must be repaired from what can simply be repainted. That keeps the budget focused on visible rooms, durable trim, clean wall colour, and a practical schedule.`,
        `This is where local context matters. A ${city.name} home may need different staging, access, and finish choices than the same room in another market, especially when the work has to happen around daily use.`,
      ], 230 + index),
    };
  });
}

function realWorldProcessItems(city, profile, archetypeKey) {
  const archetype = archetypes[archetypeKey];
  const base = {
    'toronto-core': [
      ['Building access first', 'Elevator booking, parking, loading access, hallway protection, garbage removal, and work-hour limits are confirmed before paint days are scheduled.'],
      ['Compact staging', 'Condo furniture, art, desks, beds, and access paths are planned room by room so the work area stays orderly.'],
      ['Low-odour product choices', 'When the unit is occupied, we discuss low VOC paint, drying windows, ventilation, and when rooms can be used again.'],
    ],
    'luxury-heritage': [
      ['Finished surfaces are mapped before prep', 'Hardwood, stairs, built-ins, formal rooms, art, and millwork are protected before sanding, caulking, or rolling starts.'],
      ['Older surfaces are reviewed closely', 'Plaster cracks, old patch edges, glossy trim buildup, casing gaps, and previous repairs are checked before finish coats.'],
      ['Quiet daily handoff', 'Tools are organized, rooms are cleaned, and access is kept manageable because many of these homes stay occupied during the work.'],
    ],
    'upscale-suburban': [
      ['Large rooms need sequencing', 'Open main floors, two-storey foyers, stair halls, kitchens, and furniture are staged so one area does not block the rest of the home.'],
      ['Trim is its own scope', 'Premium baseboards, casing, doors, crown, and wainscoting need separate sanding, caulking, primer, and finish choices.'],
      ['Colour transitions are planned', 'Open sightlines make sheen, undertone, ceiling lines, and transitions between rooms more important than in closed layouts.'],
    ],
    'family-home-refresh': [
      ['Room order matters', 'Bedrooms, kitchens, homework areas, pets, children, and main-floor traffic are considered before the schedule is set.'],
      ['Builder paint gets upgraded properly', 'Scuffs, thin coverage, wall dents, stair marks, and weak touch-ups are repaired before stronger finish coats go on.'],
      ['Daily cleanup keeps the home usable', 'The crew plans access paths, drying zones, tools, drop sheets, and cleanup so family routines are not overwhelmed.'],
    ],
    'newer-subdivisions': [
      ['Builder deficiencies are separated from paint', 'Nail pops, drywall seams, thin builder paint, settlement cracks, and rough patches are reviewed before colour selection.'],
      ['Move-in timing shapes the sequence', 'Rooms can be prioritized before furniture arrives, with basements, bedrooms, and main floors scheduled by use.'],
      ['Primer decisions matter', 'Dark colour changes, repaired drywall, stains, and builder flat paint may need primer before finish coats.'],
    ],
    'mixed-housing-practical': [
      ['Scope is chosen by home type', 'A condo, townhome, bungalow, and detached home may need different access, protection, repair, and timeline assumptions.'],
      ['Value rooms come first', 'Entry walls, main living areas, stair walls, bedrooms, trim, and visible ceilings are prioritized when resale or move-in timing matters.'],
      ['Furniture and access are priced clearly', 'Parking, elevators, stairs, furniture movement, and room availability are discussed before the estimate is finalized.'],
    ],
    'country-estate': [
      ['Longer projects need staging', 'Larger homes are planned by zone so rooms, mudrooms, stair halls, and bedrooms are not all disrupted at once.'],
      ['Durability is part of the finish', 'High-traffic entries, mudrooms, stair walls, and family rooms may need more washable wall paint and harder trim coatings.'],
      ['Access and timing are reviewed early', 'Drive time, seasonal occupancy, material planning, and multi-day scheduling are discussed before the start date.'],
    ],
  };
  return (base[archetypeKey] ?? []).map(([title, desc]) => ({
    title,
    desc: `${desc} For ${city.name}, that process supports ${archetype.storyFocus}.`,
  }));
}

function failureItems(city, profile, archetypeKey, images) {
  const selected = {
    'toronto-core': ['Skipped building planning', 'Poor accent-wall coverage'],
    'luxury-heritage': ['Rushing plaster repair', 'Glossy trim painted without sanding'],
    'upscale-suburban': ['Underestimating tall walls', 'Wrong sheen across open rooms'],
    'family-home-refresh': ['Painting over builder defects', 'No plan for busy rooms'],
    'newer-subdivisions': ['Ignoring nail pops', 'Treating builder paint like a finished system'],
    'mixed-housing-practical': ['Comparing vague scopes', 'Skipping repair photos'],
    'country-estate': ['Poor staging on large repaints', 'Choosing weak finishes for high-traffic rooms'],
  }[archetypeKey] ?? ['Insufficient surface preparation', 'Wrong product for the surface'];
  return selected.map((title, index) => ({
    title,
    desc: `${title} leads to visible patch marks, flashing, rough caulking lines, weak coverage, or trim that chips too quickly. We avoid that by reviewing ${listSentence(profile.prepConcerns.slice(0, 3))}, primer needs, sheen, sanding, and the room sequence before finish coats.`,
    image: {
      src: images[index + 2]?.src ?? images[0]?.src ?? '../photos/open-concept-home-painting-gta.webp',
      alt: `${city.name} painting prep and finish planning example.`,
    },
  }));
}

function quoteComparisonItems(city, profile) {
  return [
    {
      title: 'Prep and repairs',
      desc: `Ask whether wall dents, cracks, old patches, sanding, caulking, stain blocking, primer, skim coating, and ${listSentence(profile.prepConcerns.slice(0, 2))} are included or priced separately.`,
    },
    {
      title: 'Surfaces included',
      desc: `Walls, ceilings, trim, doors, baseboards, stair halls, closets, feature walls, and touch-ups should be named clearly. A low quote can simply mean fewer surfaces are included.`,
    },
    {
      title: 'Protection and cleanup',
      desc: `Furniture movement, floor covering, stair protection, masking, access paths, dust control, garbage removal, and daily cleanup should be part of the comparison, especially in lived-in spaces.`,
    },
    {
      title: 'Paint system and coats',
      desc: `Compare paint line, sheen, primer, coat count, colour changes, low VOC needs, trim coating, and whether the quote allows enough time for proper drying and finish quality.`,
    },
  ];
}

function authorityItems(city) {
  const items = [
    ['When skim coating is worth it', 'Skim coating is worth discussing when walls show bad patch edges, torn drywall paper, texture, plaster movement, or strong side light. It is not automatic, but it can matter more than paint brand when the wall surface is rough.'],
    ['When drywall repair should happen first', 'Dents, settlement cracks, nail pops, and old anchor holes should be repaired before primer and colour. Painting first usually makes defects more obvious, not less.'],
    ['Choosing wall sheen', 'Lower-sheen washable finishes often make walls look calmer, while higher sheen can reveal roller marks and repairs. Busy halls may need more durability than formal rooms.'],
    ['Trim versus wall finishes', 'Trim and doors usually need a harder coating than walls. They are touched more, cleaned more, and often need sanding or primer before paint.'],
    ['Why colour changes need extra coats', 'Dark colours, strong undertones, bright whites, and accent wall removal can need primer or extra finish coats to avoid shadowing and uneven coverage.'],
  ];
  const start = variationIndex(city, items.length, 251);
  return [...items.slice(start), ...items.slice(0, start)].slice(0, 4).map(([title, desc]) => ({ title, desc }));
}

function universalFaqItems(city) {
  return [
    { title: `How much does interior painting cost in ${city.name}?`, desc: 'Cost depends on room count, wall condition, trim and door scope, ceilings, colour changes, repairs, furniture, access, primer, and finish expectations. A bedroom repaint, condo repaint, main-floor refresh, and whole-home repaint are priced differently because the prep and surfaces are different.' },
    { title: 'Can you provide a quote from photos?', desc: 'Often, yes. Send wide room photos, close-ups of damage, trim and doors, ceilings, stair walls, furniture constraints, access details, and the colour direction. We will explain what can be priced from photos and what needs a visit.' },
    { title: 'How long does interior painting take?', desc: 'Timing depends on repairs, primer, coat count, ceilings, trim, drying time, furniture, access, and the number of rooms. We plan the sequence so the highest-priority rooms reopen cleanly.' },
    { title: 'Do you repair drywall before painting?', desc: 'Yes. Dents, nail pops, cracks, torn paper, old patch edges, and rough repairs are reviewed before painting. Some areas need spot repair, while rough walls may need broader skim coating.' },
    { title: 'Should ceilings be painted at the same time as walls?', desc: 'Often, yes, especially when ceilings are stained, patched, yellowed, textured, or beside fresh wall colour. We quote ceilings clearly so you can decide whether the full-room refresh is worth it.' },
    { title: 'Do you use low VOC paint?', desc: 'Yes. Low VOC paint can be specified for bedrooms, condos, nurseries, occupied homes, and sensitive spaces. Product choice still depends on the surface: walls, ceilings, trim, doors, and repairs may need different systems.' },
  ];
}

function archetypeFaqItems(archetypeKey) {
  const faqByType = {
    'toronto-core': [
      ['Can you paint occupied condos?', 'Yes. We plan furniture shifts, access paths, drying time, low-odour products, cleanup, and room sequencing so the unit stays manageable.'],
      ['Can you work with elevator booking rules?', 'Yes. Elevator times, loading areas, hallway protection, parking, work hours, and material movement are discussed before scheduling.'],
      ['Can you repaint a condo before listing?', 'Yes. We can focus on entry walls, living areas, bedrooms, trim, doors, and colour choices that photograph cleanly for listing prep.'],
      ['Can you remove or cover a dark feature wall?', 'Yes. Dark accent walls may need primer or extra coats so the new colour does not shadow through the finish.'],
      ['How do you handle parking restrictions?', 'Parking, loading, and material drop-off are part of the quote discussion because they can affect timing and staging.'],
      ['Can you work with designer colours?', 'Yes. We can discuss samples, sheen, undertone, wall light, trim contrast, and how many coats the selected colour may need.'],
    ],
    'luxury-heritage': [
      ['Do older homes need more prep before painting?', 'Usually. Plaster cracks, older patch work, trim buildup, casing gaps, and previous paint layers often need repair, sanding, caulking, or primer before finish coats.'],
      ['Can you paint plaster walls?', 'Yes. Plaster can be painted cleanly when cracks, movement, old repairs, and side-light issues are handled before colour goes on.'],
      ['Can you paint around built-ins?', 'Yes. Built-ins are masked and protected, and any painted shelving or casing is reviewed separately from wall painting.'],
      ['How do you protect hardwood floors and millwork?', 'Protection is planned before prep starts: floors, stairs, built-ins, casing, furniture, art, and access paths are covered or masked as needed.'],
      ['Can you help with colour selection?', 'Yes. We can discuss colour direction, samples, sheen, trim contrast, low VOC products, and how natural light changes the colour during the day.'],
      ['Do you paint formal living and dining rooms?', 'Yes. Formal rooms need clean wall finishes, controlled sheen, sharp casing lines, furniture protection, and attention to how light crosses the walls.'],
    ],
    'upscale-suburban': [
      ['Can you paint large foyers and stair halls?', 'Yes. Tall walls, landings, rail-adjacent surfaces, ceiling lines, and access equipment are planned before the quote is finalized.'],
      ['Can you repaint an open-concept main floor?', 'Yes. Open layouts need colour transitions, sheen consistency, ceiling-line control, furniture planning, and clean sequencing.'],
      ['Do premium trim packages cost more to paint?', 'Often they do because casing, doors, crown, baseboards, wainscoting, and built-ins need separate prep and coating systems.'],
      ['Can you paint before move-in?', 'Yes. Move-in painting can be sequenced before furniture arrives, with high-impact rooms and trim prioritized first.'],
      ['What paint works best in large bright rooms?', 'Product choice depends on light, traffic, colour, sheen, washability, and wall condition. Bright rooms often reveal poor patching and roller texture.'],
      ['Can you coordinate ceilings, trim and walls?', 'Yes. We can plan ceilings, walls, trim, doors, and repairs in the correct order so the finish feels complete.'],
    ],
    'family-home-refresh': [
      ['Can you paint while my family is living in the home?', 'Yes. We plan room order, drying zones, access paths, pets, children, cleanup, and which rooms need to reopen first.'],
      ['Can you upgrade builder paint?', 'Yes. Builder paint often needs wall repair, primer decisions, better coverage, stronger trim coatings, and cleaner colour transitions.'],
      ['Do you paint trim and doors?', 'Yes. Trim and doors are cleaned, sanded, caulked, spot-primed where needed, and painted with a more durable finish than wall paint.'],
      ['Can you paint stair halls?', 'Yes. Stair walls need floor and railing protection, safe access, patching, ceiling-line control, and careful sequencing.'],
      ['Can you work around pets and children?', 'Yes. We discuss safe access, drying time, low-odour products, daily cleanup, and room order so the home stays practical.'],
      ['Can you repaint before selling?', 'Yes. We can prioritize main floors, entry walls, stair marks, bedrooms, trim, doors, and visible repairs for a cleaner listing presentation.'],
    ],
    'newer-subdivisions': [
      ['Do you fix nail pops before painting?', 'Yes. Nail pops, seams, cracks, and rough builder repairs are reviewed before primer and finish coats.'],
      ['Can you repaint builder-grade walls?', 'Yes. Builder flat paint often needs better coverage, repair, primer decisions, and a more washable finish for daily use.'],
      ['Can you paint a finished basement?', 'Yes. Basement painting may include drywall repairs, ceiling work, trim, doors, stair access, and low-odour product planning.'],
      ['Should we paint before moving in?', 'Often, yes. Painting before furniture arrives can reduce staging time and help the home feel finished from day one.'],
      ['Can you handle colour changes over builder beige?', 'Yes. Strong colour changes may need primer or extra coats for even coverage.'],
      ['Do builder deficiencies affect the quote?', 'Yes. Nail pops, rough patches, seams, and weak touch-ups can change preparation time and finish expectations.'],
    ],
    'mixed-housing-practical': [
      ['Is condo painting different from house painting?', 'Yes. Condos often involve elevators and compact staging, while houses may involve stairs, basements, more trim, and larger room sequences.'],
      ['Can you repaint room by room?', 'Yes. Room-by-room painting can prioritize the highest-impact spaces while keeping budget and disruption under control.'],
      ['Can you paint before resale?', 'Yes. Entry walls, main living areas, stair halls, bedrooms, trim, doors, and visible repairs usually matter most for resale presentation.'],
      ['What scope gives the best value?', 'The best scope depends on current condition. Sometimes walls are enough; other times trim, doors, ceilings, and repairs make the repaint look more complete.'],
      ['Can you paint townhome stair walls?', 'Yes. Stair walls, landings, rail-adjacent surfaces, and ceiling lines can be painted with the right protection and access plan.'],
      ['How do I compare quotes for mixed scopes?', 'Compare surfaces, repairs, primer, coat count, ceilings, trim, furniture, access, cleanup, and paint products rather than just the final price.'],
    ],
    'country-estate': [
      ['Can you stage a larger home repaint?', 'Yes. Larger projects are planned by zone so rooms can reopen gradually and the home does not feel fully disrupted at once.'],
      ['What finishes work best in mudrooms?', 'Mudrooms and high-traffic areas usually need more washable wall paint, durable trim coatings, and extra attention to scuffs and moisture.'],
      ['Does access affect scheduling?', 'It can. Longer access routes, material planning, seasonal occupancy, and multi-day schedules are discussed before booking.'],
      ['Can you paint estate stair halls and large rooms?', 'Yes. Tall walls, large rooms, foyers, and stair halls are planned with proper staging, protection, and finish sequencing.'],
      ['How do you plan long painting projects?', 'We divide the home by priority, access, drying time, furniture, cleanup, and which rooms need to stay available.'],
      ['Are durable paints worth it?', 'Often, yes, especially in entries, mudrooms, family rooms, stair walls, doors, and trim that see daily wear.'],
    ],
  };
  return (faqByType[archetypeKey] ?? faqByType['family-home-refresh']).map(([title, desc]) => ({ title, desc }));
}

function localConditionFaqItems(city, profile) {
  return [
    { title: `What surfaces are most important to review in ${city.name}?`, desc: `We usually start with ${listSentence(profile.rooms.slice(0, 3))}, then review ${listSentence(profile.prepConcerns.slice(0, 4))}, trim, doors, ceilings, and access. Those details tell us whether the work is a clean repaint or a prep-heavy finish job.` },
    { title: `Why do painting quotes vary so much in ${city.name}?`, desc: 'Quotes vary because some include repairs, primer, sanding, caulking, ceilings, trim, doors, protection, cleanup, and stronger paint products, while others only include rolling wall colour.' },
    { title: `Can you match existing trim colour in ${city.name} homes?`, desc: 'Often, yes. We review the existing sheen, age, yellowing, gloss level, previous paint buildup, and whether a full trim repaint will look better than small touch-ups.' },
    { title: `Do you service nearby areas around ${city.name}?`, desc: `Yes. We also plan painting work in nearby areas such as ${nearbyCitySlugs(city).slice(0, 4).map((slug) => cityBySlug[slug]?.name).filter(Boolean).join(', ')}. The quote can include the address, access notes, photos, and room scope.` },
  ];
}

function uniqueFaqItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cityFaqItems(city, profile, archetypeKey) {
  return uniqueFaqItems([
    ...universalFaqItems(city),
    ...archetypeFaqItems(archetypeKey),
    ...localConditionFaqItems(city, profile),
    { title: 'Can you paint over oil paint?', desc: 'Sometimes, but glossy or oil-based surfaces need the right cleaning, sanding, bonding primer, and product selection before finish paint. We check trim and doors carefully before recommending the system.' },
    { title: 'Can you repaint after wallpaper removal?', desc: 'Yes. Wallpaper removal can leave adhesive, torn paper, seams, and rough areas. Those usually need cleaning, repair, skim coating, primer, or sealing before paint.' },
    { title: 'What paint finish is best for walls, trim and ceilings?', desc: 'Walls often need washable low sheen, ceilings usually need a flat finish, and trim or doors usually need a harder coating. The exact product depends on room use and surface condition.' },
  ]).slice(0, 19);
}

function templateSections(template, sectionMap) {
  const orders = {
    A: ['carousel', 'localStory', 'projects', 'process', 'pricing', 'authority', 'faq', 'cta', 'related', 'nearby'],
    B: ['carousel', 'problems', 'scenarios', 'imageGallery', 'pricing', 'quoteComparison', 'process', 'faq', 'cta', 'related', 'nearby'],
    C: ['carousel', 'localStory', 'prep', 'projects', 'failure', 'authority', 'pricing', 'faq', 'cta', 'related', 'nearby'],
    D: ['carousel', 'localStory', 'process', 'quoteComparison', 'scenarios', 'imageGallery', 'pricing', 'faq', 'cta', 'related', 'nearby'],
  };
  return (orders[template] ?? orders.A).map((key) => sectionMap[key]).filter(Boolean);
}

function exactCityFaqItems(city, profile) {
  const nearbyNames = nearbyCitySlugs(city).slice(0, 4).map((slug) => cityBySlug[slug]?.name).filter(Boolean).join(', ');
  const sets = {
    toronto: [
      ['Can you paint downtown Toronto condos with elevator booking rules?', 'Yes. We ask for elevator times, service entrance rules, loading dock details, hallway requirements, parking limits, and work-hour restrictions before the quote is finalized.'],
      ['Can you repaint a Toronto condo before listing?', 'Yes. We focus on entry walls, living areas, bedrooms, feature walls, trim touch-ups, and colours that photograph cleanly for sale preparation.'],
      ['Can you handle parking and loading access in Toronto?', 'Yes. Parking and loading affect timing, material movement, and staging. We ask about those details early so the painting day is not derailed at the curb.'],
      ['Do you paint occupied Toronto condos?', 'Yes. We can work by room, keep access paths open, discuss low-odour products, and plan drying windows around daily use.'],
      ['Can you remove a dark condo feature wall?', 'Yes. Dark accent colours often need primer or extra coats, especially when the new colour is light or the wall is strongly lit.'],
      ['Can you provide a condo painting quote from photos?', 'Often, yes. Send each room from two angles, trim and door close-ups, wall damage, ceiling height, elevator notes, parking notes, and the colours you are considering.'],
      ['How much does condo painting cost in Toronto?', 'Cost depends on room count, access, repairs, trim, doors, ceilings, colour changes, product choice, and whether the unit is empty or furnished.'],
      ['How long does a Toronto condo repaint take?', 'A simple condo can move quickly, while repairs, feature wall colour changes, trim, ceilings, elevator windows, and furniture can add time.'],
      ['Can you paint rental turnover units?', 'Yes. We can prioritize durable wall finishes, quick repair decisions, entry walls, bedrooms, living rooms, and trim that affects the first impression.'],
      ['Do building rules change the painting schedule?', 'They can. Some buildings limit service elevator use, loading hours, disposal, hallway coverage, and contractor access. Those rules are part of the plan.'],
      ['What paint finish works best for condos?', 'Many condo walls suit a washable low-sheen finish, while trim and doors need something tougher. Strong daylight and pot lights can make sheen choice important.'],
      ['Do you repair drywall dents before painting?', 'Yes. Condo walls often have anchor holes, moving scuffs, furniture marks, and previous tenant patches that should be corrected before colour goes on.'],
      ['Can you match designer colours?', 'Yes. We can discuss samples, undertones, sheen, trim contrast, coverage, and whether the colour needs primer or extra coats.'],
      ['Do you paint ceilings in condos?', 'Yes, when stains, repairs, old roller marks, or colour contrast would make fresh walls look unfinished.'],
      ['Can you work around furniture in a small condo?', 'Yes. Furniture movement, drop zones, drying areas, and tool staging are planned before the work starts.'],
      ['Why do Toronto painting quotes vary so much?', 'Some quotes include building logistics, wall repair, primer, trim, doors, cleanup, paint quality, and access planning. Others only price wall colour.'],
      ['Do you service nearby areas from Toronto?', `Yes. We also handle painting in ${nearbyNames || 'nearby GTA areas'} when the scope fits our interior painting work.`],
    ],
    vaughan: [
      ['How much does interior painting cost in Vaughan?', 'Cost depends on the number of rooms, stair hall height, trim and door count, wall damage, colour changes, ceilings, furniture, and whether the work is before or after move-in.'],
      ['Can you repaint a Vaughan main floor?', 'Yes. Main-floor repainting often includes long walls, kitchen-adjacent areas, family rooms, entries, stair walls, trim, and ceiling-line work.'],
      ['Can you upgrade builder-grade paint?', 'Yes. Builder paint often needs better coverage, repaired dents, nail pops, stronger washable wall paint, and cleaner transitions between rooms.'],
      ['Do you paint stair halls and high walls?', 'Yes. Stair halls need safe access, floor and railing coverage, patching, clean cut lines, and enough time for tall walls.'],
      ['Do you paint trim, doors and baseboards?', 'Yes. Doors, casing, baseboards, crown, and rail-adjacent trim are reviewed separately because they need a tougher coating than walls.'],
      ['Can you paint while kids and pets are home?', 'Yes. We plan room order, drying zones, access paths, and daily cleanup so the work fits family life more comfortably.'],
      ['Can you repaint before move-in?', 'Yes. Empty-home timing is often ideal for bedrooms, main floors, stair halls, trim, and colour changes before furniture arrives.'],
      ['Can you repaint before selling a Vaughan home?', 'Yes. We can focus on entry walls, main floors, stair marks, tired trim, doors, bedrooms, and obvious wall repairs.'],
      ['How long does a Vaughan home repaint take?', 'Timing depends on room count, stair halls, repairs, trim and doors, ceilings, drying time, furniture, and coat count.'],
      ['Should ceilings be painted with the walls?', 'Sometimes. Fresh wall colour can make older ceilings look dull, especially near kitchens, stair halls, and bright main-floor rooms.'],
      ['Can you repair nail pops and drywall dents?', 'Yes. We repair common wall dents, nail pops, old anchors, settlement marks, and rough patches before painting.'],
      ['What paint finish works best for family homes?', 'Washable low-sheen wall paint usually works well for busy areas, while trim and doors need a more durable finish.'],
      ['Can you paint dark colours back to neutral?', 'Yes. Strong colour changes may need primer and extra coats to prevent shadowing or uneven coverage.'],
      ['Can you work around heavy furniture?', 'Yes. Furniture movement and room access are discussed during the quote so the sequence is realistic.'],
      ['Why do Vaughan painting quotes vary so much?', 'Quotes vary when trim, doors, stair halls, repairs, primer, ceilings, paint quality, and cleanup are included differently.'],
      ['Can you quote from photos?', 'Often, yes. Send main-floor photos, stair hall views, trim and door close-ups, wall damage, room list, ceiling height, and timing.'],
      ['Do you service nearby areas from Vaughan?', `Yes. We also handle painting in ${nearbyNames || 'nearby York Region areas'} when the project fits our interior painting scope.`],
    ],
    'forest-hill': [
      ['How much does interior painting cost in Forest Hill?', 'Cost varies with plaster condition, room size, trim detail, built-ins, stair halls, ceiling work, furniture, colour changes, and the level of finish expected.'],
      ['Do older Forest Hill homes need plaster repair first?', 'Often, yes. Hairline cracks, movement, old patch edges, and uneven plaster can show through fresh paint if they are not addressed first.'],
      ['Can you paint plaster walls?', 'Yes. Plaster walls can paint beautifully when cracks, loose areas, old repairs, primer needs, and side light are reviewed before colour goes on.'],
      ['Can you paint formal living rooms and dining rooms?', 'Yes. Formal rooms need calm wall sheen, clean casing lines, furniture staging, and close attention to how daylight crosses the walls.'],
      ['Can you paint around built-ins?', 'Yes. Built-ins, shelving, casing, and adjacent walls are reviewed as separate surfaces so the work does not look like a quick wall repaint.'],
      ['How do you protect hardwood floors and stairs?', 'We plan floor covering, stair access, furniture movement, and masking before sanding or painting begins.'],
      ['Can you paint detailed casing and older trim?', 'Yes. Older trim may need cleaning, sanding, caulking, spot primer, and a durable finish that suits the existing paint history.'],
      ['Can you help with colour selection?', 'Yes. We can discuss samples, undertones, trim contrast, room light, sheen, and how colours behave in formal rooms.'],
      ['Is skim coating worth it in older homes?', 'It can be when walls show texture, rough old patches, plaster movement, or strong side light. Not every room needs it.'],
      ['Do you paint stair halls and high walls?', 'Yes. Stair halls need careful access, railing coverage, clean ceiling lines, and a plan for tall or highly visible walls.'],
      ['Can you paint while the home is furnished?', 'Yes. Furniture, floors, built-ins, stairs, and daily access are planned before work starts.'],
      ['Do you paint after popcorn ceiling removal?', 'Yes. Ceiling smoothing, primer, and wall painting can be sequenced so the room is finished once rather than reopened twice.'],
      ['Why do Forest Hill painting quotes vary so much?', 'Quotes vary because plaster repair, trim detail, built-ins, floors, furniture, ceilings, primer, and finish expectations can change the labour significantly.'],
      ['Can you match existing older trim colour?', 'Often, yes. We review yellowing, sheen, paint buildup, and whether touch-ups or a full trim repaint will look better.'],
      ['What paint finish works best in formal rooms?', 'Lower-sheen washable wall finishes often look calmer, while trim and doors need more durability. Light and wall condition drive the final choice.'],
      ['Can you quote from photos?', 'Often, yes. Send wide room photos, plaster cracks, trim detail, built-ins, stair halls, ceiling height, and any areas that worry you.'],
      ['Do you service nearby areas from Forest Hill?', `Yes. We also handle painting in ${nearbyNames || 'nearby Toronto neighbourhoods'} when the scope fits our interior painting work.`],
    ],
  };
  const selected = sets[city.slug];
  if (!selected) return null;
  return selected.map(([title, desc]) => ({ title, desc }));
}

function exactCitySections(city, profile, archetypeKey, images) {
  const related = renderBenefits('Related Strataline services', relatedItems(city));
  const nearby = renderBenefits('Nearby service areas', nearbyItems(city));
  const cta = renderQuoteCta(city, profile, images[0]);
  const faqs = exactCityFaqItems(city, profile);
  if (!faqs) return null;

  if (city.slug === 'toronto') {
    return {
      faqs,
      sections: [
        renderImageCarousel(images, city),
        renderBenefits('Painting Toronto condos without building headaches', [
          { title: 'Downtown condos and compact rooms', desc: 'Toronto condo painting is often less about square footage and more about access. We plan the repaint around unit layout, furniture, service elevator timing, hallway rules, and the rooms that need to open first. Larger wall repairs can be coordinated with [drywall repair and skim coating](/services/drywall-repair-skim-coating).' },
          { title: 'Rental turnover and owner-occupied units', desc: 'A turnover unit may need fast repair decisions and durable neutral colour. An owner-occupied condo may need quieter staging, low-odour products, and a room-by-room sequence.' },
          { title: 'Photo quotes with the right details', desc: 'Useful photos show wide room views, wall damage, trim and doors, ceiling height, feature colours, elevator notes, parking notes, and where materials can be staged.' },
        ]),
        renderBenefits('Elevator, parking and access planning', [
          { title: 'Elevators and loading docks', desc: 'Before booking, we ask about service elevator windows, loading dock rules, move-in pads, hallway coverage, disposal rules, and allowed contractor hours.' },
          { title: 'Parking that does not derail the day', desc: 'Downtown parking limits can change arrival time, unloading, and material movement. We factor that into the schedule instead of treating access as an afterthought.' },
          { title: 'Hallways, alarms and building rules', desc: 'Condo work has shared spaces. We confirm hallway requirements, security desk instructions, garbage handling, and any rules that affect tools or coatings.' },
        ]),
        renderImagePanel('Toronto condo-style finish examples', images, city, 2),
        renderBenefits('Condo repaint before listing or move-in', [
          { title: 'Before listing', desc: 'Entry walls, living areas, bedrooms, dark feature walls, scuffed doors, and visible patches are usually the highest-impact items before photos and showings.' },
          { title: 'Before move-in', desc: 'When the unit is empty, we can handle bedrooms, closets, living areas, trim, and colour changes before furniture makes access harder.' },
          { title: 'Rental turnover', desc: 'Turnovers often need practical repairs, washable wall paint, reliable neutral colour, and a clear schedule between tenants.' },
          { title: 'Occupied condo painting', desc: 'When someone is living in the unit, the work is staged around furniture, drying time, ventilation, pets, work-from-home needs, and evening access.' },
        ]),
        renderBenefits('Feature walls, repairs and clean finishes', [
          { title: 'Dark accent wall changes', desc: 'Deep feature colours may need primer and extra coats so the new colour reads evenly in daylight and pot lights. If the wall surface is rough, we review whether [drywall repair and skim coating](/services/drywall-repair-skim-coating) belongs in the scope.' },
          { title: 'Drywall dents and anchor holes', desc: 'Condo walls often collect TV anchors, art holes, moving damage, and tenant touch-ups. Those repairs are reviewed before colour is applied.' },
          { title: 'Modern paint finish choices', desc: 'Condo interiors often need washable low-sheen walls, durable trim paint, and careful sheen choices because compact rooms show marks quickly.' },
        ]),
        renderBenefits('How To Compare Painting Quotes', quoteComparisonItems(city, profile)),
        renderFaq('Toronto condo painting FAQ', faqs),
        cta,
        related,
        nearby,
      ],
    };
  }

  if (city.slug === 'vaughan') {
    return {
      faqs,
      sections: [
        renderImageCarousel(images, city),
        renderZigZag('Main-floor repainting for Vaughan homes', [
          { title: 'Main floors, kitchens and family rooms', desc: 'Vaughan repaint requests often start with the rooms everyone sees: open main floors, kitchen-adjacent walls, family rooms, entries, and stair walls. We scope those areas together so colour, sheen, and trim lines feel consistent, especially when nearby [stairs](/services/stairs) or railing updates affect the walls.', image: { src: images[0]?.src ?? '../photos/open-concept-home-painting-gta.webp', alt: 'Vaughan main-floor interior painting with bright walls and trim.' } },
          { title: 'Move-in and pre-sale refreshes', desc: 'Before moving in or listing, the work usually focuses on visible walls, stair marks, tired baseboards, bedroom colours, and doors that make the home feel worn.', image: { src: images[1]?.src ?? '../photos/bright-living-room-interior-painting.webp', alt: 'Vaughan family home repaint with finished living space.' } },
        ]),
        renderBenefits('Builder paint upgrades and colour changes', [
          { title: 'Thin builder paint', desc: 'Builder-grade walls often show scuffs, roller marks, weak washability, and patchy touch-ups. A proper upgrade means repairs, primer decisions, and a better finish paint.' },
          { title: 'Neutralizing strong colours', desc: 'Dark bedrooms, accent walls, and dated colours may need primer or extra coats so the new colour covers evenly.' },
          { title: 'Nail pops and settlement marks', desc: 'Newer homes can show nail pops, corner cracks, and small drywall movement. Those defects should be handled before the repaint is judged.' },
        ]),
        renderBenefits('Stair halls, trim and doors', [
          { title: 'Stair halls and high walls', desc: 'Stair walls collect hand marks and are highly visible from the main floor. Safe access, rail coverage, patching, and clean ceiling lines matter here.' },
          { title: 'Trim, doors and baseboards', desc: 'Doors, casing, and baseboards need a harder coating than walls. They are reviewed separately because sanding, caulking, and drying time can change the schedule. Detailed rooms can link naturally into [trim and millwork painting](/services/trim-and-millwork-painting).' },
          { title: 'Open sightlines', desc: 'Large family rooms and open layouts make colour transitions, sheen, and long wall quality more obvious.' },
        ]),
        renderImagePanel('Vaughan family-home finish examples', images, city, 2),
        renderBenefits('Painting around family life', [
          { title: 'Kids, pets and room order', desc: 'Bedrooms, kitchens, homework areas, pets, and daily traffic influence the sequence. We plan which rooms need to reopen first.' },
          { title: 'Furniture and access paths', desc: 'Large sofas, dining tables, beds, and stair access are discussed before the estimate so the work can move sensibly through the home.' },
          { title: 'Cleaner day-to-day staging', desc: 'Tools, drop sheets, drying zones, and touch-up areas are kept organized so the home does not feel overtaken.' },
        ]),
        renderBenefits('Common Painting Situations In Vaughan', projectScenarioItems(city, profile, archetypeKey)),
        renderBenefits('How To Compare Painting Quotes', quoteComparisonItems(city, profile)),
        renderFaq('Vaughan house painting FAQ', faqs),
        cta,
        related,
        nearby,
      ],
    };
  }

  if (city.slug === 'forest-hill') {
    return {
      faqs,
      sections: [
        renderImageCarousel(images, city),
        renderBenefits('Painting older Forest Hill homes', [
          { title: 'Older detached homes', desc: 'Forest Hill interiors often combine plaster, formal rooms, detailed casing, hardwood floors, and trim that has been painted many times. The work needs a finish plan, not a quick colour swap.' },
          { title: 'Renovated luxury homes', desc: 'Renovated homes may have newer drywall beside older plaster, custom built-ins, smooth ceilings, and high expectations for wall sheen and trim lines.' },
          { title: 'High-value interiors', desc: 'Furniture, artwork, floors, stairs, built-ins, and millwork are considered before sanding, repairs, or finish coats begin.' },
        ]),
        renderZigZag('Plaster repair before painting', [
          { title: 'Cracks, movement and old patches', desc: 'Plaster cracks, settlement lines, rough old repairs, and raised patch edges can show through fresh paint. We identify what needs repair, what needs primer, and where [skim coating before painting](/services/drywall-repair-skim-coating) may be worth discussing.', image: { src: images.find((image) => image.src.includes('level-5'))?.src ?? '../photos/level-5-drywall-finish-painted-wall.webp', alt: 'Forest Hill plaster repair and smooth wall finish before painting.' } },
          { title: 'Side light and formal rooms', desc: 'Formal living and dining rooms can reveal wall texture more than bedrooms. Sheen, sanding, patch edges, and primer all matter when natural light crosses the wall.', image: { src: images[2]?.src ?? '../photos/dining-room-painting-toronto.webp', alt: 'Forest Hill formal room painting with smooth walls.' } },
        ]),
        renderBenefits('Formal rooms, built-ins and detailed trim', [
          { title: 'Formal living and dining rooms', desc: 'These rooms need calm wall finishes, crisp casing lines, careful furniture staging, and colour choices that hold up in changing light.' },
          { title: 'Built-ins and shelving', desc: 'Built-ins are reviewed as their own surface. Masking, sanding, primer, and coating choices affect whether they blend cleanly with adjacent walls and trim. Where the scope is millwork-heavy, we connect it with [trim and millwork painting](/services/trim-and-millwork-painting).' },
          { title: 'Detailed casing and baseboards', desc: 'Older casing, crown, baseboards, and doors can have paint buildup, gaps, gloss, and chips that need separate attention.' },
        ]),
        renderZigZag('Protecting hardwood, stairs and millwork', [
          { title: 'Finished floors and stairs', desc: 'Hardwood floors, stair treads, rail-adjacent walls, and landings are mapped before repair dust or paint tools enter the room. Stair-adjacent wall work can be coordinated with [stairs](/services/stairs) when refinishing is part of the broader project.', image: { src: images[1]?.src ?? '../photos/luxury-home-painting-toronto.webp', alt: 'Forest Hill luxury home painting with hardwood floors.' } },
          { title: 'Millwork and furniture', desc: 'Built-ins, casing, furniture, art, and access paths are staged carefully so the home stays orderly through a detailed repaint.', image: { src: images.find((image) => image.src.includes('wainscoting'))?.src ?? '../photos/wainscoting-painting-satin-finish.webp', alt: 'Forest Hill millwork and wainscoting painting finish.' } },
        ]),
        renderZigZag('Why Paint Jobs Fail', failureItems(city, profile, archetypeKey, images)),
        renderBenefits('Common Painting Situations In Forest Hill', projectScenarioItems(city, profile, archetypeKey)),
        renderFaq('Forest Hill older-home painting FAQ', faqs),
        cta,
        related,
        nearby,
      ],
    };
  }

  return null;
}

function localIntro(city, profile) {
  const intros = [
    `In many ${city.name} homes, interior painting is not just a colour change. The real work is protecting the finished space, correcting the flaws that will show in daylight, and choosing the right finish for walls, trim, doors, and ceilings. For ${profile.angle}, that planning matters before a brush ever touches the wall.`,
    `${city.name} painting projects usually succeed or fail during prep. We look at the wall condition, trim age, door wear, furniture layout, access, lighting, and cleanup plan so the finished rooms feel intentional rather than quickly covered.`,
    `A good repaint in ${city.name} should make the home feel sharper without making the process feel chaotic. We plan around ${profile.logistics}, then separate walls, trim, doors, repairs, and ceilings into the right finish systems.`,
    `The best painting jobs are quiet: no messy setup, no vague scope, no rough patch marks flashing through the finish. In ${city.name}, we build the work around ${listSentence(profile.homeTypes.slice(0, 2))}, surface prep, protection, and a clean handoff.`,
    `For ${city.name} homeowners, paint often comes after flooring, stair, lighting, or move-in decisions. We help organize the repaint so the rooms, trim, doors, touch-ups, and cleanup all support the finished look of the home.`,
    `Interior painting in ${city.name} needs a practical plan for the way the home is actually used. That means room sequencing, furniture protection, sanding dust control, trim prep, colour coverage, and daily cleanup, not just cans of paint on site.`,
  ];
  return pick(city, intros, 13);
}

function scopeParagraph(city, profile) {
  const choices = [
    `Depending on the room, the work may include wall painting, trim and door painting, ceiling touch-ups, drywall repairs, caulking, sanding glossy surfaces, priming patched areas, furniture protection, and daily cleanup. We adjust the emphasis around ${listSentence(profile.rooms.slice(0, 2))} instead of treating every repaint as the same package.`,
    `A proper painting scope separates walls, trim, doors, ceilings, repairs, and protection. That matters in ${listSentence(profile.homeTypes.slice(0, 2))}, where prep, access, light, and daily use can change the amount of work behind a clean finish.`,
    `The final result depends on the invisible steps: patching dents, sanding rough areas, priming repairs, tightening caulking lines, protecting floors, and choosing the right finish for each surface. For ${profile.tone} work, those details are part of the plan from the start.`,
    `We can include walls, trim, doors, ceilings, drywall touch-ups, furniture movement, and cleanup, but we do not bundle them into one vague line. Each surface is reviewed so the quote matches the finish level expected in the home.`,
    `The goal is not just fresh colour. The goal is a cleaner room: sharper trim lines, corrected patches, protected floors, a sensible work sequence, and finishes chosen for how the space is actually used.`,
  ];
  return pick(city, choices, 14);
}

function localPlanningItems(city, profile) {
  const firstRoom = first(profile.rooms, 'main floors');
  const homeTypes = listSentence(profile.homeTypes.slice(0, 3));
  const concerns = listSentence(profile.prepConcerns.slice(0, 3));
  const variants = [
    [
      {
        title: `${city.name} homes need a real prep plan`,
        desc: `${city.name} projects often involve ${profile.cityHousingNotes}. We check ${concerns}, then decide what needs sanding, patching, caulking, primer, or extra finish coats before the price is locked in.`,
      },
      {
        title: `The rooms we usually discuss first`,
        desc: `Most quote conversations start with ${listSentence(profile.rooms)}. We separate walls, ceilings, trim, doors, and repairs so the scope is easy to compare and nothing important is hidden in a vague line item.`,
      },
      {
        title: `Built for the way the home is used`,
        desc: `This is a better fit for ${profile.buyerIntent}. The job is planned around access, cleanliness, drying time, and how the rooms need to function while work is underway.`,
      },
    ],
    [
      {
        title: `Local painting conditions`,
        desc: `${capitalise(homeTypes)} in ${city.name} often need different decisions than a basic repaint. We look at lighting, wall texture, trim wear, colour coverage, and how much repair is needed before final coats.`,
      },
      {
        title: `Scope without confusion`,
        desc: `${repaintPhrase(firstRoom)} may sound simple, but doors, casing, baseboards, stair walls, ceilings, and drywall touch-ups can change the final result. We break those pieces out clearly.`,
      },
      {
        title: `Protection comes before speed`,
        desc: `The work is planned around ${profile.logistics}. That setup protects the home and keeps the project from feeling like a messy construction site.`,
      },
    ],
    [
      {
        title: `Not every wall takes paint the same way`,
        desc: `Older repairs, glossy trim, builder paint, dark colours, and strong window light can all change the prep. In ${city.name}, we identify those issues before committing to a finish plan.`,
      },
      {
        title: `A finished-home painting sequence`,
        desc: `We plan room order, furniture shifts, masking, sanding, primer, coats, and touch-ups so ${listSentence(profile.homeTypes.slice(0, 2))} stay manageable during the work.`,
      },
      {
        title: `A quote that matches expectations`,
        desc: `Some clients want a quick refresh. Others want a very clean trim and wall finish. We clarify that expectation first so the scope matches the level of finish you actually want.`,
      },
    ],
  ];
  return pick(city, variants, 21);
}

function roomScenarios(city, profile) {
  const roomA = first(profile.rooms, 'main floors');
  const roomB = profile.rooms[1] ?? 'bedrooms';
  const home = first(profile.homeTypes, 'home');
  const scenarios = [
    {
      title: `${sentenceCase(roomA)} refresh`,
      desc: `${repaintPhrase(roomA)} usually means wall repair, ceiling-line control, clean cut lines, and a plan for furniture. In ${city.name}, we check how daylight will reveal patch edges, roller texture, and old touch-ups before painting starts.`,
    },
    {
      title: `Trim and door upgrade`,
      desc: `Doors, casing, and baseboards take abuse in daily use. We treat them separately with cleaning, sanding, caulking, spot primer, and a harder-wearing coating so they do not look like an afterthought beside freshly painted walls.`,
    },
    {
      title: `Move-in or pre-listing repaint`,
      desc: `When timing matters, the priority is the highest-impact areas: entry walls, stair halls, visible trim, bedrooms, and tired doors. The goal is a sharper impression without wasting budget on rooms that do not need attention.`,
    },
    {
      title: `Older wall correction`,
      desc: `Where walls show old repairs, hairline cracks, settlement lines, or raised patch edges, we build the prep into the painting plan instead of covering the problem with colour and hoping the light does not catch it.`,
    },
    {
      title: `Occupied-home repainting`,
      desc: `For ${livedInPhrase(home)}, the sequence matters. We plan work zones, access paths, furniture movement, drying time, and daily cleanup so the project stays controlled while the household keeps moving.`,
    },
    {
      title: `${sentenceCase(roomB)} and private spaces`,
      desc: `${capitalise(roomB)} often need a quieter schedule, careful furniture handling, patching around headboards or desks, and a finish that looks clean without feeling overly shiny in softer light.`,
    },
  ];
  const start = variationIndex(city, scenarios.length, 7);
  return [...scenarios.slice(start), ...scenarios.slice(0, start)].slice(0, 3);
}

function prepItems(city, profile) {
  const templates = [
    (concern) => `${concern} can show through a new colour if it is treated as a quick touch-up. We identify the problem, sand or repair as needed, spot-prime where useful, and then paint the area as part of the full surface.`,
    (concern) => `When we find ${concern}, the paint job needs more than rolling. We review texture, edges, primer needs, and lighting so the repair does not stand out after the finish dries.`,
    (concern) => `${concern} affects pricing because prep time changes the finished look. We explain that upfront instead of pretending every wall or trim run is in the same condition.`,
    (concern) => `For ${concern}, the right sequence is clean, repair, sand, prime where needed, and then coat. Skipping those steps is what makes freshly painted rooms still look tired.`,
  ];
  return (profile.prepConcerns ?? fallbackProfile.prepConcerns).slice(0, 3).map((concern, index) => ({
    title: capitalise(concern),
    desc: templates[(variationIndex(city, templates.length, index * 3))](concern),
  }));
}

function finishSystemItems(city, profile) {
  const systems = [
    {
      title: 'Walls',
      desc: pick(city, [
        'Walls need patching, sanding, spot priming, clean cut lines, and a finish that suits the room. Strong side light, darker colours, and older repairs make prep more important than the paint brand alone.',
        'Wall painting is where every dent, patch, and roller mark becomes visible. We look at the room in normal light and decide how much correction is needed before finish coats.',
        'For walls, the best result comes from controlled prep and the right sheen. A washable low-sheen finish often gives a cleaner look without making every imperfection glare.',
      ], 31),
    },
    {
      title: 'Trim and baseboards',
      desc: pick(city, [
        'Baseboards, casing, and crown details collect dents, caulking gaps, old drips, and glossy paint. We separate trim prep from wall painting so the edges and sheen look intentional.',
        'Trim needs its own prep: cleaning, sanding, filling, caulking where appropriate, and primer on problem areas. That is what makes the trim look crisp beside freshly painted walls.',
        'Old trim can make a new wall colour look unfinished. We check chipped edges, gaps, gloss, brush marks, and previous buildup before deciding how far the trim scope should go.',
      ], 32),
    },
    {
      title: 'Doors',
      desc: pick(city, [
        'Doors often need extra attention around handles, panel edges, hinge-side buildup, and previous brush marks. The goal is a durable, smooth finish that stands up to daily use.',
        'Door painting is slower than it looks when the finish needs to be clean. Edges, panels, hardware areas, and old runs need prep before a durable coating goes on.',
        'A freshly painted door should not feel sticky, rough, or streaky. We plan sanding, coating choice, drying time, and access so doors can return to normal use properly.',
      ], 33),
    },
    {
      title: 'Ceilings',
      desc: pick(city, [
        'Ceilings can be included where staining, old roller marks, popcorn removal, pot-light work, or drywall repairs make a simple wall repaint look incomplete.',
        'Ceiling paint is worth discussing when the room is being fully refreshed. A tired ceiling beside fresh walls can make the whole room feel half-finished.',
        'We quote ceilings separately when needed so the scope is clear. That is especially useful when ceiling repairs, height, texture, or lighting will change the work.',
      ], 34),
    },
    {
      title: 'Feature walls',
      desc: pick(city, [
        'Feature walls need clean layout, sharp edges, primer planning for strong colours, and a finish that suits the room. Dark accent walls make wall prep and cut lines more visible.',
        'A feature wall is not only a colour choice. We review lighting, wall texture, trim edges, and coverage so the accent reads deliberate instead of patchy.',
        'Accent colours can expose wall flaws and weak cut lines. We plan sanding, primer, edge control, and coat count before the darker or stronger colour goes on.',
      ], 35),
    },
    {
      title: 'Repairs and skim coating',
      desc: pick(city, [
        'Repairs and skim coating are handled before paint when dents, cracks, torn paper, raised patches, or rough surfaces would show through final coats.',
        'Drywall repair is part of the finish system when the wall condition affects the result. We separate small patching from larger skim-coat areas so the quote is honest.',
        'Skim coating is considered where strong side light or old repair texture would make a fresh paint job look uneven. It is quoted separately when it changes the scope.',
      ], 36),
    },
    {
      title: 'Colour changes',
      desc: pick(city, [
        'Large colour changes may need primer, extra coats, or a different sequence around trim and ceilings. We flag that before work starts so coverage is not a surprise.',
        'Dark-to-light and light-to-dark changes are not equal. Coverage, sheen, primer, and cut lines all affect how clean the final colour looks.',
        'Colour updates work best when the surrounding trim, doors, and ceilings are reviewed at the same time. Otherwise the new wall colour can expose older finishes.',
      ], 37),
    },
  ];
  return systems;
}

function processItems(city, profile) {
  const steps = [
    {
      title: 'Protect the finished home first',
      desc: pick(city, [
        `Floors, stairs, counters, hardware, railings, furniture, and access paths are protected before sanding or painting starts. This matters especially for ${profile.logistics}.`,
        `Before prep starts, we decide what gets covered, moved, masked, or isolated. That setup keeps the job controlled and reduces cleanup surprises.`,
        `Protection is part of the painting process, not a courtesy add-on. Finished floors, trim, stairs, furniture, and adjacent rooms are planned before tools come out.`,
      ], 41),
    },
    {
      title: 'Prepare surfaces before colour',
      desc: pick(city, [
        `We address dents, cracks, nail pops, old caulking gaps, glossy trim, patch marks, and primer needs before finish coats. Better prep is what makes the paint job feel calm and finished.`,
        `Prep is where the quality is decided: fill, sand, clean, caulk, prime, and inspect. The finish coat should not be asked to hide problems that needed repair.`,
        `Surface prep is matched to the room. A stair hall, bedroom, kitchen area, and door package all need slightly different handling.`,
      ], 42),
    },
    {
      title: 'Use the right coating for each surface',
      desc: pick(city, [
        `Walls, trim, doors, ceilings, and cabinetry do not all want the same paint or the same prep. Sheen, durability, brushing, rolling, sanding, and primer decisions are made by surface.`,
        `A durable trim coating, a calm wall finish, and a flat ceiling paint solve different problems. We keep those systems separate so the home looks intentional.`,
        `The coating decision is based on use, cleaning needs, light, surface condition, and expected durability, not just colour.`,
      ], 43),
    },
    {
      title: 'Inspect after drying',
      desc: pick(city, [
        `Paint can look different once it dries and once daylight moves across the room. We leave time for touch-ups, edge checks, cleanup, and practical review before calling the work complete.`,
        `Final review happens after the paint has settled enough to see misses, texture, and edge issues. That is when touch-ups are useful instead of rushed.`,
        `The last part of the job is cleanup, reinstalling what was moved, checking edges, and making sure the rooms feel ready to use again.`,
      ], 44),
    },
  ];
  const start = variationIndex(city, steps.length, 45);
  return [...steps.slice(start), ...steps.slice(0, start)].slice(0, 3);
}

function trustItems(city, profile) {
  return [
    {
      title: 'Dust-controlled preparation',
      desc: `Floors, furniture, stairs, built-ins and finished rooms are protected before sanding or painting. The work starts with masking, staging, and a plan for the surfaces most likely to be affected by prep dust.`,
    },
    {
      title: 'Older-home surface prep',
      desc: `${capitalise(listSentence(profile.prepConcerns.slice(0, 3)))} are reviewed before finish coats. The goal is to correct the issues that would still show after a basic repaint.`,
    },
    {
      title: 'Finished-home cleanup',
      desc: `Work areas are staged, cleaned daily and kept manageable for occupied homes. Rooms are reopened as soon as practical instead of leaving the home feeling scattered.`,
    },
    {
      title: 'Renovation-level experience',
      desc: `Painting can be coordinated with ceiling smoothing, trim work, drywall repair and other Strataline renovation services when a room needs more than paint alone.`,
    },
  ];
}

function relatedItems(city) {
  const descriptions = {
    painting: [`See the main painting page for room scope, finish choices, images, and quote planning.`],
    'trim-and-millwork-painting': [`Use this when baseboards, casing, doors, crown, wainscoting, or built-ins need a separate finish system.`],
    'drywall-repair-skim-coating': [`Plan repairs before painting where cracks, rough patches, or side light would show through.`],
    'smooth-ceiling-finishing': [`Coordinate ceiling smoothing, repairs, primer, and paint before final wall colour.`],
    'popcorn-removal': [`Remove texture, repair the ceiling, then paint walls and ceilings in the right sequence.`],
    stairs: [`Coordinate stair refinishing, railing work, adjacent wall painting, and trim details.`],
    'cabinet-painting': [`Use a separate coating system for cabinets, vanities, and painted built-ins.`],
  };
  return existingRelatedLinks().slice(0, 6).map(([slug, label], index) => ({
    title: label,
    desc: `${pick(city, descriptions[slug] ?? [`Review ${label.toLowerCase()} when it affects prep, protection, or the final painted result.`], 61 + index)} [View ${label.toLowerCase()}](/services/${slug}).`,
  }));
}

function nearbyItems(city) {
  return nearbyCitySlugs(city).slice(0, 4).map((slug, index) => {
    const nearby = cityBySlug[slug];
    const profile = paintingProfile(nearby);
    return {
      title: `Interior painting in ${nearby.name}`,
      desc: `${nearby.name} painting for ${listSentence(profile.homeTypes.slice(0, 2))}, local prep, protection, and scheduling context. [View painting in ${nearby.name}](/services/painting/${nearby.slug}).`,
    };
  });
}

function faqItems(city, profile) {
  const text = `${profile.angle} ${profile.logistics} ${profile.homeTypes.join(' ')} ${profile.prepConcerns.join(' ')}`;
  const condo = /condo|elevator|parking|building/i.test(text);
  const older = /older|heritage|plaster|millwork|traditional|settlement/i.test(text);
  const family = /family|detached|kids|pets|busy/i.test(text);

  const local = [];
  if (condo) {
    local.push({
      title: `How do you handle painting in ${city.name} condos with elevator, parking, or building rules?`,
      desc: pick(city, [
        `We ask about elevator booking, parking, loading rules, work-hour limits, hallway protection, garbage removal, and material staging before scheduling. Condo logistics can affect timing as much as the painting itself.`,
        `Condo work starts with logistics: elevator time, parking, hallway protection, material storage, and building rules. Once that is clear, the actual painting can be planned much more cleanly.`,
      ], 81),
    });
  }
  if (older) {
    local.push({
      title: `Do older ${city.name} homes need more prep before painting?`,
      desc: pick(city, [
        `Often they do. Older plaster, settlement cracks, built-up trim paint, previous repairs, and detailed casing can require more sanding, filling, caulking, priming, and inspection than newer drywall.`,
        `Usually, yes. Older walls and trim are rarely flat, clean, and ready for paint. We look for movement cracks, old patches, caulking gaps, gloss, and areas that need primer before finish coats.`,
      ], 82),
    });
  }
  if (family) {
    local.push({
      title: `Can you stage the painting around a busy family schedule in ${city.name}?`,
      desc: pick(city, [
        `Yes. We can plan rooms in phases, keep access paths clear, protect stairs and floors, and clean daily so the home stays livable during the project.`,
        `Yes. The room order can be planned around sleep, work, pets, school routines, and the rooms that need to reopen first. That planning is part of the quote discussion.`,
      ], 83),
    });
  }

  const commonPool = [
    {
      title: `Do you repair wall dents and previous patch marks before painting in ${city.name}?`,
      desc: pick(city, [
        `Yes. We review dents, nail pops, cracks, old repairs, raised patch edges, and primer needs before painting. The goal is not just to change the colour; it is to make the surface look cleaner once light hits it.`,
        `Yes. Small defects are discussed before painting so the quote reflects the finish level you expect. Some marks need filling and sanding; others need primer or broader wall correction.`,
        `We can. Photos help us decide whether the issue is a simple repair, a skim-coat area, or something that should be priced separately from basic painting.`,
      ], 84),
    },
    {
      title: `Can you repaint trim and doors without making the house feel like a construction site?`,
      desc: pick(city, [
        `Yes. Trim and doors need sanding, cleaning, caulking, spot-priming, and a durable finish, but the work can be staged with floor protection, organized tools, and daily cleanup so the home remains manageable.`,
        `Yes. The key is staging. We plan door access, drying time, hardware areas, trim sanding, masking, and cleanup so the home does not feel taken over.`,
        `That is the goal. Trim and doors are slower than walls, so we organize the sequence instead of scattering wet doors and sanding dust through the house.`,
      ], 85),
    },
    {
      title: `What paint finish do you recommend for ${city.name} homes?`,
      desc: pick(city, [
        `It depends on traffic, lighting, room use, cleaning needs, and the surface. Walls often need a washable low-sheen finish, while trim and doors usually need a harder-wearing coating with a smoother feel.`,
        `The right finish depends on how the room is used. Busy halls, kids rooms, trim, doors, ceilings, and formal rooms all have different durability and sheen needs.`,
        `We choose finish by surface first. Walls, trim, doors, and ceilings should not all be treated the same because they wear and reflect light differently.`,
      ], 86),
    },
    {
      title: `Do you paint ceilings as part of an interior painting project?`,
      desc: pick(city, [
        `Ceilings can be included where stains, drywall repairs, old roller marks, popcorn removal, or colour changes would make the room feel incomplete. We quote ceilings separately when that makes the scope clearer.`,
        `Yes, when it makes sense. A clean ceiling can finish the room, but high ceilings, texture, stains, and repairs should be discussed separately from wall painting.`,
        `Often, yes. We flag ceilings during the quote because fresh walls can make older ceiling paint, patches, or texture look more obvious.`,
      ], 87),
    },
    {
      title: `Can you provide a quote from photos?`,
      desc: pick(city, [
        `Often, yes. Send wide room photos, close-ups of damage, trim and door condition, ceiling height, furniture constraints, and colour direction. We will explain what can be priced from photos and what needs a site visit.`,
        `Photos are usually enough for a starting range. Include each room from two angles, close-ups of damage, trim details, doors, ceiling height, and anything that may slow access.`,
        `Yes for many projects. The more useful photos show the room, the surface problems, the trim condition, and the access constraints, not just the wall colour.`,
      ], 88),
    },
    {
      title: `How do you protect floors, stairs, and furniture during painting?`,
      desc: pick(city, [
        `We plan floor covering, masking, furniture shifting, access paths, dust-producing prep, and cleanup before work starts. Protection is part of the scope, especially when the home is already finished and furnished.`,
        `Protection is decided room by room: floors, stairs, furniture, railings, counters, hardware, and adjacent rooms. That setup is especially important before sanding or trim work.`,
        `We cover the surfaces at risk, organize the work zone, and clean daily. In a finished home, the protection plan is as important as the painting sequence.`,
      ], 89),
    },
    {
      title: `What usually affects the price of interior painting in ${city.name}?`,
      desc: pick(city, [
        `The biggest variables are room count, ceiling height, amount of repair, trim and door condition, colour change, furniture movement, access, number of coats, primer needs, and how clean the final finish needs to be.`,
        `Price changes with prep level. Smooth walls, damaged walls, trim packages, doors, ceilings, dark colour changes, high areas, and occupied-home protection all take different time.`,
        `The scope matters more than square footage alone. Repairs, trim, doors, ceilings, furniture, access, primer, and coat count can all change the estimate.`,
      ], 90),
    },
    {
      title: `How much does interior painting cost in ${city.name}?`,
      desc: `The useful answer depends on scope. A bedroom repaint, living room repaint, condo repaint, whole-home repaint, trim and door package, ceiling repaint, and drywall repair add-on all price differently. We give ranges only after we understand room count, surface condition, access, furniture, colours, and finish expectations.`,
    },
    {
      title: `How long does an interior painting project take in ${city.name}?`,
      desc: `Small rooms can often be completed quickly, while full homes, stair halls, ceilings, trim, doors, and repair-heavy projects need more time. Drying time, furniture staging, elevator bookings, repair compound, primer, and multiple colours can all change the schedule.`,
    },
    {
      title: `Do you use low VOC paint?`,
      desc: `Yes, low VOC paint can be specified for bedrooms, condos, nurseries, occupied homes, and sensitive spaces. We still choose by surface: walls, ceilings, trim, doors, and repairs may need different products for durability and finish quality.`,
    },
    {
      title: `What paint brands do you work with?`,
      desc: `We commonly discuss professional lines from major paint brands such as Benjamin Moore and Sherwin-Williams, then choose the product by room use, sheen, washability, trim durability, ceiling flatness, and colour coverage needs.`,
    },
    {
      title: `Is skim coating worth it before painting?`,
      desc: `Skim coating is worth discussing when walls show old repairs, texture, torn paper, bad patch edges, or strong side light. It is not needed for every room, but it can make a bigger difference than paint alone on rough surfaces.`,
    },
    {
      title: `Can you work around pets and children?`,
      desc: `Yes. We plan room order, drying zones, access paths, daily cleanup, low-odour product choices where needed, and clear communication so pets and children are not moving through fresh paint or prep dust.`,
    },
    {
      title: `Should I paint ceilings at the same time as walls?`,
      desc: `Often, yes, especially if the ceiling is stained, patched, yellowed, textured, or beside newly painted walls. We price ceilings separately so you can decide whether the full room refresh is worth it.`,
    },
    {
      title: `Do you service nearby cities?`,
      desc: `Yes. We regularly plan painting work across nearby GTA communities. The quote can include your address, access details, parking, room count, photos, and the closest service area page if you are near a city boundary.`,
    },
    {
      title: `Can you help with colour selection?`,
      desc: `Yes. We can discuss colour direction, sheen, sample testing, low VOC options, trim contrast, ceiling tone, and how natural light changes the colour through the day.`,
    },
    {
      title: `Do you paint after popcorn ceiling removal?`,
      desc: `Yes. Painting often follows popcorn removal, ceiling smoothing, drywall repair, and primer. Coordinating the ceiling and wall work avoids disturbing the room twice.`,
    },
    {
      title: `Can you paint plaster walls in ${city.name} homes?`,
      desc: `Yes. Plaster walls can be painted cleanly, but cracks, movement, old repairs, and strong side light need attention first. We review whether the wall needs spot repair, broader skim coating, primer, or a standard repaint.`,
    },
    {
      title: `Do you paint formal living rooms and dining rooms?`,
      desc: `Yes. Formal rooms often need careful furniture protection, clean lines around casing and built-ins, attention to natural light, and a wall finish that looks calm rather than shiny.`,
    },
    {
      title: `Can you paint stair halls and high walls?`,
      desc: `Yes. Stair halls and high walls need proper staging, floor and railing protection, clean ceiling lines, and safe access. We include those details when reviewing the quote.`,
    },
  ];

  const selectedCommon = [];
  const start = variationIndex(city, commonPool.length, 91);
  for (const item of [...commonPool.slice(start), ...commonPool.slice(0, start)]) {
    if (selectedCommon.length >= 14 - local.length) break;
    selectedCommon.push(item);
  }
  return [...local, ...selectedCommon].slice(0, 14);
}

function quoteItems(city, profile) {
  return [
    {
      title: `Get a painting quote in ${city.name}`,
      desc: pick(city, [
        `Send photos of the rooms, close-ups of wall damage, trim and door condition, ceiling height, furniture constraints, and the colours you are considering. Call [(416) 471 5999](tel:+14164715999) or use the quote form so we can review the scope and sequence.`,
        `For a faster quote, send each room from two angles, plus close-ups of damage, doors, baseboards, ceiling height, and any access concerns. Call [(416) 471 5999](tel:+14164715999) when you want the scope reviewed directly.`,
        `Tell us which rooms matter most, whether the home is occupied, and what finish level you expect. Photos of ${listSentence(profile.rooms.slice(0, 2))} help us price the work more accurately. Call [(416) 471 5999](tel:+14164715999).`,
      ], 101),
    },
    {
      title: 'What helps us price it properly',
      desc: pick(city, [
        `Measurements, room count, door count, trim condition, ceiling height, colour change, repair photos, and furniture constraints usually tell us more than a short written description.`,
        `The best quote photos show both the whole room and the problems: dents, patch marks, trim wear, ceiling lines, door damage, and access limitations.`,
        `We price more accurately when we can see the room layout, finish expectations, prep concerns, and whether ceilings, trim, doors, or repairs are included.`,
      ], 102),
    },
  ];
}

function localIntroItems(city, profile) {
  return [
    {
      title: `Painting for ${city.name} homes, not basic repaints`,
      desc: `${localIntro(city, profile)}

${scopeParagraph(city, profile)}

For quoting, we separate the visible finish from the work behind it: access, protection, masking, repairs, sanding, primer, caulking, trim condition, door count, ceiling height, paint product, and daily cleanup. That makes the estimate easier to compare and the finished room easier to judge.`,
      image: {
        src: '../photos/luxury-home-interior-painting.webp',
        alt: `Premium ${city.name} interior painting with bright walls, hardwood floors, and refined trim.`,
      },
    },
    {
      title: 'Premium finish depends on protection and prep',
      desc: `${capitalise(listSentence(profile.homeTypes.slice(0, 3)))} often need more care than a quick repaint. We look at ${listSentence(profile.prepConcerns.slice(0, 4))}, trim wear, ceiling condition, furniture, and access.

The process is planned for occupied homes: floors protected, furniture covered or shifted, edges masked cleanly, prep dust controlled, and work areas cleaned daily.`,
      image: {
        src: '../photos/wainscoting-painting-satin-finish.webp',
        alt: `Detailed trim and wall painting for a premium ${city.name} home.`,
      },
    },
  ];
}

function commonProjectItems(city, profile) {
  const condoRelevant = /condo|elevator|parking|building|rental/i.test(`${profile.angle} ${profile.logistics} ${profile.homeTypes.join(' ')}`);
  return [
    {
      title: 'Whole-home repainting',
      desc: `Full-home painting planned by room, floor, stair access, furniture, repairs, ceilings, trim, doors, drying time, and daily cleanup.`,
    },
    {
      title: condoRelevant ? 'Condo painting and building logistics' : 'Formal living rooms and dining rooms',
      desc: condoRelevant
        ? `Elevator bookings, parking, hallway protection, work-hour rules, loading access, and compact staging handled before the painting date.`
        : `Careful wall prep, clean cut lines, smooth finishes, and protection for floors, furniture, art, casing, and built-ins.`,
    },
    {
      title: 'Stair halls and high walls',
      desc: `Tall walls, landings, ceiling lines, rail-adjacent surfaces, and high-traffic marks painted with proper staging and protection.`,
    },
    {
      title: 'Plaster and drywall repair before painting',
      desc: `Hairline cracks, settlement lines, dents, rough patches, torn paper, and old repair edges reviewed before primer and finish coats.`,
    },
    {
      title: 'Trim, doors and baseboards',
      desc: `Casing, baseboards, crown, doors, wainscoting, and built-ins cleaned, sanded, caulked, primed where needed, and painted separately from walls.`,
    },
    {
      title: 'Ceiling painting after repairs or popcorn removal',
      desc: `Flat ceilings, repaired ceilings, coffered ceilings, and ceilings after texture removal painted so fresh walls do not expose tired overhead surfaces.`,
    },
    {
      title: 'Move-in and pre-listing painting',
      desc: `High-impact rooms, entry walls, trim, doors, bedrooms, stair halls, and visible repairs prioritized when timing matters.`,
    },
    {
      title: 'Occupied-home repainting',
      desc: `Room sequencing, furniture handling, access paths, daily cleanup, low-odour product options, and clear communication for lived-in homes.`,
    },
  ];
}

function pricingItems(city, profile) {
  return [
    {
      title: 'Scope and surface condition',
      desc: `${city.name} painting projects can vary widely because one room may only need a clean repaint, while another may need repair work, trim sanding, caulking, primer, stain blocking, and multiple finish coats.`,
    },
    {
      title: 'Details that change the quote',
      desc: `Room count, wall condition, ${listSentence(profile.prepConcerns.slice(0, 3))}, trim detail, doors, ceilings, stair halls, high walls, furniture, protection, paint product, primer, skim coating, and occupied-home staging all affect cost.`,
    },
    {
      title: 'How to compare estimates',
      desc: `Ask what is included for prep, protection, repairs, trim, doors, ceilings, paint products, cleanup, and touch-ups. The cheapest repaint can become expensive if the visible defects remain after the final coat.`,
    },
  ];
}

function prepZigZagItems(city, profile, images) {
  return [
    {
      title: 'The finish depends on what happens before paint',
      desc: `Premium paint cannot hide poor prep. We check ${listSentence(profile.prepConcerns.slice(0, 4))}, old caulking, glossy trim, water stains, and side lighting before the scope is finalized.

Some walls only need patching and spot primer. Others benefit from skim coating. Trim and doors may need cleaning, sanding, caulking, stain blocking, or a more durable coating.`,
      image: {
        src: images.find((image) => image.src.includes('level-5'))?.src ?? '../photos/level-5-drywall-finish-painted-wall.webp',
        alt: `Smooth wall preparation before premium interior painting in ${city.name}.`,
      },
    },
    {
      title: 'Clean work in high-value occupied homes',
      desc: `Finished rooms deserve more than a drop sheet tossed on the floor. Hardwood, stairs, furniture, built-ins, hardware, and access paths are protected before sanding or rolling begins.

Work is staged so the home stays manageable: tools organized, dust controlled, rooms reopened when practical, and daily cleanup handled before the crew leaves.`,
      image: {
        src: images[3]?.src ?? '../photos/open-concept-home-painting-gta.webp',
        alt: `Clean occupied-home painting process with protected rooms in ${city.name}.`,
      },
    },
  ];
}

function competitorCoverageItems(city, profile) {
  return [
    {
      title: 'Coverage checklist used for this local page',
      desc: `This page is written to answer the topics homeowners usually need before calling: pricing guidance, quote photos, process, prep, paint brands, low VOC options, warranty and insurance questions, drywall or plaster repair, trim and doors, ceilings, occupied-home protection, reviews, nearby service areas, and before/after image expectations.`,
    },
    {
      title: `Local details competitors often flatten`,
      desc: `For ${city.name}, the copy is anchored in ${profile.angle}. That local angle changes the questions, especially around ${profile.logistics}, ${listSentence(profile.prepConcerns.slice(0, 3))}, and the rooms most likely to be painted first.`,
    },
  ];
}

function buildPaintingPage(city) {
  const profile = paintingProfile(city);
  const archetypeKey = cityArchetype(city, profile);
  const archetype = archetypes[archetypeKey];
  const template = cityTemplate(city, archetypeKey);
  const pageDir = path.join(paintingRoot, city.slug);
  fs.mkdirSync(pageDir, { recursive: true });

  const images = rankImagesForArchetype(findImages(city.slug), archetypeKey);
  const hero = images[0]?.src ?? '../cover.jpg';
  const title = choose(city, titlePatterns, 1)({ city, profile });
  const h1 = choose(city, h1Patterns, 2)({ city, profile });
  const meta = choose(city, metaPatterns, 3)({ city, profile });
  const heroDesc = archetype.heroDesc(city);

  const intro = archetypeStoryItems(city, profile, archetypeKey, images);
  const commonProjects = commonProjectItems(city, profile);
  const scenarios = projectScenarioItems(city, profile, archetypeKey);
  const prep = prepZigZagItems(city, profile, images);
  const pricing = pricingItems(city, profile);
  const process = realWorldProcessItems(city, profile, archetypeKey);
  const problems = problemItems(city, profile, archetypeKey);
  const failures = failureItems(city, profile, archetypeKey, images);
  const quoteComparison = quoteComparisonItems(city, profile);
  const authority = authorityItems(city, profile, archetypeKey);
  const trust = trustItems(city, profile).slice(0, 4);
  const related = relatedItems(city);
  const nearby = nearbyItems(city);
  const faqs = cityFaqItems(city, profile, archetypeKey);
  const exact = exactCitySections(city, profile, archetypeKey, images);
  if (exact) faqs.splice(0, faqs.length, ...exact.faqs);
  const sectionMap = {
    carousel: renderImageCarousel(images, city),
    localStory: renderZigZag(`${archetype.storyTitle} in ${city.name}`, intro),
    problems: renderBenefits(`Problems we solve in ${city.name}`, problems),
    projects: renderBenefits(`Common painting projects in ${city.name}`, commonProjects),
    scenarios: renderBenefits(`Common Painting Situations In ${city.name}`, scenarios),
    prep: renderZigZag(archetype.processTitle, prep),
    process: renderBenefits(archetype.processTitle, process),
    failure: renderZigZag('Why Paint Jobs Fail', failures),
    quoteComparison: renderBenefits('How To Compare Painting Quotes', quoteComparison),
    imageGallery: renderImagePanel(`${city.name} finish examples`, images, city, 3),
    pricing: renderBenefits(`What affects interior painting cost in ${city.name}?`, pricing),
    authority: renderBenefits('Finish decisions that change the result', authority),
    trust: renderBenefits(`Why ${city.name} homeowners choose Strataline`, trust),
    faq: renderFaq(`${city.name} interior painting FAQ`, faqs),
    cta: renderQuoteCta(city, profile, images[0]),
    related: renderBenefits(`Related Strataline services`, related),
    nearby: renderBenefits('Nearby service areas', nearby),
  };
  const sections = exact?.sections ?? templateSections(template, sectionMap);

  const visibleText = [title, h1, meta, heroDesc, ...sections].join('\n');
  const similarityText = [
    title,
    h1,
    heroDesc,
    archetype.label,
    archetype.storyFocus,
    visibleItemText(intro),
    visibleItemText(problems),
    visibleItemText(scenarios),
    visibleItemText(process),
    visibleItemText(failures),
    visibleItemText(faqs.slice(6, 16)),
  ].join('\n');
  const wordCount = countWords(visibleText);
  const linkCount = (visibleText.match(/\]\(\//g) ?? []).length + (visibleText.match(/tel:\+/g) ?? []).length;
  const faqCount = faqs.length;
  const hasLocalMedia = images.some((image) => image.local);
  const hasUsefulImages = images.length >= 4;
  const hasClearLocalAngle = Boolean(profileOverrides[city.slug] || priorityCitySet.has(city.slug));
  const phraseCounts = repeatedPhraseCounts(visibleText);
  const pass = wordCount >= 1600 && wordCount <= 3200 && faqCount >= 16 && faqCount <= 22 && linkCount >= 8 && linkCount <= 16 && hasUsefulImages && hasClearLocalAngle;
  const quality = pass ? 'strong' : 'weak';
  const score = pass ? (hasLocalMedia ? 100 : 94) : 55;

  const yaml = `title: ${yamlString(title)}\ngenerated: true\ngenerator: painting-city-v5\nqualityScore: ${score}\n${pass ? '' : 'hidden: true\n'}startPos: right\n\nseo:\n  description: ${block(meta, 4)}\n  noindex: ${pass ? 'false' : 'true'}\n  indexableQuality: ${quality}\n\ndesc: ${block(heroDesc, 2)}\n\nimage:\n  src: ${hero}\n  alt: ${yamlString(hasLocalMedia ? `Interior painting in ${city.name} with careful protection and finish prep.` : 'Interior painting finish example for Strataline clients.')}\n\nsections:\n${sections.join('\n\n')}\n`;

  if (!dryRun) fs.writeFileSync(path.join(pageDir, 'index.yaml'), yaml, 'utf8');

  return {
    slug: city.slug,
    page: `/services/painting/${city.slug}`,
    archetype: archetypeKey,
    archetypeLabel: archetype.label,
    template,
    quality,
    qualityScore: score,
    wordCount,
    faqCount,
    linkCount,
    mediaCount: images.length,
    repeatedPhraseCounts: phraseCounts,
    hasLocalMedia,
    hasUsefulImages,
    missingImageWarning: hasUsefulImages ? null : 'Needs at least four useful interior painting images.',
    title,
    h1,
    textForSimilarity: similarityText,
  };
}

function citiesToGenerate() {
  if (onlyArg) {
    return onlyArg
      .replace('--only=', '')
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean)
      .map((slug) => cityBySlug[slug] ?? fail(`Unknown city slug in --only: ${slug}`));
  }

  if (all) return cities;

  if (priorityOnly || !all) {
    return priorityCitySlugs.map((slug) => cityBySlug[slug] ?? fail(`Missing priority city data for ${slug}`));
  }

  return [];
}

const selectedCities = citiesToGenerate();
if (!selectedCities.length) fail('No painting cities selected. Use --priority-only, --all --confirm, or --only=toronto,vaughan.');

console.log(`Painting city generator v5`);
console.log(`Project root: ${root}`);
console.log(`Mode: ${dryRun ? 'dry-run' : 'write files'}`);
console.log(`Cities selected: ${selectedCities.length}`);

const results = selectedCities.map(buildPaintingPage);

const similaritySets = results.map((result) => ({
  slug: result.slug,
  paragraphs: paragraphSet(result.textForSimilarity),
}));
const similarPairs = [];
const similarityScores = [];
const highestSimilarityBySlug = new Map(results.map((result) => [result.slug, 0]));
for (let i = 0; i < similaritySets.length; i += 1) {
  for (let j = i + 1; j < similaritySets.length; j += 1) {
    const score = jaccard(similaritySets[i].paragraphs, similaritySets[j].paragraphs);
    const rounded = Number(score.toFixed(3));
    similarityScores.push({ a: similaritySets[i].slug, b: similaritySets[j].slug, similarity: rounded });
    highestSimilarityBySlug.set(similaritySets[i].slug, Math.max(highestSimilarityBySlug.get(similaritySets[i].slug) ?? 0, rounded));
    highestSimilarityBySlug.set(similaritySets[j].slug, Math.max(highestSimilarityBySlug.get(similaritySets[j].slug) ?? 0, rounded));
    if (score >= similarityWarningThreshold) similarPairs.push({ a: similaritySets[i].slug, b: similaritySets[j].slug, similarity: Number(score.toFixed(3)) });
  }
}
similarPairs.sort((a, b) => b.similarity - a.similarity);
similarityScores.sort((a, b) => b.similarity - a.similarity);
for (const result of results) {
  result.highestSimilarity = highestSimilarityBySlug.get(result.slug) ?? 0;
  result.uniqueContentShare = Number((1 - result.highestSimilarity).toFixed(3));
}

const similarityWeakSlugs = new Set(similarPairs.flatMap((pair) => [pair.a, pair.b]));
for (const result of results) {
  if (!similarityWeakSlugs.has(result.slug)) continue;
  result.quality = 'weak';
  result.qualityScore = Math.min(result.qualityScore, 55);
  result.similarityWarning = true;
  result.noindexReason = `Similarity met or exceeded ${similarityWarningThreshold}.`;

  if (!dryRun) {
    const yamlPath = path.join(paintingRoot, result.slug, 'index.yaml');
    const current = fs.readFileSync(yamlPath, 'utf8');
    const withHidden = current.includes('\nhidden: true\n') ? current : current.replace('\nstartPos:', '\nhidden: true\nstartPos:');
    const updated = withHidden
      .replace(/qualityScore: \d+/, 'qualityScore: 55')
      .replace(/noindex: false/, 'noindex: true')
      .replace(/indexableQuality: strong/, 'indexableQuality: weak');
    fs.writeFileSync(yamlPath, updated, 'utf8');
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  dryRun,
  total: results.length,
  indexablePages: results.filter((result) => result.quality === 'strong').length,
  noindexPages: results.filter((result) => result.quality !== 'strong').length,
  strong: results.filter((result) => result.quality === 'strong').length,
  weak: results.filter((result) => result.quality !== 'strong').length,
  similarityWarningThreshold,
  similarityWarnings: similarPairs.length,
  similarityScores,
  missingImageWarnings: results.filter((result) => result.missingImageWarning).map((result) => ({ slug: result.slug, warning: result.missingImageWarning })),
  competitorCoverageNotes: [
    'Reviewed competitor coverage for Toronto condo painting, Vaughan house painting, Forest Hill interior painting, and Oakville premium painting searches.',
    'Coverage gaps to answer on Strataline pages: pricing guidance, quote process, condo access, occupied-home protection, drywall/plaster repair, trim and doors, ceilings, low VOC paint, paint brands, warranty/insurance questions, reviews, service areas, and before/after images.',
    'City pages should use this research as a checklist only and avoid copying competitor wording.',
  ],
  worstSimilarPairs: similarPairs.slice(0, 20),
  pages: results.map(({ textForSimilarity, ...result }) => result),
};

if (!dryRun) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`Generated painting city pages: ${report.total}`);
console.log(`Strong/indexable: ${report.indexablePages}`);
console.log(`Weak/noindex: ${report.noindexPages}`);
console.log(`Report: ${reportPath}`);
if (similarPairs.length) {
  console.warn(`Similarity warnings: ${similarPairs.length}. Worst pair: ${similarPairs[0].a} / ${similarPairs[0].b} = ${similarPairs[0].similarity}`);
}

const weak = results.filter((result) => result.quality !== 'strong');
if (weak.length) {
  console.table(weak.map(({ slug, wordCount, faqCount, linkCount, mediaCount }) => ({ slug, wordCount, faqCount, linkCount, mediaCount })));
}

process.exitCode = weak.length ? 1 : 0;
