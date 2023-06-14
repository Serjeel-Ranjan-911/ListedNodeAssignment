const express = require("express");
const { getAuthUrl, getToken, setCredentials } = require("./gmailAuth");
const { checkNewEmails } = require("./emailResponder");

const app = express();
const port = 3000;

// Set up routes

// Route to initiate the "Login with Google" flow
app.get("/auth", (req, res) => {
	const authUrl = getAuthUrl();
	res.redirect(authUrl);
});

// Route to handle the callback after successful authorization
app.get("/auth/callback", async (req, res) => {
	const { code } = req.query;
	const token = await getToken(code);
	setCredentials(token.tokens);
	res.send("Authorization successful. You can close this page now.");
});

// Start the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

// Start checking for new emails and sending replies
// setInterval(checkNewEmails, getRandomInterval(45000, 120000));
setInterval(checkNewEmails, 5000);

function getRandomInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
