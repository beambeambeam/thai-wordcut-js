function isMatch(pat, offset, ch) {
  if (pat.length <= offset) return false;
  var _ch = pat[offset];
  return (
    _ch === ch ||
    (_ch.match(/[กข]/) && ch.match(/[ก-ฮ]/)) ||
    (_ch.match(/[มบ]/) && ch.match(/[ก-ฮ]/)) ||
    (_ch.match(/\u0E49/) && ch.match(/[\u0E48-\u0E4B]/))
  );
}

var Rule0 = {
  pat: "เหก็ม",
  createAcceptor: (_tag) => ({
    strOffset: 0,
    isFinal: false,
    transit: function (ch) {
      if (isMatch(Rule0.pat, this.strOffset, ch)) {
        this.isFinal = this.strOffset + 1 === Rule0.pat.length;
        this.strOffset++;
      } else {
        this.isError = true;
      }
      return this;
    },
    isError: false,
    tag: "THAI_RULE",
    type: "THAI_RULE",
    w: 1,
  }),
};

var PartRule = {
  createAcceptor: (_tag) => ({
    strOffset: 0,
    patterns: ["แก", "เก", "ก้", "กก์", "กา", "กี", "กิ", "กืก"],
    isFinal: false,
    transit: function (ch) {
      var offset = this.strOffset;
      var len;
      this.patterns = this.patterns.filter((pat) => isMatch(pat, offset, ch));

      if (this.patterns.length > 0) {
        len = 1 + offset;
        this.isFinal = this.patterns.some((pat) => pat.length === len);
        this.strOffset++;
      } else {
        this.isError = true;
      }
      return this;
    },
    isError: false,
    tag: "PART",
    type: "PART",
    unk: 1,
    w: 1,
  }),
};

var ThaiRules = [Rule0, PartRule];

module.exports = ThaiRules;
