import type { ImageMetadata } from 'astro';

import heroImage from '../../content/services/popcorn-removal/cover.jpg';
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

export { heroImage, ownerImage, citylineImage, torontoStarImage, seenOnTvBadge };

export const primaryComparison = {
	id: 'perfectly-smooth-ceiling',
	label: 'Primary comparison',
	eyebrow: 'Before & after',
	title: 'Experience perfectly smooth ceiling',
	description:
		'This ceiling had heavy texture that made the room feel darker and dated. After removal and finishing, the surface looks cleaner, smoother and more modern.',
	beforeImage: before1,
	afterImage: after1,
	beforeAlt: 'Textured popcorn ceiling before removal in a Toronto and GTA home.',
	afterAlt: 'Smooth finished ceiling after popcorn ceiling removal in a Toronto and GTA home.',
	beforeObjectPosition: 'center center',
	afterObjectPosition: 'center center',
};

export type Comparison = {
	id: string;
	label: string;
	eyebrow: string;
	title: string;
	description: string;
	beforeImage: ImageMetadata;
	afterImage: ImageMetadata;
	beforeAlt: string;
	afterAlt: string;
	beforeObjectPosition: string;
	afterObjectPosition: string;
};

export const comparisons: Comparison[] = [
	{
		id: 'bay-window-ceiling',
		label: 'Natural Light',
		eyebrow: 'Natural light cleanup',
		title: 'Bay window ceiling',
		description:
			'Textured ceilings are most noticeable in bright, naturally lit spaces. This comparison shows how a smooth finish lets the ceiling support the daylight instead of competing with it.',
		beforeImage: before2,
		afterImage: after2,
		beforeAlt: 'Textured ceiling at a bay window before refinishing.',
		afterAlt: 'Smooth ceiling at a bay window after refinishing.',
		beforeObjectPosition: 'center center',
		afterObjectPosition: 'center center',
	},
	{
		id: 'columns-and-trim',
		label: 'Columns & Trim',
		eyebrow: 'Detail correction',
		title: 'Columns and trim',
		description:
			'Areas around columns, crown moulding and ceiling transitions require careful correction after removal. Clean lines around these details make the finish read as one continuous surface.',
		beforeImage: before3,
		afterImage: after3,
		beforeAlt: 'Popcorn ceiling around columns and trim before correction.',
		afterAlt: 'Smooth corrected ceiling around columns and trim.',
		beforeObjectPosition: 'center center',
		afterObjectPosition: 'center center',
	},
	{
		id: 'bulkheads-and-angles',
		label: 'Bulkheads',
		eyebrow: 'Clean edge finishing',
		title: 'Bulkheads and angles',
		description:
			'Ceiling edges, bulkheads and angled transitions reveal uneven finishing quickly. Proper removal and edge correction sharpen the detail lines and make the ceiling look intentional.',
		beforeImage: before4,
		afterImage: after4,
		beforeAlt: 'Textured ceiling around bulkheads and angled transitions.',
		afterAlt: 'Smooth finished ceiling around bulkheads and angled transitions.',
		beforeObjectPosition: 'center center',
		afterObjectPosition: 'center center',
	},
	{
		id: 'open-living-area',
		label: 'Open Living Area',
		eyebrow: 'Room-wide smoothing',
		title: 'Open living area',
		description:
			'Large uninterrupted ceiling planes expose waves, seams and inconsistent repairs. A continuous smooth finish opens the room visually and distributes light more evenly.',
		beforeImage: before5,
		afterImage: after5,
		beforeAlt: 'Open living area with popcorn ceiling before renovation.',
		afterAlt: 'Open living area with a smooth painted ceiling after renovation.',
		beforeObjectPosition: 'center center',
		afterObjectPosition: 'center center',
	},
	{
		id: 'smooth-brighter-ceiling',
		label: 'Finished Room',
		eyebrow: 'Finished room result',
		title: 'Smooth, brighter ceiling',
		description:
			'This same-room comparison shows the overall effect of a properly finished smooth ceiling. The wider change in viewpoint emphasizes the finished room rather than an exact overlay alignment.',
		beforeImage: before6,
		afterImage: after6,
		beforeAlt: 'Full room with textured ceiling before removal.',
		afterAlt: 'Finished room with a smooth bright ceiling.',
		beforeObjectPosition: 'center center',
		afterObjectPosition: 'center center',
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

export const faqs = [
	{
		id: 'cost',
		question: 'How much does popcorn ceiling removal cost in Toronto and the GTA?',
		answer:
			'Strataline does not publish a one-size-fits-all price because the required finish work varies by ceiling. Area, height, access, painted texture, surface condition, room protection, skim-coat requirements, primer and paint, occupancy and condo logistics all affect the scope. Clear photos and rough measurements are the practical starting point.',
		links: [{ label: 'Send ceiling photos', href: '#photo-estimate' }],
	},
	{
		id: 'photo-estimate',
		question: 'Can you estimate popcorn ceiling removal from photos?',
		answer:
			'Clear photos can often support an initial scope and planning response. Send wide and close ceiling photos, rough room dimensions, ceiling height, your city, whether the texture appears painted, visible cracks or damage, and any furniture or occupancy constraints. Complex, high or uncertain ceilings may still need a site assessment. Strataline’s approved response target is within 12 hours.',
		links: [{ label: 'Start a photo estimate', href: '#photo-estimate' }],
	},
	{
		id: 'complete-scope',
		question: 'What is included in a complete popcorn ceiling removal and smooth-ceiling finish?',
		answer:
			'A complete scope covers the work required to leave a properly finished ceiling, not only texture removal. Depending on its condition, that can include protection, removal or controlled resurfacing, repairs, skim coating, HEPA-controlled sanding, primer, ceiling paint, cleanup and a final review. The written proposal identifies which steps apply.',
		links: [{ label: 'See smooth ceiling finishing', href: '/services/smooth-ceiling-finishing' }],
	},
	{
		id: 'dust-control',
		question: 'How dusty is popcorn ceiling removal?',
		answer:
			'The work is dust-controlled, not dust-free. Strataline plans containment, floor and furniture protection, HEPA source extraction for sanding, and cleanup around the room and occupancy conditions. The amount of disruption depends on access and the correction the ceiling requires.',
	},
	{
		id: 'occupancy',
		question: 'Can we stay in the house while the ceilings are being done?',
		answer:
			'Sometimes homeowners can remain in the house while ceiling work proceeds. The answer depends on the number of rooms, access, containment, drying stages and work sequence. Before scheduling, Strataline explains which spaces must remain clear and how circulation through the home will be affected.',
	},
	{
		id: 'painted-texture',
		question: 'Can painted popcorn ceilings be removed?',
		answer:
			'Painted popcorn ceilings can often be refinished, but straightforward wet scraping may not be practical. Paint can seal the texture, so adhesion and the surface below must be assessed before choosing removal or controlled resurfacing. Additional correction and skim coating may be required.',
	},
	{
		id: 'scrape-or-skim',
		question: 'Is it better to scrape popcorn texture or skim coat over it?',
		answer:
			'The better method is the one suited to the texture adhesion, paint, substrate and ceiling condition. Strataline assesses whether removal is practical or whether controlled resurfacing will create a more reliable base. An unstable surface should not simply be covered without addressing the condition beneath it.',
	},
	{
		id: 'testing',
		question: 'Should a popcorn ceiling be tested before it is disturbed?',
		answer:
			'If the ceiling’s history or age raises concern, testing should happen before it is scraped, sanded, drilled, cut or otherwise disturbed. Appearance, photographs and age alone cannot diagnose asbestos. A positive result requires appropriate regulated handling before ordinary refinishing proceeds.',
	},
	{
		id: 'skim-coating',
		question: 'Why does a ceiling sometimes need skim coating after popcorn removal?',
		answer:
			'Skim coating creates a continuous surface when removal reveals seams, waves, dents, patches or scraper damage. Texture often hides conditions that become visible only after it is removed. The amount of skim work depends on the substrate and the finish expected under real room lighting.',
		links: [
			{ label: 'Drywall repair and skim coating', href: '/services/drywall-repair-skim-coating' },
		],
	},
	{
		id: 'concrete-condos',
		question: 'Can you remove popcorn ceilings from concrete condo ceilings?',
		answer:
			'Concrete condo ceilings can be assessed and refinished, but their correction method and transitions differ from drywall ceilings. Texture adhesion, concrete condition and building requirements affect the scope. Access, work-hour and disposal rules may also need coordination.',
	},
	{
		id: 'condo-differences',
		question: 'Are condo popcorn ceilings different from house ceilings?',
		answer:
			'Condo projects can involve concrete substrates and building logistics that are less common in houses. Depending on the building, approval, work hours, elevator bookings, loading, parking, protection and disposal rules may affect planning. These conditions are confirmed before scheduling.',
	},
	{
		id: 'timeline',
		question: 'How long does popcorn ceiling removal usually take?',
		answer:
			'The schedule is project-specific rather than a fixed number of days. Area, height, paint, ceiling condition, repairs, skim-coat layers and drying time, access and occupancy all affect the sequence. Strataline establishes timing after reviewing the complete scope.',
	},
	{
		id: 'protection',
		question: 'Do you protect furniture, floors and adjacent rooms?',
		answer:
			'Yes, protection is planned around the room and how the home is being used. The setup can include furniture relocation or covering, floor protection, containment at openings, protected circulation routes and cleanup. The written scope should clarify the protection appropriate to the project.',
	},
	{
		id: 'cracks-and-repairs',
		question: 'Can you repair cracks and paint the ceiling as part of the work?',
		answer:
			'Cracks, old repairs, primer and ceiling paint can be included in the same written scope. Some cracks need tape or broader correction rather than a simple fill, and recurring movement may require further review. The repair method is based on what becomes visible after assessment or removal.',
	},
	{
		id: 'details-and-lights',
		question: 'Can you work around crown moulding, columns, bulkheads and pot lights?',
		answer:
			'Yes, those transitions are accounted for in the finish plan. Crown, columns, bulkheads, angled edges and light openings expose uneven correction quickly, so they require careful edge work. Electrical changes, when needed, must be coordinated separately from surface finishing.',
		links: [{ label: 'View detail comparisons', href: '#comparison-gallery' }],
	},
	{
		id: 'high-vaulted-ceilings',
		question: 'Can you remove popcorn ceilings from high or vaulted ceilings?',
		answer:
			'High and vaulted ceilings can be refinished when safe access and project conditions allow. Vaults, stairwells and tall rooms require suitable access equipment and a tailored protection plan. Height and access are part of the quoted scope and schedule.',
	},
	{
		id: 'finish-quality',
		question: 'What makes a smooth ceiling look good under windows and pot lights?',
		answer:
			'A good smooth ceiling remains visually consistent under daylight, low-angle window light and pot lights. Those conditions can expose seams, waves, ridges, scraper damage and weak repairs. Skim coating where needed, controlled sanding and inspection lighting are central to the result.',
		links: [{ label: 'See the before-and-after proof', href: '#before-after' }],
	},
	{
		id: 'before-wall-painting',
		question: 'Should popcorn ceiling removal happen before wall painting?',
		answer:
			'Ceiling removal and refinishing should usually happen before the final wall paint. Removal, repairs, sanding and work at corners can affect connected surfaces. Sequencing the ceiling first allows the wall finish to follow cleanly.',
		links: [{ label: 'Interior painting services', href: '/services/painting' }],
	},
	{
		id: 'quote-scope',
		question: 'What should be included in a popcorn ceiling removal quote?',
		answer:
			'The quote should identify protection, the removal or resurfacing method, testing assumptions, repairs, skim coating, sanding control, primer and paint, height and access, furniture handling, cleanup, exclusions and expected sequence. It should also describe the finish being delivered, not only the texture-removal step.',
	},
	{
		id: 'after-removal',
		question: 'What happens after the texture is removed?',
		answer:
			'After removal, the exposed substrate is reviewed and corrected before finishing. Seams, cracks, waves and scraper marks are repaired, skim coating is applied where required, and the ceiling is sanded with HEPA source extraction and inspected under light. Primer, ceiling paint, cleanup and final review complete the scope.',
		links: [
			{ label: 'Learn about smooth ceiling finishing', href: '/services/smooth-ceiling-finishing' },
		],
	},
	{
		id: 'service-area',
		question: 'What areas does Strataline serve for popcorn ceiling removal?',
		answer:
			'Strataline provides popcorn ceiling removal across Toronto and the GTA. The current service area includes Toronto, Vaughan, Richmond Hill, Markham, Mississauga and Oakville, with nearby GTA projects reviewed by location and scope.',
		links: [{ label: 'View the service area', href: '/#service-area' }],
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
