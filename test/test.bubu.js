var assert = require('assert');
var restifier = require('../bubu-restifier');
var apiClient = restifier.augment({}); // Augment empty object since we are not going to use a real request
var querystring = require('querystring');

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

    describe('post', function () {
        it('should request the creation of a resource', function (done) {
            animalsApi.post({name: 'dog'}, function (opts) {
                assert.equal('POST', opts.method);
                assert.equal('/animals', opts.path);
                assert.equal('dog', opts.data.name);
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(8000, opts.port);
                done();
            });
        });

        it('should accept and overwrite the options', function (done) {
            animalsApi.post({name: 'dog'}, {
                host : '127.0.0.1',
                port : 3000,
                path : '/test',
                method : 'OTHER',
                headers : {
                    'Custom-Header': 'test'
                },
                query : {
                    legs : 4
                }
            }, function (opts) {
                assert.equal('127.0.0.1', opts.host);
                assert.equal(3000, opts.port);
                assert.equal('OTHER', opts.method);
                assert.equal('/test', opts.path.replace(/\?.*/, ''));
                assert.equal(4, querystring.parse(opts.path.replace(/.*\?/, '')).legs);
                assert.equal('dog', opts.data.name);
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(opts.headers['Custom-Header'], 'test');
                done();
            });
        });
    });

    describe('get', function () {
        it('should request all resources', function (done) {
            animalsApi.get(function (opts) {
                assert.equal('GET', opts.method);
                assert.equal('/animals', opts.path);
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(8000, opts.port);
                done();
            });
        });

        it('should request a single resource', function (done) {
            animalsApi.get('3', function (opts) {
                assert.equal('GET', opts.method);
                assert.equal('/animals/3', opts.path);
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(8000, opts.port);
                done();
            });
        });

        it('should accept and overwrite the options', function (done) {
            animalsApi.get('3', {
                    host : '127.0.0.1',
                    port : 3000,
                    path : '/test',
                    method : 'OTHER',
                    headers : {
                        'Custom-Header': 'test'
                    },
                    query : {
                        legs : 4
                    }
                }, function (opts) {
                assert.equal('127.0.0.1', opts.host);
                assert.equal(3000, opts.port);
                assert.equal('OTHER', opts.method);
                assert.equal('/test', opts.path.replace(/\?.*/, ''));
                assert.equal(4, querystring.parse(opts.path.replace(/.*\?/, '')).legs);
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(opts.headers['Custom-Header'], 'test');
                done();
            });
        });

        it('should not modify arrays when passed as headers or in a query', function (done) {
            animalsApi.get('3', {
                    headers : {
                        'Custom-Header': ['something']
                    },
                    query : {
                        something: ['something']
                    }
                }, function (opts) {
                assert.equal(opts.headers['Custom-Header'].length, 1);
                assert.equal(opts.headers['Custom-Header'][0], 'something');
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
                assert.equal(8000, opts.port);
                done();
            });
        });

        it('should accept and overwrite the options', function (done) {
            animalsApi.put(1, {name : 'vaca'}, {
                    host : '127.0.0.1',
                    port : 3000,
                    path : '/test',
                    method : 'OTHER',
                    headers : {
                        'Custom-Header': 'test'
                    },
                    query : {
                        legs : 4
                    }
                }, function (opts) {
                assert.equal('127.0.0.1', opts.host);
                assert.equal(3000, opts.port);
                assert.equal('OTHER', opts.method);
                assert.equal('/test', opts.path.replace(/\?.*/, ''));
                assert.equal(4, querystring.parse(opts.path.replace(/.*\?/, '')).legs);
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(opts.headers['Custom-Header'], 'test');
                done();
            });
        });
    });

    describe('delete', function () {
        it('should request a deletion to a single resource', function (done) {
            animalsApi.delete(2, function (opts) {
                assert.equal('DELETE', opts.method);
                assert.equal(opts.path, '/animals/2');
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(8000, opts.port);
                done();
            });
        });

        it('should accept and overwrite the options', function (done) {
            animalsApi.delete(2, {
                    host : '127.0.0.1',
                    port : 3000,
                    path : '/test',
                    method : 'OTHER',
                    headers : {
                        'Custom-Header': 'test'
                    },
                    query : {
                        legs : 4
                    }
                }, function (opts) {
                assert.equal('127.0.0.1', opts.host);
                assert.equal(3000, opts.port);
                assert.equal('OTHER', opts.method);
                assert.equal('/test', opts.path.replace(/\?.*/, ''));
                assert.equal(4, querystring.parse(opts.path.replace(/.*\?/, '')).legs);
                assert.equal('application/json', opts.headers['Content-Type']);
                assert.equal(opts.headers['Custom-Header'], 'test');
                done();
            });
        });
    });

});
