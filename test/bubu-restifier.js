var assert = require('assert');
var http = require('http');
var restifier = require('../bubu-restifier');
var apiClient = restifier.augment(Object.create(http));

describe('bubu-restifier', function () {
    var animalsApi, server;

    before(function (done) {
        server = http.createServer(function (req, res) {
            var body = '';
            req.on('data', function (chunk) { body += chunk; });
            req.on('end', function () {
                res.write(JSON.stringify({
                    path   : req.url,
                    method : req.method,
                    headers : req.headers,
                    data   : JSON.parse(body || "{}")
                }));
                res.end();
            });
        });
        server.listen(8000, function () {
            done();
        });
    });
    after(function (done) {
        server.close(function () { 
            done(); 
        });
    });

    before(function (done) {
        animalsApi = apiClient.create({
            host      : 'localhost',
            port      : 8000,
            resource  : 'animals',
        });
        done();
    });

    describe('get', function () {
        it('should request all resources', function (done) {
            animalsApi.get(function (res) {
                var body = '';
                res.on('data', function (chunk) { body += chunk; });
                res.on('end', function () {
                    var resData = JSON.parse(body);
                    assert.equal('GET', resData.method);
                    assert.equal('/animals', resData.path);
                    assert.equal('application/json', resData.headers['content-type']);
                    done();
                });
            });
        });

        it('should request a single resource', function (done) {
            animalsApi.get(3, function (res) {
                var body = '';
                res.on('data', function (chunk) { body += chunk; });
                res.on('end', function () {
                    var resData = JSON.parse(body);
                    assert.equal('GET', resData.method);
                    assert.equal('/animals/3', resData.path);
                    assert.equal('application/json', resData.headers['content-type']);
                    done();
                });
            });
        });
    });

    describe('put', function () {
        it('should request an update to a single resource', function (done) {
            animalsApi.put(1, {name: 'vaca'}, function (res) {
                var body = '';
                res.on('data', function (chunk) { body += chunk; });
                res.on('end', function () {
                    var resData = JSON.parse(body);
                    assert.equal('PUT', resData.method);
                    assert.equal('/animals/1', resData.path);
                    assert.equal('vaca', resData.data.name);
                    assert.equal('application/json', resData.headers['content-type']);
                    done();
                });
            });
        });
    });

    describe('delete', function () {
        it('should request a deletion to a single resource', function (done) {
            animalsApi.remove(2, function (res) {
                var body = '';
                res.on('data', function (chunk) { body += chunk; });
                res.on('end', function () {
                    var resData = JSON.parse(body);
                    assert.equal('DELETE', resData.method);
                    assert.equal('/animals/2', resData.path);
                    assert.equal('application/json', resData.headers['content-type']);
                    done();
                });
            });
        });
    });
});
