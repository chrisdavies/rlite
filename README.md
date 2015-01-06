# rlite

Tiny, light-weight JavaScript routing with zero dependencies.

## Usage
Rlite does not come with any explicit tie into HTML5 push state or hash-change events, but these are easy enough to tie in based on your needs. Here's an example:

    var r = new Rlite();

    // Default route
    r.add('', function () {
        document.title = 'Home';
    });

    // #inbox
    r.add('inbox', function () {
        document.title = 'In';
    });

    // #sent?to=john -> r.params.to will equal 'john'
    r.add('sent', function (r) {
        document.title = 'Out ' + r.params.to;
    });

    // #users/chris -> r.params.name will equal 'chris'
    r.add('users/:name', function (r) {
        document.title = 'User ' + r.params.name;
    });

    // #logout
    r.add('logout', function () {
        document.title = 'Logout';
    });

    // Hash-based routing
    function processHash() {
        var hash = location.hash || '#';
        r.run(hash.substr(1));
    }

    window.addEventListener('hashchange', processHash);
    processHash();

The previous examples should be relatively self-explantatory. Simple, parameterized routes are supported. Only relative URLs are supported. (So, instead of passing: 'http://example.com/users/1', pass '/users/1'). 

One other non-obvious thing is this: if there is a query parameter with the same name as a route parameter, it will override the route parameter. So given the following route definition:

    /users/:name

If you pass the following URL:

    /users/chris?name=joe

The value of params.name will be 'joe', not 'chris'.

## License MIT
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
