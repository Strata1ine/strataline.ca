import type { ImageMetadata } from 'astro';

import heroImage from '../../content/project-gallery/interior-renovation-toronto-dining-room.jpg';
import kitchenModernImage from '../../content/project-gallery/kitchen-renovation-toronto-modern.jpg';
import diningRoomImage from '../../content/project-gallery/interior-renovation-toronto-dining-room.jpg';
import livingRoomImage from '../../content/project-gallery/living-room-renovation-toronto-modern.jpg';
import bathroomImage from '../../content/project-gallery/bathroom-renovation-toronto-modern-double-vanity.jpg';
import openRiserImage from '../../content/project-gallery/staircase-renovation-toronto-open-riser.jpg';
import stairRefinishingImage from '../../content/project-gallery/staircase-refinishing-mississauga-hardwood.jpg';
import mainFloorImage from '../../content/project-gallery/kitchen-renovation-toronto-white-cabinets.jpg';
import homeRefreshImage from '../../content/project-gallery/staircase-renovation-toronto-modern-iron-railing.jpg';
import moveInImage from '../../content/project-gallery/popcorn-removal-toronto.jpg';
import sequenceImage from '../../content/project-gallery/dust-free-popcorn-ceiling-removal-gta.jpg';
import cityTvImage from '../../content/awards/strataline-cityline-tv-feature-popcorn-ceiling.jpg';
import hgtvImage from '../../content/awards/strataline-hgtv-love-it-or-list-it.jpg';
import torontoStarImage from '../../content/awards/strataline-toronto-star-popcorn-ceiling-removal-article.jpg';
import houseHomeImage from '../../content/awards/strataline-house-and-home-chevron-hardwood-floors.webp';
import ownerWorksiteImage from '../../content/services/about/photos/strataline-owner-newel-post-installation.jpg';
import beforeCeilingImage from '../../content/services/popcorn-removal/toronto/project-2/before/popcorn-ceiling-removal-toronto-project-2-before-02.webp';
import afterCeilingImage from '../../content/services/popcorn-removal/toronto/project-2/after/popcorn-ceiling-removal-toronto-project-2-after-02.webp';

export type PrototypeImage = {
	src: ImageMetadata;
	path: string;
	section: string;
	orientation: 'landscape' | 'portrait' | 'square';
	aspectRatio: string;
	description: string;
	alt: string;
};

export type CapabilityItem = {
	label: string;
	href?: string;
};

export const prototypeImages = {
	hero: {
		src: heroImage,
		path: '/images/interior-renovations/hero-complete-interior.webp',
		section: 'Hero',
		orientation: 'landscape',
		aspectRatio: '16:10',
		description: 'Wide finished interior showing connected ceiling, wall, flooring and trim work.',
		alt: 'Completed connected interior renovation in Toronto with living, dining and kitchen finishes coordinated as one project.',
	},
	mainFloor: {
		src: mainFloorImage,
		path: '/images/interior-renovations/main-floor-transformation.webp',
		section: 'Main-Floor Transformations',
		orientation: 'landscape',
		aspectRatio: '16:10',
		description:
			'Main-floor living and kitchen area with coordinated surfaces and architectural details.',
		alt: 'Main-floor renovation with connected kitchen, trim, painting and flooring work.',
	},
	homeRefresh: {
		src: homeRefreshImage,
		path: '/images/interior-renovations/whole-home-refresh.webp',
		section: 'Whole-Home Interior Refreshes',
		orientation: 'landscape',
		aspectRatio: '16:10',
		description: 'Interior image showing stairs, railings, flooring and consistent finishing.',
		alt: 'Whole-home interior refresh with staircase, railing, flooring and painted finishes.',
	},
	moveIn: {
		src: moveInImage,
		path: '/images/interior-renovations/pre-move-in-renovation.webp',
		section: 'Pre-Move-In Renovations',
		orientation: 'landscape',
		aspectRatio: '16:10',
		description: 'Clean ceiling and interior preparation image suitable for pre-move-in work.',
		alt: 'Pre-move-in renovation with popcorn ceiling removal and clean interior preparation.',
	},
	condo: {
		src: livingRoomImage,
		path: '/images/interior-renovations/condo-main.webp',
		section: 'Condos and Multi-Room Projects',
		orientation: 'landscape',
		aspectRatio: '16:10',
		description: 'Wide completed interior showing flooring, trim, ceiling and painting.',
		alt: 'Completed Toronto living room renovation with smooth ceilings, flooring and painted interior.',
	},
	sequence: {
		src: sequenceImage,
		path: '/images/interior-renovations/ceiling-to-detail-sequence.webp',
		section: 'From the ceiling down',
		orientation: 'landscape',
		aspectRatio: '16:9',
		description:
			'Room image that can support a vertical sequence from ceiling preparation to finishing.',
		alt: 'Dust-controlled ceiling renovation prepared for coordinated interior finishing work.',
	},
} satisfies Record<string, PrototypeImage>;

