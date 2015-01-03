// bubu module

// Augments a requester object to implement a RESTful styled API
function augment (requester) {
    // Add create method if it does not exist
    if (!requester.create) {
        requester.create = function create (config) {
            var apiClient = Object.create(this);

            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    apiClient[key] = config[key];
                }
            }

            return apiClient;
        };
    }

    requester.get = function get (query, options, done) {
        options = options || {};

        if (arguments.length < 4) {
            done = arguments[arguments.length-1];
            arguments[arguments.length] = undefined;
        }

        if (typeof(query) === 'String') {
            options.path = '/' + this.resource + '/' + query;
        } else {
            options.path = '/' + this.resource;
        }

        options = {
            protocol: options.protocol || this.protocol || 'http',
            host: options.host || this.host,
            port: options.port || this.port || 80,
            path: options.path || this.path,
            url: options.url || this.url,
            method : 'GET',
        };

        if (!options.url) {
            options.url = options.protocol + '://' + options.host + ':' + options.port + options.path
        }

        console.log('before here');
        this.request(options, function (res) {
            console.log('here');
            done(res);
        });
    };

    return requester;
}

module.exports.augment = augment;
