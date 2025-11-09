import type { Acceptor, PathInfo, PathInfoBuilder } from "./types.js";

const PathInfoBuilderImpl: PathInfoBuilder = {
  buildByAcceptors: (
    path: PathInfo[],
    finalAcceptors: Acceptor[],
    i: number,
  ): PathInfo[] => {
    const infos = finalAcceptors.map((acceptor) => {
      const p = i - acceptor.strOffset + 1;
      const _info = path[p];
      let j: number;

      const info: PathInfo = {
        p: p,
        mw: _info.mw + (acceptor.mw === undefined ? 0 : acceptor.mw),
        w: acceptor.w + _info.w,
        unk: (acceptor.unk ? acceptor.unk : 0) + _info.unk,
        type: acceptor.type,
      };

      if (acceptor.type === "PART") {
        for (j = p + 1; j <= i; j++) {
          path[j].merge = p;
        }
        info.merge = p;
      }

      return info;
    });
    return infos.filter((info): info is PathInfo => info !== null);
  },

  fallback: (
    path: PathInfo[],
    leftBoundary: number,
    text: string,
    i: number,
  ): PathInfo => {
    const _info = path[leftBoundary];
    if (text[i].match(/[\u0E48-\u0E4E]/)) {
      let newLeftBoundary = leftBoundary;
      if (leftBoundary !== 0) {
        newLeftBoundary = path[leftBoundary].p ?? 0;
      }
      return {
        p: newLeftBoundary,
        mw: 0,
        w: 1 + _info.w,
        unk: 1 + _info.unk,
        type: "UNK",
      };
    } else {
      return {
        p: leftBoundary,
        mw: _info.mw,
        w: 1 + _info.w,
        unk: 1 + _info.unk,
        type: "UNK",
      };
    }
  },

  build: function (
    path: PathInfo[],
    finalAcceptors: Acceptor[],
    i: number,
    leftBoundary: number,
    text: string,
  ): PathInfo[] {
    const basicPathInfos = this.buildByAcceptors(path, finalAcceptors, i);
    if (basicPathInfos.length > 0) {
      return basicPathInfos;
    } else {
      return [this.fallback(path, leftBoundary, text, i)];
    }
  },
};

export default (): PathInfoBuilder => Object.assign({}, PathInfoBuilderImpl);
