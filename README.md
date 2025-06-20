# @kojodesign/split-text

A lightweight library for splitting text into individual characters, words, and lines for animations and styling.

## Features

- Split text into characters, words, and lines
- Preserve HTML structure with recursive splitting
- Customizable CSS classes
- TypeScript support
- Zero dependencies

## Installation

```bash
pnpm install
```

## Usage

### Basic Text Splitting

```javascript
import { splitText } from "@kojodesign/split-text";

// Split a single element's text content
const result = splitText("#my-element");

// Access the split elements
result.chars.forEach((char) => {
  // Animate individual characters
});

result.words.forEach((word) => {
  // Animate individual words
});

result.lines.forEach((line) => {
  // Animate individual lines
});
```

### Recursive Text Splitting

Perfect for preserving HTML structure while splitting text in nested elements:

```html
<div id="container">
  <h1>Main Title</h1>
  <p>First paragraph with some text</p>
  <p>Second paragraph with more text</p>
  <span>Some span text</span>
</div>
```

```javascript
// Split text in all nested elements while preserving structure
const result = splitText("#container", { recursive: true });

// The HTML structure is preserved:
// - <h1>, <p>, and <span> elements remain
// - Each element's text is split into spans
// - All split elements are aggregated in the result
```

### Options

```javascript
splitText("#element", {
  splitBy: " ", // Character to split words by (default: ' ')
  classNames: {
    word: "word", // CSS class for word spans (default: 'split-word')
    char: "char", // CSS class for character spans (default: 'split-char')
    line: "line", // CSS class for line spans (default: 'split-line')
  },
  recursive: false, // Split text in nested elements (default: false)
  filter: (element) => boolean, // Filter function for recursive mode (default: undefined)
  inline: false, // Use 'inline' instead of 'inline-block' for display style (default: false)
});
```

#### Filter Option

When using `recursive: true`, you can use the `filter` option to selectively process elements:

```javascript
// Only process paragraphs
splitText("#container", {
  recursive: true,
  filter: (element) => element.tagName.toLowerCase() === "p"
});

// Skip elements with a specific class
splitText("#container", {
  recursive: true,
  filter: (element) => !element.classList.contains("no-split")
});

// Only process elements with a specific data attribute
splitText("#container", {
  recursive: true,
  filter: (element) => element.hasAttribute("data-split")
});
```

#### Display Style

By default, all split elements use `display: inline-block`. You can change this to `display: inline` with the `inline` option:

```javascript
// Use inline display style
splitText("#element", {
  inline: true
});
```

## Examples

### Animation with GSAP

```javascript
import { splitText } from "@kojodesign/split-text";
import { gsap } from "gsap";

// Split text and animate characters
const { chars } = splitText("#animated-text", {
  classNames: {
    char: "animated-char"
  }
});

gsap.from(chars, {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: 0.02,
});
```

### Recursive Animation

```javascript
// Animate all paragraphs in a container
const { words } = splitText("#article", { 
  recursive: true,
  classNames: {
    word: "animated-word"
  }
});

gsap.from(words, {
  opacity: 0,
  y: 10,
  duration: 0.3,
  stagger: 0.01,
});
```

## Development

To run tests:

```bash
pnpm test
``