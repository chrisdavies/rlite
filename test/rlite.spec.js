(function (Rlite) {
  describe('Rlite', function () {

    it('Does not put hash values in query', function () {
      var r = new Rlite();

      r.add('stuff', function (r) {
        expect(r.params.name).toEqual('value');
      });

      r.run('stuff?name=value#baz');
    });

    it('Has empty params for parameterless routes', function () {
      var r = new Rlite();

      r.add('stuff', function (r) {
        expect(Object.keys(r.params).length).toEqual(0);
      });

      r.run('stuff');
    });

    it('Lets users check for existing routes', function () {
      var r = new Rlite();

      r.add('stuff', function () {});

      expect(r.exists('/stuff/')).toBeTruthy();
      expect(r.exists('stuff/')).toBeTruthy();
      expect(r.exists('/stuff')).toBeTruthy();
      expect(r.exists('stuff')).toBeTruthy();
      expect(r.exists('nopes')).toBeFalsy();
    });

    it('Handles route params', function() {
      var r = new Rlite();

      r.add('hey/:name', function(r) {
        expect(r.params.name).toEqual('chris');
      });

      r.run('hey/chris');
    });

    it('Handles uppercases', function() {
      var r = new Rlite();

      r.add('Hey/:name', function(r) {
        expect(r.params.name).toEqual('chris');
      });

      r.run('hey/chris');
    });

    it('Should overwrite the same routes', function() {
      var r = new Rlite();

      r.add('hey/:name', function (r) {
        throw new Error('First route should not run');
      });

      r.add('hey/:name', function(r) {
        expect(r.params.name).toEqual('chris');
      });

      r.run('hey/chris');
    });

    it('Matches root routes correctly', function() {
      var r = new Rlite();

      r.add('hey/:name/new', function(r) {
        throw new Error('New called');
      });

      r.add('hey/:name', function(r) {
        expect(r.params.name).toEqual('chris');
      });

      r.add('hey/:name/edit', function(r) {
        throw new Error('Edit called');
      });

      r.run('hey/chris');
    });

    it('Understands specificity', function() {
      var r = new Rlite();

      r.add('hey/joe', function(r) {
        expect(r.url).toEqual('hey/joe');
      });

      r.add('hey/:name', function(r) {
        throw new Error('New called');
      });

      r.add('hey/jane', function(r) {
        expect(r.url).toEqual('hey/jane');
      });

      r.run('hey/joe');
      r.run('hey/jane');
    });

    it('Handles complex routes', function() {
      var r = new Rlite();

      r.add('hey/:name/new', function(r) {
        throw new Error('New called');
      });

      r.add('hey/:name', function(r) {
        throw new Error('Name called');
      });

      r.add('hey/:name/last/:last', function(r) {
        expect(r.params.name).toEqual('chris');
        expect(r.params.last).toEqual('davies');
      });

      r.run('hey/chris/last/davies');
    });

    it('Overrides params with query string values', function() {
      var r = new Rlite();

      r.add('hey/:name/new', function(r) {
        throw new Error('New called');
      });

      r.add('hey/:name', function(r) {
        throw new Error('Name called');
      });

      r.add('hey/:name/last/:last', function(r) {
        expect(r.params.name).toEqual('ham');
        expect(r.params.last).toEqual('mayo');
      });

      expect(r.run('hey/chris/last/davies?last=mayo&name=ham')).toBeTruthy();
    });

    it('Handles not founds', function() {
      var r = new Rlite();

      r.add('hey/:name', function(r) {
        throw new Error('Name called');
      });

      expect(r.run('hoi/there')).toBeFalsy();
    });

    it('Ignores leading slashes', function() {
      var r = new Rlite();

      r.add('hey/:name', function(r) {
        expect(r.params.name).toEqual('chris');
      });

      r.run('/hey/chris');
    });

    it('Handles default urls', function() {
      var r = new Rlite(),
          ran = false;

      r.add('', function(r) {
        ran = true;
      });

      r.run('');

      expect(ran).toBeTruthy();
    });

    it('Handles trailing slashes', function() {
      var r = new Rlite(),
          ran = false;

      r.add('hoi', function(r) {
        ran = true;
      });

      r.run('hoi/');

      expect(ran).toBeTruthy();
    });

    it('Handles trailing slash with query', function() {
      var r = new Rlite(),
          ran = false;

      r.add('hoi', function(r) {
        expect(r.params.there).toEqual('yup');
        ran = true;
      });

      r.run('hoi/?there=yup');

      expect(ran).toBeTruthy();
    });

    it('Encodes params', function() {
      var r = new Rlite();

      r.add(':hey', function(r) {
        expect(r.params.hey).toEqual('/hoi/hai?hui');
      });
      r.run(encodeURIComponent('/hoi/hai?hui'));

      r.add('', function(r) {
        expect(r.params.hey).toEqual('/hoi/hai');
      });
      r.run('/?hey=' + encodeURIComponent('/hoi/hai'));

      r.add('/more-complex/:hey', function(r) {
        expect(r.params.hey).toEqual('/hoi/hai?hui');
        expect(r.params.hui).toEqual('/hoi/hai');
      });

      r.run('/more-complex/' + encodeURIComponent('/hoi/hai?hui') + '?hui=' + encodeURIComponent('/hoi/hai'));
    });
  });

})(this.Rlite || require('../rlite'));
