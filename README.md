# Purpose #
A sample application to test the various ways of errors being raised within an angularJS application, and how it relates to new relic.

# Installing & Running #
## To install: ##
Needs NODE ~0.10.x
```
npm install -g bower
npm install
bower install
```
You will also need to add your own New Relic license key in `newrelic.js`. Update the `license_key` property.

Also, the New Relic NodeJS library takes a couple of moments to connect to New Relic servers, so if you immediately refresh after restarting your NodeJS server, the tracking may or may not work. Look through `newrelic_agent.log` to see when it's connected (There should be an extra script tag if it is).

## To run: ##
node index.js

# Notes #
AngularJS catches all Javascript errors thrown within its `$digest` loops. Thus, if you want New Relic's RUM monitoring to be aware of AngularJS errors, you need to reraise the errors.

I've chosen to do this by decorating the $exceptionHandler object.

There are two differing implementations, one which will directly re-throw the error within the same frame, and another that will rethrow in the next frame. Synchronous will stop angular's $digest loop, so all further watchers and promise resolution stops. Asynchronous will not, but may or may not (More testing required), correctly identify the stack trace. Chrome seems to provide the right stack trace (Tested on Chrome 33.0.1750.152)