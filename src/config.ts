export const config = {
  /// The offical URL
  site: "https://strataline.ca",
  // See full documentation at: https://schema.org/GeneralContractor
  schema_type: "GeneralContractor",
  business: {
    // The official name of the business (required)
    "name": "Strataline",

    // The official registered name of the business (if different from trading name)
    "legalName": "Dust Free Popcorn Removal & Stair Refinishing by Strataline Inc.",

    // An alternate name for the business (e.g., abbreviation, different language name)
    "alternateName": "Strataline Inc",

    // A comprehensive description of the business and its services/products
    "description": "With over 15 years of experience, we specialize in dust-free renovations, setting a new industry standard with our ultra-clean approach. We excel in dustless popcorn ceiling removal and stair sanding, ensuring every project is completed in a spotless environment. Our meticulous attention to detail eliminates costly rework, enhances the finished product's quality, and accelerates project completion—all while ensuring your complete satisfaction. Our expertise shines in kitchen and bathroom remodeling, where we deliver stunning transformations with unmatched cleanliness and precision. We also offer a range of exterior renovation services, including door and window replacements, as well as brick and concrete cutting. Our interior renovation services cover electrical work, plumbing, flooring, painting, wall repairs, wallpaper removal, floor refinishing, and tile installation. We specialize in custom finishes such as crown molding, wainscoting, coffered ceilings, custom inlay medallions, and stone fireplace surrounds. Our dedication to customer service and quality control is second to none—we don’t just promise excellence, we deliver it.",

    // A short marketing slogan or tagline
    // "slogan": "Each renovation starts with a tomato.",

    // URLs to social media profiles or other web presences (helps establish entity connections)
    // NOTE: The available icon names can be found at: 
    // https://icon-sets.iconify.design/ph/?suffixes=Fill
    "sameAs": [
      {
        "url": "https://www.tiktok.com/@stratalineinc",
        "social": {
          "color": "000000",
          "icon": "ph:tiktok-logo-fill",
          "name": "TikTok social icon"
        }
      },
      {
        "url": "https://x.com/Strataline_Inc"
        // "social": {
        //   "color": "000000",
        //   "icon": "ph:x-logo-fill",
        //   "name": "X social icon"
        // }
      },
      {
        "url": "https://www.instagram.com/strataline.ca",
        "social": {
          "color": "e1306c",
          "icon": "ph:instagram-logo-fill",
          "name": "Instagram social icon"
        }
      },
      {
        "url": "https://www.facebook.com/stratalineinc",
        "social": {
          "color": "4267B2",
          "icon": "ph:facebook-logo-fill",
          "name": "Facebook social icon"
        }
      },
      {
        "url": "https://www.thestar.com/life/home-and-garden/popcorn-ceilings-get-a-new-smooth-surface/article_462130c5-9edc-588b-98b2-1498f6388c8c.html"
      },
      {
        "url": "https://houseandhome.com/gallery/luxe-for-less-design/"
      },
      {
        "url": "https://www.houzz.com/professionals/specialty-contractors/strataline-inc-pfvwus-pf~849729290"
      },
      {
        "url": "https://m.yelp.ca/biz/strataline-maple"
      },
      {
        "url": "https://www.mapquest.com/ca/ontario/strataline-inc-455175838"
      },
      {
        "url": "https://trustedpros.ca/company/strataline-inc"
      },
      {
        "url": "https://strataline-inc-stair-railing-stairs-refinishing-vaughan.vaughandirect.ca/"
      },
      {
        "url": "https://www.homestars.com/profile/2872533-strataline-inc"
      },
      {
        "url": "https://www.zoominfo.com/c/strataline-inc/442590402"
      },
      {
        "url": "https://www.yelp.ca/biz/strataline-maple"
      }
    ],

    // The date the business was established (ISO 8601 format)
    "foundingDate": "2015-03-25",

    // The location where the business was founded
    "foundingLocation": "Toronto, ON",

    // The person or entity who founded the business
    "founder": "Maxim Sologub",

    "email": "max@strataline.ca",

    "address": {
      "streetAddress": "88 Penderwick Crescent",
      "addressLocality": "Vaughan",
      "addressRegion": "ON",
      "postalCode": "L6A 3W2",
      "addressCountry": "CA"
    },

    // Primary contact phone number
    "telephone": "(416) 471 5999",

    // Fax number (if applicable)
    // "faxNumber": "",

    // Tax/business registration ID
    "taxID": "809655996 RT0001",

    // Global Location Number (if applicable)
    // "globalLocationNumber": "",

    // Approximate number of employees
    "numberOfEmployees": 5,

    // Currencies accepted by the business
    "currenciesAccepted": "CAD",

    // General opening hours in text format
    // "openingHours": "Mo-Fr 09:00-17:00",

    // Payment methods accepted
    "paymentAccepted": "Cash, Debit Card, E-transfer, Cheque",

    // Price range indicator ($ = inexpensive, $$ = moderate, $$$ = expensive, etc.)
    "priceRange": "$$",

    // Geographic areas served by the business (municipalities, regions, etc.)
    // This helps with local SEO for these specific areas
    "areaServed": [
      "Aurora",
      "Barrie",
      "Bolton",
      "Bowmanville",
      "Brampton",
      "Burlington",
      "Caledon",
      "Collingwood",
      "East Gwillimbury",
      "Etobicoke",
      "Forest Hill",
      "Glen Abbey",
      "King City",
      "Lorne Park",
      "Maple",
      "Markham",
      "Milton",
      "Mississauga",
      "Newmarket",
      "North York",
      "Oakville",
      "Oshawa",
      "Richmond Hill",
      "Rosedale",
      "Scarborough",
      "Sheridan",
      "Stouffville",
      "The Blue Mountains",
      "The Bridle Path",
      "Thornhill",
      "Toronto",
      "Vaughan",
      "Whitby",
      "Woodbridge",
      "York Region",
      "Yorkville"
    ],

    // URL to a map showing the business location
    // "hasMap": "https://goo.gl/maps/example",

    // Awards or recognition received by the business
    "award": ["Best of Houzz 2018", "Best of Houzz 2021"],

    // Whether the business offers drive-through service
    "hasDriveThroughService": false,

    // Keywords relevant to the business (for SEO)
    // do not include words already included in the schema
    // all services are included as offers and therefore already added as keywords
    // NOTE: highlight keywords that are found on the website
    // choose carefully
    "keywords": [
      "GTA and beyond",
      "experts",
      "quality",
      "dust-free",
      "renovation",
      "transformation"
    ],

    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "theme_color",
        "value": "#FEE2E6"
      },
      {
        "@type": "PropertyValue",
        "name": "background_color",
        "value": "#FFFAFB"
      }
    ]
  },
  globalDefaults: {
    imageAttr: {
      widths: [750, 1300, 2160],
      sizes: "60vw",
      width: 2160,
      draggable: false,
    },
  },
};

export const getPropertyValue = (name: string) =>
  config.business.additionalProperty?.find(prop => prop.name === name)?.value;
