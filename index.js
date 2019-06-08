const app = require('express')()
const cors = require('cors');

// This app will be mounted at
// http://<app server url>/<app url>

function init() {
	// This function is called once the module loads
	// Here you can initialize everything about your app
	app.use(function (req, res, next) {
		console.log('set cors')
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader("Access-Control-Allow-Headers", "*");
		next();
	});
	require('./routes')(app)
}

// Export these so that the app server can use them
module.exports = { app, init }