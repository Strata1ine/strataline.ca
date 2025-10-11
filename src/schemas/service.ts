import type { CollectionEntry } from '@/content.config';
import { querySections } from '@/components/registry';
import business from '#/business.json';
import { computeAggregateRating } from './reviews';
import type { AstroGlobal } from 'astro';

export const generateServiceSchema = (Astro: AstroGlobal, service: CollectionEntry<'services'>) => {
	const reviews = querySections(service.data.sections, 'Reviews');
	const prices = querySections(service.data.sections, 'Prices');

	return {
		'@type': 'Product',
		name: service.data.title,
		description: service.data.desc,
		url: `${Astro.url.origin}/services/${service.id.split('/')[0]}`,
		brand: {
			'@type': 'LocalBusiness',
			'@id': `${Astro.url.origin}#company`,
		},
		...(reviews.length > 0 && {
			...computeAggregateRating(Astro, reviews),
		}),
		...(prices.length > 0 && {
			offers: prices.flatMap((prices) =>
				prices.content.map((content) => ({
					'@type': 'Offer',
					name: content.title,
					description: content.desc,
					price: content.min,
					priceCurrency: business['currenciesAccepted'],
					priceSpecification: {
						'@type': 'PriceSpecification',
						minPrice: content.min,
						maxPrice: content.max,
						priceCurrency: business['currenciesAccepted'],
					},
					availability: 'https://schema.org/InStock',
				})),
			),
		}),
		image: service.data.covers.map((cover) => ({
			'@type': 'ImageObject',
			url: `${Astro.url.origin}${cover.src}`,
			description: cover.alt,
		})),
	};
};
