export const globalPrimaryNavigation = [
	{ label: 'Services', hasMenu: true },
	{ label: 'Projects', href: '/interior-renovations#recent-work' },
	{ label: 'Process', href: '/interior-renovations#process' },
	{ label: 'Reviews', href: '/reviews' },
	{ label: 'Media', href: '/interior-renovations#media' },
	{ label: 'About', href: '/#owner-led' },
] as const;

export const globalPrimaryServices = [
	{ label: 'Interior Renovations', href: '/interior-renovations' },
	{ label: 'Popcorn Ceiling Removal', href: '/services/popcorn-removal' },
	{ label: 'Stairs & Railings', href: '/services/stairs', context: '/services/stairs' },
	{ label: 'Kitchens', href: '/services/kitchens' },
	{ label: 'Bathrooms', href: '/services/bathrooms' },
	{ label: 'Doors & Windows', href: '/services/doors_and_windows' },
] as const;

export const globalMenuGroups = [
	{
		title: 'Stairs & Railings',
		mobileTitle: 'Stairs',
		links: [
			{ label: 'Stair Renovation', href: '/services/stairs' },
			{ label: 'Stair Refinishing', href: '/services/stairs/refinishing' },
			{ label: 'Tread Caps', href: '/services/stairs/tread-caps' },
			{ label: 'Railing Installation', href: '/services/stairs/railing-installation' },
		],
	},
	{
		title: 'Interior Finishing',
		mobileTitle: 'Interior Finishing',
		links: [
			{ label: 'Painting', href: '/services/painting' },
			{ label: 'Wallpaper', href: '/services/wallpaper' },
			{ label: 'Flooring', href: '/services/flooring' },
			{ label: 'Trim / Finish Work', href: '/services/painting' },
		],
	},
] as const;

export const globalExploreLinks = [
	{ label: 'Projects', href: '/interior-renovations#recent-work' },
	{ label: 'Process', href: '/interior-renovations#process' },
	{ label: 'Reviews', href: '/reviews' },
	{ label: 'Media', href: '/interior-renovations#media' },
	{ label: 'About', href: '/#owner-led' },
] as const;

export const globalMobileServices = [
	...globalPrimaryServices,
	...globalMenuGroups[1].links,
] as const;
