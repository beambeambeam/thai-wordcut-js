var WordcutDict = require("./dict"),
  WordcutCore = require("./wordcut-core"),
  PathInfoBuilder = require("./path-info-builder"),
  PathSelector = require("./path-selector"),
  Acceptors = require("./acceptors"),
  latinRules = require("./latin-rules"),
  thaiRules = require("./thai-rules");

var Wordcut = Object.create(WordcutCore);
Wordcut.defaultPathInfoBuilder = PathInfoBuilder;
Wordcut.defaultPathSelector = PathSelector;
Wordcut.defaultAcceptors = Acceptors;
Wordcut.defaultLatinRules = latinRules;
Wordcut.defaultThaiRules = thaiRules;
Wordcut.defaultDict = WordcutDict;

Wordcut.initNoDict = function (_dict_path) {
  this.pathInfoBuilder = this.defaultPathInfoBuilder();
  this.pathSelector = this.defaultPathSelector();
  this.acceptors = this.defaultAcceptors();
  this.defaultLatinRules.forEach((rule) => {
    this.acceptors.creators.push(rule);
  });
  this.defaultThaiRules.forEach((rule) => {
    this.acceptors.creators.push(rule);
  });
};

Wordcut.init = function (dict_path) {
  this.initNoDict();
  var dict = Object.assign({}, this.defaultDict);
  dict.init(dict_path);
  this.acceptors.creators.push(dict);
};

module.exports = Wordcut;
