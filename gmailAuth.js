const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const credentials = require("./credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];

const oAuth2Client = new OAuth2Client(
	credentials.web.client_id,
	credentials.web.client_secret,
	credentials.web.redirect_uris[0]
);
google.options({
	auth: oAuth2Client,
});

function getAuthUrl() {
	return oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});
}

function getToken(code) {
	return oAuth2Client.getToken(code);
}

function setCredentials(token) {
	oAuth2Client.setCredentials(token);
}

module.exports = {
	getAuthUrl,
	getToken,
	setCredentials,
	oAuth2Client,
	google,
};
