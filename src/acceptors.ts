import type { Acceptor, Acceptors, Rule } from "./types.js";

const AcceptorsImpl: Acceptors = {
  creators: [],
  current: [],
  tag: {},

  init: function (): void {
    this.creators = [];
    this.current = [];
    this.tag = {};
  },

  reset: function (): void {
    this.current = [];
    this.tag = {};
  },

  transit: function (ch: string): void {
    let i: number;
    let _acceptor: Acceptor;
    let acceptor: Acceptor | null;

    this.creators.forEach((creator: Rule) => {
      acceptor = creator.createAcceptor(this.tag);
      if (acceptor) {
        this.current.push(acceptor);
      }
    });

    const _current: Acceptor[] = [];
    this.tag = {};

    for (i = 0; i < this.current.length; i++) {
      _acceptor = this.current[i];
      acceptor = _acceptor.transit(ch);

      if (!acceptor.isError) {
        _current.push(acceptor);
        if (!this.tag[acceptor.tag]) {
          this.tag[acceptor.tag] = acceptor;
        } else {
          this.tag[acceptor.tag] = acceptor;
        }
      }
    }
    this.current = _current;
  },

  getFinalAcceptors: function (): Acceptor[] {
    return this.current.filter((acceptor) => acceptor.isFinal);
  },
};

export default (): Acceptors => {
  const acceptors: Acceptors = Object.assign({}, AcceptorsImpl);
  acceptors.init();
  return acceptors;
};
