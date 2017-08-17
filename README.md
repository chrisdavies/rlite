# rlite

Tiny, [fast](http://jsperf.com/rlite/2), light-weight JavaScript routing with zero dependencies.

- Order of route declaration doesn't matter: the most specific route wins
- Zero dependencies
- No performance drop as you add routes
- Less than 700 bytes minified and gzipped
- Parses query strings
- Wildcard support

[![Build Status](https://travis-ci.org/chrisdavies/rlite.svg?branch=master)](https://travis-ci.org/chrisdavies/rlite)

## Usage

Rlite does not come with any explicit tie into HTML5 push state or hash-change events, but these are easy enough to tie in based on your needs. Here's an example:

```javascript
const route = rlite(notFound, {
  // Default route
  '': function () {
    return 'Home';
  },

  // #inbox
  'inbox': function () {
    return 'Inbox';
  },

  // #sent?to=john -> r.params.to will equal 'john'
  'sent': function ({to}) {
    return 'Sent to ' + to;
  },

  // #users/chris -> r.params.name will equal 'chris'
  'users/:name': function ({name}) {
    return 'User ' + name;
  },

  // #users/foo/bar/baz -> r.params.path will equal 'foo/bar/baz'
  'users/*path': function ({path}) {
    return 'Path = ' + path;
  },

  // #logout
  'logout': function () {
    return 'Logout';
  }
});

function notFound() {
  return '<h1>404 Not found :/</h1>';
}

// Hash-based routing
function processHash() {
  const hash = location.hash || '#';

  // Do something useful with the result of the route
  document.body.textContent = route(hash.slice(1));
}

window.addEventListener('hashchange', processHash);
processHash();
```

The previous examples should be relatively self-explantatory. Simple, parameterized routes are supported. Only relative URLs are supported. (So, instead of passing: `'http://example.com/users/1'`, pass `'/users/1'`).

Routes are not case sensitive, so `'Users/:name'` will resolve to `'users/:name'`

One other non-obvious thing is this: if there is a query parameter with the same name as a route parameter, it will override the route parameter. So given the following route definition:

    /users/:name

If you pass the following URL:

    /users/chris?name=joe

The value of params.name will be 'joe', not 'chris'.


## Route handlers

Route handlers ara functions that take three arguments and return a result and/or produce a side-effect.

Here's an example handler:

```javascript
const route = rlite(notFound, {
  'users/:id': function (params, state, url) {
    // Do interesting stuff here...
  }
});
```

The first argument is `params`. It is an object representing the route parameters. So, if you were to
run `route('users/33')`, params would be `{id: '33'}`.

The second argument is `state`. It is an optional value that was passed into the route function. So,
if you were to run `route('users/22', 'Hello')`, params would be `{id: '22'}` and state would be `'Hello'`.

The third argument is `url`. It is the URL which was matched to the route. So, if you were to run
`route('users/25')`, params would be `{id: '22'}`, state would be `undefined` and url would be `'users/25'`.


## Modules

If you're using ES6, import rlite like so:

```javascript
import rlite from 'rlite-router';

const routes = rlite(notFound, {
  '': function () { }
});

// etc
```

Or using [CommonJS](http://www.commonjs.org/) like so:

```javascript
var Rlite = require('rlite-router');
var routes = rlite(notFound, {
  '': function () { }
});

// etc
```


## Handling 404s

The first parameter to rlite is the 404 handler. This function will be invoked when rlite
is called with a URL that has no matching routes.

In the following example, the body will end up with `<h1>404 NOT FOUND</h1>`.

```javascript
const route = rlite(() => '<h1>404 NOT FOUND</h1>', {
  'hello': => '<h1>WORLD</h1>'
});

document.body.innerHTML = route('/not/a/valid/url');
```

## Changes from 1.x

- The parameters to route handlers have changed
- The plugins have been dropped since 2.x is more functional in nature, it's easy to extend
- rlite returns a function, rather than an object
- You can pass optional state into your route handlers
- The result of your route handler is returned by the router

## Installation

Just download rlite.min.js, or use bower:

    bower install rlite

Or use npm: https://www.npmjs.com/package/rlite-router

    npm install --save rlite-router

## Contributing

Make your changes (and add tests), then run the tests:

    npm test

If all is well, build your changes:

    npm run min

This minifies rlite, and tells you the size. It's currently just under 700
bytes, and I'd like to keep it that way!

## Status

Rlite is being actively maintained, but is pretty much feature complete, with the possible exception of support for wildcard routes. Generally, I avoid repos that look stale (no recent activity), but in this case, the reason for inactivity is that library is stable and complete.

## Usage with React

I've been using Rlite along with React and Redux. [Here's a write up on how that works.](https://github.com/chrisdavies/rlite/wiki/Using-with-React)

## License MIT

Copyright (c) 2016 Chris Davies

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
