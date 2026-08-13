import type { ImageMetadata } from 'astro';

import heroImage from '../../content/services/popcorn-removal/cover.jpg';
import finishedImage from '../../content/services/popcorn-removal/cleanup.jpg';
import protectionImage from '../../content/services/popcorn-removal/removal.jpg';
import assessmentImage from '../../content/services/popcorn-removal/before.jpg';
import ownerImage from '../../content/services/about/photos/strataline-owner-newel-post-installation.jpg';
import citylineImage from '../../content/awards/strataline-cityline-tv-feature-popcorn-ceiling.jpg';
import torontoStarImage from '../../content/awards/strataline-toronto-star-popcorn-ceiling-removal-article.jpg';
import seenOnTvBadge from '../../content/awards/as-seen-on-tv-badge.webp';
import planexImage from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/vaughan/festool-planex-popcorn-removal-vaughan-02.jpg';
import torontoCeilingImage from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/toronto/dust-free-popcorn-ceiling-removal-toronto.jpg';

import before1 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-before-1.jpg';
import after1 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-after-1.jpg';
import before2 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-before-2.jpg';
import after2 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-after-2.jpg';
import before3 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-before-3.jpg';
import after3 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-after-3.jpg';
import before4 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-before-4.jpg';
import after4 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-after-4.jpg';
import before5 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-before-5.jpg';
import after5 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-after-5.jpg';
import before6 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-before-6.jpg';
import after6 from '../../content/services/popcorn-removal/images/popcorn-ceiling-removal/before-after/toronto-gta/popcorn-ceiling-removal-toronto-gta-after-6.jpg';

export { heroImage, finishedImage, ownerImage, citylineImage, torontoStarImage, seenOnTvBadge };

export const primaryComparison = {
	title: 'Experience perfectly smooth ceiling',
	before: before1,
	after: after1,
	beforeAlt: 'Textured popcorn ceiling before removal in a Toronto and GTA home.',
	afterAlt: 'Smooth finished ceiling after popcorn ceiling removal in a Toronto and GTA home.',
};

export type Comparison = {
	label: string;
	before: ImageMetadata;
	after: ImageMetadata;
	beforeAlt: string;
	afterAlt: string;
};

export const comparisons: Comparison[] = [
	{
		label: 'Natural Light',
		before: before2,
		after: after2,
		beforeAlt: 'Textured ceiling at a bay window before refinishing.',
		afterAlt: 'Smooth ceiling at a bay window after refinishing.',
	},
	{
		label: 'Columns & Trim',
		before: before3,
		after: after3,
		beforeAlt: 'Popcorn ceiling around columns and trim before correction.',
		afterAlt: 'Smooth corrected ceiling around columns and trim.',
	},
	{
		label: 'Bulkheads',
		before: before4,
		after: after4,
		beforeAlt: 'Textured ceiling around bulkheads and angled transitions.',
		afterAlt: 'Smooth finished ceiling around bulkheads and angled transitions.',
	},
	{
		label: 'Open Living Area',
		before: before5,
		after: after5,
		beforeAlt: 'Open living area with popcorn ceiling before renovation.',
		afterAlt: 'Open living area with a smooth painted ceiling after renovation.',
	},
	{
		label: 'Finished Room',
		before: before6,
		after: after6,
		beforeAlt: 'Full room with textured ceiling before removal.',
		afterAlt: 'Finished room with a smooth bright ceiling.',
	},
];

export const processSteps = [
	{
		number: '01',
		title: 'Protection and containment',
		text: 'Floors, furnishings, openings and connected spaces are protected to suit the room and occupancy.',
		image: protectionImage,
		alt: 'Room protected with containment before popcorn ceiling work.',
	},
	{
		number: '02',
		title: 'Removal or resurfacing strategy',
		text: 'We choose a method after reviewing paint, texture adhesion, ceiling condition and any testing needs.',
		image: assessmentImage,
		alt: 'Existing textured ceiling assessed before removal or resurfacing.',
	},
	{
		number: '03',
		title: 'Repairs and skim coating',
		text: 'Seams, cracks, scraper marks and uneven areas are corrected to prepare a continuous smooth surface.',
		image: after3,
		alt: 'Ceiling corrected around detailed columns and trim.',
	},
	{
		number: '04',
		title: 'HEPA sanding and light inspection',
		text: 'Controlled sanding with source extraction limits airborne dust while inspection light reveals remaining defects.',
		image: planexImage,
		alt: 'Festool Planex ceiling sanding with connected dust extraction.',
	},
	{
		number: '05',
		title: 'Primer, paint, cleanup and final review',
		text: 'The corrected ceiling is primed and painted, then the room is cleaned and the finish is reviewed.',
		image: torontoCeilingImage,
		alt: 'Smooth painted ceiling after popcorn ceiling removal in Toronto.',
	},
];

