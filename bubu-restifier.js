// bubu-restifier module
var querystring = require('querystring');

// Augments a requester object to implement a RESTful styled API
function augment (requester) {
    // A recursive merge of objects
    function merge () {
        var newObj = {}, obj;

        for (var i = 0; i < arguments.length; i+=1) {
            obj = arguments[i];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof(obj[key]) === 'object') {
                        newObj[key] = merge(newObj[key], obj[key]);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }

        return newObj;
    }

    // Filter the available options
    function getRequestOptions(obj) {
        var options = {},
            key,
            validOptions = [
                'host', 'port', 'path', 'method', 'headers', 'query'
            ];

        for (var i = 0; i < validOptions.length; i+=1) {
            key = validOptions[i];
            if (obj.hasOwnProperty(key)) {
                options[key] = obj[key];
            }
        }

        return options;
    }

    // Execute the request
    function requestVerb (verb, query, data, options, done) {
        var req, i,
            path, query;

        i = arguments.length-1;
        while (i >= 0) {
            if (arguments[i]) {
                done = arguments[i];
                if (i < arguments.length-1) {
                    arguments[i] = undefined;
                }
                break;
            }
            i -= 1;
        }

        options = options || {};

        if (typeof(query) === 'string' || typeof(query) === 'number') {
            path = '/' + this.resource + '/' + query;
        } else {
            path = '/' + this.resource;

            if (query) {
                query = query;
            }
        }
        options.query = merge(query, options.query);
        options.path = options.path || path;
        options.method = options.method || verb;

        options = getRequestOptions(merge(this, options));

        // Set the path after query
        if (options.query && Object.keys(options.query).length > 0) {
            options.path = options.path + '?' + querystring.stringify(options.query);
        }

        req = this.request(options, function (res) {
            done(res);
        });
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    }

    // Add create method if it does not exist
    if (!requester.create) {
        requester.create = function create (config) {
            var apiClient = Object.create(this);

            // Set defaults
            apiClient.host = 'localhost';
            apiClient.port = 80;
            apiClient.path = '/';
            apiClient.query = {};

            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    apiClient[key] = config[key];
                }
            }

            apiClient.headers = apiClient.headers || {};
            apiClient.headers['Content-Type'] = 'application/json';

            return apiClient;
        };
    }

    requester.post = function post (data, options, done) {
        requestVerb.call(this, 'POST', null, data, options, done);
    };

    requester.get = function get (query, options, done) {
        requestVerb.call(this, 'GET', query, null, options, done);
    };

    requester.put = function get (query, data, options, done) {
        requestVerb.call(this, 'PUT', query, data, options, done);
    };

    requester.delete = function get (query, options, done) {
        requestVerb.call(this, 'DELETE', query, null, options, done);
    };

    return requester;
}

module.exports.augment = augment;
