import type { ImageMetadata } from 'astro';

import eliseStaircaseFullView1 from '../../content/reviews/google/elise/staircase-renovation-full-view-1.webp';
import eliseStaircaseFullView2 from '../../content/reviews/google/elise/staircase-renovation-full-view-2.webp';
import eliseStairTreadsDetail from '../../content/reviews/google/elise/stair-treads-metal-balusters-detail.webp';
import eliseNewelDetail from '../../content/reviews/google/elise/staircase-newel-baluster-detail.webp';
import eliseLandingDetail from '../../content/reviews/google/elise/staircase-landing-balusters-detail.webp';
import kristaCurvedStaircase from '../../content/reviews/google/krista-singh/curved-staircase-before-after.webp';
import kristaStairLanding from '../../content/reviews/google/krista-singh/stair-landing-before-after.webp';
import tarasStaircaseBeforeFront from '../../content/reviews/google/taras-burban/staircase-before-front.webp';
import tarasStaircaseBeforeLanding from '../../content/reviews/google/taras-burban/staircase-before-landing.webp';
import tarasStaircaseAfterFront from '../../content/reviews/google/taras-burban/staircase-after-front.webp';
import tarasStaircaseAfterLanding from '../../content/reviews/google/taras-burban/staircase-after-landing.webp';
import virginiaWainscotingHallway from '../../content/reviews/google/virginia-coppola/wainscoting-hallway.webp';
import virginiaWainscotingStairwell from '../../content/reviews/google/virginia-coppola/wainscoting-stairwell-wall.webp';
import virginiaWainscotingLanding from '../../content/reviews/google/virginia-coppola/wainscoting-stair-landing-wall.webp';

export const reviewFilterOptions = [
	{ value: 'all', label: 'All' },
	{ value: 'popcorn-ceilings', label: 'Popcorn Ceilings' },
	{ value: 'stairs-railings', label: 'Stairs & Railings' },
	{ value: 'painting', label: 'Painting' },
	{ value: 'interior-renovations', label: 'Interior Renovations' },
] as const;

export type ReviewFilter = (typeof reviewFilterOptions)[number]['value'];

export type ReviewService =
	| Exclude<ReviewFilter, 'all'>
	| 'flooring'
	| 'wallpaper'
	| 'doors'
	| 'trim-carpentry'
	| 'lighting'
	| 'dust-control';

export type ReviewImage = {
	src: string | ImageMetadata;
	alt: string;
};

export type GoogleReview = {
	id: string;
	name: string;
	source: 'Google';
	rating: 5;
	dateLabel: string;
	fullText: string;
	excerpt: string;
	services: ReviewService[];
	location?: string;
	images?: ReviewImage[];
	featured?: boolean;
};

