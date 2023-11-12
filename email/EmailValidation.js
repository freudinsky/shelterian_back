export const emailHtml = (
	referencePerson,
	shelterName,
	email,
	validationToken
) => {
	return `<html style="box-sizing: border-box;">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Bestätigung deiner E-Mail Adresse</title>
	</head>
	<body style="max-width: 600px; margin: auto;">
		<header>
            <div style="margin: 0.5rem auto 1.5rem; width: fit-content;"><img src="https://res.cloudinary.com/dcbuuobgt/image/upload/w_180/v1699303721/Logo_sq_aglwpm.webp" alt=""></div>
        </header>
        <main>
		    <div>
    		    <h2 style="font-size:1.3rem">Bestätigung deiner E-Mail Adresse</h2>
                <p>Liebe/r ${referencePerson} ${
		shelterName ? `von ${shelterName}` : ""
	},</p>
                <p>wir freuen uns, dass du und dein Tierheim teil der Shelterian-Familie sein wollt!
                    </p><p>Um deine Registrierung abzuschließen bestätige bitte deine E-Mail Adresse unter folgendem Link:
                </p>
    		</div>
            <div style="margin: 2rem auto; width: fit-content;"><a href="https://www.shelterian.com/validation?email=${email}&token=${validationToken}" style="text-decoration: none; color: white; font-weight: 600; background-color: #AB4E68; padding: 10px 16px; border-radius: 30px;">E-Mail Adresse bestätigen</a></div>
            <div style="font-size: 0.9rem; opacity: 0.8;padding:0 0.7rem;">
                <p>Falls der Button nicht funktionieren sollte, kopiere einfach folgenden Link in die Adresszeile deines Browsers:</p>
                <p>https://www.shelterian.com/validation?email=${email}&token=${validationToken}</p>
            </div>
		</main>
        <hr style="opacity: 0.4; margin: 2rem auto; width: 35%;">

        <footer>
<div style="font-size: 0.8rem; opacity: 0.7;"><p>&copy; 2023 Shelterian</p>
<p >Du bekommst diese E-Mail weil du dich unter <a style="text-decoration: none; color:#AB4E68; font-weight: 600;" href="https://www.shelterian.com">https://www.shelterian.com</a> für einen Tierheim-Account registriert hast. Falls du das nicht warst, dann gib uns bitte schnellstmöglich per E-Mail bescheid!</p>
<p>E-Mail: <a style="text-decoration: none; color:#AB4E68; font-weight: 600;" href="mailto:info@shelterian.com">info@shelterian.com</a></p></div>
        </footer>
	</body>
</html>
`;
};
