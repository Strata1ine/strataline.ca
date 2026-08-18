import type { ImageMetadata } from 'astro';

import { getReviewById } from './reviews';

import liveHero from '../../content/services/stairs/cover.jpg';
import liveGrandStaircase from '../../content/services/stairs/staircase-renovation-gallery/grand-staircase-renovation-toronto-curved-iron-railing.jpg';
import liveCurvedToronto from '../../content/services/stairs/staircase-renovation-gallery/curved-staircase-refinishing-toronto-dark-treads-iron-railing.jpg';
import liveVaughanDark from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-vaughan-dark-treads-white-risers-modern.jpg';
import liveVaughanWhite from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-vaughan-white-risers-hardwood-treads.jpg';
import liveVaughanIron from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-vaughan-black-iron-balusters.jpg';
import liveWoodbridgeIron from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-woodbridge-dark-wood-iron-balusters.jpg';
import liveWoodbridgeCurved from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-woodbridge-dark-oak-curved.jpg';
import liveWoodbridgeClassic from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-woodbridge-dark-wood-classic.jpg';
import liveKleinburgOak from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-kleinburg-oak-modern.jpg';
import liveTorontoIron from '../../content/services/stairs/staircase-renovation-gallery/staircase-refinishing-iron-railing-dark-treads-toronto.jpg';
import liveTelevisionFeature from '../../content/services/stairs/staircase-renovation-gallery/staircase-renovation-featured-tv-modern-oak-toronto.jpg';
import liveAuroraStaircase from '../../content/services/stairs/staircase-renovation-gallery/staircase-renovation-aurora.jpg';
import tarasStaircaseBeforeFront from '../../content/reviews/google/taras-burban/staircase-before-front.webp';
import tarasStaircaseBeforeLanding from '../../content/reviews/google/taras-burban/staircase-before-landing.webp';
import tarasStaircaseAfterFront from '../../content/reviews/google/taras-burban/staircase-after-front.webp';
import tarasStaircaseAfterLanding from '../../content/reviews/google/taras-burban/staircase-after-landing.webp';

import primaryBefore from '../../content/services/stairs/selected-projects/curved-dark-staircase/curved-staircase-before-b32.webp';
import primaryAfter from '../../content/services/stairs/selected-projects/curved-dark-staircase/curved-staircase-after-a32.webp';
import primaryAfterWide from '../../content/services/stairs/selected-projects/curved-dark-staircase/curved-staircase-after-wide-a38.webp';
import woodbridgeBefore from '../../content/services/stairs/selected-projects/woodbridge-dark-staircase/woodbridge-staircase-before-b4.webp';
import woodbridgeAfter from '../../content/services/stairs/selected-projects/woodbridge-dark-staircase/woodbridge-staircase-after-a4.webp';
import woodbridgeDetail from '../../content/services/stairs/selected-projects/woodbridge-dark-staircase/woodbridge-dark-tread-detail-a6.webp';
import curvedBefore from '../../content/services/stairs/selected-projects/curved-staircase-transformation/curved-staircase-before-b1.webp';
import curvedAfter from '../../content/services/stairs/selected-projects/curved-staircase-transformation/curved-staircase-after-a1.webp';
import curvedOverhead from '../../content/services/stairs/selected-projects/curved-staircase-transformation/curved-staircase-overhead-after-a5.webp';
import curvedWide from '../../content/services/stairs/selected-projects/curved-staircase-transformation/curved-staircase-wide-after-a7.webp';
import etobicokeAfter from '../../content/services/stairs/selected-projects/etobicoke-natural-tread-caps/etobicoke-staircase-after-a25.webp';
import etobicokeDetail from '../../content/services/stairs/selected-projects/etobicoke-natural-tread-caps/etobicoke-newel-detail-after-a20.webp';
import centralMetalRailing from '../../content/services/stairs/selected-projects/central-metal-railing/open-staircase-metal-railing-after-a57.webp';
import grandCurvedStaircase from '../../content/services/stairs/selected-projects/grand-curved-staircase/grand-curved-staircase-after-a65.webp';
import curvedTreadConversion from '../../content/services/stairs/selected-projects/curved-tread-conversion/curved-tread-conversion-after-a71.webp';
import curvedTreadConversionBefore from '../../content/services/stairs/selected-projects/curved-tread-conversion/curved-tread-conversion-before-b71.webp';
import curvedTreadConversionLanding from '../../content/services/stairs/selected-projects/curved-tread-conversion/curved-tread-conversion-landing-after-a72.webp';
import curvedTreadConversionDetail from '../../content/services/stairs/selected-projects/curved-tread-conversion/curved-tread-conversion-tread-detail-after-a73.webp';
import miltonRailing from '../../content/services/stairs/selected-projects/milton-railing-update/milton-railing-update-after-a1.webp';
import replacementRailingImage from '../../content/services/stairs/selected-projects/exact-assets/20190909_155804.webp';
import stairScopeImage from '../../content/services/stairs/selected-projects/exact-assets/20250126_143814.webp';
import cappingBefore from '../../content/services/stairs/staircase-renovation-gallery/staircase-tread-caps-installation-toronto-before.jpg';
import cappingAfter from '../../content/services/stairs/staircase-renovation-gallery/staircase-tread-caps-installation-toronto-after.jpg';