export const navItems = [
	{ label: 'Services', href: '#services', hasMenu: true },
	{ label: 'Projects', href: '#recent-work' },
	{ label: 'Process', href: '#process' },
	{ label: 'About', href: '#why-strataline' },
	{ label: 'Reviews', href: '/reviews' },
	{ label: 'Contact', href: '#consultation' },
];

export const servicesMenu = [
	{
		title: 'Ceilings and Walls',
		links: [
			{ label: 'Popcorn Ceiling Removal', href: '/services/popcorn-removal' },
			{ label: 'Painting', href: '/services/painting' },
			{ label: 'Wallpaper', href: '/services/wallpaper' },
		],
	},
	{
		title: 'Stairs and Railings',
		links: [
			{ label: 'Stair Renovation', href: '/services/stairs' },
			{ label: 'Stair Refinishing', href: '/services/stairs/refinishing' },
			{ label: 'Tread Caps', href: '/services/stairs/tread-caps' },
			{ label: 'Railing Installation', href: '/services/stairs/railing-installation' },
		],
	},
	{
		title: 'Complete Rooms',
		links: [
			{ label: 'Kitchens', href: '/services/kitchens' },
			{ label: 'Bathrooms', href: '/services/bathrooms' },
			{ label: 'Interior Renovations', href: '/interior-renovations' },
		],
	},
	{
		title: 'Openings and Finishing',
		links: [
			{ label: 'Doors and Windows', href: '/services/doors_and_windows' },
			{ label: 'Flooring', href: '/services/flooring' },
			{ label: 'Drywall Repair', href: '/services/painting' },
			{ label: 'Trim and Millwork Painting', href: '/services/painting' },
		],
	},
];

export const subnavItems = [
	{ label: 'Overview', href: '#overview' },
	{ label: 'Media', href: '#media' },
	{ label: 'Projects', href: '#recent-work' },
	{ label: 'Services', href: '#services' },
	{ label: 'Process', href: '#process' },
	{ label: 'FAQ', href: '#faq' },
	{ label: 'Contact', href: '#consultation' },
];

export const trustStrip = [
	{ label: '15+ Years', detail: 'Serving the GTA' },
	{ label: 'Fully Insured', detail: 'Professional liability coverage' },
	{ label: 'WSIB Covered', detail: 'Responsible project execution' },
	{ label: 'Dust Controlled', detail: 'HEPA source extraction' },
	{ label: 'Detailed Scopes', detail: 'Clear written proposals' },
	{ label: 'Occupied-Home Care', detail: 'Protection and daily cleanup' },
];

export const featuredMedia = [
	{
		source: 'CityTV',
		title: 'Dust-free ceiling renovation featured on Cityline',
		type: 'video',
		video: '/videos/cityline-featuring-strataline-popcorn-removal.mp4',
		image: {
			src: cityTvImage,
			alt: 'Strataline CityTV feature for dust-free popcorn ceiling removal.',
		},
	},
	{
		source: 'HGTV',
		title: 'Dust-free renovation process seen on Love It or List It',
		type: 'video',
		video: '/videos/love-it-or-list-it-featuring-strataline-dust-free-renovation.mp4',
		image: {
			src: hgtvImage,
			alt: 'Strataline HGTV feature showing dust-free renovation work.',
		},
	},
	{
		source: 'Toronto Star',
		title: 'Popcorn ceiling removal expertise in major Canadian media',
		type: 'image',
		image: {
			src: torontoStarImage,
			alt: 'Toronto Star article featuring Strataline popcorn ceiling removal expertise.',
		},
		link: 'https://www.thestar.com/life/home-and-garden/popcorn-ceilings-get-a-new-smooth-surface/article_462130c5-9edc-588b-98b2-1498f6388c8c.html',
	},
	{
		source: 'House & Home',
		title: 'Premium floor and finish work in design media',
		type: 'image',
		image: {
			src: houseHomeImage,
			alt: 'House and Home feature with Strataline flooring and finishing work.',
		},
		link: 'https://houseandhome.com/gallery/luxe-for-less-design',
	},
];

