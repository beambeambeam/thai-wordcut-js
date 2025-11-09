# thai-wordcut-js

Thai word breaker/segmentation library for Node.js

ใช้สำหรับตัดแบ่งคำในภาษาไทยจากประโยคเป็นคำๆ

## Installation

```bash
npm install thai-wordcut-js
# or
pnpm add thai-wordcut-js
# or
yarn add thai-wordcut-js
```

## Requirements

- Node.js >= 20.0.0

## Usage

### Basic Usage

```javascript
import Wordcut from "thai-wordcut-js";

const wordcut = Object.create(Wordcut);
wordcut.init();

const result = wordcut.cut("สวัสดีครับ");
console.log(result); // สวัสดี|ครับ
```

### Without Dictionary

If you want to use the library without a dictionary (using only rules):

```javascript
import Wordcut from "thai-wordcut-js";

const wordcut = Object.create(Wordcut);
wordcut.initNoDict();

const result = wordcut.cut("กากา");
console.log(result); // กา|กา
```

### Custom Delimiter

You can specify a custom delimiter for word separation:

```javascript
const result = wordcut.cut("สวัสดีครับ", " ");
console.log(result); // สวัสดี ครับ
```

### Get Word Ranges

To get word ranges with positions instead of delimited text:

```javascript
const ranges = wordcut.cutIntoRanges("สวัสดีครับ");
// Returns: [{ s: 0, e: 6, text: 'สวัสดี' }, { s: 6, e: 10, text: 'ครับ' }]

// Without text property:
const rangesOnly = wordcut.cutIntoRanges("สวัสดีครับ", true);
// Returns: [{ s: 0, e: 6 }, { s: 6, e: 10 }]
```

## API Reference

### `Wordcut.init(dict_path?: string)`

Initializes the wordcut instance with dictionary support.

- `dict_path` (optional): Path to dictionary file. If not provided, uses default dictionary.

### `Wordcut.initNoDict(_dict_path?: string)`

Initializes the wordcut instance without dictionary, using only rules.

- `_dict_path` (optional): Ignored parameter for API compatibility.

### `Wordcut.cut(text: string, delimiter?: string): string`

Cuts Thai text into words separated by a delimiter.

- `text`: The Thai text to segment
- `delimiter` (optional): Delimiter to use between words. Defaults to `'|'`
- Returns: String with words separated by delimiter

### `Wordcut.cutIntoRanges(text: string, noText?: boolean): Range[]`

Cuts Thai text and returns word ranges with positions.

- `text`: The Thai text to segment
- `noText` (optional): If `true`, excludes `text` property from ranges
- Returns: Array of `Range` objects with `s` (start), `e` (end), and optionally `text` properties

### `Wordcut.buildPath(text: string): PathInfo[]`

Builds the path information for text segmentation (internal method).

### `Wordcut.pathToRanges(path: PathInfo[]): Range[]`

Converts path information to ranges (internal method).

### `Wordcut.rangesToText(text: string, ranges: Range[], delimiter: string): string`

Converts ranges back to delimited text (internal method).

## Acknowledgments

This project is a TypeScript fork of the original [wordcut](https://github.com/veer66/wordcut) library by [veer66](https://github.com/veer66).

We also acknowledge [pureexe/thai-wordcut-js](https://github.com/pureexe/thai-wordcut-js), another fork that inspired this TypeScript implementation.
