import type { AstroGlobal } from "astro";
import type { CollectionEntry } from "~/content.config";
import { querySections } from "@sections/registry";
import business from "@root/content/business.json";

export const serviceSchema = (Astro: AstroGlobal, service: CollectionEntry<"services">) => {
  const reviews = querySections(service.data.sections, "Reviews");
  const prices = querySections(service.data.sections, "Prices");
  const s = querySections(service.data.sections, "wasd");

  return {
    "@type": "Product",
    name: service.data.title,
    description: service.data.desc,
    url: `${Astro.url.origin}/services/${service.id.split("/")[0]}`,
    brand: {
      "@type": "LocalBusiness",
      "@id": `${Astro.url.origin}#company`,
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: parseFloat(
          (
            reviews
              .flatMap((review) => review.content)
              .reduce((total, content) => total + content.stars, 0) /
            reviews.flatMap((review) => review.content).length
          ).toFixed(1),
        ),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 0,
        itemReviewed: {
          "@type": business["@type"],
          "@id": `${Astro.url.origin}#company`,
        },
      },
    }),
    ...(prices.length > 0 && {
      offers: prices.flatMap((prices) =>
        prices.content.map((content) => ({
          "@type": "Offer",
          name: content.title,
          description: content.desc,
          price: content.min,
          priceCurrency: business["currenciesAccepted"],
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: content.min,
            maxPrice: content.max,
            priceCurrency: business["currenciesAccepted"],
          },
          availability: "https://schema.org/InStock",
        })),
      ),
    }),
    image: service.data.covers.map((cover) => ({
      "@type": "ImageObject",
      url: `${Astro.url.origin}${cover.meta.src}`,
      description: cover.alt,
    })),
  }
}
