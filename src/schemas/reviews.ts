import business from '#/business.json';
import { marked } from 'marked';
import type { AstroGlobal } from 'astro';

// export const generateReviews = (Astro: AstroGlobal, reviews: PropsOf<'Reviews'>[]) => {
// 	return {
// 		review: reviews.flatMap((review) =>
// 			review.content.map((content) => ({
// 				'@type': 'Review',
// 				author: {
// 					'@type': 'Person',
// 					name: content.title,
// 				},
// 				itemReviewed: {
// 					'@type': business['@type'],
// 					'@id': `${Astro.url.origin}#company`,
// 				},
// 				contentLocation: {
// 					'@type': 'Place',
// 					name: content.location,
// 				},
// 				reviewRating: {
// 					'@type': 'Rating',
// 					ratingValue: content.stars,
// 					bestRating: 5,
// 				},
// 				reviewBody: marked.parseInline(content.desc) as string,
// 				...(content.date && { datePublished: content.date.toISOString() }),
// 				...(content.url && {
// 					associatedMedia: {
// 						'@type': 'MediaObject',
// 						associatedArticle: content.url,
// 					},
// 				}),
// 			})),
// 		),
// 	};
// };
//
// export const computeAggregateRating = (Astro: AstroGlobal, reviews: PropsOf<'Reviews'>[]) => {
// 	return {
// 		aggregateRating: {
// 			'@type': 'AggregateRating',
// 			ratingValue: parseFloat(
// 				(
// 					reviews
// 						.flatMap((review) => review.content)
// 						.reduce((total, content) => total + content.stars, 0) /
// 					reviews.flatMap((review) => review.content).length
// 				).toFixed(1),
// 			),
// 			reviewCount: reviews.flatMap((review) => review.content).length,
// 			bestRating: 5,
// 			worstRating: 0,
// 			itemReviewed: {
// 				'@type': business['@type'],
// 				'@id': `${Astro.url.origin}#company`,
// 			},
// 		},
// 	};
// };
