export type PathType =
  | "UNK"
  | "INIT"
  | "PART"
  | "DICT"
  | "WORD_RULE"
  | "SPACE_RULE"
  | "SINSYM"
  | "THAI_RULE";

export type AcceptorTag =
  | "WORD_RULE"
  | "SPACE_RULE"
  | "SINSYM"
  | "THAI_RULE"
  | "PART"
  | "DICT";

export interface WordcutDict {
  dict: readonly string[];
  init: (dictPath?: string) => void;
  dictSeek: (
    l: number | null,
    r: number | null,
    ch: string,
    strOffset: number,
    pos: 0 | 1,
  ) => number | null;
  isFinal: (acceptor: Acceptor) => boolean;
  createAcceptor: () => Acceptor;
  transit: (acceptor: Acceptor, ch: string) => Acceptor;
}

export interface Acceptor {
  strOffset: number;
  isFinal: boolean;
  isError: boolean;
  tag: AcceptorTag;
  type: PathType;
  w: number;
  unk?: number;
  mw?: number;
  transit: (ch: string) => Acceptor;
  l?: number;
  r?: number;
  dict?: WordcutDict;
  patterns?: string[];
  merge?: number;
}

export interface PathInfo {
  p: number | null;
  w: number;
  unk: number;
  type: PathType;
  mw: number;
  merge?: number;
}

export interface Range {
  s: number;
  e: number;
  text?: string;
}

export interface AcceptorTagMap {
  [key: string]: Acceptor;
}

export interface Rule {
  createAcceptor: (tag: AcceptorTagMap) => Acceptor | null;
  tag?: AcceptorTag;
  pat?: string;
}

export interface PathInfoBuilder {
  buildByAcceptors: (
    path: PathInfo[],
    finalAcceptors: Acceptor[],
    i: number,
  ) => PathInfo[];
  fallback: (
    path: PathInfo[],
    leftBoundary: number,
    text: string,
    i: number,
  ) => PathInfo;
  build: (
    path: PathInfo[],
    finalAcceptors: Acceptor[],
    i: number,
    leftBoundary: number,
    text: string,
  ) => PathInfo[];
}

export interface PathSelector {
  selectPath: (paths: PathInfo[]) => PathInfo;
  createPath: () => PathInfo[];
}

export interface Acceptors {
  creators: Rule[];
  current: Acceptor[];
  tag: AcceptorTagMap;
  init: () => void;
  reset: () => void;
  transit: (ch: string) => void;
  getFinalAcceptors: () => Acceptor[];
}

export interface WordcutCore {
  pathInfoBuilder: PathInfoBuilder;
  pathSelector: PathSelector;
  acceptors: Acceptors;
  buildPath: (text: string) => PathInfo[];
  pathToRanges: (path: PathInfo[]) => Range[];
  rangesToText: (text: string, ranges: Range[], delimiter: string) => string;
  cut: (text: string, delimiter?: string) => string;
  cutIntoRanges: (text: string, noText?: boolean) => Range[];
}

export const LEFT = 0 as const;
export const RIGHT = 1 as const;
