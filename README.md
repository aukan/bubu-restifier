bubu
=========

Javascript RESTful styled API client. Follows modularity (link missing).

bubu augments a 'requester' object to implement a RESTful styled API.

## Getting started

Example:

```js
var isoHttp = require('iso-http');
var bubu = require('bubu');
var apiClient = bubu.augment(Object.create(isoHttp));   // We use Object.create because we do not want to directly modify isoHttp in this case.

var productsApi = apiClient.create({
    host      : 'www.example.com',  // Server host
    port      : 8080,               // Server port
    resource  : 'products'          // RESTful resource
});

// "GET" verb. Query the list of products
productsApi.get(function (err, products) {
    if (!err) {
        console.log(products);
    }
});
// "GET" verb. Obtain a single product
productsApi.get('some_id', function (err, product) {
    if (!err) {
        console.log(product);
    }
});
```

Notes: 

* I'm introducing some terms in this module which I intend to clarify later in a more proper documentation. If you have any questions please feel free to write to me.
* This module is not intended to implement a strict RESTful API (link missing).

