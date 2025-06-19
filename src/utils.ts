import type {
  ElementOrSelector,
  AnimationScope,
  SelectorCache,
  WithQuerySelectorAll,
} from "./types";

export function resolveElements(
  elementOrSelector: ElementOrSelector,
  scope?: AnimationScope,
  selectorCache?: SelectorCache,
): Element[] {
  if (elementOrSelector instanceof EventTarget) {
    return [elementOrSelector];
  }

  if (typeof elementOrSelector === "string") {
    let root: WithQuerySelectorAll = document;

    if (scope) {
      root = scope.current;
    }

    const elements =
      selectorCache?.[elementOrSelector] ??
      root.querySelectorAll(elementOrSelector);

    return elements ? Array.from(elements) : [];
  }

  return Array.from(elementOrSelector);
}

/**
 * Creates a span element with specified class and optional index attribute
 */
export function createSpan(className: string, index?: number) {
  const span = document.createElement("span");
  if (className) span.className = className;
  if (index !== undefined) span.dataset.index = index.toString();
  span.style.display = "inline-block";
  return span;
}

/**
 * Checks if an element contains only text content (no child elements)
 */
export function isTextOnlyElement(element: Element): boolean {
  return Array.from(element.childNodes).every(
    (node) => node.nodeType === Node.TEXT_NODE,
  );
}

/**
 * Recursively finds all elements that contain text and should be split
 */
export function findTextElements(container: Element): Element[] {
  const textElements: Element[] = [];

  // Find all leaf elements that contain only text
  function traverse(element: Element) {
    if (isTextOnlyElement(element) && element.textContent?.trim()) {
      textElements.push(element);
    } else {
      // Traverse children
      Array.from(element.children).forEach((child) => traverse(child));
    }
  }

  traverse(container);

  return textElements;
}
