import createAcceptors from "./acceptors.js";
import WordcutDictImpl from "./dict.js";
import { LatinRules } from "./latin-rules.js";
import createPathInfoBuilder from "./path-info-builder.js";
import createPathSelector from "./path-selector.js";
import { ThaiRules } from "./thai-rules.js";
import type {
  Acceptors,
  PathInfoBuilder,
  PathSelector,
  Rule,
  WordcutCore as WordcutCoreType,
  WordcutDict as WordcutDictType,
} from "./types.js";
import { WordcutCoreImpl } from "./wordcut-core.js";

export interface Wordcut extends WordcutCoreType {
  defaultPathInfoBuilder: () => PathInfoBuilder;
  defaultPathSelector: () => PathSelector;
  defaultAcceptors: () => Acceptors;
  defaultLatinRules: Rule[];
  defaultThaiRules: Rule[];
  defaultDict: WordcutDictType;
  initNoDict: (this: Wordcut, _dict_path?: string) => void;
  init: (this: Wordcut, dict_path?: string) => void;
}

export const Wordcut: Wordcut = Object.assign(Object.create(WordcutCoreImpl), {
  defaultPathInfoBuilder: createPathInfoBuilder,
  defaultPathSelector: createPathSelector,
  defaultAcceptors: createAcceptors,
  defaultLatinRules: LatinRules,
  defaultThaiRules: ThaiRules,
  defaultDict: WordcutDictImpl,

  initNoDict: function (this: Wordcut, _dict_path?: string): void {
    (this as Wordcut).pathInfoBuilder = this.defaultPathInfoBuilder();
    (this as Wordcut).pathSelector = this.defaultPathSelector();
    (this as Wordcut).acceptors = this.defaultAcceptors();
    this.defaultLatinRules.forEach((rule: Rule) => {
      (this as Wordcut).acceptors.creators.push(rule);
    });
    this.defaultThaiRules.forEach((rule: Rule) => {
      (this as Wordcut).acceptors.creators.push(rule);
    });
  },

  init: function (this: Wordcut, dict_path?: string): void {
    this.initNoDict();
    const dict: WordcutDictType = Object.assign({}, this.defaultDict);
    dict.init(dict_path);
    (this as Wordcut).acceptors.creators.push(dict);
  },
});

export default Wordcut;
