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

const cityBySlug = Object.fromEntries(cities.map((city) => [city.slug, city]));
const citySlugs = new Set(cities.map((city) => city.slug));

const args = process.argv.slice(2);
const onlyArg = args.find((arg) => arg.startsWith('--only='));
const all = args.includes('--all');
const dryRun = args.includes('--dry-run');

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
    .replace(/\b(ajax|aurora|bolton|bradford|burlington|caledon|etobicoke|forest hill|innisfil|king city|kleinburg|leaside|markham|mississauga|newmarket|oakville|oshawa|pickering|richmond hill|rosedale|stouffville|the beaches|toronto|vaughan|whitby|woodbridge)\b/g, 'CITY')
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

function findImages(citySlug) {
  const pageDir = path.join(paintingRoot, citySlug);
  const preferredByCity = {
    toronto: [
      '../photos/toronto-dining-room-interior-painting.webp',
      '../photos/toronto-feature-wall-interior-painting.webp',
      '../photos/toronto-modern-living-room-interior-painting.webp',
      '../photos/living-room-interior-painting-neutral-finish.webp',
      '../photos/smooth-wall-level-5-paint-finish.webp',
    ],
    vaughan: [
      '../photos/coffered-ceiling-foyer-painting-vaughan.webp',
      '../photos/coffered-ceiling-fresh-white-paint-finish.webp',
      '../photos/interior-spray-painting-protected-room.webp',
      '../photos/dark-feature-wall-interior-painting.webp',
      '../photos/wainscoting-spray-painting-satin-finish.webp',
    ],
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
  const preferred = preferredByCity[citySlug] ?? [];
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
    .slice(0, 8);
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
  ({ city, profile }) => `${city.name} Painting for ${profile.buyerIntent.replace(/^homeowners who /i, '').replace(/^clients who /i, '')}`,
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
    ['trim-and-millwork-painting', 'Trim and millwork painting'],
    ['drywall-repair-skim-coating', 'Drywall repair and skim coating'],
    ['popcorn-removal', 'Popcorn ceiling removal'],
    ['cabinet-painting', 'Cabinet painting'],
  ].filter(([slug]) => fs.existsSync(path.join(servicesRoot, slug, 'index.yaml')));
}

function renderImageCarousel(images, city) {
  if (images.length < 2) return '';
  return `  - type: ImageCarousel\n    content:\n${images
    .slice(0, 6)
    .map((item) => `      - src: ${item.src}\n        alt: ${yamlString(item.local ? `Interior painting photo for a ${city.name} home.` : `Interior painting finish example for Strataline clients.`)}`)
    .join('\n')}`;
}

function renderImagePanel(title, images, city, offset = 0) {
  const selected = images.slice(offset, offset + 3);
  if (selected.length < 2) return '';

  const labels = [
    `Finished interior painting in ${city.name}`,
    'Prep and protection details',
    'Clean walls, trim, and finish work',
  ];

  return `  - type: ImagePanel\n    title: ${yamlString(title)}\n    content:\n${selected
    .map((item, index) => `      - title: ${yamlString(labels[index] ?? `Interior painting example ${index + 1}`)}\n        image:\n          src: ${item.src}\n          alt: ${yamlString(item.local ? `Interior painting project photo for a ${city.name} home.` : `Interior painting finish example for Strataline clients.`)}`)
    .join('\n')}`;
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
      title: 'Colour changes',
      desc: pick(city, [
        'Large colour changes may need primer, extra coats, or a different sequence around trim and ceilings. We flag that before work starts so coverage is not a surprise.',
        'Dark-to-light and light-to-dark changes are not equal. Coverage, sheen, primer, and cut lines all affect how clean the final colour looks.',
        'Colour updates work best when the surrounding trim, doors, and ceilings are reviewed at the same time. Otherwise the new wall colour can expose older finishes.',
      ], 35),
    },
  ];
  const start = variationIndex(city, systems.length, 36);
  return [...systems.slice(start), ...systems.slice(0, start)].slice(0, 3);
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
  const items = [
    {
      title: 'Clean finished-home process',
      desc: `Strataline is built around careful work in occupied homes. For ${city.name}, that means masking, floor protection, dust-producing prep control, daily cleanup, and a work sequence that respects the rest of the house.`,
    },
    {
      title: 'Better surface preparation',
      desc: `Painting looks expensive or cheap depending on the prep. We look for ${listSentence(profile.prepConcerns.slice(0, 3))} before finish coats, because those details decide how the room reads when the light changes.`,
    },
    {
      title: 'Recognized local renovation experience',
      desc: `Our work and renovation advice have been featured by CityTV, The Toronto Star, House & Home, and HGTV. That credibility matters when the project is inside a finished, furnished home.`,
    },
    {
      title: 'Clear quote expectations',
      desc: `We separate rooms, repairs, ceilings, trim, doors, protection, and material assumptions so the quote is easier to understand and the finished result is easier to judge.`,
    },
  ];
  const start = variationIndex(city, items.length, 51);
  return [...items.slice(start), ...items.slice(0, start)].slice(0, 3);
}