const heroImage = liveHero;
const railingFeatureImage = liveGrandStaircase;
const ownerImage = grandCurvedStaircase;
const scopeDetailImage = stairScopeImage;

export { heroImage, railingFeatureImage, ownerImage, scopeDetailImage };

const tarasReview = getReviewById('taras-burban');

export const decisionItems = [
	{
		title: 'Refinish Existing Hardwood',
		text: 'Best for sound hardwood that can be repaired, sanded, stained and refinished.',
		image: { src: primaryAfter, alt: 'Curved hardwood staircase refinished with dark treads, white risers and black metal balusters.' },
		href: '/services/stairs/refinishing',
		linkLabel: 'See stair refinishing',
	},
	{
		title: 'Convert Carpet to Hardwood',
		text: 'Best for carpet-grade, worn or unsuitable treads that need solid hardwood tread caps.',
		image: { src: etobicokeAfter, alt: 'Natural oak tread-cap staircase conversion with finished hardwood treads and white risers.' },
		href: '/services/stairs/tread-caps',
		linkLabel: 'See hardwood stair tread caps',
	},
	{
		title: 'Replace the Railing',
		text: 'Best when the treads can remain but the posts, handrail, balusters or landing guards need replacement.',
		image: { src: replacementRailingImage, alt: 'Finished staircase railing replacement with dark wood posts, handrails and black metal balusters.' },
		href: '/services/stairs/railing-installation',
		linkLabel: 'See stair railing installation',
	},
	{
		title: 'Repair, Restore or Rebuild',
		text: 'Loose components, squeaks, finish damage and structural changes are assessed before the repair or rebuild scope is set.',
		image: { src: centralMetalRailing, alt: 'Open staircase renovated with dark treads, white risers and black metal railings.' },
		href: '#consultation',
		linkLabel: 'Request a stair assessment',
	},
];

export const primaryComparison = {
	id: 'curved-staircase-refinishing',
	title: 'Curved staircase refinishing and railing update',
	beforeImage: primaryBefore,
	afterImage: primaryAfter,
	beforeAlt: 'Curved staircase before refinishing with white wood spindles and worn stair finishes.',
	afterAlt: 'The same curved staircase after dark tread refinishing, white risers and black metal baluster installation.',
	beforeObjectPosition: 'center center',
	afterObjectPosition: 'center center',
};

