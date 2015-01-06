// bubu-restifier module

// Augments a requester object to implement a RESTful styled API
function augment (requester) {
    function requestVerb (verb, query, data, options, done) {
        var req;

        if (arguments.length < 5) {
            done = arguments[arguments.length-1];
            arguments[arguments.length-1] = undefined;
        }

        options = options || {};

        if (typeof(query) === 'string' || typeof(query) === 'number') {
            options.path = '/' + this.resource + '/' + query;
        } else {
            options.path = '/' + this.resource;
        }

        options = {
            host: options.host || this.host,
            port: options.port || this.port || 80,
            path: options.path || this.path,
            method : verb,
            headers: options.headers || this.headers || {},
        };

        for (var key in this.headers) {
            if (!options.headers.hasOwnProperty(key)) {
                options.headers[key] = this.headers[key];
            }
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

            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    apiClient[key] = config[key];
                }
            }

            // Set defaults
            apiClient.headers = apiClient.headers || {};
            if (!apiClient.headers['Content-Type']) {
                apiClient.headers['Content-Type'] = 'application/json';
            }

            return apiClient;
        };
    }

    requester.get = function get () {
        Array.prototype.unshift.call(arguments, 'GET');
        requestVerb.apply(this, arguments);
    };

    requester.put = function get (query, data, options, done) {
        Array.prototype.unshift.call(arguments, 'PUT');
        requestVerb.apply(this, arguments);
    };

    requester.remove = function get (query, data, options, done) {
        Array.prototype.unshift.call(arguments, 'DELETE');
        requestVerb.apply(this, arguments);
    };

    return requester;
}

module.exports.augment = augment;
