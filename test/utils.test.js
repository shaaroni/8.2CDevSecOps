const t = require('tap');
const utils = require('../utils');

t.test('ran_no returns a number within the given range', t => {
    for (let i = 0; i < 10; i++) {
        const result = utils.ran_no(1, 10);

        t.ok(result >= 1, 'result is greater than or equal to 1');
        t.ok(result <= 10, 'result is less than or equal to 10');
    }

    t.end();
});

t.test('uid returns a string with the requested length', t => {
    const result = utils.uid(10);

    t.equal(typeof result, 'string', 'uid returns a string');
    t.equal(result.length, 10, 'uid has the requested length');

    t.end();
});

t.test('forbidden sends a 403 response', t => {
    const response = {
        statusCode: 0,
        headers: {},
        body: '',

        setHeader(name, value) {
            this.headers[name] = value;
        },

        end(body) {
            this.body = body;
        }
    };

    utils.forbidden(response);

    t.equal(response.statusCode, 403, 'status code is 403');
    t.equal(response.headers['Content-Type'], 'text/plain', 'content type is text/plain');
    t.equal(response.body, 'Forbidden', 'response body is Forbidden');

    t.end();
});