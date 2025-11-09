var WordcutCore = {
  buildPath: function (text) {
    var path = this.pathSelector.createPath(),
      leftBoundary = 0;
    var i, ch, possiblePathInfos, selectedPath;
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

  pathToRanges: (path) => {
    var e = path.length - 1,
      ranges = [];
    var info, s, r;

    while (e > 0) {
      info = path[e];
      s = info.p;

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

  rangesToText: (text, ranges, delimiter) =>
    ranges.map((r) => text.substring(r.s, r.e)).join(delimiter),

  cut: function (text, delimiter) {
    var path = this.buildPath(text),
      ranges = this.pathToRanges(path);
    return this.rangesToText(
      text,
      ranges,
      delimiter === undefined ? "|" : delimiter,
    );
  },

  cutIntoRanges: function (text, noText) {
    var path = this.buildPath(text),
      ranges = this.pathToRanges(path);

    if (!noText) {
      ranges.forEach((r) => {
        r.text = text.substring(r.s, r.e);
      });
    }
    return ranges;
  },
};

module.exports = WordcutCore;
