import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const photosRoot = path.join(projectRoot, 'content', 'services', 'stairs', 'photos');

const cityOrder = [
	{ slug: 'ajax', name: 'Ajax' },
	{ slug: 'aurora', name: 'Aurora' },
	{ slug: 'bolton', name: 'Bolton' },
	{ slug: 'bradford', name: 'Bradford' },
	{ slug: 'burlington', name: 'Burlington' },
	{ slug: 'caledon', name: 'Caledon' },
	{ slug: 'etobicoke', name: 'Etobicoke' },
	{ slug: 'forest-hill', name: 'Forest Hill' },
	{ slug: 'innisfil', name: 'Innisfil' },
	{ slug: 'king-city', name: 'King City' },
	{ slug: 'kleinburg', name: 'Kleinburg' },
	{ slug: 'leaside', name: 'Leaside' },
	{ slug: 'markham', name: 'Markham' },
	{ slug: 'mississauga', name: 'Mississauga' },
	{ slug: 'newmarket', name: 'Newmarket' },
	{ slug: 'oakville', name: 'Oakville' },
	{ slug: 'oshawa', name: 'Oshawa' },
	{ slug: 'pickering', name: 'Pickering' },
	{ slug: 'richmond-hill', name: 'Richmond Hill' },
	{ slug: 'rosedale', name: 'Rosedale' },
	{ slug: 'stouffville', name: 'Stouffville' },
	{ slug: 'the-beaches', name: 'The Beaches' },
	{ slug: 'toronto', name: 'Toronto' },
	{ slug: 'vaughan', name: 'Vaughan' },
	{ slug: 'whitby', name: 'Whitby' },
	{ slug: 'woodbridge', name: 'Woodbridge' },
];

const nearbyMap = {
	ajax: ['pickering', 'whitby', 'oshawa'],
	aurora: ['newmarket', 'king-city', 'richmond-hill'],
	bolton: ['caledon', 'kleinburg', 'woodbridge'],
	bradford: ['innisfil', 'newmarket', 'aurora'],
	burlington: ['oakville', 'mississauga'],
	caledon: ['bolton', 'kleinburg', 'woodbridge'],
	etobicoke: ['toronto', 'mississauga', 'oakville'],
	'forest-hill': ['toronto', 'rosedale', 'leaside'],
	innisfil: ['bradford', 'newmarket'],
	'king-city': ['aurora', 'richmond-hill', 'vaughan'],
	kleinburg: ['woodbridge', 'vaughan', 'caledon'],
	leaside: ['toronto', 'forest-hill', 'rosedale'],
	markham: ['richmond-hill', 'stouffville', 'vaughan'],
	mississauga: ['oakville', 'etobicoke', 'burlington'],
	newmarket: ['aurora', 'bradford', 'richmond-hill'],
	oakville: ['mississauga', 'burlington'],
	oshawa: ['whitby', 'ajax', 'pickering'],
	pickering: ['ajax', 'whitby', 'oshawa'],
	'richmond-hill': ['markham', 'aurora', 'vaughan'],
	rosedale: ['toronto', 'forest-hill', 'leaside'],
	stouffville: ['markham', 'richmond-hill'],
	'the-beaches': ['toronto', 'leaside'],
	toronto: ['forest-hill', 'rosedale', 'the-beaches'],
	vaughan: ['woodbridge', 'kleinburg', 'richmond-hill'],
	whitby: ['ajax', 'pickering', 'oshawa'],
	woodbridge: ['vaughan', 'kleinburg', 'caledon'],
};

function isImageFile(filename) {
	return /\.(jpg|jpeg|png|webp)$/i.test(filename);
}

function safeReadDir(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true });
}

function getFiles(dir) {
	return safeReadDir(dir)
		.filter((entry) => entry.isFile() && isImageFile(entry.name))
		.map((entry) => entry.name)
		.sort((a, b) => a.localeCompare(b));
}

function getDirectories(dir) {
	return safeReadDir(dir)
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort((a, b) => a.localeCompare(b));
}

function pickHero(files) {
	if (!files.length) return null;

	const ranked = [...files].sort((a, b) => scoreFile(b) - scoreFile(a));
	return ranked[0] ?? files[0];
}

function scoreFile(filename) {
	const n = filename.toLowerCase();
	let score = 0;

	if (n.includes('hero')) score += 100;
	if (n.includes('full-view')) score += 60;
	if (n.includes('main-view')) score += 55;
	if (n.includes('overview')) score += 50;
	if (n.includes('full-run')) score += 45;
	if (n.includes('open-concept')) score += 35;
	if (n.includes('luxury')) score += 35;
	if (n.includes('curved-staircase')) score += 30;
	if (n.includes('after')) score += 25;

	if (n.includes('detail')) score -= 25;
	if (n.includes('tread-detail')) score -= 30;
	if (n.includes('baluster-detail')) score -= 30;
	if (n.includes('newel-post')) score -= 25;
	if (n.includes('top-view')) score -= 10;
	if (n.includes('down-view')) score -= 10;
	if (n.includes('before')) score -= 60;

	return score;
}

function getProjectFolders(citySlug) {
	const cityPath = path.join(photosRoot, citySlug);
	const directFiles = getFiles(cityPath);
	const subdirs = getDirectories(cityPath);

	if (directFiles.length) {
		return [
			{
				id: citySlug,
				folder: citySlug,
				files: directFiles,
			},
		];
	}

	if (!subdirs.length) return [];

	return subdirs
		.map((subdir) => {
			const files = getFiles(path.join(cityPath, subdir));
			return {
				id: subdir,
				folder: `${citySlug}/${subdir}`,
				files,
			};
		})
		.filter((project) => project.files.length > 0);
}

function buildCity(city) {
	const projects = getProjectFolders(city.slug);

	const allImages = projects.flatMap((project) =>
		project.files.map((file) => ({
			src: `./photos/${project.folder}/${file}`,
			filename: file,
			project: project.id,
		})),
	);

	const featuredProject =
		projects.find((p) => /project-2|featured|hero/i.test(p.id)) ?? projects[0] ?? null;

	const heroFilename = featuredProject
		? pickHero(featuredProject.files)
		: pickHero(allImages.map((img) => img.filename));

	const hero =
		heroFilename && featuredProject
			? `./photos/${featuredProject.folder}/${heroFilename}`
			: heroFilename
				? (allImages.find((img) => img.filename === heroFilename)?.src ?? null)
				: null;

	const featured = featuredProject
		? featuredProject.files.map((file) => `./photos/${featuredProject.folder}/${file}`)
		: [];

	const gallery = allImages.map((img) => img.src);

	return {
		name: city.name,
		slug: city.slug,
		folder: city.slug,
		hero,
		featured,
		gallery,
		projects: projects.map((project) => ({
			id: project.id,
			folder: project.folder,
			images: project.files.map((file) => `./photos/${project.folder}/${file}`),
			hero: pickHero(project.files)
				? `./photos/${project.folder}/${pickHero(project.files)}`
				: null,
		})),
		nearby: nearbyMap[city.slug] ?? [],
		shortDesc: `Professional staircase refinishing in ${city.name} with dust-controlled sanding, modern railing upgrades, tread refinishing, and custom stair transformations.`,
	};
}

export const stairsCities = cityOrder.map(buildCity).filter((city) => city.gallery.length > 0);

export function getStairsCityBySlug(slug) {
	return stairsCities.find((city) => city.slug === slug);
}