export const recentWork = [
	{
		image: {
			src: kitchenModernImage,
			alt: 'Modern Toronto kitchen renovation by Strataline.',
		},
		caption: 'Kitchen renovation - Toronto',
		service: 'Kitchen renovation',
		location: 'Toronto',
		summary: 'Cabinetry, counters, lighting and finish coordination.',
		href: '/services/kitchens',
	},
	{
		image: {
			src: diningRoomImage,
			alt: 'Connected living and dining space after a Toronto interior renovation.',
		},
		caption: 'Connected living and dining space - Toronto',
		service: 'Interior renovation',
		location: 'Toronto',
		summary: 'Connected flooring, trim, painting and living-area finishing.',
		href: '/services/painting',
	},
	{
		image: {
			src: livingRoomImage,
			alt: 'Modern Toronto living room finishing with coordinated surfaces.',
		},
		caption: 'Modern living room finishing - Toronto',
		service: 'Interior painting and finishing',
		location: 'Toronto',
		summary: 'Smooth walls, trim detailing and coordinated surface finishes.',
		href: '/services/painting',
	},
	{
		image: {
			src: bathroomImage,
			alt: 'Modern Toronto bathroom renovation with double vanity.',
		},
		caption: 'Bathroom renovation - Toronto',
		service: 'Bathroom renovation',
		location: 'Toronto',
		summary: 'Vanity, tile, lighting and finishing details.',
		href: '/services/bathrooms',
	},
	{
		image: {
			src: openRiserImage,
			alt: 'Open-riser staircase renovation in Toronto.',
		},
		caption: 'Open-riser staircase - Toronto',
		service: 'Stair renovation',
		location: 'Toronto',
		summary: 'Open-riser stair update with modern railing and finish work.',
		href: '/services/stairs',
	},
	{
		image: {
			src: stairRefinishingImage,
			alt: 'Hardwood staircase refinishing project in Mississauga.',
		},
		caption: 'Hardwood staircase refinishing - Mississauga',
		service: 'Stair refinishing',
		location: 'Mississauga',
		summary: 'Hardwood stair refinishing with clean stain and finish control.',
		href: '/services/stairs/refinishing',
	},
];

export const premiumTestimonial = {
	quote:
		'The Popcorn removal was excellent and a very clean process. They also transformed our stairs from boring oak to a much more modern look.',
	name: 'John Seigel',
	location: 'Richmond Hill',
};

export const projectTypes = [
	{
		title: 'Pre-Move-In Renovations',
		intro: 'Complete disruptive and connected work before furniture and occupants enter the home.',
		image: prototypeImages.moveIn,
	},
	{
		title: 'Main-Floor Transformations',
		intro:
			'Coordinate ceilings, floors, trim, doors, lighting, fireplaces, staircases and finishing across connected living areas.',
		image: prototypeImages.mainFloor,
	},
	{
		title: 'Whole-Home Interior Refreshes',
		intro:
			'Update visible surfaces and architectural details throughout the home with one consistent finish direction.',
		image: prototypeImages.homeRefresh,
	},
	{
		title: 'Condos and Multi-Room Projects',
		intro:
			'Plan access, protection, building requirements and multiple finish systems as one organized scope.',
		image: prototypeImages.condo,
	},
];

export const projectTypesSummary =
	'Best suited to coordinated projects involving multiple rooms, connected surfaces or several finish systems.';

