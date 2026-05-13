// Exercises the native `fetch()` fallback path in `Backbone.ajax`.
// `test/setup/environment.js` replaces `Backbone.ajax` with a settings
// recorder on every `testStart`, which is what every other suite in this
// project depends on. To talk to the real fetch adapter we have to undo
// that replacement *inside* each test's `beforeEach` (which runs after
// the global `testStart`), and to force the fetch path specifically we
// also have to null out `Backbone.$` so the jQuery branch is skipped.

(function(QUnit) {

  var realAjax = Backbone.ajax;

  QUnit.module('Backbone.ajax fetch() fallback', {
    beforeEach: function() {
      this.realDollar = Backbone.$;
      Backbone.$ = void 0;
      Backbone.ajax = realAjax;

      this.fetchCalls = [];
      this.realFetch = window.fetch;
      this.nextResponse = {
        status: 200,
        statusText: 'OK',
        body: '{"id":1,"ok":true}',
        contentType: 'application/json'
      };
      var ctx = this;
      window.fetch = function(url, init) {
        ctx.fetchCalls.push({url: url, init: init});
        var r = ctx.nextResponse;
        if (r.networkError) return Promise.reject(new TypeError('Network down'));
        return Promise.resolve(new Response(r.body, {
          status: r.status,
          statusText: r.statusText,
          headers: {'Content-Type': r.contentType || 'application/json'}
        }));
      };
    },
    afterEach: function() {
      window.fetch = this.realFetch;
      Backbone.$ = this.realDollar;
    }
  });

  QUnit.test('GET with a data object is serialized into the query string', function(assert) {
    var done = assert.async();
    var ctx = this;
    Backbone.ajax({
      url: '/items',
      type: 'GET',
      data: {a: 1, b: 'two words'},
      success: function() {
        var call = ctx.fetchCalls[0];
        assert.ok(call.url.indexOf('/items?') === 0, 'query string was appended');
        assert.ok(call.url.indexOf('a=1') !== -1);
        assert.ok(call.url.indexOf('b=two+words') !== -1, 'value was URL-encoded');
        assert.strictEqual(call.init.method, 'GET');
        assert.strictEqual(call.init.body, undefined, 'GET has no body');
        done();
      }
    });
  });

  QUnit.test('POST with a data object is JSON-stringified by default', function(assert) {
    var done = assert.async();
    var ctx = this;
    Backbone.ajax({
      url: '/items',
      type: 'POST',
      contentType: 'application/json',
      data: '{"name":"new"}',
      success: function() {
        var call = ctx.fetchCalls[0];
        assert.strictEqual(call.init.method, 'POST');
        assert.strictEqual(call.init.body, '{"name":"new"}');
        assert.strictEqual(call.init.headers['Content-Type'], 'application/json');
        done();
      }
    });
  });

  QUnit.test('POST with form-encoded contentType uses URLSearchParams', function(assert) {
    var done = assert.async();
    var ctx = this;
    Backbone.ajax({
      url: '/form',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: {field: 'value with space'},
      success: function() {
        var call = ctx.fetchCalls[0];
        assert.strictEqual(call.init.body, 'field=value+with+space');
        done();
      }
    });
  });

  QUnit.test('Backbone.sync round-trip: model.fetch() goes through fetchAjax', function(assert) {
    var done = assert.async();
    var ctx = this;
    var Item = Backbone.Model.extend({urlRoot: '/items'});
    var item = new Item({id: 1});
    item.fetch({
      success: function(model, resp) {
        assert.strictEqual(ctx.fetchCalls.length, 1);
        assert.strictEqual(ctx.fetchCalls[0].url, '/items/1');
        assert.strictEqual(ctx.fetchCalls[0].init.method, 'GET');
        assert.deepEqual(resp, {id: 1, ok: true});
        assert.strictEqual(model.get('ok'), true);
        done();
      }
    });
  });

  QUnit.test('beforeSend receives an xhr-like with abort and setRequestHeader', function(assert) {
    var done = assert.async();
    var ctx = this;
    Backbone.ajax({
      url: '/x',
      type: 'GET',
      beforeSend: function(xhr) {
        assert.strictEqual(typeof xhr.abort, 'function');
        assert.strictEqual(typeof xhr.setRequestHeader, 'function');
        xhr.setRequestHeader('X-Custom', 'yes');
      },
      success: function() {
        assert.strictEqual(ctx.fetchCalls[0].init.headers['X-Custom'], 'yes');
        done();
      }
    });
  });

  QUnit.test('HTTP error status fires options.error and rejects', function(assert) {
    var done = assert.async();
    this.nextResponse = {
      status: 404,
      statusText: 'Not Found',
      body: 'gone',
      contentType: 'text/plain'
    };
    var errorCalled = false;
    var promise = Backbone.ajax({
      url: '/missing',
      type: 'GET',
      dataType: 'text',
      error: function(xhr, status, msg) {
        errorCalled = true;
        assert.strictEqual(xhr.status, 404);
        assert.strictEqual(status, 'error');
        assert.strictEqual(msg, 'Not Found');
      }
    });
    promise.then(function() {
      assert.ok(false, 'should not resolve on HTTP error');
      done();
    }, function(err) {
      assert.ok(errorCalled, 'options.error was called before reject');
      assert.strictEqual(err.message, 'Not Found');
      done();
    });
  });

  QUnit.test('returned promise has an abort() that triggers AbortController', function(assert) {
    var done = assert.async();
    // Make fetch hang so we can verify abort cancels it.
    window.fetch = function(url, init) {
      return new Promise(function(_, reject) {
        init.signal.addEventListener('abort', function() {
          var err = new Error('aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    };
    var promise = Backbone.ajax({url: '/slow', type: 'GET'});
    assert.strictEqual(typeof promise.abort, 'function');
    promise.then(function() {
      assert.ok(false, 'should not resolve');
      done();
    }, function(err) {
      assert.strictEqual(err.name, 'AbortError');
      done();
    });
    promise.abort();
  });

  QUnit.test('JSON parse error fires options.error with parsererror status', function(assert) {
    var done = assert.async();
    this.nextResponse = {
      status: 200,
      statusText: 'OK',
      body: 'not json{{{',
      contentType: 'application/json'
    };
    var errorCalled = false;
    Backbone.ajax({
      url: '/bad-json',
      type: 'GET',
      error: function(xhr, status) {
        errorCalled = true;
        assert.strictEqual(status, 'parsererror');
      }
    }).then(function() {
      assert.ok(false, 'should not resolve');
      done();
    }, function() {
      assert.ok(errorCalled);
      done();
    });
  });

  QUnit.test('jQuery path still wins when Backbone.$ is present', function(assert) {
    var done = assert.async();
    var jqAjaxCalled = false;
    Backbone.$ = {
      ajax: function(opts) {
        jqAjaxCalled = true;
        opts.success({via: 'jquery'}, 'success', {});
        return {abort: function() {}};
      }
    };
    Backbone.ajax({
      url: '/x',
      type: 'GET',
      success: function(data) {
        assert.ok(jqAjaxCalled, 'jQuery $.ajax was invoked, not fetch');
        assert.strictEqual(this.fetchCalls.length, 0, 'fetch was not called');
        assert.strictEqual(data.via, 'jquery');
        done();
      }.bind(this)
    });
  });

})(QUnit);
