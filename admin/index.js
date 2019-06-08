const app = require('express')()

// This is the admin server
// It will be accessible at
// http://<app server url>/admin/<app url>
// This will happen post authentication
// So your app doesn't have to worry about that

function init() {
	const expressFileupload = require('express-fileupload')
	app.use(expressFileupload())
	// Initialize the admin server here
	require('./routes')(app);
}

module.exports = { app, init }