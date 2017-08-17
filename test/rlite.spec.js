(function (rlite) {
  describe('Rlite', function () {

    it('Does not put hash values in query', function () {
      const route = rlite(noop, {stuff: ({name}) => expect(name).toEqual('value')});

      route('stuff?name=value#baz');
    });

    it('Has empty params for parameterless routes', function () {
      const route = rlite(noop, {
        stuff: (params) => expect(Object.keys(params).length).toEqual(0)
      });

      route('stuff');
    });

    it('Returns the result of the route', function () {
      const route = rlite(noop, {
        hi: () => 'Hello bob',
        bye: () => 'Bye bob',
      });

      expect(route('hi')).toEqual('Hello bob');
      expect(route('bye')).toEqual('Bye bob');
    });

    it('It handles leading and trailing slashes and 404s', function () {
      const route = rlite(() => 'Nope!', {
        stuff: () => 'Yep!'
      });

      expect(route('/stuff/')).toEqual('Yep!');
      expect(route('stuff/')).toEqual('Yep!');
      expect(route('/stuff')).toEqual('Yep!');
      expect(route('stuff')).toEqual('Yep!');
      expect(route('nopes')).toEqual('Nope!');
    });

    it('It handles deep conflicting routes', function () {
      const route = rlite(() => '404', {
        'foo/:bar/baz': ({bar}) => `Hi, ${bar}`,
        'foo/:bar/:boo': ({bar, boo}) => `Bar=${bar}, Boo=${boo}`,
        'foo/bar/bing': () => 'BING',
      });

      expect(route('/foo/bar/baz/')).toEqual('Hi, bar');
      expect(route('/foo/x/y/')).toEqual('Bar=x, Boo=y');
      expect(route('/foo/bar/bing/')).toEqual('BING');
    });

    it('Handles route params', function() {
      const route = rlite(noop, {
        'hey/:name': ({name}) => expect(name).toEqual('chris')
      });

      route('hey/chris');
    });

    it('Handles different cases', function() {
      let count = 0;
      const route = rlite(noop, {
        'Hey/:name': ({name}) => {
          expect(name).toEqual('chris');
          ++count;
        },
        'hello/:firstName': ({firstName}) => {
          expect(firstName).toEqual('jane');
          ++count;
        },
        'hoi/:FirstName/:LastName': ({FirstName, LastName}) => {
          expect(FirstName).toEqual('Joe');
          expect(LastName).toEqual('Smith');
          ++count;
        }
      });

      route('hey/chris');
      route('hello/jane');
      route('hoi/Joe/Smith');
      expect(count).toBe(3);
    });

    it('Passes the argument and url through', function() {
      const route = rlite(noop, {
        'hey/:name': ({name}, arg, url) => {
          expect(arg).toEqual('Wut');
          expect(name).toEqual('You');
          expect(url).toEqual('hey/You');
        }
      });

      route('hey/You', 'Wut');
    });

    it('Matches root routes correctly', function() {
      const route = rlite(noop, {
        'hey/:name/new': () => {throw new Error('New called');},
        'hey/:name': ({name}) => expect(name).toEqual('chris'),
        'hey/:name/edit': () => {throw new Error('Edit called');},
      });

      route('hey/chris');
    });

    it('Understands specificity', function() {
      const route = rlite(noop, {
        'hey/joe': (_1, _2, url) => expect(url).toEqual('hey/joe'),
        'hey/:name': () => {throw new Error('Name called')},
        'hey/jane': (_1, _2, url) => expect(url).toEqual('hey/jane'),
      });

      route('hey/joe');
      route('hey/jane');
    });

    it('Handles complex routes', function() {
      const route = rlite(noop, {
        'hey/:name/new': () => {throw new Error('New called');},
        'hey/:name': () => {throw new Error('Name called');},
        'hey/:name/last/:last': () => ({name, last}) => {
          expect(name).toEqual('chris');
          expect(last).toEqual('davies');
        }
      });

      route('hey/chris/last/davies');
    });

    it('Overrides params with query string values', function() {
      const route = rlite(noop, {
        'hey/:name/new': () => {throw new Error('New called');},
        'hey/:name': () => {throw new Error('Name called');},
        'hey/:name/last/:last': function({name, last}) {
          expect(name).toEqual('ham');
          expect(last).toEqual('mayo');
          return name + ' ' + last;
        }
      });

      expect(route('hey/chris/last/davies?last=mayo&name=ham')).toEqual('ham mayo');
    });

    it('Handles not founds', function() {
      const route = rlite(() => '404', {
        'hey/:name': () => {throw new Error('Name called');}
      });

      expect(route('hey?hi=there')).toEqual('404');
    });

    it('Handles default urls', function() {
      const route = rlite(noop, {
        '': () => 'HOME'
      });

      expect(route('')).toEqual('HOME');
    });

    it('Handles multiple params in a row', function() {
      const route = rlite(noop, {
        'hey/:hello/:world': ({hello, world}) => {
          expect(hello).toEqual('a');
          expect(world).toEqual('b');
        }
      });

      route('hey/a/b');
    });

    it('Handles trailing slash with query', function() {
      const route = rlite(noop, {
        'hoi': ({there}) => {
          expect(there).toEqual('yup');
          return 'Yeppers';
        }
      });

      expect(route('hoi/?there=yup')).toEqual('Yeppers');
    });

    it('Handles leading slashes in defs', function() {
      const route = rlite(noop, {
        '/hoi': () => 'GOT IT'
      });

      expect(route('hoi')).toEqual('GOT IT');
    });

    it('Handles wildcard routes', function() {
      const route = rlite(() => 'NOT FOUND', {
        '/users/:name/baz': ({name}) => `Hi, ${name}`,
        '/users/*name': ({name}) => `Wild, ${name}`,
      });

      expect(route('hoi')).toEqual('NOT FOUND');
      expect(route('users/chris/baz')).toEqual('Hi, chris');
      expect(route('users/chris/bar')).toEqual('Wild, chris/bar');
    });

    it('Encodes params', function() {
      const route = rlite(noop, {
        '': ({hey}) => {
          expect(hey).toEqual('/what/now');
          return 'HOME';
        },

        ':hey': ({hey}) => {
          expect(hey).toEqual('/hoi/hai?hui');
          return ':hey';
        },

        'more-complex/:hey': ({hey, hui}) => {
          expect(hey).toEqual('/hoi/hai?hui');
          expect(hui).toEqual('/hoi/hai');
          return 'LAST';
        },
      });

      expect(route(encodeURIComponent('/hoi/hai?hui'))).toEqual(':hey');
      expect(route('/?hey=' + encodeURIComponent('/what/now'))).toEqual('HOME');
      expect(route('/more-complex/' + encodeURIComponent('/hoi/hai?hui') + '?hui=' + encodeURIComponent('/hoi/hai'))).toEqual('LAST');
    });
  });

  function noop() { }

})(this.Rlite || require('../rlite'));
