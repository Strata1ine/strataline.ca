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

// I am great at naming things
export function minmaxBloat(images: NodeListOf<Element>, i: number) {
  setAttrElementsIf(
    images,
    "fetchpriority",
    "high",
    (_: Element, i: number) => i == 0,
  );

  setAttrElementsIf(
    images,
    "fetchpriority",
    "low",
    (_: Element, i: number) => i != 0,
  );
}
