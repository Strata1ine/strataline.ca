import type { Props as GalleryMeta } from './Gallery.astro';
import Image from '@/components/Image';
import { createMasonry } from '@solid-primitives/masonry';
import { createBreakpoints } from '@solid-primitives/media';

export default function Gallery(props: { content: GalleryMeta['content'] }) {
	const br = createBreakpoints({
		md: '768px',
		lg: '1024px',
	});

	const getColumns = () => {
		if (br.lg) return 3;
		if (br.md) return 2;
		return 2;
	};

	const getGap = () => {
		if (br.lg) return 16;
		if (br.md) return 12;
		return 8;
	};

	const masonry = createMasonry({
		source: () => props.content,
		columns: getColumns,
		mapHeight: (item) => () => item.src.height / 4.0 / (br.md ? 1 : 2) + getGap(),
		mapElement: (data) => (
			<div
				class="relative"
				style={{
					height: `${data.height() - getGap()}px`,
					order: data.order(),
					'margin-bottom': `${data.margin()}px`,
				}}
			>
				<Image widths={[400, 700, 1440]} image={data.source} class="absolute" />
			</div>
		),
	});

	return (
		<div
			class="flex flex-col flex-wrap items-stretch"
			style={{ gap: `${getGap()}px`, height: `${masonry.height() - getGap()}px` }}
		>
			{masonry()}
		</div>
	);
}
