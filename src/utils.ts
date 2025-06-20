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
 * @param className - The class name to apply to the span
 * @param index - Optional index to set as a data attribute
 * @param inline - Whether to use 'inline' instead of 'inline-block' for display style
 * @returns The created span element
 */
export function createSpan(className: string, index?: number, inline?: boolean) {
  const span = document.createElement("span");
  if (className) span.className = className;
  if (index !== undefined) span.dataset.index = index.toString();
  span.style.display = inline ? "inline" : "inline-block";
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
 * @param container The container element to search within
 * @param filter Optional callback to filter elements (return true to include, false to exclude)
 * @returns Array of elements that should be split
 */
export function findTextElements(
  container: Element,
  filter?: (node: Element) => boolean
): Element[] {
  const textElements: Element[] = [];
  
  function traverse(element: Element) {
    // Check if element contains only text and has non-empty content
    if (isTextOnlyElement(element) && element.textContent?.trim()) {
      // Only add the element if it passes the filter (or if no filter is provided)
      if (!filter || filter(element)) {
        textElements.push(element);
      }
    } else { 
      // Recursively traverse child elements
      for (const child of Array.from(element.children)) {
        traverse(child);
      }
    }
  }

  traverse(container);

  return textElements;
}