export const reviews = [
	{
		name: 'John Seigel',
		location: 'Richmond Hill',
		rating: 5,
		quote:
			'The popcorn removal was excellent and a very clean process. Very talented and reliable people. They are very professional, providing detailed quotations and billing.',
	},
	{
		name: 'Virginia Coppola',
		location: 'Newmarket',
		rating: 5,
		quote:
			'Maxim at Strataline did a very professional job removing our hallway popcorn ceiling. The result was completely smooth, and they sealed off the area so dust did not penetrate other areas of the house.',
	},
	{
		name: 'Mike',
		location: 'Burlington',
		rating: 5,
		quote:
			'We contacted Max to remove the popcorn finish on our vaulted great-room ceiling. He made the ceiling look brand new, with no detectable dust left anywhere.',
	},
	{
		name: 'Maggie and Scott',
		location: 'Mississauga',
		rating: 5,
		quote:
			'The ceilings look completely smooth now, and the whole process was much cleaner than we expected. Max and his team were professional and paid attention to the details.',
	},
];

export const faqs = [
	{
		question: 'How much does popcorn ceiling removal cost in Toronto and the GTA?',
		answer:
			'Cost depends on ceiling area and height, whether the texture is painted, the condition below it, access, protection, repair and skim-coat needs, and the primer and paint scope. Photos and approximate room sizes are a practical place to start.',
	},
	{
		question: 'Can you estimate popcorn ceiling removal from photos?',
		answer:
			'Often, yes. Clear ceiling photos, room dimensions, ceiling height, property type and any known paint or repair history can support an initial scope. Complex, high or uncertain ceilings may still need a site assessment.',
	},
	{
		question: 'What is included in a complete smooth-ceiling finish?',
		answer:
			'The required scope may include protection, removal or resurfacing, ceiling repairs, skim coating, controlled sanding, primer, ceiling paint, cleanup and a final finish review. The written scope identifies what applies to your ceiling.',
	},
	{
		question: 'Is popcorn ceiling removal dusty or disruptive?',
		answer:
			'Ceiling refinishing creates debris and sanding dust. Containment, surface protection, source extraction and cleanup are used to control it. The exact disruption depends on room access, occupancy and the correction required.',
	},
	{
		question: 'Can we stay home during the work?',
		answer:
			'Sometimes. Occupancy depends on the number of rooms, access, containment plan and work sequence. We discuss how spaces will be isolated and when rooms need to remain clear before scheduling.',
	},
	{
		question: 'Can painted popcorn ceilings be removed?',
		answer:
			'Paint can seal the texture and make straightforward scraping impractical. Depending on adhesion and condition, the ceiling may need a different removal or resurfacing approach with additional correction and skim coating.',
	},
	{
		question: 'Should a popcorn ceiling be tested before it is disturbed?',
		answer:
			'If the age or history of the ceiling raises a concern, testing should happen before disturbance. A positive result must be handled by an appropriate regulated specialist before ordinary refinishing proceeds.',
	},
	{
		question: 'How long does popcorn ceiling removal take?',
		answer:
			'Timing varies with area, ceiling height, texture condition, paint, drying between coats, repair requirements, access and occupancy. We establish a project-specific sequence after reviewing the ceiling.',
	},
	{
		question: 'Do you work in condos and homes with high ceilings?',
		answer:
			'Yes, subject to access and project conditions. Condos may require elevator, parking and building-rule coordination, while high or vaulted ceilings require suitable access and a tailored protection plan.',
	},
	{
		question: 'Can you repair cracks and paint the ceiling as part of the work?',
		answer:
			'Yes. Crack and surface correction, primer and ceiling paint can be included in the written scope when the existing condition calls for them.',
	},
];

export const serviceAreas = [
	'Toronto',
	'Vaughan',
	'Richmond Hill',
	'Markham',
	'Mississauga',
	'Oakville',
];