export const secondaryComparison = {
	id: 'woodbridge-dark-staircase',
	title: 'Wood staircase refinishing and railing update in Woodbridge',
	beforeImage: woodbridgeBefore,
	afterImage: woodbridgeAfter,
	beforeAlt: 'Woodbridge staircase before refinishing with natural oak treads, posts and wood spindles.',
	afterAlt: 'The same Woodbridge staircase after dark refinishing and black metal baluster installation.',
	beforeObjectPosition: 'center center',
	afterObjectPosition: 'center center',
};

export const cappingComparison = {
	id: 'carpet-to-hardwood-tread-caps',
	title: 'Carpeted stairs to modern hardwood upgrade',
	beforeImage: cappingBefore,
	afterImage: cappingAfter,
	beforeAlt: 'Carpeted staircase before hardwood stair capping and railing renovation.',
	afterAlt: 'The same staircase after solid oak tread caps, white risers and an updated railing system.',
	beforeObjectPosition: 'center center',
	afterObjectPosition: 'center center',
};

export interface StairCaseStudy {
	title: string;
	location?: string;
	images: Array<{ src: ImageMetadata; alt: string }>;
	details: Array<{ label: string; text: string }>;
	links: Array<{ href: string; label: string }>;
	review?: { quote: string; name: string };
}

export const caseStudies: StairCaseStudy[] = [
	{
		title: 'Carpeted stairs to hardwood',
		images: [
			{ src: curvedTreadConversion, alt: 'Curved staircase after carpet removal, dark hardwood tread installation and black metal baluster work.' },
			{ src: curvedTreadConversionBefore, alt: 'The same curved staircase before renovation with carpeted treads and wood spindles.' },
			{ src: curvedTreadConversionLanding, alt: 'Upper landing after hardwood flooring, dark posts and black metal railing installation.' },
			{ src: curvedTreadConversionDetail, alt: 'Top view of the curved hardwood treads and black metal balusters after renovation.' },
		],
		details: [
			{ label: 'Before', text: 'Carpeted curved treads and wood spindles interrupted the relationship between the stair and the finished floor.' },
			{ label: 'After', text: 'Hardwood treads, white risers, dark posts and metal balusters created one continuous staircase and landing.' },
		],
		links: [
			{ href: '/services/stairs/tread-caps', label: 'See hardwood stair tread caps' },
			{ href: '/services/stairs/railing-installation', label: 'See stair railing installation' },
		],
	},
	{
		title: 'Curved staircase refinishing and railing',
		images: [
			{ src: curvedAfter, alt: 'Curved staircase after dark tread refinishing, white riser painting and black metal baluster installation.' },
			{ src: curvedBefore, alt: 'The same curved staircase before renovation with warm wood finishes and wood spindles.' },
			{ src: curvedOverhead, alt: 'Overhead view of the curved handrail, treads and metal balusters after renovation.' },
			{ src: curvedWide, alt: 'Wide room view of the completed curved staircase and upper landing railing.' },
		],
		details: [
			{ label: 'Before', text: 'Warm wood treads, handrails and spindles made the curved stair read as one heavy block.' },
			{ label: 'After', text: 'Dark treads, white risers and black metal balusters sharpened the curve from the first tread to the upper landing.' },
		],
		links: [
			{ href: '/services/stairs/refinishing', label: 'See stair refinishing' },
			{ href: '/services/stairs/railing-installation', label: 'See stair railing installation' },
		],
	},
	{
		title: 'Custom stain match, square posts and metal balusters',
		images: [
			{ src: tarasStaircaseAfterFront, alt: 'Staircase after custom stain matching with dark oak treads, square posts and black metal balusters.' },
			{ src: tarasStaircaseBeforeFront, alt: 'The same staircase before renovation with grey carpet, white wood spindles and dark handrails.' },
			{ src: tarasStaircaseAfterLanding, alt: 'Upper landing after dark floor finishing and black metal railing installation.' },
			{ src: tarasStaircaseBeforeLanding, alt: 'The upper landing before renovation with carpet and natural wood railings.' },
		],
		details: [
			{ label: 'Before', text: 'Carpeted treads and existing guards separated the stair from the surrounding hardwood floors.' },
			{ label: 'After', text: 'Custom-matched oak treads, square posts and metal balusters were coordinated across the flight and landing.' },
		],
		links: [
			{ href: '/services/stairs/refinishing', label: 'See stair refinishing' },
			{ href: '/services/stairs/railing-installation', label: 'See stair railing installation' },
		],
		...(tarasReview
			? { review: { quote: tarasReview.excerpt, name: tarasReview.name } }
			: {}),
	},
];

