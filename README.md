bubu-restifier
=========

RESTful styled API client augmenter. Follows modularity. Works with browserify.

bubu-restifier augments a 'requester' object, such as http, to implement a RESTful styled API.

## Getting started

To install:

```
npm install bubu-restifier
```

### Initialization

```js
var http = require('http');
var restifier = require('bubu-restifier');
var apiClient = restifier.augment(Object.create(http));   // We use Object.create because we do not want to directly modify http in this case.

animalsApi = apiClient.create({
    host      : 'localhost',
    port      : 8000,
    resource  : 'animals',
});
```

### Usage examples

```
// POST /animals
animalsApi.post({name: 'dog'}, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
        var animal = JSON.parse(body);
    });
});

// GET /animals
animalsApi.get(function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
        var animals = JSON.parse(body);
    });
});

// "GET" /animals/:id
animalsApi.get(3, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
        var animal = JSON.parse(body);
    });
});

// "PUT" /animals/:id
animalsApi.put(3, {name: 'cow'}, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
        // updated to name cow
    });
});
```

## API

* restifier.get([query], [options], callback)
* restifier.post([data], [options], callback)
* restifier.update([query], [data], [options], callback)
* restifier.delete([query], [options], callback)

options:

This parameter overwrites the predefined options in case something more custom is needed.

* host
* port
* path
* method
* headers
* query

## Notes

* This module is not intended to implement a strict RESTful API (http://www.restdoc.org/spec.html), its just inspired on it.
