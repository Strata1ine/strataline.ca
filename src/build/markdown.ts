import type { Root } from 'hast';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

const blockProcessor = await createMarkdownProcessor();
const processor = await createMarkdownProcessor({
	rehypePlugins: [rehypeUnwrapParagraphs],
});

const markdown = {
	parse: async (content: string): Promise<string> => {
		return (await blockProcessor.render(content)).code;
	},
	parseInline: async (content: string): Promise<string> => {
		return (await processor.render(content)).code;
	},
};

function rehypeUnwrapParagraphs() {
	return (tree: Root) => {
		if (tree.children.length === 1) {
			const child = tree.children[0];
			if (child && child.type === 'element' && child.tagName === 'p') {
				tree.children = child.children;
			}
		}
	};
}

export default markdown;