function relatedItems(city) {
  const descriptions = {
    painting: [
      `Use the main interior painting page for scope planning, room-by-room examples, finish choices, and quote information before narrowing the work for a ${city.name} property.`,
      `The main painting hub explains how we think about walls, trim, doors, repairs, protection, and scheduling across different home types.`,
    ],
    'trim-and-millwork-painting': [
      `Trim and millwork painting is worth separating when baseboards, casing, crown, doors, wainscoting, or built-ins need sanding, caulking, primer, and a smoother durable finish.`,
      `If the trim is dated, chipped, glossy, or full of caulking gaps, review the trim painting page before treating it as a small add-on.`,
    ],
    'drywall-repair-skim-coating': [
      `Drywall repair and skim coating should be planned before painting where dents, cracks, old patches, torn paper, or strong side light would show through new paint.`,
      `When the wall surface is rough, patched, or uneven, drywall repair may do more for the final result than another coat of paint.`,
    ],
    'popcorn-removal': [
      `Popcorn ceiling removal pairs well with painting when ceiling texture, drywall repairs, primer, and fresh wall colour need to be coordinated in the same project.`,
      `If the ceiling still has popcorn texture, plan ceiling smoothing before final wall colour so the room does not need to be disturbed twice.`,
    ],
    'cabinet-painting': [
      `Cabinet painting belongs in the plan when kitchens, vanities, laundry cabinets, or built-ins need a more controlled finish than standard wall painting.`,
      `Cabinets and built-ins need a different coating system than walls. Review this separately if they are part of the same interior refresh.`,
    ],
  };
  return existingRelatedLinks().map(([slug, label], index) => ({
    title: label,
    desc: `${pick(city, descriptions[slug] ?? [`Review ${label.toLowerCase()} when it affects prep, protection, or the final painted result.`], 61 + index)} [View ${label.toLowerCase()}](/services/${slug}).`,
  }));
}

