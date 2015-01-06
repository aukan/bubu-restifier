var assert = require('assert');
var restifier = require('../bubu-restifier');
var apiClient = restifier.augment({}); // Augment empty object since we are not going to use a real request

describe('bubu-restifier', function () {
    var animalsApi, server;

    before(function (done) {
        animalsApi = apiClient.create({
            host      : 'localhost',
            port      : 8000,
            resource  : 'animals',
        });

        // Moch request method
        animalsApi.request = function (options, done) {
            return {
                write : function (data) {
                    options.data = JSON.parse(data);
                },
                end : function () {
                    done(options);
                }
            };
        };

        done();
    });

    describe('get', function () {
        it('should request all resources', function (done) {
            animalsApi.get(function (opts) {
                assert.equal('GET', opts.method);
                assert.equal('/animals', opts.path);
                assert.equal('application/json', opts.headers['Content-Type']);
                done();
            });
        });

        it('should request a single resource', function (done) {
            animalsApi.get(3, function (opts) {
                assert.equal('GET', opts.method);
                assert.equal('/animals/3', opts.path);
                assert.equal('application/json', opts.headers['Content-Type']);
                done();
            });
        });
    });

    describe('put', function () {
        it('should request an update to a single resource', function (done) {
            animalsApi.put(1, {name: 'vaca'}, function (opts) {
                assert.equal('PUT', opts.method);
                assert.equal('/animals/1', opts.path);
                assert.equal('vaca', opts.data.name);
                assert.equal('application/json', opts.headers['Content-Type']);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should request a deletion to a single resource', function (done) {
            animalsApi.remove(2, function (opts) {
                assert.equal('DELETE', opts.method);
                assert.equal('/animals/2', opts.path);
                assert.equal('application/json', opts.headers['Content-Type']);
                done();
            });
        });
    });
});
