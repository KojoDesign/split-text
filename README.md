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
bun install
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
  wordClass: "word", // CSS class for word spans (default: 'split-word')
  charClass: "char", // CSS class for character spans (default: 'split-char')
  lineClass: "line", // CSS class for line spans (default: 'split-line')
  recursive: false, // Split text in nested elements (default: false)
});
```

## Examples

### Animation with GSAP

```javascript
import { splitText } from "@kojodesign/split-text";
import { gsap } from "gsap";

// Split text and animate characters
const { chars } = splitText("#animated-text");

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
const { words } = splitText("#article", { recursive: true });

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
bun test
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
