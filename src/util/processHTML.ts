import clsx from "clsx";

export function appendAttrElements(e: NodeListOf<Element>, a: string, customAttr: string) {
  e.forEach((item, _) => {
    if (a == "class") {
      item.setAttribute(a, clsx(item.getAttribute(a), customAttr));
    } else {
      item.setAttribute(a, `${item.getAttribute(a)} ${customAttr}`);
    }
  });
}

export function appendAttrElementsIf(e: NodeListOf<Element>, a: string, customAttr: string,
  condition: (item: Element, i: number) => boolean,
) {
  e.forEach((item, i) => {
    if (condition(item, i)) {
      if (a == "class") {
        item.setAttribute(a, clsx(item.getAttribute(a), customAttr));
      } else {
        item.setAttribute(a, `${item.getAttribute(a)} ${customAttr}`);
      }
    }
  });
}
