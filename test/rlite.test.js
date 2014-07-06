function ok(cond, msg) {
    if (!cond) throw (msg || 'Ruh roh!');
}

// Route parameter check
(function () {
    var r = new Rlite();

    r.add('hey/:name', function (r) {
        ok(r.params.name == 'chris');
    });

    r.run('hey/chris');
})();

// Other routes don't get confused
(function () {
    var r = new Rlite();

    r.add('hey/:name/new', function (r) {
        throw 'New called';
    });

    r.add('hey/:name', function (r) {
        ok(r.params.name == 'chris');
    });

    r.add('hey/:name/edit', function (r) {
        throw 'Edit called';
    });

    r.run('hey/chris');
})();

// Most explicit wins
(function () {
    var r = new Rlite();

    r.add('hey/joe', function (r) {
        ok(r.url == 'hey/joe');
    });

    r.add('hey/:name', function (r) {
        throw 'New called';
    });

    r.add('hey/jane', function (r) {
        ok(r.url == 'hey/jane');
    });

    r.run('hey/joe');
    r.run('hey/jane');
})();

// Complex routes work
(function () {
    var r = new Rlite();

    r.add('hey/:name/new', function (r) {
        throw 'New called';
    });

    r.add('hey/:name', function (r) {
        throw 'Name called';
    });

    r.add('hey/:name/last/:last', function (r) {
        ok(r.params.name == 'chris' && r.params.last == 'davies');
    });

    r.run('hey/chris/last/davies');
})();

// Query strings override other params
(function () {
    var r = new Rlite();

    r.add('hey/:name/new', function (r) {
        throw 'New called';
    });

    r.add('hey/:name', function (r) {
        throw 'Name called';
    });

    r.add('hey/:name/last/:last', function (r) {
        ok(r.params.name == 'ham' && r.params.last == 'mayo');
    });

    r.run('hey/chris/last/davies?last=mayo&name=ham');
})();

// Not found
(function () {
    var r = new Rlite();

    r.add('hey/:name', function (r) {
        throw 'Name called';
    });

    r.notFound = function (url) {
        ok(url == 'hoi/there');
    }

    r.run('hoi/there');
})();

// Leading slashes don't matter
(function () {
    var r = new Rlite();

    r.add('hey/:name', function (r) {
        ok(r.params.name == 'chris');
    });

    r.run('/hey/chris');
})();

// Default url
(function () {
    var r = new Rlite();

    r.add('', function (r) {
        ok(true);
    });

    r.run('');
})();

document.title = 'DONE';