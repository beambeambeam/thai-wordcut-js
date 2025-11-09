import type { Acceptor, AcceptorTagMap, Rule } from "./types.js";

const WordRule: Rule = {
  createAcceptor: (tag: AcceptorTagMap): Acceptor | null => {
    if (tag.WORD_RULE) return null;

    return {
      strOffset: 0,
      isFinal: false,
      transit: function (ch: string): Acceptor {
        const lch = ch.toLowerCase();
        if (lch >= "a" && lch <= "z") {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      },
      isError: false,
      tag: "WORD_RULE",
      type: "WORD_RULE",
      w: 1,
    };
  },
};

const SpaceRule: Rule = {
  tag: "SPACE_RULE",
  createAcceptor: (tag: AcceptorTagMap): Acceptor | null => {
    if (tag.SPACE_RULE) return null;

    return {
      strOffset: 0,
      isFinal: false,
      transit: function (ch: string): Acceptor {
        if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n") {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      },
      isError: false,
      tag: "SPACE_RULE",
      w: 1,
      type: "SPACE_RULE",
    };
  },
};

const SingleSymbolRule: Rule = {
  tag: "SINSYM",
  createAcceptor: (_tag: AcceptorTagMap): Acceptor => ({
    strOffset: 0,
    isFinal: false,
    transit: function (ch: string): Acceptor {
      if (this.strOffset === 0 && ch.match(/^[()/-]$/)) {
        this.isFinal = true;
        this.strOffset++;
      } else {
        this.isError = true;
      }
      return this;
    },
    isError: false,
    tag: "SINSYM",
    w: 1,
    type: "SINSYM",
  }),
};

export const LatinRules: Rule[] = [WordRule, SpaceRule, SingleSymbolRule];

export default LatinRules;
