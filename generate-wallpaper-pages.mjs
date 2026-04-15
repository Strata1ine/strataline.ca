import { wallpaperCities } from './wallpaperCities.js';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const baseDir = path.join(projectRoot, 'content', 'services', 'wallpaper');

function getGallery(city) {
	return city.gallery?.length
		? city.gallery
		: [
				city.hero,
				'hallway-wallpaper-installation-toronto-modern-grey-corridor-feature-wall.jpg',
				'bedroom-wallpaper-installation-toronto-neutral-vertical-stripe-feature-wall-02.jpg',
				'modern-bathroom-wallpaper-installation-woodbridge-vanity-feature-wall-01.jpg',
				'textured-wallpaper-installation-richmond-hill-living-room-grey-feature-wall.jpg',
				'landscape-wall-mural-installation-vaughan-mountain-scene-feature-wall.jpg',
			];
}

function uniqueFirst(arr, count) {
	return [...new Set(arr)].slice(0, count);
}

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function quote(str) {
	return String(str).replace(/'/g, '’');
}

function makeCityShortDesc(city) {
	return city.shortDesc
		? city.shortDesc
		: `Professional wallpaper installation in ${city.name} for feature walls, bedrooms, bathrooms, murals, and designer wall coverings.`;
}

function makeCityLinks(currentSlug = null, imagePrefix = '..') {
	return wallpaperCities
		.filter((c) => c.slug !== currentSlug)
		.map((c) => {
			const image = `${imagePrefix}/photos/${c.hero}`;
			return `      - title: Wallpaper installation ${c.name}
        desc: |-
          ${quote(makeCityShortDesc(c))}
        image:
          src: ${image}
          alt: Wallpaper installation in ${c.name}.
        link: /services/wallpaper/${c.slug}`;
		})
		.join('\n');
}

function makeKeywords(city) {
	return `primary:
  - wallpaper installation ${city.name.toLowerCase()}
  - wallpaper installer ${city.name.toLowerCase()}
  - feature wall wallpaper ${city.name.toLowerCase()}

secondary:
  - bedroom wallpaper installation ${city.name.toLowerCase()}
  - bathroom wallpaper installation ${city.name.toLowerCase()}
  - wall mural installation ${city.name.toLowerCase()}
  - textured wallpaper ${city.name.toLowerCase()}
  - professional wallpaper installer ${city.name.toLowerCase()}

long_tail:
  - how much does wallpaper installation cost in ${city.name.toLowerCase()}
  - best wallpaper installer in ${city.name.toLowerCase()}
  - wallpaper feature wall installation in ${city.name.toLowerCase()}
  - can wallpaper be installed in bathrooms in ${city.name.toLowerCase()}
  - do walls need to be smooth before wallpaper installation

local:
  - ${city.name}
${(city.nearby ?? []).map((n) => `  - ${n}`).join('\n')}

ai_prompts:
  - who installs wallpaper in ${city.name.toLowerCase()}
  - how much does wallpaper installation cost in ${city.name.toLowerCase()}
  - is wallpaper better than paint for feature walls
  - can wallpaper be installed in bathrooms
  - what is the best wallpaper for a bedroom feature wall
`;
}

function makeCityPage(city) {
	const gallery = uniqueFirst(getGallery(city), 6);
	const [g1, g2, g3, g4, g5, g6] = gallery;

	return `title: Wallpaper installation ${city.name}
startPos: right

seo: |-
  Professional wallpaper installation in ${city.name}. Feature walls, bedroom wallpaper, bathroom wallpaper, murals, textured wallpaper, and designer wall coverings installed cleanly with precise seams, proper surface preparation, and a professional finish.

desc: |-
  ${quote(makeCityShortDesc(city))}

image:
  src: ../photos/${city.hero}
  alt: Wallpaper installation in ${city.name}.

sections:
  - type: Benefits
    title: Wallpaper installation in ${city.name} done properly
    content:
      - title: Clean seams and pattern alignment
        desc: |-
          Wallpaper only looks premium when seams stay tight, patterns line up correctly, and corners, ceilings, and trim are cut cleanly.

      - title: Proper wall preparation
        desc: |-
          Smooth, properly prepared walls matter. Minor repairs, sanding, and priming are handled as needed so the wallpaper adheres properly and finishes clean.

      - title: Feature walls without a full renovation
        desc: |-
          Wallpaper creates a strong visual upgrade without the cost or disruption of a full remodel.

      - title: Ideal for finished homes
        desc: |-
          We work carefully in occupied homes and finished spaces, protecting nearby finishes and keeping the work area controlled and tidy.

  - type: ImagePanel
    title: Wallpaper installation in ${city.name}
    content:
      - title: Feature walls and bedrooms
        desc: |-
          Wallpaper can anchor a room, add visual depth, and create a more finished, designer look in bedrooms and living spaces.
        image:
          src: ../photos/${g1}
          alt: Wallpaper feature wall installation in ${city.name}.

      - title: Bathrooms and smaller spaces
        desc: |-
          Smaller spaces benefit from texture and pattern. Clean cuts around mirrors, vanities, and trim are what make the result look sharp.
        image:
          src: ../photos/${g2}
          alt: Bathroom or feature wallpaper installation in ${city.name}.

      - title: Murals and statement walls
        desc: |-
          Murals and statement walls require careful layout and alignment so the finished wall reads as one complete image.
        image:
          src: ../photos/${g3}
          alt: Statement wallpaper installation in ${city.name}.

  - type: ImageCarousel
    content:
      - src: ../photos/${g1}
        alt: Wallpaper installation in ${city.name}.
      - src: ../photos/${g2}
        alt: Feature wall wallpaper installation in ${city.name}.
      - src: ../photos/${g3}
        alt: Designer wallpaper installation in ${city.name}.
      - src: ../photos/${g4}
        alt: Wallpaper detail installation in ${city.name}.
      - src: ../photos/${g5}
        alt: Wallpaper feature wall project in ${city.name}.
      - src: ../photos/${g6}
        alt: Professional wallpaper installation in ${city.name}.

  - type: Benefits
    title: Wallpaper vs painting
    content:
      - title: Wallpaper creates stronger visual impact
        desc: |-
          Wallpaper offers textures, patterns, and depth that paint usually cannot achieve, especially on feature walls and murals.

      - title: Paint is simpler but less expressive
        desc: |-
          Paint is easier to change, but it usually creates flatter, more uniform walls without the same design impact.

      - title: Wallpaper lasts longer when installed properly
        desc: |-
          With proper surface preparation and professional installation, wallpaper can stay in place for many years without frequent touch-ups.

      - title: Installation quality matters
        desc: |-
          Poor installation leads to visible seams, misaligned patterns, and lifting edges. Professional installation is what makes the finished wall look clean and lasting.

  - type: TextCarousel
    text:
      - Wallpaper installation ${city.name}
      - Professional wallpaper installer ${city.name}
      - Feature wall wallpaper installation
      - Wall mural installation
      - Proper surface preparation
      - Clean seams and pattern alignment

  - type: ZigZag
    title: More wallpaper installation service areas
    content:
${makeCityLinks(city.slug, '..')}

  - type: Benefits
    title: What affects wallpaper installation quality in ${city.name}
    content:
      - title: Wall preparation
        desc: |-
          Good wallpaper installation starts with the wall surface. Drywall condition, old adhesive, texture, paint sheen, and repairs all affect how clean the finished wallpaper will look.

      - title: Pattern alignment
        desc: |-
          Straight match, drop match, murals, and large scale prints all require careful planning so the design lines up properly from panel to panel.

      - title: Product type
        desc: |-
          Peel and stick wallpaper, non woven wallpaper, traditional wallpaper, vinyl, murals, and textured wall coverings all install differently and need the right method.

      - title: Final trimming and cleanup
        desc: |-
          Clean cuts at ceilings, corners, trim, outlets, vanities, and baseboards are a large part of what separates a professional result from a rough one.

  - type: Faq
    title: Wallpaper installation ${city.name} FAQ
    content:
      - title: Do walls need to be smooth before wallpaper installation?
        desc: |-
          Yes. Wallpaper looks best on smooth, properly prepared walls. Depending on the surface, prep can include patching, sanding, sealing, priming, skim coating, and minor corrections so the wallpaper lays flatter and finishes cleaner.

      - title: Can wallpaper be installed in bathrooms?
        desc: |-
          Yes, especially in powder rooms and well ventilated bathrooms. Product choice, humidity conditions, and wall preparation all matter. Some wallpapers perform better than others in bathroom environments.

      - title: Do you install murals and textured wallpaper?
        desc: |-
          Yes. We install standard wallpaper, murals, textured wallpaper, designer wall coverings, feature walls, and statement walls. Layout and pattern planning become especially important on murals and large scale designs.

      - title: Can you remove old wallpaper before installing new wallpaper?
        desc: |-
          Yes. We can remove existing wallpaper, clean off leftover adhesive, repair the wall where needed, and prepare the surface for new wallpaper installation. Removal is often necessary for the best final result.

      - title: Can wallpaper be installed on textured walls?
        desc: |-
          Sometimes, but textured walls often need preparation first. Depending on the texture and wallpaper type, that can include sanding, skim coating, priming, or other prep to create a smoother surface.

      - title: Do you install peel and stick wallpaper?
        desc: |-
          Yes. We install peel and stick wallpaper as well as traditional wallpaper, non woven wallpaper, and paste the wall products. Each material behaves differently, so installation method matters.

      - title: What is the difference between paste the wall and traditional wallpaper?
        desc: |-
          Paste the wall wallpaper is installed by applying adhesive to the wall, while traditional wallpaper often requires paste on the paper itself. The right method depends on the wallpaper product and manufacturer instructions.

      - title: What does pattern matching mean in wallpaper installation?
        desc: |-
          Pattern matching means aligning the design correctly from one panel to the next so seams look clean and the wallpaper reads as one continuous design. This is especially important on drop match and large pattern wallpapers.

      - title: How much does wallpaper installation cost in ${city.name}?
        desc: |-
          Cost depends on wall condition, room size, wallpaper type, pattern complexity, access, trimming difficulty, and whether preparation or wallpaper removal is needed first.

      - title: How long does wallpaper installation take?
        desc: |-
          Many feature walls can be completed in one day. Full rooms, wallpaper removal, extensive wall repairs, detailed pattern matching, and difficult layouts can take longer.

      - title: Do you supply the wallpaper?
        desc: |-
          Usually the client supplies the wallpaper because colour, style, and product choice are very personal. We can still review the product, advise on suitability, and help confirm approximate quantities before installation.

      - title: Can you quote wallpaper installation from photos?
        desc: |-
          In many cases, yes. The fastest way to price the work is to send photos, rough wall measurements, ceiling height, and the wallpaper product link or label if you have it.

      - title: What rooms are best for wallpaper?
        desc: |-
          Wallpaper works especially well on feature walls, bedrooms, dining rooms, powder rooms, hallways, foyers, offices, libraries, nurseries, and living rooms where pattern, texture, or contrast can make the room feel more finished.

      - title: Why hire a professional wallpaper installer instead of doing it yourself?
        desc: |-
          Wallpaper installation is detail work. Problems like bubbles, crooked seams, poor adhesion, misaligned patterns, rough cuts, and lifting edges are common with DIY installs. Professional installation helps avoid those issues and produces a cleaner finished look.
 
        
  - type: ImagePanel
    title: Get a quote for wallpaper installation in ${city.name}
    content:
      - title: Send wall measurements and wallpaper details
        desc: |-
          The fastest way to price your wallpaper installation project is to send photos, wall measurements, and the wallpaper product link or label.
        image:
          src: ../photos/${g4}
          alt: Wallpaper consultation image for ${city.name}.

      - title: Feature wall or full room
        desc: |-
          We install single feature walls, accent walls, powder rooms, nurseries, and full-room wallpaper depending on the space and product.
        image:
          src: ../photos/${g5}
          alt: Wallpaper feature wall project in ${city.name}.

      - title: Clean, careful installation
        desc: |-
          Wallpaper work is detail work. Careful prep, layout, trimming, and finishing are what make the final wall look sharp rather than improvised.
        image:
          src: ../photos/${g6}
          alt: Clean wallpaper installation detail in ${city.name}.

  - type: Services
    exclude:
      - wallpaper
`;
}

function makeHubPage() {
	return `title: Wallpaper installation Toronto & GTA
startPos: right

seo: |-
  wallpaper installation toronto, wallpaper installer toronto, wallpaper hanging toronto, feature wall wallpaper toronto, bedroom wallpaper installation, bathroom wallpaper installation, mural installation toronto, wallpaper installation vaughan, wallpaper installation richmond hill, wallpaper installation markham, designer wallpaper installer gta, textured wallpaper installation

desc: |-
  Professional wallpaper installation in Toronto and the GTA for feature walls, bedrooms, dining rooms, bathrooms, powder rooms, murals, libraries, offices, and designer wall coverings. Clean layout, proper wall preparation, precise seams, and careful finishing.

image:
  src: ./photos/upscale-hallway-wallpaper-installation-markham-modern-entry-corridor.jpg
  alt: Upscale hallway wallpaper installation in Markham with a modern entry feature wall.

sections:
  - type: Benefits
    title: Professional wallpaper installation done properly
    content:
      - title: Clean seams and balanced pattern layout
        desc: |-
          Wallpaper only looks premium when seams stay tight, patterns line up properly, and the layout is planned so the wall feels intentional rather than improvised.

      - title: Proper surface preparation before hanging
        desc: |-
          Good wallpaper installation starts before the first panel goes up. Wall condition, texture, minor defects, and surface readiness all affect the final result.

      - title: Strong visual impact without major renovation
        desc: |-
          Wallpaper can completely change the feel of a room without opening walls or turning the house into a construction site.

      - title: Careful work in finished homes and furnished spaces
        desc: |-
          Wallpaper is often installed in completed bedrooms, dining rooms, hallways, powder rooms, and living spaces, so the work needs to be careful, controlled, and clean.

  - type: ImagePanel
    title: Our wallpaper installation process
    content:
      - title: Wall prep and surface review
        desc: |-
          We check the wall condition first and deal with minor imperfections where needed so the wallpaper has a better surface to bond to and finish against.
        image:
          src: ./photos/modern-bathroom-wallpaper-installation-woodbridge-vanity-feature-wall-01.jpg
          alt: Modern bathroom wallpaper installation in Woodbridge showing a clean prepared vanity wall.

      - title: Layout and feature alignment
        desc: |-
          Before installation begins, panel layout, seam placement, centering, and pattern balance are planned so the finished wall looks sharp and intentional.
        image:
          src: ./photos/silver-feature-wall-wallpaper-installation-markham-textured-metallic-finish.jpg
          alt: Silver feature wall wallpaper installation in Markham with a balanced textured metallic finish.

      - title: Clean trimming and final finish
        desc: |-
          Careful trimming around ceilings, corners, outlets, trim, and transitions is what makes the finished wallpaper look properly installed rather than roughly applied.
        image:
          src: ./photos/bedroom-wallpaper-installation-toronto-neutral-vertical-stripe-feature-wall-02.jpg
          alt: Bedroom wallpaper installation in Toronto with a clean finished stripe feature wall.

  - type: ImageCarousel
    content:
      - src: ./photos/upscale-hallway-wallpaper-installation-markham-modern-entry-corridor.jpg
        alt: Upscale hallway wallpaper installation in Markham.
      - src: ./photos/hallway-wallpaper-installation-toronto-modern-grey-corridor-feature-wall.jpg
        alt: Hallway wallpaper installation in Toronto with a modern grey corridor feature wall.
      - src: ./photos/dark-luxury-lounge-wallpaper-installation-vaughan-moody-feature-wall.jpg
        alt: Dark luxury lounge wallpaper installation in Vaughan.
      - src: ./photos/feature-wall-wallpaper-installation-markham.jpg
        alt: Feature wall wallpaper installation in Markham.
      - src: ./photos/bedroom-wallpaper-installation-markham-dark-botanical-feature-wall.jpg
        alt: Bedroom wallpaper installation in Markham with a dark botanical feature wall.
      - src: ./photos/bedroom-wallpaper-installation-vaughan-dark-floral-headboard-feature-wall.jpg
        alt: Bedroom wallpaper installation in Vaughan with a dark floral headboard wall.
      - src: ./photos/custom-library-wallpaper-installation-richmond-hill-built-in-bookshelves.jpg
        alt: Custom library wallpaper installation in Richmond Hill with built in bookshelves.
      - src: ./photos/home-library-wallpaper-installation-vaughan-dark-accent-reading-room.png
        alt: Home library wallpaper installation in Vaughan.
      - src: ./photos/dramatic-foyer-wallpaper-installation-toronto-dark-floral-entry-console.png
        alt: Dramatic foyer wallpaper installation in Toronto.
      - src: ./photos/geometric-feature-wall-wallpaper-installation-vaughan-navy-gold-pattern.png
        alt: Geometric feature wall wallpaper installation in Vaughan with a navy and gold pattern.
      - src: ./photos/luxurious-living-room-wallpaper-installation-toronto-botanical-mural.png
        alt: Luxurious living room wallpaper installation in Toronto with a botanical mural.
      - src: ./photos/luxury-boardroom-wallpaper-installation-toronto-executive-meeting-room.png
        alt: Luxury boardroom wallpaper installation in Toronto.
      - src: ./photos/executive-boardroom-wallpaper-installation-markham-modern-conference-space.png
        alt: Executive boardroom wallpaper installation in Markham.
      - src: ./photos/home-office-wallpaper-installation-richmond-hill-bright-study-bookshelves.jpg
        alt: Home office wallpaper installation in Richmond Hill with bright study bookshelves.
      - src: ./photos/modern-living-room-wallpaper-installation-vaughan-neutral-designer-wallpaper.png
        alt: Modern living room wallpaper installation in Vaughan.
      - src: ./photos/modern-boardroom-wallpaper-installation-toronto-contemporary-office.jpg
        alt: Modern boardroom wallpaper installation in Toronto.
      - src: ./photos/traditional-living-room-wallpaper-installation-markham-classic-floral-pattern.png
        alt: Traditional living room wallpaper installation in Markham.
      - src: ./photos/office-wallpaper-installation-vaughan-modern-commercial-interior.jpg
        alt: Office wallpaper installation in Vaughan.
      - src: ./photos/bedroom-wallpaper-installation-markham-soft-textured-feature-wall.png
        alt: Bedroom wallpaper installation in Markham with a soft textured feature wall.
      - src: ./photos/luxury-tv-room-wallpaper-installation-toronto-dark-media-wall.jpg
        alt: Luxury TV room wallpaper installation in Toronto with a dark media wall.
      - src: ./photos/soft-kids-room-wallpaper-installation-richmond-hill-playful-floral.png
        alt: Soft kids room wallpaper installation in Richmond Hill.
      - src: ./photos/dining-room-wallpaper-ideas-vaughan-modern-arched-pattern.png
        alt: Dining room wallpaper ideas in Vaughan with a modern arched pattern.
      - src: ./photos/formal-dining-room-wallpaper-installation-vaughan-elegant-pattern.png
        alt: Formal dining room wallpaper installation in Vaughan.
      - src: ./photos/elegant-dining-room-wallpaper-installation-toronto-classic-panel-look.png
        alt: Elegant dining room wallpaper installation in Toronto.
      - src: ./photos/dining-room-wallpaper-installation-vaughan-soft-floral-luxury-space.png
        alt: Dining room wallpaper installation in Vaughan with a soft floral luxury design.
      - src: ./photos/elegant-living-room-wallpaper-installation-richmond-hill-soft-floral-design.png
        alt: Elegant living room wallpaper installation in Richmond Hill.
      - src: ./photos/wallpaper-installation-toronto-bedroom-grey-texture-feature-wall.png
        alt: Wallpaper installation in Toronto bedroom with a grey texture feature wall.
      - src: ./photos/bedroom-wallpaper-installation-toronto-neutral-vertical-stripe-feature-wall-02.jpg
        alt: Bedroom wallpaper installation in Toronto with a neutral vertical stripe feature wall.
      - src: ./photos/landscape-wall-mural-installation-vaughan-mountain-scene-feature-wall.jpg
        alt: Landscape wall mural installation in Vaughan with a mountain scene.
      - src: ./photos/modern-bathroom-wallpaper-installation-woodbridge-light-grey-wallpaper-04.jpg
        alt: Modern bathroom wallpaper installation in Woodbridge with light grey wallpaper.
      - src: ./photos/silver-feature-wall-wallpaper-installation-markham-textured-metallic-finish.jpg
        alt: Silver feature wall wallpaper installation in Markham.
      - src: ./photos/striped-wallpaper-installation-mississauga-bedroom-neutral-vertical-lines.jpg
        alt: Striped wallpaper installation in Mississauga with neutral vertical lines.
      - src: ./photos/textured-wallpaper-installation-richmond-hill-living-room-grey-feature-wall.jpg
        alt: Textured wallpaper installation in Richmond Hill living room with a grey feature wall.
      - src: ./photos/bathroom-wallpaper-installation-toronto-grey-pattern-feature-wall-02.jpg
        alt: Bathroom wallpaper installation in Toronto with a grey patterned feature wall.
      - src: ./photos/bathroom-wallpaper-installation-toronto-grey-pattern-feature-wall-01.jpg
        alt: Bathroom wallpaper installation in Toronto with a grey patterned feature wall.
      - src: ./photos/bathroom-wallpaper-installation-woodbridge-modern-01.jpg
        alt: Bathroom wallpaper installation in Woodbridge with a modern wallpaper feature.
      - src: ./photos/bedroom-wallpaper-installation-toronto-neutral-vertical-stripe-feature-wall-01.jpg
        alt: Bedroom wallpaper installation in Toronto with a neutral vertical stripe feature wall.
      - src: ./photos/wallpaper-installation-toronto-bedroom-feature-wall-01.jpg
        alt: Wallpaper installation in Toronto bedroom feature wall.
      - src: ./photos/modern-bathroom-wallpaper-installation-woodbridge-vanity-feature-wall-02.jpg
        alt: Modern bathroom wallpaper installation in Woodbridge with a vanity feature wall.
      - src: ./photos/modern-bathroom-wallpaper-installation-woodbridge-vanity-feature-wall-01.jpg
        alt: Modern bathroom wallpaper installation in Woodbridge with a vanity feature wall.

  - type: Benefits
    title: Where wallpaper works especially well
    content:
      - title: Bedrooms and headboard walls
        desc: |-
          Wallpaper behind the bed or on a primary feature wall gives the room a finished, designed look without changing the whole space.

      - title: Dining rooms and formal spaces
        desc: |-
          Dining rooms respond especially well to wallpaper because they benefit from depth, pattern, and a more intentional decorative feel.

      - title: Bathrooms and powder rooms
        desc: |-
          Smaller rooms are often the best place to use bolder wallpaper, stronger texture, metallic effects, or designer patterns.

      - title: Libraries, offices, and statement rooms
        desc: |-
          Wallpaper is excellent for home offices, reading rooms, libraries, foyers, and other spaces that should feel distinctive rather than generic.

  - type: ZigZag
    title: Wallpaper installation by city
    content:
${makeCityLinks(null, '.')}

  - type: Benefits
    title: Wallpaper installation pricing factors
    content:
      - title: Wall condition
        desc: |-
          Smooth, ready walls are faster to paper. Wallpaper removal, adhesive cleanup, wall repairs, skim coating, and priming add labour.

      - title: Wallpaper type
        desc: |-
          Murals, heavy vinyl, textured wallpaper, grasscloth style products, peel and stick materials, and large pattern papers all vary in installation difficulty.

      - title: Room layout
        desc: |-
          Corners, bulkheads, vanities, high ceilings, windows, outlets, niches, stairwells, and tight spaces all affect labour time and final pricing.

      - title: Scope of work
        desc: |-
          A single feature wall is very different from a full room, multiple rooms, wallpaper replacement project, or wallpaper removal plus reinstall.

  - type: Faq
    title: Wallpaper installation FAQ
    content:
      - title: Do walls need to be smooth before wallpaper installation?
        desc: |-
          Yes. Wallpaper looks best on properly prepared walls. Depending on the surface, prep can include patching, sanding, sealing, priming, skim coating, and correcting minor defects so the wallpaper finishes cleanly.

      - title: Can wallpaper be installed in bathrooms?
        desc: |-
          Yes, especially in powder rooms and well ventilated bathrooms. Product choice, moisture levels, and wall preparation all affect performance.

      - title: Do you remove old wallpaper?
        desc: |-
          Yes. We can remove old wallpaper, clean off adhesive residue, repair the wall where needed, and prepare the surface for new wallpaper installation.

      - title: Can wallpaper be installed on textured walls?
        desc: |-
          Textured walls often need prep first. Depending on the texture and wallpaper type, this can include sanding, skim coating, priming, or other corrective work.

      - title: Do you install murals and textured wallpaper?
        desc: |-
          Yes. We install standard wallpaper, murals, textured wallpaper, designer wall coverings, feature walls, and statement walls in a range of residential spaces.

      - title: Do you install peel and stick wallpaper?
        desc: |-
          Yes. We install peel and stick wallpaper as well as paste the wall and traditional wallpapers. Each product has its own handling and installation requirements.

      - title: What is the difference between paste the wall and traditional wallpaper?
        desc: |-
          Paste the wall products are installed by applying adhesive directly to the wall, while traditional wallpaper often requires paste on the back of the paper. The correct method depends on the manufacturer instructions.

      - title: What is pattern matching in wallpaper installation?
        desc: |-
          Pattern matching means aligning the wallpaper design correctly from strip to strip so seams blend properly and the pattern reads continuously across the wall.

      - title: How much does wallpaper installation cost?
        desc: |-
          Cost depends on wall condition, room size, wallpaper type, pattern complexity, trimming difficulty, access, and whether wallpaper removal or prep work is required.

      - title: How long does wallpaper installation take?
        desc: |-
          A single feature wall may be completed in one day. Full rooms, murals, wallpaper removal, wall repairs, and complex layouts can take longer.

      - title: Do you supply wallpaper?
        desc: |-
          Usually the client supplies the wallpaper because style and product choice are personal. We can still advise on suitability and help review quantities before installation.

      - title: Can you quote wallpaper installation from photos?
        desc: |-
          In many cases, yes. Photos, measurements, ceiling height, and the wallpaper product information are usually enough for an initial estimate.

      - title: What rooms are best for wallpaper?
        desc: |-
          Wallpaper works especially well in bedrooms, dining rooms, powder rooms, hallways, foyers, offices, libraries, nurseries, living rooms, and feature wall applications.

      - title: Why hire a professional wallpaper installer?
        desc: |-
          Professional installation reduces the risk of bubbles, crooked seams, poor adhesion, bad pattern alignment, rough trimming, and other common DIY mistakes.

  - type: ImagePanel
    title: Get a quote for wallpaper installation
    content:
      - title: Send photos and wall measurements
        desc: |-
          The quickest way to price your wallpaper installation project is to send photos of the wall, approximate measurements, and the wallpaper product details if you already have them.
        image:
          src: ./photos/bedroom-wallpaper-installation-toronto-neutral-vertical-stripe-feature-wall-01.jpg
          alt: Bedroom wallpaper installation in Toronto with a finished stripe feature wall.

      - title: Feature wall or full room
        desc: |-
          We install single accent walls, bedrooms, dining rooms, foyers, libraries, offices, powder rooms, and full wallpapered rooms depending on the layout and product.
        image:
          src: ./photos/dining-room-wallpaper-installation-vaughan-soft-floral-luxury-space.png
          alt: Dining room wallpaper installation in Vaughan.

      - title: Clean, careful finishing
        desc: |-
          Wallpaper work is detail work. Proper prep, careful layout, clean trimming, and tight seams are what make the finished wall look sharp and professionally installed.
        image:
          src: ./photos/modern-bathroom-wallpaper-installation-woodbridge-vanity-feature-wall-02.jpg
          alt: Clean bathroom wallpaper installation in Woodbridge.

  - type: Services
    exclude:
      - wallpaper
`;
}

ensureDir(baseDir);

fs.writeFileSync(path.join(baseDir, 'index.yaml'), makeHubPage(), 'utf8');

fs.writeFileSync(
	path.join(baseDir, 'keywords.yaml'),
	`primary:
  - wallpaper installation toronto
  - wallpaper installation gta
  - professional wallpaper installation

secondary:
  - feature wall wallpaper installation
  - bedroom wallpaper installation
  - bathroom wallpaper installation
  - wall mural installation
  - textured wallpaper installation

long_tail:
  - how much does wallpaper installation cost
  - best wallpaper installer toronto
  - wallpaper vs paint for feature walls
  - proper surface preparation for wallpaper
  - professional wallpaper installer near me

local:
${wallpaperCities.map((c) => `  - ${c.name}`).join('\n')}

ai_prompts:
  - who installs wallpaper in toronto
  - how much does wallpaper installation cost
  - is wallpaper better than paint for feature walls
  - can wallpaper be installed in bathrooms
`,
	'utf8',
);

for (const city of wallpaperCities) {
	const cityDir = path.join(baseDir, city.folder);
	ensureDir(cityDir);
	fs.writeFileSync(path.join(cityDir, 'index.yaml'), makeCityPage(city), 'utf8');
	fs.writeFileSync(path.join(cityDir, 'keywords.yaml'), makeKeywords(city), 'utf8');
}

console.log('Wallpaper hub and city pages generated successfully.');
