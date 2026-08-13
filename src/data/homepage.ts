import type { ImageMetadata } from 'astro';

import heroImage from '../../content/project-gallery/interior-renovation-toronto-dining-room.jpg';
import popcornImage from '../../content/project-gallery/popcorn-removal-toronto.jpg';
import staircaseImage from '../../content/project-gallery/staircase-renovation-toronto-hardwood-iron-railing.jpg';
import paintingImage from '../../content/project-gallery/living-room-renovation-toronto-modern.jpg';
import kitchenImage from '../../content/project-gallery/kitchen-renovation-toronto-modern.jpg';
import bathroomImage from '../../content/project-gallery/bathroom-renovation-toronto-modern-double-vanity.jpg';
import doorsWindowsImage from '../../content/services/doors_and_windows/photos/39.jpg';
import wallpaperImage from '../../content/services/wallpaper/cover.jpg';
import flooringImage from '../../content/services/flooring/cover.jpg';
import cityTvImage from '../../content/awards/strataline-cityline-tv-feature-popcorn-ceiling.jpg';
import hgtvImage from '../../content/awards/strataline-hgtv-love-it-or-list-it.jpg';
import torontoStarImage from '../../content/awards/strataline-toronto-star-popcorn-ceiling-removal-article.jpg';
import houseHomeImage from '../../content/awards/strataline-house-and-home-chevron-hardwood-floors.webp';

import type { FeaturedMediaItem } from './interiorRenovationsPrototype';

export const homepageHero = {
	src: heroImage,
	alt: 'Completed Toronto interior renovation with connected living, dining and kitchen finishes.',
};

type ServiceCard = {
	title: string;
	description: string;
	href: string;
	image: ImageMetadata;
	alt: string;
};

export const primaryServices: ServiceCard[] = [
	{
		title: 'Interior Renovations',
		description: 'Connected rooms, surfaces and finish work managed as one coordinated project.',
		href: '/interior-renovations',
		image: heroImage,
		alt: 'Connected Toronto interior renovation with coordinated dining, living and kitchen finishes.',
	},
	{
		title: 'Popcorn Ceiling Removal',
		description: 'Dust-controlled removal, correction and finishing for clean, smooth ceilings.',
		href: '/services/popcorn-removal',
		image: popcornImage,
		alt: 'Smooth ceiling after dust-controlled popcorn ceiling removal in Toronto.',
	},
	{
		title: 'Stairs & Railings',
		description: 'Treads, railings, refinishing and structural details brought together cleanly.',
		href: '/services/stairs',
		image: staircaseImage,
		alt: 'Toronto staircase renovation with hardwood treads and black iron railings.',
	},
];

export const secondaryServices: ServiceCard[] = [
	{
		title: 'Interior Painting',
		description: 'Interior wall, ceiling, trim and finish painting.',
		href: '/services/painting',
		image: paintingImage,
		alt: 'Finished Toronto living room with coordinated interior painting and trim.',
	},
	{
		title: 'Kitchens',
		description: 'Cabinetry, surfaces, lighting and finish coordination.',
		href: '/services/kitchens',
		image: kitchenImage,
		alt: 'Modern Toronto kitchen renovation with white cabinetry and a central island.',
	},
	{
		title: 'Bathrooms',
		description: 'Complete bathroom renovations and finish updates.',
		href: '/services/bathrooms',
		image: bathroomImage,
		alt: 'Toronto bathroom renovation with a double vanity and coordinated finishes.',
	},
	{
		title: 'Doors & Windows',
		description: 'Interior and exterior openings, trim and installation.',
		href: '/services/doors_and_windows',
		image: doorsWindowsImage,
		alt: 'Installed doors and windows with completed interior trim details.',
	},
	{
		title: 'Wallpaper',
		description: 'Careful wall preparation, installation and removal.',
		href: '/services/wallpaper',
		image: wallpaperImage,
		alt: 'Professionally installed wallpaper in a finished GTA interior.',
	},
	{
		title: 'Flooring',
		description: 'Hardwood, engineered flooring and connected trim work.',
		href: '/services/flooring',
		image: flooringImage,
		alt: 'Finished flooring installation with coordinated interior trim.',
	},
];

export const homepageMedia: FeaturedMediaItem[] = [
	{
		id: 'citytv-cityline',
		type: 'video',
		source: 'CityTV',
		title: 'Strataline on Cityline',
		videoSrc: '/videos/cityline-featuring-strataline-popcorn-removal.mp4',
		poster: {
			src: cityTvImage,
			alt: 'Cityline segment featuring Strataline ceiling renovation work.',
		},
	},
	{
		id: 'hgtv-love-it-or-list-it',
		type: 'video',
		source: 'HGTV',
		title: 'Strataline on Love It or List It',
		videoSrc: '/videos/love-it-or-list-it-featuring-strataline-dust-free-renovation.mp4',
		poster: {
			src: hgtvImage,
			alt: 'Love It or List It segment featuring Strataline renovation work.',
		},
	},
	{
		id: 'toronto-star-popcorn-ceilings',
		type: 'article',
		source: 'Toronto Star',
		title: 'Popcorn ceilings get a new smooth surface',
		image: {
			src: torontoStarImage,
			alt: 'Toronto Star article about smooth ceiling work featuring Strataline.',
		},
		url: 'https://www.thestar.com/life/home-and-garden/popcorn-ceilings-get-a-new-smooth-surface/article_462130c5-9edc-588b-98b2-1498f6388c8c.html',
		cta: 'Read the article',
	},
	{
		id: 'house-and-home-chevron-floors',
		type: 'article',
		source: 'House & Home',
		title: 'Luxe For Less design feature',
		image: {
			src: houseHomeImage,
			alt: 'House & Home design feature with Strataline flooring work.',
		},
		url: 'https://houseandhome.com/decorating-and-design/luxe-for-less-design/',
		cta: 'Read the article',
	},
];