export const serviceChooser = [
	{
		title: 'Complete Interior',
		copy: 'Coordinate connected rooms, surfaces and finishing details as one managed scope.',
		image: prototypeImages.mainFloor,
		links: [
			{ label: 'Interior Renovations', href: '/interior-renovations' },
			{ label: 'Flooring', href: '/services/flooring' },
			{ label: 'Drywall Repair', href: '/services/painting' },
			{ label: 'Trim and Millwork Painting', href: '/services/painting' },
		],
	},
	{
		title: 'Stairs and Railings',
		copy: 'Modernize treads, railings, stain colours and visible stair details.',
		image: prototypeImages.homeRefresh,
		links: [
			{ label: 'Stair Renovation', href: '/services/stairs' },
			{ label: 'Stair Refinishing', href: '/services/stairs/refinishing' },
			{ label: 'Tread Caps', href: '/services/stairs/tread-caps' },
			{ label: 'Railing Installation', href: '/services/stairs/railing-installation' },
		],
	},
	{
		title: 'Ceilings and Walls',
		copy: 'Prepare, repair and finish the surfaces that define the home.',
		image: prototypeImages.moveIn,
		links: [
			{ label: 'Popcorn Ceiling Removal', href: '/services/popcorn-removal' },
			{ label: 'Interior Painting', href: '/services/painting' },
			{ label: 'Wallpaper', href: '/services/wallpaper' },
			{ label: 'Wallpaper Removal', href: '/services/wallpaper' },
		],
	},
	{
		title: 'Kitchens, Bathrooms and Openings',
		copy: 'Plan complete rooms, doors, windows and practical finishing details together.',
		image: prototypeImages.condo,
		links: [
			{ label: 'Kitchens', href: '/services/kitchens' },
			{ label: 'Bathrooms', href: '/services/bathrooms' },
			{ label: 'Doors and Windows', href: '/services/doors_and_windows' },
			{ label: 'Cabinet Painting', href: '/services/painting' },
		],
	},
];

export const capabilityGroups: Array<{ title: string; items: CapabilityItem[] }> = [
	{
		title: 'Ceilings and Walls',
		items: [
			{ label: 'Popcorn Ceiling Removal', href: '/services/popcorn-removal' },
			{ label: 'Interior Painting', href: '/services/painting' },
			{ label: 'Wallpaper', href: '/services/wallpaper' },
		],
	},
	{
		title: 'Stairs and Railings',
		items: [
			{ label: 'Stair Renovation', href: '/services/stairs' },
			{ label: 'Stair Refinishing', href: '/services/stairs/refinishing' },
			{ label: 'Tread Caps', href: '/services/stairs/tread-caps' },
			{ label: 'Railing Installation', href: '/services/stairs/railing-installation' },
		],
	},
	{
		title: 'Complete Rooms',
		items: [
			{ label: 'Kitchens', href: '/services/kitchens' },
			{ label: 'Bathrooms', href: '/services/bathrooms' },
		],
	},
	{
		title: 'Openings and Finishing',
		items: [
			{ label: 'Doors and Windows', href: '/services/doors_and_windows' },
			{ label: 'Flooring, trim, drywall repairs and finish coordination' },
		],
	},
];

export const sequenceSteps = [
	'Ceiling and drywall preparation',
	'Electrical and lighting coordination',
	'Painting and wall finishes',
	'Flooring and stairs',
	'Doors, trim and millwork',
	'Cabinetry and feature elements',
	'Final detailing and cleanup',
];

export const processStages = [
	{
		number: '01',
		title: 'Project Review',
		receives: 'project-fit guidance',
		items: [
			'complete wish list',
			'photos and address',
			'priorities and timing',
			'known constraints',
		],
	},
	{
		number: '02',
		title: 'Site Assessment',
		receives: 'measured scope',
		items: [
			'existing conditions',
			'measurements',
			'recommended approach',
			'responsibilities and exclusions',
		],
	},
	{
		number: '03',
		title: 'Written Proposal',
		receives: 'written inclusions and exclusions',
		items: [
			'detailed scope',
			'material allowances where applicable',
			'schedule expectations',
			'payment milestones',
		],
	},
	{
		number: '04',
		title: 'Protected Execution',
		receives: 'protection and coordinated scheduling',
		items: [
			'containment',
			'floor and finish protection',
			'coordinated trade sequence',
			'regular communication',
			'daily cleanup',
		],
	},
	{
		number: '05',
		title: 'Completion and Walkthrough',
		receives: 'walkthrough and deficiency correction',
		items: [
			'final detailing',
			'walkthrough',
			'deficiency correction',
			'care information where applicable',
		],
	},
];

export const beforeAfterComparison = {
	before: {
		src: beforeCeilingImage,
		alt: 'Original textured ceiling before Strataline preparation and finishing work in Toronto.',
		label: 'Before',
	},
	after: {
		src: afterCeilingImage,
		alt: 'Smooth finished ceiling after Strataline preparation and finishing work in Toronto.',
		label: 'After',
	},
};

