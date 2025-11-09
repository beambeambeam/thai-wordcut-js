import type { Acceptor, AcceptorTagMap, Rule } from "./types.js";

function isMatch(pat: string, offset: number, ch: string): boolean {
  if (pat.length <= offset) return false;
  const _ch = pat[offset];
  return (
    _ch === ch ||
    (_ch.match(/[กข]/) !== null && ch.match(/[ก-ฮ]/) !== null) ||
    (_ch.match(/[มบ]/) !== null && ch.match(/[ก-ฮ]/) !== null) ||
    (_ch.match(/\u0E49/) !== null && ch.match(/[\u0E48-\u0E4B]/) !== null)
  );
}

const Rule0: Rule = {
  pat: "เหก็ม",
  createAcceptor: (_tag: AcceptorTagMap): Acceptor => ({
    strOffset: 0,
    isFinal: false,
    transit: function (ch: string): Acceptor {
      if (Rule0.pat && isMatch(Rule0.pat, this.strOffset, ch)) {
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

const PartRule: Rule = {
  createAcceptor: (_tag: AcceptorTagMap): Acceptor => ({
    strOffset: 0,
    patterns: ["แก", "เก", "ก้", "กก์", "กา", "กี", "กิ", "กืก"],
    isFinal: false,
    transit: function (ch: string): Acceptor {
      const offset = this.strOffset;
      let len: number;
      if (this.patterns) {
        this.patterns = this.patterns.filter((pat) => isMatch(pat, offset, ch));

        if (this.patterns.length > 0) {
          len = 1 + offset;
          this.isFinal = this.patterns.some((pat) => pat.length === len);
          this.strOffset++;
        } else {
          this.isError = true;
        }
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

export const ThaiRules: Rule[] = [Rule0, PartRule];

export default ThaiRules;
