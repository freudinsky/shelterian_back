import { google } from "googleapis";

export const sendEmail = (recipient, subject, emailContent) => {
	const jwtClient = new google.auth.JWT({
		email: process.env.SERVICE_ACC_EMAIL,
		key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
		scopes: [process.env.SCOPE],
		subject: process.env.USER_MAIL,
	});

	jwtClient.authorize((err, tokens) => {
		if (err) {
			console.error("Error: ", err);
			return;
		}
	});

	const gmail = google.gmail({ version: "v1", auth: jwtClient });

	function encodeSubjectToMIME(subject) {
		const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString(
			"base64"
		)}?=`;
		return encodedSubject;
	}

	const encodedSubject = encodeSubjectToMIME(subject);
	

	const headers = {
		To: recipient,
		Subject: encodedSubject,
		From: "Shelterian <info@shelterian.com>",
		"Content-Type": "text/html; charset=utf-8",
	};

	const email = Object.keys(headers)
		.map((header) => `${header}: ${headers[header]}`)
		.join("\r\n");

	const fullEmail = `${email}\r\n\r\n${emailContent}`;

	const base64EncodedEmail = Buffer.from(fullEmail)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	gmail.users.messages.send(
		{
			userId: "me",
			requestBody: {
				raw: base64EncodedEmail,
				userId: "me",
			},
		},
		(err, res) => {
			if (err) {
				console.error("Error: ", err);
				return;
			}
			console.log("Email sent: ", res.data);
		}
	);
};
