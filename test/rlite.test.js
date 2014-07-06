test('resolve last', function () {
    var p = new Plite();

    p.then(function (result) {
        ok(result == 'hello');
    });

    p.resolve('hello');
});

test('resolve first', function () {
    var p = new Plite();

    p.resolve('world');

    p.then(function (result) {
        ok(result == 'world');
    });
}); 

test('resolve chain', function () {
    var p = new Plite();

    p.then(function (result) {
        return result + ' chris';
    }).then(function (result){
        ok(result == 'hello chris');
    });

    p.resolve('hello');
});

asyncTest('resolve multi-promise', function () {
    var p1 = new Plite(),
        p2 = new Plite();

    p1.then(function (result) {
        
        setTimeout(function () {
            p2.resolve('hi ' + result);
        }, 10);

        return p2;
    }).then(function (result) {
        ok(result == 'hi chris');
        start();
    });

    p1.resolve('chris');
})

test('resolve finally', function () {
    var p = new Plite();

    p.then(function (msg) {
        return msg + ' beans';
    }).catch(function (err) {
        throw err;
    }).finally(function (msg) {
        ok(msg == 'cool beans');
    })

    p.resolve('cool');
});

test('resolve finally last', function () {
    var p = new Plite();

    p.resolve('cool');

    p.then(function (msg) {
        return msg + ' beans';
    }).catch(function (err) {
        throw err;
    }).finally(function (msg) {
        ok(msg == 'cool beans');
    })
});

test('reject last', function () {
    var p = new Plite();

    p.then(function (result) {
        ok(false, 'Should not have gotten to then');
    }).catch(function (err) {
        ok(err == 'doh');
    });

    p.reject('doh');
})

test('reject first', function () {
    var p = new Plite();

    p.reject('doh');

    p.then(function (result) {
        ok(false, 'Should not have gotten to then');
    }).catch(function (err) {
        ok(err == 'doh');
    });
})

asyncTest('reject multi-promise', function () {
    var p1 = new Plite(),
        p2 = new Plite();

    p1.then(function (result) {

        setTimeout(function () {
            p2.reject('snap!');
        }, 10);

        return p2;
    }).then(function (result) {
        ok(false);
    }).catch(function (result) {
        ok(result == 'snap!');
    }).finally(start);

    p1.resolve('chris');
});

test('reject finally', function () {
    var p = new Plite();

    p.then(function (msg) {
        ok(false);
    }).catch(function (err) {
        return 'e' + err;
    }).finally(function (msg) {
        ok(msg == 'ecool');
    })

    p.reject('cool');
});

test('reject finally last', function () {
    var p = new Plite();

    p.reject('cool');

    p.then(function (msg) {
        ok(false);
    }).catch(function (err) {
        return 'e' + err;
    }).finally(function (msg) {
        ok(msg == 'ecool');
    })
});

test('catch is triggered when then excepts', function () {
    var p = new Plite();

    p.then(function () {
        throw 'ruh roh!';
    }).catch(function (err) {
        ok(err == 'ruh roh!');
    })

    p.resolve('mkay');
});