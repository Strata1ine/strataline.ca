import clsx from "clsx";

// NOTE: common utilities to process MDX easily

export function appendAttrElements(e: NodeListOf<Element>, a: string, customAttr: string, swap: string | null = null) {
  e.forEach(item => {
    const attr = item.getAttribute(a);
    if (a === "class") {
      let classes = attr ? attr.split(' ') : [];
      if (swap && classes.includes(swap)) {
        classes = classes.filter(cls => cls !== swap);
      }

      item.setAttribute(a, clsx(classes, customAttr));
    } else {
      let newValue = attr || '';
      if (swap && newValue.includes(swap)) {
        newValue = newValue.replace(swap, '').trim();
      }

      item.setAttribute(a, `${newValue} ${customAttr}`.trim());
    }
  });
}

export function deleteAttrElements(e: NodeListOf<Element>, a: string[]) {
  e.forEach((item, _) => {
    a.forEach((s) => {
      item.removeAttribute(s);
    })
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

export function processElements(
  elements: NodeListOf<Element>,
  callback: (element: Element, index: number) => void
): void {
  if (!elements || elements.length === 0) return;

  Array.from(elements).forEach((element, index) => {
    if (element) {
      callback(element, index);
    }
  });
}

export function flexImages(images: NodeListOf<Element>) {
  appendAttrElements(
    images,
    "class",
    `object-cover h-full select-none ${images.length > 1 ? 'min-w-0 hover:flex-5 flex-1' : ''}`,
  );

  if (images.length > 1) {
    appendAttrElements(
      images,
      "data-safari-bad",
      `duration-800`,
    );
  }
}
