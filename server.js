var liveServer = require("live-server");

var params = {
    port: 8080, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "./server", // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    //ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [
        ['/dist', './dist']
    ], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    //middleware in some dummy data
    middleware: [
        function(req, res, next) { 
            console.log(req.url);
            if(req.url === '/api/posts')
            {
                res.setHeader('content-type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                    "posts": [
                        {
                            "id": 1,
                            "value": "Some post data here",
                            "links": {
                                "comments": "/api/posts/1/comments"
                            } 
                        }
                    ],
                    "meta": {
                        "total": 1
                    }
                }, null, 4));

            }
            else if(req.url === '/api/posts/1')
            {
                res.setHeader('content-type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                    "posts": [
                        {
                            "id": 1,
                            "value": "Some post data here",
                            "links": {
                                "comments": "/api/posts/1/comments"
                            } 
                        }
                    ]
                }, null, 4));

            }
            else if(req.url === '/api/posts/1/comments')
            {
                res.setHeader('content-type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                    "comments": [
                        {
                            "id": 1,
                            "post": 1,
                            "value": "Some comment data here"
                        }
                    ]
                }, null, 4));

            }
            else if(req.url === '/api/comments')
            {
                res.setHeader('content-type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                    "comments": [
                        {
                            "id": 1,
                            "post": 1,
                            "value": "Some comment data here"
                        }
                    ],
                    "meta": {
                        "total": 1
                    }
                }, null, 4));
            }
            else if(req.url === '/api/comments/1')
            {
                res.setHeader('content-type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                    "comments": [
                        {
                            "id": 1,
                            "post": 1,
                            "value": "Some comment data here"
                        }
                    ]
                }, null, 4));
            }
            else if(req.url === '/api/comments/1/posts')
            {
                res.setHeader('content-type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({
                    "posts": [
                        {
                            "id": 1,
                            "value": "Some post data here",
                            "links": {
                                "comments": "/api/posts/1/comments"
                            } 
                        }
                    ]
                }, null, 4));
            }
            else
            {
                next();
            }
        }
    ] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};
liveServer.start(params);