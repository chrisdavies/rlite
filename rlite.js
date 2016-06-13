(function (root) {
  function Rlite() {
    var routes = {};
    var decode = decodeURIComponent;
    var paramMarker = ':';
    var paramNameMarker = '~';
    var callbackMarker = '@';

    // Noop, technically an identity function
    function noop(s) { return s }

    // Removes trailing and leading slashes, taking query into account
    function sanitize(url) {
      return url.replace(/(^\/)|(\/$)|(\/)(\?.*)/g, '$4');
    }

    // Processes the path portion of a URL, using the specified escape function
    function processUrl(url) {
      var pieces = url.split('/');
      var rules = routes;
      var params = {};

      for (var i = 0; i < pieces.length && rules; ++i) {
        var piece = decode(pieces[i]);
        rules = rules[piece.toLowerCase()] || rules[paramMarker];
        rules && rules[paramNameMarker] && (params[rules[paramNameMarker]] = piece);
      }

      return rules && {
        cb: rules[callbackMarker],
        params: params
      };
    }

    // Processes the query portion of the URL, using the specified route context
    // and escape function.
    function processQuery(url, ctx) {
      if (url && ctx.cb) {
        var query = url.split('#', 1)[0].split('&');

        for (var i = 0; i < query.length; ++i) {
          var nameValue = query[i].split('=');

          ctx.params[nameValue[0]] = decode(nameValue[1]);
        }
      }

      return ctx;
    }

    // Finds route that matches the specified URL.
    function lookup(url) {
      var querySplit = sanitize(url).split('?');

      return processQuery(querySplit[1], processUrl(querySplit[0]) || {});
    }

    return {
      // Adds the specified route handler to the router.
      // route: a string like /users/:id
      // handler: a callback to be run when the route is matched
      add: function (route, handler) {
        var pieces = route.split('/');
        var rules = routes;

        for (var i = 0; i < pieces.length; ++i) {
          var piece = pieces[i];
          var name = piece[0] == paramMarker ? paramMarker : piece.toLowerCase();

          rules = rules[name] || (rules[name] = {});

          name == paramMarker && (rules[paramNameMarker] = piece.slice(1));
        }

        rules[callbackMarker] = handler;
      },

      // Determines if an existing route matches the specified URL
      exists: function (url) {
        return !!lookup(url).cb;
      },

      // Looks up the specified URL in the router
      lookup: lookup,

      // Runs the specified URL and calls the appropriate callback
      // if a route is found.
      run: function(url) {
        var result = lookup(url);

        result.cb && result.cb({
          url: url,
          params: result.params
        });

        return !!result.cb;
      }
    }
  }


  // JS modules support
  var define = root.define;

  if (define && define.amd) {
    define('rlite', [], function () { return Rlite });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Rlite;
  } else {
    root.Rlite = Rlite;
  }
}(this));
