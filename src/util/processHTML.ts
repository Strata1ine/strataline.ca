import clsx from "clsx";

// NOTE: helper utilities to process MDX easily

export function appendAttrElements(e: NodeListOf<Element>, a: string, customAttr: string) {
  e.forEach((item, _) => {
    const attr = item.getAttribute(a);
    if (a == "class") {
      item.setAttribute(a, clsx((attr != null) ? attr : '', customAttr));
    } else {
      item.setAttribute(a, (`${(attr != null) ? attr : ''} ${customAttr}`).trim());
    }
  });
}

export function setAttrElements(e: NodeListOf<Element>, a: string, customAttr: string) {
  e.forEach((item, _) => {
    if (a == "class") {
      item.setAttribute(a, clsx(customAttr));
    } else {
      item.setAttribute(a, (`${customAttr}`).trim());
    }
  });
}

export function appendAttrElementsIf(e: NodeListOf<Element>, a: string, customAttr: string,
  condition: (item: Element, i: number) => boolean,
) {
  e.forEach((item, i) => {
    if (condition(item, i)) {
      const attr = item.getAttribute(a);
      if (a == "class") {
        item.setAttribute(a, clsx((attr != null) ? attr : '', customAttr));
      } else {
        item.setAttribute(a, (`${(attr != null) ? attr : ''} ${customAttr}`).trim());
      }
    }
  });
}

export function setAttrElementsIf(e: NodeListOf<Element>, a: string, customAttr: string,
  condition: (item: Element, i: number) => boolean,
) {
  e.forEach((item, i) => {
    if (condition(item, i)) {
      if (a == "class") {
        item.setAttribute(a, clsx(customAttr));
      } else {
        item.setAttribute(a, customAttr);
      }
    }
  });
}

export function flexImages(images: NodeListOf<Element>) {
  appendAttrElements(
    images,
    "class",
    `object-cover h-full ${images.length > 1 ? 'min-w-0 hover:flex-5 flex-1' : ''}`,
  );

  if (images.length > 1) {
    appendAttrElements(
      images,
      "data-safari-bad",
      `transition-[flex-grow] duration-800`,
    );
  }
}