export type StairGalleryCategory = 'refinishing' | 'tread-caps' | 'railings' | 'curved-stairs' | 'details';

export interface StairGalleryItem {
	id: string;
	src: ImageMetadata;
	alt: string;
	caption: string;
	location?: string;
	service: string;
	categories: StairGalleryCategory[];
	href?: string;
}

export const galleryItems: StairGalleryItem[] = [
	{
		id: 'live-grand-staircase',
		src: liveGrandStaircase,
		alt: 'Grand curved staircase renovation in Toronto with custom iron railing and hardwood treads.',
		caption: 'Grand curved staircase',
		location: 'Toronto',
		service: 'Stair refinishing and custom railings',
		categories: ['refinishing', 'railings', 'curved-stairs'],
	},
	{
		id: 'live-curved-toronto',
		src: liveCurvedToronto,
		alt: 'Curved staircase refinishing in Toronto with dark hardwood treads, white risers and iron railing.',
		caption: 'Curved stair refinishing',
		location: 'Toronto',
		service: 'Stair refinishing and railings',
		categories: ['refinishing', 'railings', 'curved-stairs'],
	},
	{
		id: 'selected-curved-dark-staircase',
		src: primaryAfterWide,
		alt: 'Wide view of a curved staircase after dark tread refinishing, white riser painting and black metal baluster installation.',
		caption: 'Dark treads and white risers',
		service: 'Stair refinishing and railings',
		categories: ['refinishing', 'railings', 'curved-stairs'],
	},
	{
		id: 'live-vaughan-dark',
		src: liveVaughanDark,
		alt: 'Vaughan staircase refinishing with dark hardwood treads, white risers and a modern finish.',
		caption: 'Dark treads and modern contrast',
		location: 'Vaughan',
		service: 'Stair refinishing',
		categories: ['refinishing'],
	},
	{
		id: 'live-vaughan-white-risers',
		src: liveVaughanWhite,
		alt: 'Vaughan staircase refinishing with white risers and finished hardwood treads.',
		caption: 'Hardwood treads and white risers',
		location: 'Vaughan',
		service: 'Stair refinishing',
		categories: ['refinishing'],
	},
	{
		id: 'selected-etobicoke-natural-oak',
		src: etobicokeAfter,
		alt: 'Etobicoke staircase after natural oak tread-cap installation with white risers and railings.',
		caption: 'Natural oak tread caps',
		location: 'Etobicoke',
		service: 'Tread caps and railings',
		categories: ['tread-caps', 'railings'],
	},
	{
		id: 'live-vaughan-black-iron',
		src: liveVaughanIron,
		alt: 'Vaughan staircase refinishing with black iron balusters and hardwood treads.',
		caption: 'Black iron baluster update',
		location: 'Vaughan',
		service: 'Stair refinishing and railings',
		categories: ['refinishing', 'railings'],
	},
	{
		id: 'live-woodbridge-iron',
		src: liveWoodbridgeIron,
		alt: 'Woodbridge staircase refinishing with dark hardwood and iron balusters.',
		caption: 'Dark wood and iron balusters',
		location: 'Woodbridge',
		service: 'Stair and railing renovation',
		categories: ['refinishing', 'railings'],
	},
	{
		id: 'selected-woodbridge-dark-staircase',
		src: woodbridgeAfter,
		alt: 'Woodbridge staircase after dark tread and stringer refinishing with black metal balusters.',
		caption: 'Dark stringers and metal balusters',
		location: 'Woodbridge',
		service: 'Stair refinishing and railings',
		categories: ['refinishing', 'railings'],
	},
	{
		id: 'live-woodbridge-curved',
		src: liveWoodbridgeCurved,
		alt: 'Curved Woodbridge staircase refinished in dark oak.',
		caption: 'Dark oak curved staircase',
		location: 'Woodbridge',
		service: 'Stair refinishing',
		categories: ['refinishing', 'curved-stairs'],
	},
	{
		id: 'live-woodbridge-classic',
		src: liveWoodbridgeClassic,
		alt: 'Classic Woodbridge staircase refinished with dark hardwood treads.',
		caption: 'Classic dark wood staircase',
		location: 'Woodbridge',
		service: 'Stair refinishing',
		categories: ['refinishing'],
	},
	{
		id: 'selected-open-center-staircase',
		src: centralMetalRailing,
		alt: 'Open center staircase after dark tread finishing and black metal railing installation.',
		caption: 'Open stair with two-sided railing',
		service: 'Stair and railing renovation',
		categories: ['refinishing', 'railings'],
	},
	{
		id: 'live-kleinburg-oak',
		src: liveKleinburgOak,
		alt: 'Kleinburg staircase refinished with modern oak treads.',
		caption: 'Modern oak stair finish',
		location: 'Kleinburg',
		service: 'Stair refinishing',
		categories: ['refinishing'],
	},
	{
		id: 'live-toronto-iron',
		src: liveTorontoIron,
		alt: 'Toronto staircase refinishing with dark treads and iron railing.',
		caption: 'Iron railing and dark treads',
		location: 'Toronto',
		service: 'Stair refinishing and railings',
		categories: ['refinishing', 'railings'],
	},
	{
		id: 'live-television-feature',
		src: liveTelevisionFeature,
		alt: 'Modern oak staircase renovation in Toronto featured on television.',
		caption: 'Modern oak television feature',
		location: 'Toronto',
		service: 'Complete staircase renovation',
		categories: ['refinishing', 'railings'],
	},
	{
		id: 'live-aurora-staircase',
		src: liveAuroraStaircase,
		alt: 'Aurora staircase renovation with custom railings and hardwood treads.',
		caption: 'Hardwood stairs and custom railings',
		location: 'Aurora',
		service: 'Complete staircase renovation',
		categories: ['refinishing', 'railings'],
	},
	{
		id: 'selected-milton-railing',
		src: miltonRailing,
		alt: 'Milton upper landing after dark post and black metal baluster installation.',
		caption: 'Upper-landing railing update',
		location: 'Milton',
		service: 'Railing replacement',
		categories: ['railings'],
	},
	{
		id: 'selected-etobicoke-newel-detail',
		src: etobicokeDetail,
		alt: 'Close view of a natural oak tread, custom newel post and white balusters in Etobicoke.',
		caption: 'Natural oak newel detail',
		location: 'Etobicoke',
		service: 'Tread and railing detail',
		categories: ['tread-caps', 'railings', 'details'],
	},
	{
		id: 'selected-woodbridge-tread-detail',
		src: woodbridgeDetail,
		alt: 'Close view of a refinished dark wood stair tread and nosing in Woodbridge.',
		caption: 'Dark tread and nosing detail',
		location: 'Woodbridge',
		service: 'Stair detail',
		categories: ['refinishing', 'details'],
	},
];