export const ownerLedTrust = {
	image: {
		src: ownerWorksiteImage,
		alt: 'Maxim Sologub reviewing newel post installation details on a Strataline staircase project.',
	},
	quote: premiumTestimonial.quote,
	name: premiumTestimonial.name,
	location: premiumTestimonial.location,
};

export const whyStrataline = [
	{
		title: 'Owner-Led Planning',
		text: 'Direct communication from initial scope through project completion.',
	},
	{
		title: 'Detailed Written Scope',
		text: 'Clear inclusions, exclusions, responsibilities and payment milestones.',
	},
	{
		title: 'Dust-Controlled Preparation',
		text: 'Containment and HEPA source extraction where the work produces dust.',
	},
	{
		title: 'Occupied-Home Protection',
		text: 'Careful staging, surface protection and daily cleanup.',
	},
	{
		title: 'Connected Finish Experience',
		text: 'Ceilings, walls, flooring, stairs, trim, doors and detail work planned together.',
	},
	{
		title: 'Media-Recognized Work',
		text: 'Featured by CityTV, HGTV, The Toronto Star and House & Home.',
	},
];

export const serviceAreas = [
	'Toronto',
	'Vaughan',
	'Woodbridge',
	'Richmond Hill',
	'Markham',
	'Aurora',
	'Newmarket',
	'Mississauga',
	'Oakville',
	'Etobicoke',
	'North York',
];

export const renovationFaqs = [
	{
		question: 'What types of interior renovation projects are the best fit for Strataline?',
		answer:
			'Strataline is best suited to coordinated projects involving several rooms, connected surfaces or multiple finish systems. Typical projects include pre-move-in renovations, main-floor updates, staircase and railing work, ceiling and painting projects, flooring, trim, doors and complete interior refreshes.',
	},
	{
		question: 'Can Strataline coordinate several trades within one project?',
		answer:
			'Yes. We develop a written scope, organize the sequence of work and coordinate specialized trades where the project requires them. Responsibilities, exclusions and owner-supplied items are identified before work begins.',
	},
	{
		question: 'Can we remain in the home during the renovation?',
		answer:
			'Often, yes. We use containment, floor protection, dust extraction and daily cleanup to reduce disruption. For more intensive phases, we explain which rooms will be unavailable and help plan the work around the household.',
	},
	{
		question: 'How does the estimate process work?',
		answer:
			'Start by sending photos, the property address, your preferred timing and the complete list of work you are considering. After review, we may provide preliminary guidance or arrange a site visit. The written proposal identifies the scope, materials, exclusions, expected sequence and payment milestones.',
	},
	{
		question: 'How is renovation dust controlled?',
		answer:
			'We use physical containment, protected work zones and professional HEPA dust extraction where the work produces dust. The exact setup depends on the project, access and whether the home remains occupied.',
	},
	{
		question: 'Are permits and licensed trades included?',
		answer:
			'Permit and licensed-trade requirements depend on the scope. Where structural, electrical, plumbing or other regulated work is involved, the proposal identifies the required professionals and who is responsible for permits and inspections.',
	},
	{
		question: 'What areas does Strataline serve?',
		answer:
			'Strataline serves Toronto, Vaughan, Woodbridge, Richmond Hill, Markham, Aurora, Newmarket, Mississauga, Oakville and surrounding GTA communities.',
	},
];

export const footerColumns = [
	{
		title: 'Services',
		links: [
			{ label: 'Interior Renovations', href: '/interior-renovations' },
			{ label: 'Popcorn Removal', href: '/services/popcorn-removal' },
			{ label: 'Stairs and Railings', href: '/services/stairs' },
			{ label: 'Painting', href: '/services/painting' },
			{ label: 'Doors and Windows', href: '/services/doors_and_windows' },
			{ label: 'Kitchens', href: '/services/kitchens' },
			{ label: 'Bathrooms', href: '/services/bathrooms' },
		],
	},
	{
		title: 'Company',
		links: [
			{ label: 'Projects', href: '#recent-work' },
			{ label: 'Process', href: '#process' },
			{ label: 'Reviews', href: '/reviews' },
			{ label: 'Media', href: '#media' },
			{ label: 'About', href: '#why-strataline' },
			{ label: 'Contact', href: '#consultation' },
		],
	},
];

export const footerAreas = [
	'Toronto',
	'Vaughan',
	'Woodbridge',
	'Richmond Hill',
	'Markham',
	'Mississauga',
	'Oakville',
];