function nearbyItems(city) {
  return nearbyCitySlugs(city).slice(0, 5).map((slug, index) => {
    const nearby = cityBySlug[slug];
    const profile = paintingProfile(nearby);
    const descs = [
      `${nearby.name} projects often involve ${profile.angle}. The local page covers prep, protection, room planning, and nearby painting context.`,
      `The ${nearby.name} page is useful when comparing painting scopes for ${listSentence(profile.homeTypes.slice(0, 2))}, especially where access and prep expectations differ.`,
      `Review ${nearby.name} if you are close to that area or comparing nearby scheduling, common room types, and finish expectations.`,
    ];
    return {
      title: `Interior painting in ${nearby.name}`,
      desc: `${pick(city, descs, 71 + index)} [View painting in ${nearby.name}](/services/painting/${nearby.slug}).`,
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
      title: `Can you give a painting estimate from photos?`,
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
  ];

  const selectedCommon = [];
  const start = variationIndex(city, commonPool.length, 91);
  for (const item of [...commonPool.slice(start), ...commonPool.slice(0, start)]) {
    if (selectedCommon.length >= 7 - local.length) break;
    selectedCommon.push(item);
  }
  return [...local, ...selectedCommon].slice(0, 8);
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

function buildPaintingPage(city) {
  const profile = paintingProfile(city);
  const pageDir = path.join(paintingRoot, city.slug);
  fs.mkdirSync(pageDir, { recursive: true });

  const images = findImages(city.slug);
  const hero = images[0]?.src ?? '../cover.jpg';
  const title = choose(city, titlePatterns, 1)({ city, profile });
  const h1 = choose(city, h1Patterns, 2)({ city, profile });
  const meta = choose(city, metaPatterns, 3)({ city, profile });
  const heroDesc = `Interior painting in ${city.name} for ${listSentence(profile.homeTypes.slice(0, 2))} that need careful prep, protected rooms, clean trim and door painting, and a tidy handoff.`;

  const localItems = localPlanningItems(city, profile);
  const scenarioItems = roomScenarios(city, profile);
  const prep = prepItems(city, profile);
  const finish = finishSystemItems(city, profile);
  const process = processItems(city, profile);
  const trust = trustItems(city, profile);
  const related = relatedItems(city);
  const nearby = nearbyItems(city);
  const faqs = faqItems(city, profile);
  const cta = quoteItems(city, profile);

  const sections = [
    renderImageCarousel(images, city),
    renderBenefits(`Interior painting in ${city.name}, planned for real homes`, localItems),
    renderImagePanel(`${city.name} painting project examples`, images, city, 0),
    renderBenefits(`What we usually paint in ${city.name} homes`, scenarioItems),
    renderBenefits('Prep makes the difference', prep),
    renderBenefits('Walls, trim, doors, and ceilings are separate finish systems', finish),
    renderBenefits(`A cleaner process for occupied ${city.name} homes`, process),
    renderImagePanel('Prep, protection, and finish details', images, city, 3),
    renderBenefits(`Why homeowners choose Strataline for painting in ${city.name}`, trust),
    renderBenefits(`Related services for ${city.name} homes`, related),
    renderBenefits('Nearby interior painting service areas', nearby),
    renderFaq(`${city.name} interior painting FAQ`, faqs),
    renderBenefits(`Start your ${city.name} painting quote`, cta),
  ].filter(Boolean);

  const visibleText = [title, h1, meta, heroDesc, ...sections].join('\n');
  const similarityText = [title, h1, meta, heroDesc, visibleDescText(localItems), visibleDescText(scenarioItems), visibleDescText(prep), visibleDescText(faqs), visibleDescText(cta)].join('\n');
  const wordCount = countWords(visibleText);
  const linkCount = (visibleText.match(/\]\(\//g) ?? []).length + (visibleText.match(/tel:\+/g) ?? []).length;
  const faqCount = faqs.length;
  const hasLocalMedia = images.some((image) => image.local);
  const pass = wordCount >= 1000 && wordCount <= 2400 && faqCount >= 6 && linkCount >= 8;
  const quality = pass ? 'strong' : 'weak';
  const score = pass ? (hasLocalMedia ? 100 : 94) : 55;

  const yaml = `title: ${yamlString(title)}\ngenerated: true\ngenerator: painting-city-v5\nqualityScore: ${score}\n${pass ? '' : 'hidden: true\n'}startPos: right\n\nseo:\n  description: ${block(meta, 4)}\n  noindex: ${pass ? 'false' : 'true'}\n  indexableQuality: ${quality}\n\ndesc: ${block(heroDesc, 2)}\n\nimage:\n  src: ${hero}\n  alt: ${yamlString(hasLocalMedia ? `Interior painting in ${city.name} with careful protection and finish prep.` : 'Interior painting finish example for Strataline clients.')}\n\nsections:\n${sections.join('\n\n')}\n`;

  if (!dryRun) fs.writeFileSync(path.join(pageDir, 'index.yaml'), yaml, 'utf8');

  return {
    slug: city.slug,
    page: `/services/painting/${city.slug}`,
    quality,
    qualityScore: score,
    wordCount,
    faqCount,
    linkCount,
    mediaCount: images.length,
    hasLocalMedia,
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

  return fs
    .readdirSync(paintingRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && cityBySlug[entry.name])
    .map((entry) => cityBySlug[entry.name]);
}

const selectedCities = citiesToGenerate();
if (!selectedCities.length) fail('No painting city folders found. Use --all or --only=toronto,vaughan.');

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
for (let i = 0; i < similaritySets.length; i += 1) {
  for (let j = i + 1; j < similaritySets.length; j += 1) {
    const score = jaccard(similaritySets[i].paragraphs, similaritySets[j].paragraphs);
    if (score >= 0.55) similarPairs.push({ a: similaritySets[i].slug, b: similaritySets[j].slug, similarity: Number(score.toFixed(3)) });
  }
}
similarPairs.sort((a, b) => b.similarity - a.similarity);

const report = {
  generatedAt: new Date().toISOString(),
  dryRun,
  total: results.length,
  strong: results.filter((result) => result.quality === 'strong').length,
  weak: results.filter((result) => result.quality !== 'strong').length,
  worstSimilarPairs: similarPairs.slice(0, 20),
  pages: results.map(({ textForSimilarity, ...result }) => result),
};

if (!dryRun) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`Generated painting city pages: ${report.total}`);
console.log(`Strong/indexable: ${report.strong}`);
console.log(`Weak/noindex: ${report.weak}`);
console.log(`Report: ${reportPath}`);
if (similarPairs.length) {
  console.warn(`Similarity warnings: ${similarPairs.length}. Worst pair: ${similarPairs[0].a} / ${similarPairs[0].b} = ${similarPairs[0].similarity}`);
}

const weak = results.filter((result) => result.quality !== 'strong');
if (weak.length) {
  console.table(weak.map(({ slug, wordCount, faqCount, linkCount, mediaCount }) => ({ slug, wordCount, faqCount, linkCount, mediaCount })));
}

process.exitCode = weak.length ? 1 : 0;
