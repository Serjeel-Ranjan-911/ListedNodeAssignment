const { google } = require("./gmailAuth");

const gmail = google.gmail({ version: "v1" });

async function checkNewEmails() {
	try {
		// // Fetch the user's Gmail profile
		const { data: profile } = await gmail.users.getProfile({
			userId: "me",
		});

		// // Fetch the user's inbox
		const { data: inbox } = await gmail.users.messages.list({
			userId: "me",
			labelIds: ["INBOX"],
		});

		// Iterate over each email in the inbox
		for (const email of inbox.messages) {
			const { data: message } = await gmail.users.messages.get({
				userId: "me",
				id: email.id,
			});

			// Check if the email thread has any replies
			const hasReplies =
				message.threadId &&
				message.payload.headers.some(
					(header) =>
						header.name === "From" && header.value === profile.emailAddress
				);

			if (!hasReplies) {
				// Send a reply
				await sendReply(message);
                console.log("Reply mail sent to ",message);
			}
		}
	} catch (err) {
		console.log(err);
	}
}

async function sendReply(message) {
	// Construct the reply email
	const emailLines = [
		"To: " +
			message.payload.headers.find((header) => header.name === "From").value,
		"Subject: Re: " +
			message.payload.headers.find((header) => header.name === "Subject").value,
		"",
		"Hi, this is Serjeel Ranjan's automated reply, I will reply to your mail very soon :)",
	];
	const email = emailLines.join("\r\n");

	// Send the reply
	await gmail.users.messages.send({
		userId: "me",
		requestBody: {
			raw: Buffer.from(email).toString("base64"),
		},
	});

	// const { data: labels } = await gmail.users.labels.list({
	//     userId: 'me',
	//   });
	//   console.log(labels)
	// Add a label to the replied email
	await gmail.users.messages.modify({
		userId: "me",
		id: message.id,
		resource: {
			addLabelIds: ["Label_995227494935183765"],
		},
	});
}

module.exports = {
	checkNewEmails,
};
