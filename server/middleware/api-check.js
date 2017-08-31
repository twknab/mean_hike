// Setup any Dependencies:
var express = require('express'),
    router = express.Router(),
    path = require('path');

// Setup Router Middleware:
/*
    Notes: The `apiChecker` function below will run any time a request is made.
    The API Checker will do a regex comparison to see if the request URL contained
    the `/api/` pattern, to which instead of serving the HTML file for HTML5 mode,
    it will instead `next()` along so the API route can reach the appropriate
    server-side controller.
*/
router.use(function apiChecker (req, res, next) {
    var regex = /(\/api\/)/g; // pattern which checks for `/api/` in the URL
    if (regex.test(req.originalUrl)) { // if the URL contains the pattern, then `next()`
        next();
    } else { // if the URL does not contain `/api`:
        res.sendFile(path.join(__dirname, './../../client/index.html')); // deliver index.html which angular-route will then load appropriate partial
    }
})

module.exports = router;

/*
    Further Notes: It is important to understand, if we did not check for the `/api/` in our
    URL, then, *any* url in our request would be handed the `index.html` file,
    which might be fine if our routes were only for HTML, but because we also
    use routing for our API or creating mongo documents, serving the the index.html
    file every time would render our app useless.

    None of this would be necessary if we didn't render HTML5 mode. HTML5 mode
    removes the hashbangs from the URL, but also causes an issue if the page is
    refreshed or loaded after being bookmarked. We have to 're-write' our routes
    within Express, so that if our page is directly navigated to, bookmarked, or
    refreshed, we can handle the appropriate file.

    What we've done below is serve the `index.html` file for any non-api URL
    (which we've denoted in our app design by using `/api/` in the API-urls).
    Any non-API routes (which should be only pages) -- loads the given index.html
    file, which contains the `<base>` html element required by Angular's HTML5 mode,
    which renders then the appropriate partial. I know it's confusing, but basically
    all of this just lets us either hook into our angular routing, or bypass it. In
    the case of our API routes, Angular is moot so we need to be able to access our controllers.
*/
