import type { SplitTextOptions } from "./types";
import { createSpan, findTextElements, resolveElements } from "./utils";

/**
 * Splits text content of a single element into characters, words, and lines.
 */
export function splitter(
  element: Element,
  {
    splitBy = " ",
    classNames = {},
    inline,
  }: Omit<SplitTextOptions, "recursive"> = {},
) {
  // Use classNames with defaults if properties are not provided
  const wordClass = classNames.word ?? "split-word";
  const lineClass = classNames.line ?? "split-line";
  const charClass = classNames.char ?? "split-char";

  const text = element?.textContent || "";

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

    const wordSpan = createSpan(wordClass, wordIndex, inline);

    splitElements.words.push(wordSpan);
    wordElements.push(wordSpan);

    // Add characters to the word
    for (const [charIndex, char] of Array.from(word).entries()) {
      const charSpan = createSpan(charClass, charIndex, inline);
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
        const delimiterSpan = createSpan(`${charClass}-delimiter`, undefined, inline);
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
    const lineSpan = createSpan(lineClass, lineIndex, inline);

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