export const reviews: GoogleReview[] = [
	{
		id: 'elise',
		name: 'Elise',
		source: 'Google',
		rating: 5,
		dateLabel: '4 months ago',
		fullText:
			'I love my new stairs! I am so happy I chose Strataline to renovate the staircase in my house. The stairs never looked so good, even when they were new. I get compliments from my friends!',
		excerpt:
			'I love my new stairs! I am so happy I chose Strataline to renovate the staircase in my house.',
		services: ['stairs-railings'],
		images: [
			{
				src: eliseStaircaseFullView1,
				alt: 'Renovated staircase with dark-stained wood treads, white risers and black metal balusters.',
			},
			{
				src: eliseStaircaseFullView2,
				alt: 'Full view of a multi-level staircase renovated with dark-stained wood and black metal railings.',
			},
			{
				src: eliseStairTreadsDetail,
				alt: 'Close-up of dark-stained stair treads, white risers and black square balusters.',
			},
			{
				src: eliseNewelDetail,
				alt: 'Detail of a stained wood stair tread, newel post and black metal baluster base.',
			},
			{
				src: eliseLandingDetail,
				alt: 'Renovated stair landing with dark-stained wood treads and black metal balusters.',
			},
		],
		featured: true,
	},
	{
		id: 'ilene-bottos',
		name: 'Ilene Bottos',
		source: 'Google',
		rating: 5,
		dateLabel: '2 months ago',
		fullText:
			'This is the second time Max has done some work at our home. The first time was to remove popcorn from our hallway ceilings. We were so very impressed with the results and it was truly dust-free. This time Max removed wallpaper and prepared those walls for painting. He painted several other areas as well and sanded and reapplied urethane on all our new doors. And again it was dust-free! He and Galina are superb craftsmen. Their attention to the smallest of details speaks volumes of the pride they take in their work. A quality that is difficult to find these days. We highly recommend Strataline. Thank you Max and Galina. We will be calling again for the next project. Ilene and Mario, Maple',
		excerpt:
			'This is the second time Max has done some work at our home. The first time was to remove popcorn from our hallway ceilings. We were so very impressed with the results and it was truly dust-free.',
		services: [
			'popcorn-ceilings',
			'wallpaper',
			'painting',
			'doors',
			'interior-renovations',
			'dust-control',
		],
		location: 'Maple',
	},
	{
		id: 'krista-singh',
		name: 'Krista Singh',
		source: 'Google',
		rating: 5,
		dateLabel: '4 months ago',
		fullText:
			'Max and his team at Strataline have done multiple home improvement projects for us, including stair refinishing, popcorn ceiling removal, new flooring and interior painting. From the start their team was professional and punctual. The stair refinishing completely transformed the look of our home. The popcorn ceiling removal was done cleanly and efficiently with great attention to minimize dust and mess. The team delivered on time and with no surprise budget increases. I would definitely recommend Max and his team at Strataline.',
		excerpt:
			'Max and his team at Strataline have done multiple home improvement projects for us, including stair refinishing, popcorn ceiling removal, new flooring and interior painting. From the start their team was professional and punctual.',
		services: [
			'stairs-railings',
			'popcorn-ceilings',
			'flooring',
			'painting',
			'interior-renovations',
			'dust-control',
		],
		images: [
			{
				src: kristaCurvedStaircase,
				alt: 'Before and after curved staircase renovation with dark wood treads, white risers and black iron balusters.',
			},
			{
				src: kristaStairLanding,
				alt: 'Before and after upper landing renovation with wood flooring and black iron balusters.',
			},
		],
		featured: true,
	},
	{
		id: 'john-seigel',
		name: 'John Seigel',
		source: 'Google',
		rating: 5,
		dateLabel: '4 months ago',
		fullText:
			'The Popcorn removal was excellent and a very clean process. They also transformed our stairs from boring oak to a much more modern look. They handled repainting of the whole house and replacement of old tile floors with a beautiful new one. There were many additional small tasks which they handled very well. They have design skills if you need them. The house looks great. Very talented and reliable people. I should also say they are very professional providing detailed quotations and billing. John, Richmond Hill',
		excerpt:
			'The Popcorn removal was excellent and a very clean process. They also transformed our stairs from boring oak to a much more modern look. They handled repainting of the whole house and replacement of old tile floors with a beautiful new one.',
		services: [
			'popcorn-ceilings',
			'stairs-railings',
			'painting',
			'flooring',
			'interior-renovations',
			'dust-control',
		],
		location: 'Richmond Hill',
	},
	{
		id: 'mikekk',
		name: 'MikeKK',
		source: 'Google',
		rating: 5,
		dateLabel: '4 months ago',
		fullText:
			"We initially contacted Max to remove the popcorn finish on our vaulted great room ceiling & to refinish/modernize our curved 'blonde-oak' finished stairway leading downstairs. Not only did he do an impeccable job making the ceiling look brand 'new', and with no detectable dust left anywhere, but he also re-located some potlights & installed new crown moulding that required meticulous precision due to several odd corner angles that other contactors insisted couldn't be done. It looked so good we ended up having our main hallway, front foyer, & sunroom ceilings re-done as well. The stairway & railing were re-finished in a darker oak stain that matched our dark hardwood flooring & the new modern metal spindles, and new trimwork have made it look better than ever & despite the hours of sanding off the old finish, there was no dust...!! In the end, we also had his team re-paint all of the above areas, which turned out perfectly as well... Our level of confidence with Max's professionalism & skilled expertise, not to mention being easy to deal with, is such that we would recommend his services to anyone, and should we need assistance from a contractor in the future, he'll be the first person we call, as it's clear he can handle just about anything...",
		excerpt:
			"We initially contacted Max to remove the popcorn finish on our vaulted great room ceiling & to refinish/modernize our curved 'blonde-oak' finished stairway leading downstairs.",
		services: [
			'popcorn-ceilings',
			'stairs-railings',
			'trim-carpentry',
			'lighting',
			'painting',
			'interior-renovations',
			'dust-control',
		],
		location: 'Burlington',
	},
	{
		id: 'd-kruger',
		name: 'D Kruger',
		source: 'Google',
		rating: 5,
		dateLabel: '4 months ago',
		fullText:
			'Max of Strataline Inc. did an exceptional job creating 1) a custom inside railing for a winding grand staircase and 2) installing outdoor railings. He even used a 3D printer to create a custom handle for an outdoor railing that had to be installed on a slight diagonal. Max is punctual, neat and very professional. We will be hiring him for additional projects.',
		excerpt:
			'Max of Strataline Inc. did an exceptional job creating 1) a custom inside railing for a winding grand staircase and 2) installing outdoor railings.',
		services: ['stairs-railings'],
		location: 'Thornhill',
	},
	{
		id: 'jet-pro',
		name: 'Jet Pro',
		source: 'Google',
		rating: 5,
		dateLabel: '2 years ago',
		fullText:
			'We had great experience working with Max. He was very attentive to all our concerns and requests, easy communication and quality of workmanship is outstanding! Special care was taken to keep our living area clean and dust free as renovations were taking place. We’re very pleased with end result and will definitely recommend him!',
		excerpt:
			'We had great experience working with Max. He was very attentive to all our concerns and requests, easy communication and quality of workmanship is outstanding!',
		services: ['interior-renovations', 'dust-control'],
	},
	{
		id: 'andriy-fedorenko',
		name: 'Andriy Fedorenko',
		source: 'Google',
		rating: 5,
		dateLabel: '2 years ago',
		fullText:
			"Amazing team, they painted my entire home , extremely attentive to the details, they cover and mask everything to avoid dust and mess ( I am super picky and OCD and hard to please but Galina and Maxim nailed it). Hands down the best contractors I've even seen between my 11 houses that I've renovated over the course of the last 15 years. They accommodated my every wish and request. Highly recommend. 5 STAR service!!!!! Andrew from Innisfil.",
		excerpt:
			'Amazing team, they painted my entire home , extremely attentive to the details, they cover and mask everything to avoid dust and mess ( I am super picky and OCD and hard to please but Galina and Maxim nailed it).',
		services: ['painting', 'interior-renovations', 'dust-control'],
		location: 'Innisfil',
	},
	{
		id: 'mykhailo-tvorysh',
		name: 'Mykhailo Tvorysh',
		source: 'Google',
		rating: 5,
		dateLabel: '2 years ago',
		fullText:
			'Excellent services: customer service, expertise, pricing policy. Impressive scheduling and delivering services by expected date of completion. Highly recommend Max (Strataline Inc) and his team!!',
		excerpt:
			'Excellent services: customer service, expertise, pricing policy. Impressive scheduling and delivering services by expected date of completion.',
		services: ['interior-renovations'],
	},
	{
		id: 'sergey-nikolaev',
		name: 'Sergey Nikolaev',
		source: 'Google',
		rating: 5,
		dateLabel: '5 months ago',
		fullText: 'Excellent team , top notch quality! Very happy with their work!',
		excerpt: 'Excellent team , top notch quality! Very happy with their work!',
		services: ['interior-renovations'],
	},
	{
		id: 'greg-baxter',
		name: 'Greg Baxter',
		source: 'Google',
		rating: 5,
		dateLabel: '6 days ago',
		fullText:
			'My wife and I used the services to paint our entire condo, including the ceilings, walls and baseboards. In addition, they installed new kick boards under our kitchen island, counters and in the bathrooms. The quality of the painting was excellent, but what really stood out was how clean they kept everything. Their dust control was outstanding, and they left our condo spotless at the end of the job. We truly appreciated the care they took to protect our home throughout the entire project. We highly recommend Strataline and will not hesitate to use their services again.',
		excerpt:
			'My wife and I used the services to paint our entire condo, including the ceilings, walls and baseboards. In addition, they installed new kick boards under our kitchen island, counters and in the bathrooms.',
		services: ['painting', 'trim-carpentry', 'interior-renovations', 'dust-control'],
		featured: true,
	},
	{
		id: 'taras-burban',
		name: 'Taras Burban',
		source: 'Google',
		rating: 5,
		dateLabel: 'a month ago',
		fullText:
			'We had an excellent experience working with Maxim and Strataline Inc. Installing and perfectly matching a custom stain for our oak treads was no small task, and the addition of the square posts made it an even greater technical challenge—but everything was executed flawlessly. From staining to the installation of the railings, the craftsmanship and attention to detail were truly top-tier. The stairs and railings have become a standout feature in our home, and we constantly get compliments on them. What really stood out was the clean process—using low VOC finishes and a dust-free approach made a huge difference compared to typical construction projects. Highly recommend Maxim and his team to anyone looking for high-end results without the usual mess!',
		excerpt:
			'We had an excellent experience working with Maxim and Strataline Inc. Installing and perfectly matching a custom stain for our oak treads was no small task, and the addition of the square posts made it an even greater technical challenge—but everything was executed flawlessly.',
		services: ['stairs-railings', 'dust-control'],
		images: [
			{
				src: tarasStaircaseBeforeFront,
				alt: 'Staircase before renovation with grey carpet, white wood spindles and dark wood handrails.',
			},
			{
				src: tarasStaircaseBeforeLanding,
				alt: 'Upper stair landing before renovation with grey carpet and natural wood railings.',
			},
			{
				src: tarasStaircaseAfterFront,
				alt: 'Staircase after renovation with dark wood treads, white risers, black iron balusters and stained newel posts.',
			},
			{
				src: tarasStaircaseAfterLanding,
				alt: 'Upper stair landing after renovation with dark wood flooring and black iron railings.',
			},
		],
		featured: true,
	},
	{
		id: 'lani-selick',
		name: 'Lani Selick',
		source: 'Google',
		rating: 5,
		dateLabel: '2 months ago',
		fullText:
			'WOW! Just WOW! Max removed all the popcorn from our 1800 sq ft town home, repainted from top to bottom plus did some carpentry repairs on our floors…and the final result is spectacular! But just as important, he made the entire renovation painless for us: not only was the process completely dust free and mess free, but Max also moved ALL the furniture and pictures himself (no help from us at all) then put EVERYTHING back together the way it was. We literally walked out of our home before he started and then walked back in a couple of weeks later to a beautiful brand new home with everything in the exact same place as it was beforehand. Renovating doesn’t not get better than this!!!',
		excerpt:
			'WOW! Just WOW! Max removed all the popcorn from our 1800 sq ft town home, repainted from top to bottom plus did some carpentry repairs on our floors…and the final result is spectacular!',
		services: [
			'popcorn-ceilings',
			'painting',
			'trim-carpentry',
			'flooring',
			'interior-renovations',
			'dust-control',
		],
	},
	{
		id: 'virginia-coppola',
		name: 'Virginia Coppola',
		source: 'Google',
		rating: 5,
		dateLabel: '4 months ago',
		fullText:
			'Maxim at Strataline did a very professional job in removing our hallway popcorn/stucco ceiling. The end result was a completely smooth surface and not only that, they totally sealed off the area so absolutely not dust penetrated other areas of the house. Maxim also installed wainscoting and trim work throughout the hallway, stairwell and landing. We would highly recommend their workmanship with very little disruption to the home.',
		excerpt:
			'Maxim at Strataline did a very professional job in removing our hallway popcorn/stucco ceiling. The end result was a completely smooth surface and not only that, they totally sealed off the area so absolutely not dust penetrated other areas of the house.',
		services: ['popcorn-ceilings', 'trim-carpentry', 'interior-renovations', 'dust-control'],
		location: 'Newmarket',
		images: [
			{
				src: virginiaWainscotingHallway,
				alt: 'Finished white wainscoting with picture-frame moulding beneath an ornate mirror.',
			},
			{
				src: virginiaWainscotingStairwell,
				alt: 'Full-height white picture-frame moulding in a stairwell with crown trim and pendant light.',
			},
			{
				src: virginiaWainscotingLanding,
				alt: 'Tall stairwell wall finished with white picture-frame moulding and crown trim.',
			},
		],
	},
];

