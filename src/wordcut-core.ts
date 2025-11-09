import type { PathInfo, Range, WordcutCore } from "./types.js";

export const WordcutCoreImpl = {
  buildPath: function (this: WordcutCore, text: string): PathInfo[] {
    const path = this.pathSelector.createPath();
    let leftBoundary = 0;
    let i: number;
    let ch: string;
    let possiblePathInfos: PathInfo[];
    let selectedPath: PathInfo;

    this.acceptors.reset();

    for (i = 0; i < text.length; i++) {
      ch = text[i];
      this.acceptors.transit(ch);

      possiblePathInfos = this.pathInfoBuilder.build(
        path,
        this.acceptors.getFinalAcceptors(),
        i,
        leftBoundary,
        text,
      );
      selectedPath = this.pathSelector.selectPath(possiblePathInfos);

      path.push(selectedPath);
      if (selectedPath.type !== "UNK") {
        leftBoundary = i;
      }
    }
    return path;
  },

  pathToRanges: (path: PathInfo[]): Range[] => {
    let e = path.length - 1;
    const ranges: Range[] = [];
    let info: PathInfo;
    let s: number;
    let r: Range;

    while (e > 0) {
      info = path[e];
      s = info.p ?? 0;

      if (info.merge !== undefined && ranges.length > 0) {
        r = ranges[ranges.length - 1];
        r.s = info.merge;
        s = r.s;
      } else {
        ranges.push({ s: s, e: e });
      }
      e = s;
    }
    return ranges.reverse();
  },

  rangesToText: (text: string, ranges: Range[], delimiter: string): string =>
    ranges.map((r) => text.substring(r.s, r.e)).join(delimiter),

  cut: function (this: WordcutCore, text: string, delimiter?: string): string {
    const path = this.buildPath(text);
    const ranges = this.pathToRanges(path);
    return this.rangesToText(
      text,
      ranges,
      delimiter === undefined ? "|" : delimiter,
    );
  },

  cutIntoRanges: function (
    this: WordcutCore,
    text: string,
    noText?: boolean,
  ): Range[] {
    const path = this.buildPath(text);
    const ranges = this.pathToRanges(path);

    if (!noText) {
      ranges.forEach((r) => {
        r.text = text.substring(r.s, r.e);
      });
    }
    return ranges;
  },
};