export const homepageRecentWork = [
	{
		image: { src: heroImage, alt: homepageHero.alt },
		caption: 'Connected interior renovation - Toronto',
		service: 'Interior Renovations',
		location: 'Toronto',
		summary: 'Dining, living and kitchen finishes coordinated as one connected project.',
		href: '/interior-renovations',
		objectPosition: 'center center',
	},
	{
		image: { src: kitchenImage, alt: 'Modern white kitchen renovation in Toronto.' },
		caption: 'Kitchen renovation - Toronto',
		service: 'Kitchens',
		location: 'Toronto',
		summary: 'Cabinetry, island, lighting and surfaces completed as a cohesive kitchen.',
		href: '/services/kitchens',
		objectPosition: 'center center',
	},
	{
		image: { src: bathroomImage, alt: 'Bathroom renovation with double vanity in Toronto.' },
		caption: 'Bathroom renovation - Toronto',
		service: 'Bathrooms',
		location: 'Toronto',
		summary: 'A complete bathroom with coordinated vanity, tile and finish details.',
		href: '/services/bathrooms',
		objectPosition: 'center center',
	},
	{
		image: { src: popcornImage, alt: 'Smooth ceiling after popcorn ceiling removal in Toronto.' },
		caption: 'Smooth ceiling finish - Toronto',
		service: 'Popcorn Ceiling Removal',
		location: 'Toronto',
		summary: 'Dust-controlled removal followed by ceiling correction and finishing.',
		href: '/services/popcorn-removal',
		objectPosition: 'center center',
	},
	{
		image: { src: staircaseImage, alt: 'Hardwood and iron staircase renovation in Toronto.' },
		caption: 'Staircase renovation - Toronto',
		service: 'Stairs and Railings',
		location: 'Toronto',
		summary: 'Hardwood treads, railing details and connected finish work.',
		href: '/services/stairs',
		objectPosition: 'center center',
	},
	{
		image: { src: doorsWindowsImage, alt: 'Door and window installation with completed trim.' },
		caption: 'Doors and windows - GTA',
		service: 'Doors and Windows',
		location: 'GTA',
		summary: 'Installed openings completed with clean interior trim details.',
		href: '/services/doors_and_windows',
		objectPosition: 'center center',
	},
];

export const processStages = [
	{
		number: '01',
		title: 'Review the project',
		description: 'Photos, priorities, property details and timing.',
	},
	{
		number: '02',
		title: 'Define the scope',
		description: 'Existing conditions, materials and connected work.',
	},
	{
		number: '03',
		title: 'Protect and coordinate',
		description: 'Containment, surface protection and organized sequencing.',
	},
	{
		number: '04',
		title: 'Complete and review',
		description: 'Finish work, cleanup and final walkthrough.',
	},
];

export const homepageReviews = [
	{
		quote:
			'Max is punctual, neat and very professional. We will be hiring him for additional projects.',
		name: 'D Kruger',
		location: 'Thornhill',
	},
	{
		quote:
			'We’re really happy with how everything turned out. The ceilings look completely smooth now, and the whole process was much cleaner than we expected.',
		name: 'Maggie and Scott',
		location: 'Mississauga',
	},
	{
		quote:
			'The stair renovation experience was straightforward from start to finish. Communication was clear, the work was done on schedule, and there were no surprises.',
		name: 'Jefferson Grove',
		location: 'Burlington',
	},
	{
		quote:
			'Max was great to work with—very knowledgeable and easy to deal with. He walked us through the options and helped us make the right decisions for the staircase.',
		name: 'Lyn Litvack',
		location: 'Markham',
	},
];

export const homepageServiceArea = {
	backgroundImage: null as ImageMetadata | null,
	backgroundImageAlt: '',
	assetPlaceholder: {
		targetPath: 'content/homepage/service-area-gta-aerial.webp',
		recommendedWidth: '2400–3200px',
		recommendedAspectRatio: '16:9 to 2:1',
		composition:
			'An elevated view with Vaughan-area residential fabric in the foreground, broader GTA context and the Toronto skyline in the distance.',
	},
	groups: [
		{
			label: 'Vaughan & nearby',
			areas: ['Woodbridge', 'Vaughan', 'Kleinburg', 'Maple', 'Thornhill'],
		},
		{
			label: 'North GTA',
			areas: ['Richmond Hill', 'Markham', 'Aurora', 'Newmarket', 'King City'],
		},
		{
			label: 'Toronto',
			areas: ['Toronto', 'North York', 'Etobicoke'],
		},
		{
			label: 'West GTA',
			areas: ['Bolton / Caledon', 'Mississauga', 'Oakville', 'Burlington'],
		},
	],
};
