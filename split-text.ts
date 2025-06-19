import { resolveElements } from "motion-dom";
import { invariant } from "motion-utils";

interface SplitTextOptions {
  splitBy?: string;
  charClass?: string;
  wordClass?: string;
  lineClass?: string;
}

/**
 * Creates a span element with specified class and optional index attribute
 */
function createSpan(className: string, index?: number) {
  const span = document.createElement("span");
  if (className) span.className = className;
  if (index !== undefined) span.dataset.index = index.toString();
  span.style.display = "inline-block";
  return span;
}

/**
 * Splits text content of an element into characters, words, and lines.
 *
 * @param elementOrSelector - The element or selector of the element to split. If multiple elements are found, only the first will be split.
 * @param options - Options.
 * @returns An object with the chars, words, and lines DOM nodes as lists.
 */
function splitText(
  elementOrSelector: HTMLElement | string,
  {
    splitBy = " ",
    wordClass = "split-word",
    lineClass = "split-line",
    charClass = "split-char",
  }: SplitTextOptions = {},
) {
  // Resolve the element
  const [element] = resolveElements(elementOrSelector);

  invariant(Boolean(element), "Element not found");

  const text = element?.textContent || "";

  if (!element) {
    throw new Error("Element not found");
  }

  element.setAttribute("aria-label", text);

  // Create a document fragment to minimize DOM operations
  const fragment = document.createDocumentFragment();

  // Track split elements
  const splitElements = {
    chars: [] as HTMLElement[],
    words: [] as HTMLElement[],
    lines: [] as HTMLElement[],
  };

  // Split text into words
  const words = text.split(splitBy);
  const wordElements: HTMLElement[] = [];
  const spacerElements: Node[] = [];

  // First pass: Create word and character elements
  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    const word = words[wordIndex];

    if (!word) {
      continue;
    }

    const wordSpan = createSpan(wordClass, wordIndex);

    splitElements.words.push(wordSpan);
    wordElements.push(wordSpan);

    // Add characters to the word
    for (const [charIndex, char] of Array.from(word).entries()) {
      const charSpan = createSpan(charClass, charIndex);
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
      splitElements.chars.push(charSpan);
    }

    // Add the word to the fragment
    fragment.appendChild(wordSpan);

    // Add delimiter if not the last word
    if (wordIndex < words.length - 1) {
      if (splitBy === " ") {
        const spaceNode = document.createTextNode(" ");
        fragment.appendChild(spaceNode);
        spacerElements.push(spaceNode);
      } else {
        const delimiterSpan = createSpan(`${charClass}-delimiter`);
        delimiterSpan.textContent = splitBy;
        wordSpan.appendChild(delimiterSpan);
        splitElements.chars.push(delimiterSpan);
      }
    }
  }

  // Temporarily add the fragment to the DOM to measure positions
  element.textContent = "";
  element.appendChild(fragment);

  // Measure word positions
  const wordData = wordElements.map((wordSpan, index) => ({
    element: wordSpan,
    top: wordSpan.offsetTop,
    index,
    spacer: index < spacerElements.length ? spacerElements[index] : null,
  }));

  // Group words into lines based on top offset
  const lines: { elements: Node[]; lineIndex: number }[] = [];

  let currentLine: Node[] = [];
  let currentTop = wordData[0]?.top ?? 0;
  let lineIndex = 0;

  for (const { element, top, spacer } of wordData) {
    // Check if word starts a new line
    if (top > currentTop && currentLine.length > 0) {
      lines.push({ elements: currentLine, lineIndex: lineIndex++ });
      currentLine = [];
      currentTop = top;
    }

    currentLine.push(element);

    if (spacer) currentLine.push(spacer);
  }

  // Add the last line
  if (currentLine.length > 0) {
    lines.push({ elements: currentLine, lineIndex });
  }

  // Create the final structure with lines
  const finalFragment = document.createDocumentFragment();

  for (const { elements, lineIndex } of lines) {
    const lineSpan = createSpan(lineClass, lineIndex);

    splitElements.lines.push(lineSpan);

    for (const node of elements) {
      lineSpan.appendChild(node);
    }

    finalFragment.appendChild(lineSpan);
  }

  // Replace content with the final structure
  element.textContent = "";
  element.appendChild(finalFragment);

  return splitElements;
}

export { splitText };
