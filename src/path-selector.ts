import type { PathInfo, PathSelector } from "./types.js";

const PathSelectorImpl: PathSelector = {
  selectPath: (paths: PathInfo[]): PathInfo => {
    const path = paths.reduce((selectedPath: PathInfo | null, path) => {
      if (selectedPath === null) {
        return path;
      } else {
        if (path.unk < selectedPath.unk) return path;
        if (path.unk === selectedPath.unk) {
          if (path.mw < selectedPath.mw) return path;
          if (path.mw === selectedPath.mw) {
            if (path.w < selectedPath.w) return path;
          }
        }
        return selectedPath;
      }
    }, null);
    if (path === null) {
      throw new Error("No path selected");
    }
    return path;
  },

  createPath: (): PathInfo[] => [
    { p: null, w: 0, unk: 0, type: "INIT", mw: 0 },
  ],
};

export default (): PathSelector => Object.assign({}, PathSelectorImpl);
