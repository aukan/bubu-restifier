bubu-restifier
=========

RESTful styled API client augmenter. Follows modularity. Works with browserify.

bubu-restifier augments a 'requester' object, such as http, to implement a RESTful styled API.

## Getting started

To install:

```
npm install bubu-restifier
```

Initialization:

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

Usage examples:

```
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

## Notes

* This module is not intended to implement a strict RESTful API (http://www.restdoc.org/spec.html), its just inspired on it.
