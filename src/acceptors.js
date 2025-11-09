var Acceptors = {
  creators: null,
  current: null,
  tag: null,

  init: function () {
    this.creators = [];
    this.current = [];
    this.tag = [];
  },

  reset: function () {
    this.current = [];
    this.tag = {};
  },

  transit: function (ch) {
    var i, _acceptor, acceptor;
    this.creators.forEach((creator) => {
      acceptor = creator.createAcceptor(this.tag);
      if (acceptor) this.current.push(acceptor);
    });

    var _current = [];
    this.tag = {};

    for (i = 0; i < this.current.length; i++) {
      _acceptor = this.current[i];
      acceptor = _acceptor.transit(ch);

      if (!acceptor.isError) {
        _current.push(acceptor);
        if (!this.tag[acceptor.tag]) this.tag[acceptor.tag] = [];
        this.tag[acceptor.tag] = acceptor;
      }
    }
    this.current = _current;
  },

  getFinalAcceptors: function () {
    return this.current.filter((acceptor) => acceptor.isFinal);
  },
};

module.exports = () => {
  var acceptors = Object.assign({}, Acceptors);
  acceptors.init();
  return acceptors;
};
