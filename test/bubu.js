var assert = require('assert');
var http = require('iso-http');
var bubu = require('../bubu');
var apiClient = bubu.augment(Object.create(http));

describe('bubu', function () {
    var productsApi;

    before(function (done) {
        productsApi = apiClient.create({
            host      : 'localhost',
            port      : 3000,
            resource  : 'retailers',
        });
        done();
    });

    describe('get', function () {
        it('should', function (done) {
            productsApi.get(function (res) {
                done();
                console.log(res);
            });
        });
    });
});