export const homepageReviewIds = [
	'krista-singh',
	'taras-burban',
	'lani-selick',
	'greg-baxter',
	'jet-pro',
	'john-seigel',
] as const;

export const popcornReviewIds = [
	'lani-selick',
	'virginia-coppola',
	'mikekk',
	'ilene-bottos',
	'john-seigel',
	'krista-singh',
] as const;

export const stairsReviewIds = [
	'elise',
	'taras-burban',
	'krista-singh',
	'mikekk',
	'john-seigel',
	'd-kruger',
] as const;

export const paintingReviewIds = [
	'greg-baxter',
	'andriy-fedorenko',
	'ilene-bottos',
	'krista-singh',
	'john-seigel',
] as const;

export const interiorReviewIds = [
	'lani-selick',
	'krista-singh',
	'john-seigel',
	'ilene-bottos',
	'greg-baxter',
	'jet-pro',
] as const;

export const reviewIdsByCollection = {
	homepage: homepageReviewIds,
	popcorn: popcornReviewIds,
	stairs: stairsReviewIds,
	painting: paintingReviewIds,
	interior: interiorReviewIds,
	all: reviews.map((review) => review.id),
} as const;

export type ReviewCollectionKey = keyof typeof reviewIdsByCollection;

const reviewsById = new Map(reviews.map((review) => [review.id, review]));

export const getReviewById = (id: string) => reviewsById.get(id);

export const getReviewsByIds = (ids: readonly string[]) =>
	ids
		.map((id) => reviewsById.get(id))
		.filter((review): review is GoogleReview => review !== undefined);

export const getReviewsForCollection = (collection: ReviewCollectionKey) =>
	getReviewsByIds(reviewIdsByCollection[collection]);

export const getReviewsForService = (service: ReviewService) =>
	reviews.filter((review) => review.services.includes(service));