export const scopeGroups = [
	{ title: 'Stair geometry', items: ['Tread count and shape', 'Straight, curved or open-sided layout', 'Nosings and landings'] },
	{ title: 'Existing condition', items: ['Carpet removal', 'Repairs and squeaks', 'Risers and stringers'] },
	{ title: 'Railing', items: ['Posts', 'Handrails', 'Balusters', 'Upper guards'] },
	{ title: 'Finish', items: ['Stain samples', 'Floor coordination', 'Paint preparation', 'Finish coats'] },
	{ title: 'Logistics', items: ['Occupied-home protection', 'Access', 'Cleanup'] },
	{ title: 'Scope', items: ['Inclusions', 'Exclusions', 'Sequencing'] },
];

export const processSteps = [
	{ number: '01', title: 'Photo review' },
	{ number: '02', title: 'Site assessment' },
	{ number: '03', title: 'Scope and samples' },
	{ number: '04', title: 'Renovation' },
	{ number: '05', title: 'Final finish review' },
];

export const faqItems = [
	{ question: 'How much does stair renovation cost in Toronto and the GTA?', answer: 'Stair renovation cost depends on the complete scope. Tread count and shape, layout, landings, carpet removal, repairs, finishing, railing changes, protection and access all affect a written quote.' },
	{ question: 'Should I refinish the stairs or install tread caps?', answer: 'Refinish sound hardwood that is suitable to repair and sand; use tread caps when carpet-grade, worn or unsuitable treads need a new hardwood surface.' },
	{ question: 'What is the difference between stair renovation, restoration and rebuilding?', answer: 'Renovation coordinates visible and functional upgrades, restoration preserves suitable existing components, and rebuilding changes structural components or layout after a separate assessment.' },
	{ question: 'Can carpeted stairs be converted to hardwood?', answer: 'Yes, when the existing structure is suitable. Carpet removal reveals the tread, nosing, risers, stringers and connections that determine whether tread caps or another method is appropriate.' },
	{ question: 'Can the stain be matched to my floors?', answer: 'A close stain match is often possible through samples. Wood species, age, existing finish, lighting and floor wear affect the final relationship.' },
	{ question: 'How long will the renovation take, and can we use the stairs?', answer: 'Timing and stair access depend on repairs, coatings, drying time and railing scope. The work sequence and any restricted-access periods are confirmed before work starts.' },
	{ question: 'Can the railing be replaced without changing the treads?', answer: 'Yes, when the existing treads are suitable to remain and the new posts, handrail, balusters and landing guards can be safely coordinated with them.' },
	{ question: 'Can existing posts, handrails or wood spindles be reused?', answer: 'New posts are used for Strataline railing renovations, and existing wood spindles are not refinished. An existing handrail may remain only when suitable for the new system.' },
	{ question: 'Can squeaky or loose stairs be repaired?', answer: 'Often, yes. The cause of movement and available access determine whether loose treads, gaps or connections can be repaired within the renovation scope.' },
	{ question: 'Can curved and open-sided stairs be renovated?', answer: 'Yes, subject to site conditions. Curved treads, custom nosings, railing geometry and open sides require more measuring and fitting than a standard straight flight.' },
	{ question: 'Can risers and stringers be painted white?', answer: 'Yes, when included in the scope. Preparation can include sanding, filling, selective caulking, primer and a durable coating.' },
	{ question: 'How is stair-sanding dust controlled?', answer: 'Stair sanding is dust-controlled, not dust-free. Extraction, containment, floor protection and cleanup are planned around the staircase and adjacent circulation areas.' },
	{ question: 'What photos should I send?', answer: 'Send clear views from the top, bottom and side, plus landings, tread count, posts, handrails, balusters, damaged areas and the floor or finish to be matched.' },
	{ question: 'What should a written stair-renovation quote include?', answer: 'A written quote should identify the staircase components, preparation, repairs, stain or paint scope, railing work, protection, finish coats, access, cleanup, sequencing and exclusions.' },
];

export const serviceAreas = [
	{ group: 'Vaughan & nearby', places: ['Vaughan', 'Woodbridge', 'Kleinburg', 'Maple', 'Thornhill'] },
	{ group: 'North GTA', places: ['Richmond Hill', 'Markham', 'King City'] },
	{ group: 'Toronto', places: ['Toronto', 'North York', 'Etobicoke'] },
	{ group: 'West GTA', places: ['Bolton / Caledon', 'Mississauga', 'Oakville', 'Burlington'] },
];
