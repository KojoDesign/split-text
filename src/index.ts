import { splitter } from "./splitter";
import type { SplitTextOptions } from "./types";
import { findTextElements, resolveElements } from "./utils";

/**
 * Splits text content of an element into characters, words, and lines.
 *
 * @param elementOrSelector - The element or selector of the element to split. If multiple elements are found, only the first will be split.
 * @param options - Options.
 * @param options.splitBy - The string to split by. Default is space.
 * @param options.classNames - Object containing class names for different elements.
 * @param options.classNames.word - The class to apply to word elements. Default is "split-word".
 * @param options.classNames.line - The class to apply to line elements. Default is "split-line".
 * @param options.classNames.char - The class to apply to character elements. Default is "split-char".
 * @param options.recursive - Whether to recursively split text in child elements. Default is false.
 * @param options.filter - Optional callback function that accepts an HTML node and returns a boolean.
 *                         When recursive=true, only elements that pass this filter will be processed.
 *                         Return true to process the element, false to skip it.
 * @param options.inline - Whether to use 'inline' instead of 'inline-block' for display style. Default is false.
 * @returns An object with the chars, words, and lines DOM nodes as lists.
 */
export function splitText(
  elementOrSelector: HTMLElement | string,
  {
    splitBy = " ",
    classNames = {},
    recursive = false,
    filter,
    inline,
  }: SplitTextOptions = {},
) {
  // Resolve the element
  const [element] = resolveElements(elementOrSelector);

  if (!element) {
    throw new Error("Element not found");
  }

  if (!recursive) {
    // Original behavior - split the entire element's text content
    return splitter(element, {
      splitBy,
      classNames,
      inline,
    });
  }

  // Recursive behavior - find and split text-containing elements while preserving structure
  const textElements = findTextElements(element, filter);

  // Aggregate results from all split elements
  const aggregatedResults = {
    chars: [] as HTMLElement[],
    words: [] as HTMLElement[],
    lines: [] as HTMLElement[],
  };

  for (const textElement of textElements) {
    const result = splitter(textElement, {
      splitBy,
      classNames,
      inline,
    });

    aggregatedResults.chars.push(...result.chars);
    aggregatedResults.words.push(...result.words);
    aggregatedResults.lines.push(...result.lines);
  }

  return aggregatedResults;
}
