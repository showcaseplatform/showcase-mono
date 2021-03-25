const functions = require('firebase-functions');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
var validator = require('validator');
const uuidNamespace = 'b01abb38-c109-4b71-9136-a2aa73ddde27';
var admin = require("firebase-admin");
var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var crypto = require('crypto');
var moment = require('moment');
const axios = require('axios');
let FieldValue = admin.firestore.FieldValue;
let FieldPath = admin.firestore.FieldPath;
const stripe = require('stripe')('sk_test_51FzSlvIUYoR902HWvmyEomOVnWNR7GD1wm3foYNP79Yg0UAbRJkKiGfzKZgL8nYZ8ixVTbftmTzQ1CnZs7SEcrRv000Vmq7Ply');

const ALGOLIA_ID = "JY2ZHM7KLL";
const ALGOLIA_ADMIN_KEY = "97fb4b7b4da91fac807ad880217272d0";
const ALGOLIA_SEARCH_KEY = "680b059e826b1dc3b6b6d3428bbd09b5";

const algoliasearch = require('algoliasearch');
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);





// Update the search index every time a blog post is written.
exports.onUserWrite = functions.firestore.document('users/{uid}').onWrite((data, context) => {
  // Get the note document
  const fullUser = data.after.data();

  const user = {
  	uid:fullUser.uid,
  	creator:fullUser.creator || false,
  	displayName:fullUser.displayName,
  	username:fullUser.username,
  	bio:fullUser.bio,
  	objectID:fullUser.uid,
  	avatar:fullUser.avatar,
  }

  console.log("USER UPDATE WRITE", user)

  // Write to the algolia index
  const index = client.initIndex('users');
  return index.saveObject(user);
});

exports.userIndexDeletion = functions.database.ref(`users/{uid}`).onDelete((snap, context) => {
  	const index = client.initIndex('users');
  	const objectID = context.params.uid;
	return index.deleteObject(objectID);
});

exports.onBadgeSaleWrite = functions.firestore.document('badgesales/{badgeId}').onWrite((data, context) => {
  // Get the note document
  let fullBadge = data.after.data();


  fullBadge.objectID=context.params.badgeId;
  const index = client.initIndex('badgesales');

  if (fullBadge.removedFromShowcase){
  	const objectID = context.params.badgeId;
	return index.deleteObject(objectID);
  } else {
  	return index.saveObject(fullBadge);
  }
});

exports.badgeSaleIndexDeletion = functions.database.ref(`badgesales/{badgeId}`).onDelete((snap, context) => {
  	const index = client.initIndex('badgesales');
  	const objectID = context.params.badgeId;
	return index.deleteObject(objectID);
});

//SQL DB for fiat payments
//fiatwallets
//mGlBq09h0qb4pNo2
//35.229.62.21
//const { Client } = require('pg')
//var conString = "postgres://postgres:mGlBq09h0qb4pNo2@104.155.107.134:5432/fiatwallets";

const blockchainServer = "https://us-central1-showcase-1cc97.cloudfunctions.net/app";


const currencies = [
	"USD",
	"EUR",
	"GBP"
]

/*
  set environment variables via terminal
  $ firebase functions:config:set twilio.account=<accountSid> twilio.token=<authToken> twilio.from=<your from number>
*/
const config = functions.config();
//const twilio = require('twilio')(config.twilio.account, config.twilio.token);
const twilio = require('twilio')("ACfbccd24814d0194118dc5459db768da7", "76e74f82f8c94a0c67ddd94862d74629");
//+12056274546




//var mongoConnectionUri = "mongodb+srv://admin:PouzIjQ1etIVEY93@showcase0-ozcje.mongodb.net/test?retryWrites=true&w=majority"


admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

const sendNotification = (user, title, body, token, data, type, noPush) => {
	//'{    "data":"goes here" }'

	db.collection('users').doc(user).get().then(userdoc => {
		if (!noPush && userdoc && userdoc.data() && userdoc.data().notificationToken){
		    const message = {
		      to: token,
		      sound: 'default',
		      title: title,
		      body: body,
		      data: { "data":"goes here" },
		      _displayInForeground: true,
		    };
		    axios({
			   	url: 'https://exp.host/--/api/v2/push/send', 
			    method: 'post',
			    headers: {
			        Accept: 'application/json',
			        'Accept-encoding': 'gzip, deflate',
			        'Content-Type': 'application/json',
			    },
			    data: message,
		    }).then((res)=> {
		    	console.log("SENT NOTIFICATION", res)
		    	return true;
		    }).catch((err)=> {
		    	console.log("ERR SENDING NOTIFICATION", err)
		    	return true;
		    });
		}

		//add notifications document
		let notificationDoc = {
			title,
			body,
			user,
			created: new Date(),
			data,
			read:false,
			type: type || "normal"
		}

		db.collection('notifications').add(notificationDoc).then((res)=> {
			console.log("Saved notification")
			return true;
		}).catch((err)=>{
			console.log("ERR saving notification", err);
			return true;
		})

		return true;

	}).catch(err => {
		console.log("ERROR getting creator for notification send", err)
		return true;
	});
}

const sendPushNotification = (user, title, body, data) => {
	//'{    "data":"goes here" }'

	db.collection('users').doc(user).get().then(userdoc => {
		if (userdoc && userdoc.data() && userdoc.data().notificationToken){
		    const message = {
		      to: userdoc.data().notificationToken,
		      sound: 'default',
		      title: title,
		      body: body,
		      data: { "data": (data || "goes here") },
		      _displayInForeground: true,
		    };
		    axios({
			   	url: 'https://exp.host/--/api/v2/push/send', 
			    method: 'post',
			    headers: {
			        Accept: 'application/json',
			        'Accept-encoding': 'gzip, deflate',
			        'Content-Type': 'application/json',
			    },
			    data: message,
		    }).then((res)=> {
		    	console.log("SENT NOTIFICATION", res)
		    	return true;
		    }).catch((err)=> {
		    	console.log("ERR SENDING NOTIFICATION", err)
		    	return true;
		    });
		}
		return true;

	}).catch(err => {
		console.log("ERROR getting creator for notification send", err)
		return true;
	});
}

const userAuthenticated = async(req,res,next) => {
	if (req.body.token){
		try {
		    const decodedIdToken = await admin.auth().verifyIdToken(req.body.token);
		    console.log('ID Token correctly decoded', decodedIdToken);
		    let uid = decodedIdToken.uid;
		    req.user = await db.collection('users').doc(uid).get(); 
		    if (req.user.banned === true || req.user.banned === "true"){
		    	return res.status(403).send('Unauthorized');
		    } else {
				return next();
			}
		} catch (error) {
		    console.error('Error while verifying Firebase ID token:', error);
		    return res.status(403).send('Unauthorized');
		}
	} else {
		console.error("Missing AUTHENTICATION token")
		return res.status(403).send('Unauthorized');
	}
}
const optionallyHasUser = async(req,res,next) => {
	if (req.body.token){
		try {
		    const decodedIdToken = await admin.auth().verifyIdToken(req.body.token);
		    console.log('ID Token correctly decoded', decodedIdToken);
		    let uid = decodedIdToken.uid;
		    req.user = await db.collection('users').doc(uid).get(); 
			return next();
		} catch (error) {
		    return next();
		}
	} else {
		return next();
	}
}

app.use(cors);
app.use(cookieParser);


app.get("/testnotifications", (req, res) => {
	//title, body, badge, token, data
	sendNotification("Title", "notification body", "ExponentPushToken[zW_fRQBL8tyga8cZKxAZVy]", '{    "data":"goes here" }');
	res.send("OK")
})
//later we can add a time length for the "ban" if too many attempts
app.post("/phoneAuth", (req, res) => {
	const sendError = error => {
		console.log("ERROR LOG", error)
		res.status(422).send(error);
	}
	const { phone, areaCode } = req.body;
	console.log("Called server PHONE AUTH", phone, areaCode, req.body, ("+"+areaCode+""+phone));
	console.log("COMBINED PHONE NUMBER", ("+"+areaCode+""+phone))
	if (!phone || !areaCode || !validator.isMobilePhone(phone)) return res.status(422).send({error: "Invalid mobile phone number format"});
	console.log(1)
	return admin.auth().getUserByPhoneNumber("+"+areaCode+""+phone).then(user => {
		let existingAttemptRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
		return existingAttemptRef.get().then(doc => {
		    if (!doc.exists) {
			    const code = Math.floor(Math.random() * 899999 + 100000);
			    const expiration = Date.now() + 1 * 90000; // Expires in 1 minutes
			    const verification = { 
			    	code, 
			    	expiration, 
			    	valid: true, 
			    	codesSent: 0, 
			    	codesSentSinceValid: 0, 
			    	attemptsEnteredSinceValid: 0, 
			    	attemptsEntered: 0, 
			    };
			    return twilio.messages.create({
			        body: `Your Showcase login code is ${code}`,
			        to: "+" + areaCode + phone,
			        from: "+12056274546"//config.twilio.from,
			    }).then(message => {
					let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
					return verificationRef.set(verification).then(() => {
						return res.send({ success: true });
					}).catch(sendError);
			    }).catch(sendError);
			} else {
				console.log('existing attempt (a):', doc.data());
		      	const existingAttempt = doc.data();
		      	if (existingAttempt.codesSent > 20 || existingAttempt.attemptsEnteredSinceValid > 8){
		      		console.log("TOO MANY ATTEMPTS NOT SENDING CODE")
		      		return res.status(422).send({ error: 'Too many attempts with this number' });
		      	} else {
		      		console.log("SENDING CODE")
			      	let code = existingAttempt.code;
			      	if (!existingAttempt.valid){ // make a new 
			      		code = Math.floor(Math.random() * 899999 + 100000);
			      	}

					return twilio.messages.create({
						body: `Your Showcase login code is ${code}`,
						to: "+" + areaCode + phone,
						from: "+12056274546"//config.twilio.from
					}).then(message => {
						let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
						let updatedSettings = {
							valid:true,
							codesSent: FieldValue.increment(1), 
							codesSentSinceValid: FieldValue.increment(1), 
							attemptsEnteredSinceValid: FieldValue.increment(1), 
							attemptsEntered: FieldValue.increment(1),
							expiration: (Date.now() + (1 * 90000))
						}
						console.log("SET NEW CODE", code, existingAttempt.code, existingAttempt.valid)
						if (code){
							updatedSettings.code = code;
						}
						return doc.ref.update(updatedSettings).then(() => {
							return res.send({ success: true });
						}).catch(sendError);
					}).catch(sendError);
				}
			}
		})
	}).catch(getUserErr => {
		console.log(21, getUserErr, ("+"+areaCode+""+phone))
	    if (getUserErr.code === 'auth/user-not-found') {
	    	console.log(23)
	    	//later we can save app install ids and ips and we can check if someone is abusing this to send many texts
			let existingAttemptRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
			let getExistingAttempt = existingAttemptRef.get().then(doc => {
			    if (!doc.exists) {
			    	console.log("New verification")
					const code = Math.floor(((Math.random() * 899999) + 100000));
					const expiration = Date.now() + (1 * 90000); // Expires in 1 minutes
					const verification = { code, expiration, valid: true, codesSent:0, codesSentSinceValid:0, attemptsEnteredSinceValid:0, attemptsEntered:0, phoneNumber:("+"+areaCode+""+phone) };
					return twilio.messages.create({
						body: `Your Showcase signup code is ${code}`,
						to: "+" + areaCode + phone,
						from: "+12056274546"//config.twilio.from
					})
					.then(message => {
						let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
						return verificationRef.set(verification).then(() => {
							return res.send({ success: true });
						}).catch(sendError);
					}).catch(sendError);
			    } else {
			      	console.log('existing attempt:', doc.data());
			      	const existingAttempt = doc.data();
			      	if (existingAttempt.codesSent > 20 || existingAttempt.attemptsEnteredSinceValid > 8){
			      		console.log("NOT SENDING CODE TOO MANY ATTEMPT")
			      		return res.status(422).send({ error: 'Too many attempts with this number' });
			      	} else {
			      		console.log("SENDING EIXSTING CODE", existingAttempt.code)
						return twilio.messages.create({
							body: `Your Showcase signup code is ${existingAttempt.code}`,
							to: "+" + areaCode + phone,
							from: "+12056274546"//config.twilio.from
						}).then(message => {
							console.log("TWILLIO MESG", message)
							let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
							let updatedSettings = {
								valid:true,
								codesSent: FieldValue.increment(1), 
								codesSentSinceValid: FieldValue.increment(1), 
								attemptsEnteredSinceValid: FieldValue.increment(1), 
								attemptsEntered: FieldValue.increment(1),
								expiration: (Date.now() + (1 * 90000))
							}
							return doc.ref.update(updatedSettings).then(() => {
								return res.send({ success: true });
							}).catch(sendError);
						}).catch(sendError);
					}
			    }
			}).catch(sendError);
	    } else {
	    	console.log(22)
	      return res.status(422).send({ error: getUserErr });
	    }
	});
})


app.post("/verifyPhoneCode", (req, res) => {
	const sendError = error => res.status(422).send(error);
	const { code, phone, areaCode } = req.body;
	return admin.auth().getUserByPhoneNumber("+"+areaCode+""+phone).then(user => {
		console.log("Has user", user)
		let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
		return verificationRef.get().then((doc) => {

	    /*return db.collection('users')
	        .doc(user.uid)
	        .get()
	        .then((doc) => {*/
			      const timeNow = Date.now();
			      const verification = doc.data();
			      console.log("VERIFICATION", verification)
			      let error = null;

			      if ((verification.code).toString() !== (code).toString()) {
			        error = 'custom/code-does-not-match';
			      } else if (!verification.valid) {
			        error = 'custom/code-already-used';
			      } else if (timeNow > verification.expiration) {
			        error = 'custom/code-expired';
			      }

			      if (error) {
			      	console.log("ERR", error)
			        doc.ref.update({ 
				      	'codesSentSinceValid':FieldValue.increment(1),
			      		'attemptsEnteredSinceValid':FieldValue.increment(1)
				    });

			        return Promise.reject(new Error(error));
			      }

			      doc.ref.update({ 
			      	'valid': false,
			      	'codesSentSinceValid':0,
			      	'attemptsEnteredSinceValid':0
			      });

			      return Promise.resolve(user.uid);
	        })
	        .then(uid =>{ return admin.auth().createCustomToken(uid)})
    		.then(token =>{ return res.send({ token })})
	        .catch(sendError);
	}).catch(getUserErr => {
		console.log("NEW USER0")
	    if (getUserErr.code === 'auth/user-not-found') {
	    	console.log("NEW USER")
			let verificationRef = db.collection('unverifiedsmsverifications').doc(areaCode+phone);
			return verificationRef.get().then(doc => {
			    if (!doc.exists) {
			    	console.log("NO VERIFICATION CODE ERR")
			    	return res.status(422).send({ error: 'No verification code sent to that number!' });
			    } else {
			    	console.log("FOUND VERIFICATION DOC", doc.data())
			    	let verification = doc.data();
				    const timeNow = Date.now();

				    if ((verification.code).toString() !== (code).toString() || !verification.valid || timeNow > verification.expiration) {
				        console.log("CHECKS", (verification.code).toString() !== (code).toString() , !verification.valid , timeNow > verification.expiration)
						//(parseInt(verification.code) !== code) , ((verification.code+"") !== (code+""))
				    	//console.log("CHECKS", ( (verification.code).toString() !== (code).toString() ) )
				    	//console.log("DATA", verification, code, (code+""), timeNow, typeof code, typeof verification.code);
				        doc.ref.update({ 
					      	attemptsEnteredSinceValid: FieldValue.increment(1),
							attemptsEntered: FieldValue.increment(1),
					    });
					    console.log("VERIFICATION INVALID");
				        return res.status(422).send({ error: 'Code not valid' });
				    }

				    doc.ref.update({ 
				      	'valid': false,  
				      	'codesSentSinceValid':0,
				      	'attemptsEnteredSinceValid':0
				    });

				    // create user here
				    console.log("CREADTING NEW USER!!");
				    let newId = uuidv5(phone, uuidNamespace);

				    return admin.auth().createUser({
				    	phoneNumber: "+"+areaCode+""+phone,
				        phoneLocal: phone,
				        areaCode: areaCode,
				        uid: newId
				    }).then(user=> {

				    	let userCurrency = 'USD'; //default USD

				    	const europeanCountryCodes = [
				    		"39",
				    		"43",
				    		"32",
				    		"387",
				    		"385",
				    		"420",
				    		"45",
				    		"372",
				    		"358",
				    		"33",
				    		"49",
				    		"350",
				    		"30",
				    		"36",
				    		"353",
				    		"371",
				    		"382",
				    		"31",
				    		"47",
				    		"48",
				    		"351",
				    		"7",
				    		"421",
				    		"386",
				    		"34",
				    		"46",
				    		"41",
				    	];

				    	if (areaCode+"" === "44"){
				    		userCurrency = "GBP";
				    	} else if (europeanCountryCodes.indexOf(areaCode+"") > -1){
				    		userCurrency = "EUR";
				    	}

				      return db.collection('users')
				        .doc(user.uid)
				        .set({
					    	phoneNumber: "+"+areaCode+""+phone,
					        phoneLocal: phone,
					        areaCode: areaCode,
					        liked:{},
					        followingCount:0,
					        followersCount:0,
					        uid: newId,
					        currency:userCurrency,
					        badgesCount:0,
					        chats:{},
					        balances:{
					        	usd:0,
					        	eur:0,
					        	gbp:0,
					        }
				        })
				        .then((userdoc) => { 
				        	return admin.auth().createCustomToken(user.uid); 
				        })
				        .then(token => { return res.send({ token, newUser:true }) })
				        .catch(sendError);
				    }).catch(sendError);
			    }
			}).catch(sendError);
	    } else {
	    	res.status(422).send({ error: getUserErr });
	    }
	});
});
/*
exports.loadUser = functions.https.onRequest((req, res) => {
	const { token } = req.body;
	admin.auth().verifyIdToken(token)
	  .then(function(decodedToken) {
	    var uid = decodedToken.uid;
		db.collection('users').doc(uid).get().then((myUser) => { 
			return res.send({ myUser })
		})
	}).catch(function(getUserErr) {
	    res.status(422).send({ error: getUserErr });
	});
});
*/
app.post("/loadUser", userAuthenticated, (req, res) => {
	console.log("SENDING USER!!!", req.user.data())
	return res.send({ user:req.user.data() })
})
// END AUTHENTICATION

app.get("/avatar/:id", async (req, res) => {
	let getUser = await db.collection('users').doc(req.params.id).get(); 
  	let user = getUser.data()
  	if (user.avatar){
  		return res.redirect(301, user.avatar)
  	} else {
  		return res.send(500);
  	}
})

//creates crypot wallet for nft storage
app.post("/createWallet", userAuthenticated, (req, res) => {

	let user = req.user.data();

	const { password, hint } = req.body;

	// check auth
		// check for wallet existing
		// if not wallet continue
	//console.log("CREATING WALLET", req.user.data());

	const mnemonic = bip39.generateMnemonic();
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	const hdwallet = hdkey.fromMasterSeed(seed);
	const wallet_hdpath = "m/44'/60'/0'/0/";
	const newwallet = hdwallet.derivePath(wallet_hdpath+ 0).getWallet();
	const addr = newwallet.getAddressString();//wallet.getAddress().toString('hex');
	const pubKey = newwallet.getPublicKeyString();
	const privKey = newwallet.getPrivateKeyString();
	const privKeyString = newwallet.getPrivateKeyString();
	const wallet = {
		address: addr,
		publicKey: pubKey,
		privateKey: privKey,
		mnemonic: mnemonic,
	};


	//console.log("TYPES", typeof privKey, typeof mnemonic)

	const algorithm = 'aes256'; //'aes-256-cbc';

	const ivPrivateKey = crypto.randomBytes(128).toString('hex').slice(0, 16);
	const ivMnemonic = crypto.randomBytes(128).toString('hex').slice(0, 16);

	const encryptionKeyHash = crypto.createHash("sha256").update(password).digest()

	//console.log("Key", encryptionKeyHash.toString('hex'))

	const cipherPrivateKey = crypto.createCipheriv(algorithm, encryptionKeyHash, ivPrivateKey);  
	const cipherMnemonic = crypto.createCipheriv(algorithm, encryptionKeyHash, ivMnemonic);  

	const encryptedPrivateKey = cipherPrivateKey.update(privKey, 'utf8', 'hex') + cipherPrivateKey.final('hex');
	const encryptedMnemonic = cipherMnemonic.update(mnemonic, 'utf8', 'hex') + cipherMnemonic.final('hex');

	console.log("encrypted",encryptedMnemonic, encryptedPrivateKey);


	console.log("USER", user)
	// save to databas

	db.collection('users').doc(user.uid).update({
		crypto:{
			address: addr,
			publicKey:pubKey,
			encryptedPrivateKey: encryptedPrivateKey,
			encryptedMnemonic: encryptedMnemonic,
			ivPrivateKey: ivPrivateKey,
			ivMnemonic: ivMnemonic,
			passwordHint:hint
		}
	}).then(done => {
		console.log('Added wallet to DB');
		return res.send("OK")
	}).catch(err => {
		return res.status(422).send({error: err});
	});
		
});


app.post("/unlockWallet", userAuthenticated, (req, res) => {
	
	let user = req.user.data();

	const { password } = req.body;
	
	const algorithm = 'aes256';

	const encryptionKeyHash = crypto.createHash("sha256").update(password).digest()

	const decipherPrivateKey = crypto.createDecipheriv(algorithm, encryptionKeyHash, user.crypto.ivPrivateKey);
	const decipherMnemonic = crypto.createDecipheriv(algorithm, encryptionKeyHash, user.crypto.ivMnemonic);

	var decryptedPrivateKey = decipherPrivateKey.update(user.crypto.encryptedPrivateKey, 'hex', 'utf8') + decipherPrivateKey.final('utf8');
	var decryptedMnemonic = decipherMnemonic.update(user.crypto.encryptedMnemonic, 'hex', 'utf8') + decipherMnemonic.final('utf8');

	var mnemonicLength = decryptedMnemonic.split(" ").length;
	console.log("CHECKIGN MNEMONIC VALID???", decryptedMnemonic, mnemonicLength)
	if (mnemonicLength === 12){
		res.send({decryptedPrivateKey, decryptedMnemonic})
	} else {
		return res.status(422).send({error: "invalid"});
	}
	//console.log("decrypted", decryptedMnemonic, decryptedPrivateKey);

})

app.post("/backupWallet", userAuthenticated, (req, res) => {

	let user = req.user.data();

	const { password } = req.body;

	const algorithm = 'aes256';

	const encryptionKeyHash = crypto.createHash("sha256").update(password).digest()

	//const decipherPrivateKey = crypto.createDecipheriv(algorithm, encryptionKeyHash, ivPrivateKey);
	const decipherMnemonic = crypto.createDecipheriv(algorithm, encryptionKeyHash, user.crypto.ivMnemonic);

	//var decryptedPrivateKey = decipherPrivateKey.update(encryptedPrivateKey, 'hex', 'utf8') + decipherPrivateKey.final('utf8');
	var decryptedMnemonic = decipherMnemonic.update(user.crypto.encryptedMnemonic, 'hex', 'utf8') + decipherMnemonic.final('utf8');
	//console.log("decrypted", decryptedMnemonic, decryptedPrivateKey);
	res.send({mnemonic:decryptedMnemonic})

});

/*
curl -X GET "https://api.sandbox.transferwise.tech/v1/account-requirements?source=EUR&target=USD&sourceAmount=1000"

curl -X POST "https://api.sandbox.transferwise.tech/v1/transfer-requirements" \
     -H "Authorization: Bearer d0f25271-e191-4205-bdd1-d5187e220a78" \
     -H "Content-Type: application/json" \
     -d '{ 
            "targetAccount": 13957304,
            "quote": 2123462,
            "customerTransactionId": "583479ddezdr5ilcdfv6qixvvileux5c"
         }'
*/

const transferWiseProfile = "14510070"
const transferwiseToken = "d0f25271-e191-4205-bdd1-d5187e220a78"

app.post("/payoutaccount", userAuthenticated, (req,res)=> {

	let user = req.user.data();

	if (req.body.currency ==="USD"){
		axios({
			method:"post",
			url:"https://api.sandbox.transferwise.tech/v1/accounts",
			data: {
				profile:transferWiseProfile,
				currency:"USD",
				type: "aba",
				accountHolderName: req.body.name,
				ownedByCustomer: true,
				details:{
					legalType: "PRIVATE",
					abartn:req.body.routingnumber,
					accountNumber:req.body.accountnumber,
					accountType: req.body.accounttype,
						city: req.body.city,
					address:{
						country: "US",//req.body.country,
						firstLine:req.body.firstline,
						postCode:req.body.postalcode,
					}
				}
			},
			headers:{
				Authorization: `Bearer ${transferwiseToken}`
			}
		}).then((response)=> {
			if (response.data && response.data.id){
				return db.collection('users').doc(user.uid).update({transferwiseIdUSD:response.data.id, transferwiseAccountNumberUSD:req.body.accountnumber}).then(done => {
					console.log('Updated profile');
					return res.send("OK")
				}).catch(err => {
					console.log("ERR FB DB")
					return res.status(422).send({error: err.toString()});
				});
			} else {
				console.log("ERR TW Input")
				return res.status(422).send({error: "Invalid input"});
			}
		}).catch((err)=> {
			console.log("TW ERR", err)
			return res.status(422).send({error: err.toString()});
		})
	} else if (req.body.currency ==="GBP"){
		axios({
			method:"post",
			url:"https://api.sandbox.transferwise.tech/v1/accounts",
			data: {
				profile:transferWiseProfile,
				currency:"GBP",
				type: "sort_code",
				accountHolderName: req.body.name,
				ownedByCustomer: true,
				details:{
					legalType:"PRIVATE",
					sortCode:req.body.sortcode,
					accountNumber:req.body.accountnumber
				}
			},
			headers:{
				Authorization: `Bearer ${transferwiseToken}`
			}
		}).then((response)=> {
			if (response.data && response.data.id){
				return db.collection('users').doc(user.uid).update({transferwiseIdGBP:response.data.id, transferwiseAccountNumberGBP:req.body.accountnumber}).then(done => {
					console.log('Updated profile');
					return res.send("OK")
				}).catch(err => {
					console.log("ERR FB DB")
					return res.status(422).send({error: err.toString()});
				});
			} else {
				console.log("ERR TW Input")
				return res.status(422).send({error: "Invalid input"});
			}
		}).catch((err)=> {
			console.log("TW ERR", err)
			return res.status(422).send({error: err.toString()});
		})
	} else if (req.body.currency ==="EUR"){
		axios({
			method:"post",
			url:"https://api.sandbox.transferwise.tech/v1/accounts",
			data: {
				profile:transferWiseProfile,
				currency:"EUR",
				type: "iban",
				accountHolderName: req.body.name,
				ownedByCustomer: true,
				details:{
					legalType:"PRIVATE",
					//BIC:req.body.bic,
					IBAN:req.body.iban
				}
			},
			headers:{
				Authorization: `Bearer ${transferwiseToken}`
			}
		}).then((response)=> {
			if (response.data && response.data.id){
				return db.collection('users').doc(user.uid).update({transferwiseIdEUR:response.data.id, transferwiseAccountNumberEUR: req.body.iban}).then(done => {
					console.log('Updated profile');
					return res.send("OK")
				}).catch(err => {
					console.log("ERR FB DB")
					return res.status(422).send({error: err.toString()});
				});
			} else {
				console.log("ERR TW Input")
				return res.status(422).send({error: "Invalid input"});
			}
		}).catch((err)=> {
			console.log("TW ERR", err)
			return res.status(422).send({error: err.toString()});
		})
	} else {
		console.log("INVALID CURRENCY")
		return res.status(422).send({error: "Invalid currency"});
	}
})
app.post("/payoutsend",userAuthenticated, (req,res)=> {
	let user = req.user.data();
	const originalBalance = user.balances[req.body.currency.toLowerCase()];
	//minmum 20 usd/eur/gbp withdrawal
	if (req.body.amount && req.body.currency && ((!user.kycVerified && parseFloat(req.body.amount) > 500) /*|| (user.kycVerified && parseFloat(req.body.amount) > 2000)*/)){ //500 USD, GBP or EU
		return res.status(422).send({error: "Please contact Showcase support to increase your withdrawal limits."});
	} else if (user.recentWithdrawalDate && user.recentWithdrawalAmount && moment(new Date()).diff( moment(user.recentWithdrawalDate.toDate()), 'hours') <= 24 && 
		((!user.kycVerified && (parseFloat(req.body.amount) + user.recentWithdrawalAmount) > 500) /*|| (user.kycVerified && (parseFloat(req.body.amount) + user.recentWithdrawalAmount) > 2000)*/)){
		console.log("TIEM DIFF",moment(new Date()).diff( moment(user.recentWithdrawalDate), 'hours'), user.recentWithdrawalDate, user.recentWithdrawalDate.toDate())
		return res.status(422).send({error: "Please contact Showcase support to increase your withdrawal limits."});
	} else if (req.body.amount && parseFloat(req.body.amount) > 20 && req.body.currency && user.balances[req.body.currency.toLowerCase()] && user.balances[req.body.currency.toLowerCase()] >= parseFloat(req.body.amount)){
		axios({
			method:"post",
			url:"https://api.sandbox.transferwise.tech/v1/quotes",
			data: {
				profile:transferWiseProfile,
				source:"EUR",
				target:req.body.currency,
				rateType: "FIXED",
				targetAmount:parseFloat(req.body.amount),
				type: "BALANCE_PAYOUT"
			},
			headers:{
				Authorization: `Bearer ${transferwiseToken}`
			}
		}).then((quoteResponse)=> {
			if (quoteResponse && quoteResponse.data && quoteResponse.data.id){
				let updateObj = {
				}
				updateObj["balances."+req.body.currency.toLowerCase()] = FieldValue.increment((-parseFloat(req.body.amount)))

				console.log("BALANCE UPD", updateObj)
				if (!user.recentWithdrawalDate || moment(new Date()).diff( moment(user.recentWithdrawalDate.toDate()), 'hours') > 24){
					updateObj.recentWithdrawalDate = new Date();
					updateObj.recentWithdrawalAmount = parseFloat(req.body.amount)
				} else {
					updateObj.recentWithdrawalAmount = FieldValue.increment(parseFloat(req.body.amount))
				}

				let transferwiseId = user["transferwiseId"+req.body.currency.toUpperCase()];

				return db.collection('users').doc(user.uid).update(updateObj).then(updateresult => {
					return db.collection('users').doc(user.uid).get().then(userdoc => {
						if (userdoc.data() && userdoc.data().balances && userdoc.data().balances[req.body.currency.toLowerCase()] >= 0){
							//continue
							//console.log("After deducting withdrawal amount user had >= 0 balance, so we proceed with withdrawal. amount:", userdoc.data().balances[req.body.currency.toLowerCase()]);

							let customerTransactionId = uuidv4();

							return axios({
								method:"post",
								url:"https://api.sandbox.transferwise.tech/v1/transfers",
								data: {
									customerTransactionId: customerTransactionId,
									quote: quoteResponse.data.id,
									targetAccount: transferwiseId,
									details:{
										reference: "Showcase",
										transferPurpose: "verification.transfers.purpose.other",
										transferPurposeOther:"Showcase Payout",
										sourceOfFunds:"verification.source.of.funds.other",
										sourceOfFundsOther:"Showcase badge sales"
									}
								},
								headers:{
									Authorization: `Bearer ${transferwiseToken}`
								}
							}).then((transferResponse)=> {
								if (transferResponse && transferResponse.data && transferResponse.data.id){
									return axios({
										method:"post",
										url:"https://api.sandbox.transferwise.tech/v3/profiles/"+transferWiseProfile+"/transfers/"+transferResponse.data.id+"/payments",
										data: {
											type:"BALANCE"
										},
										headers:{
											Authorization: `Bearer ${transferwiseToken}`
										}
									}).then((fundResponse)=> {
										if (fundResponse && fundResponse.data && fundResponse.data.status && fundResponse.data.status === "COMPLETED"){

												// now get ETA for withdrawal receipt to show user. 
												
											axios({
												method:"get",
												url:"https://api.sandbox.transferwise.tech/v1/delivery-estimates/"+transferResponse.data.id,
												headers:{
													Authorization: `Bearer ${transferwiseToken}`
												}
											}).then((etaResponse)=> {
												if (etaResponse && etaResponse.data && etaResponse.data.estimatedDeliveryDate){
													let withdrawalData = {
														user:user.uid,
														created: new Date(),
														customerTransactionId: customerTransactionId,
														transactionId:transferResponse.data.id,
														quote: quoteResponse.data.id,
														targetAccount: transferwiseId,
														amount: req.body.amount,
														currency:req.body.currency,
														success:true,
														eta: new Date(etaResponse.data.estimatedDeliveryDate)
													}
													return db.collection('withdrawals').add(withdrawalData).then(done => {
														return true;
													}).catch(err => {
														console.log("ERROR creating receipt", err)
														return true;
													});
												} else {
													let withdrawalData = {
														user:user.uid,
														created: new Date(),
														customerTransactionId: customerTransactionId,
														transactionId:transferResponse.data.id,
														quote: quoteResponse.data.id,
														targetAccount: transferwiseId,
														amount: req.body.amount,
														currency:req.body.currency,
														success:true,
													}
													return db.collection('withdrawals').add(withdrawalData).then(done => {
														return true;
													}).catch(err => {
														console.log("ERROR creating receipt", err)
														return true;
													});
												}
											}).catch((err)=> {
												console.log("ERR ", err)
												let withdrawalData = {
													user:user.uid,
													created: new Date(),
													customerTransactionId: customerTransactionId,
													transactionId:transferResponse.data.id,
													quote: quoteResponse.data.id,
													targetAccount: transferwiseId,
													amount: req.body.amount,
													currency:req.body.currency,
													success:true,
												}
												return db.collection('withdrawals').add(withdrawalData).then(done => {
													return true;
												}).catch(err => {
													console.log("ERROR creating receipt", err)
													return true;
												});
											})

											return res.send("OK");


										} else {

											//first put back balance to user. 
											let updateObjError = {
												recentWithdrawalAmount: FieldValue.increment((-parseFloat(req.body.amount)))
											}
											updateObjError["balances."+req.body.currency.toLowerCase()] = FieldValue.increment((parseFloat(req.body.amount)))
											db.collection('users').doc(user.uid).update(updateObjError).then(done => {
												return true;
											}).catch(err => {
												console.log("ERR restoring user balance", err)
												return true;
											})
											// now we will create a withdrawalreceipt with a failed status.
											let withdrawalData = {
												user:user.uid,
												created: new Date(),
												customerTransactionId: customerTransactionId,
												transactionId:transferResponse.data.id,
												quote: quoteResponse.data.id,
												targetAccount: transferwiseId,
												amount: req.body.amount,
												currency:req.body.currency,
												error:fundResponse.data.errorCode || "Unknown error (step 3)"
											}
											db.collection('withdrawals').add(withdrawalData).then(done => {
												return true;
											}).catch(err => {
												console.log("ERROR creating receipt", err)
												return true;
											});

											return res.status(422).send({error: fundResponse.data.errorCode || "Error processing payment to your account"});
										}
									}).catch((err) => {

										let updateObjError = {
											recentWithdrawalAmount: FieldValue.increment((-parseFloat(req.body.amount)))
										}
										updateObjError.balances[req.body.currency.toLowerCase()] = FieldValue.increment((parseFloat(req.body.amount)))
										db.collection('users').doc(user.uid).update(updateObjError).then(done => {
											return true;
										}).catch(err => {
											console.log("ERR restoring user balance", err)
											return true;
										})
										// now we will create a withdrawalreceipt with a failed status.
										let withdrawalData = {
											user:user.uid,
											created: new Date(),
											customerTransactionId: customerTransactionId,
											quote: quoteResponse.data.id,
											targetAccount: transferwiseId,
											transactionId:transferResponse.data.id,
											amount: req.body.amount,
											currency:req.body.currency,
											error:err.toString() +"#2"
										}
										db.collection('withdrawals').add(withdrawalData).then(done => {
											return true;
										}).catch(err => {
											console.log("ERROR creating receipt", err)
											return true;
										});

										return res.status(500).send({error: err.toString()});
									})
								} else {

									let updateObjError = {
										recentWithdrawalAmount: FieldValue.increment((-parseFloat(req.body.amount)))
									}
									updateObjError["balances."+req.body.currency.toLowerCase()] = FieldValue.increment((parseFloat(req.body.amount)))
									db.collection('users').doc(user.uid).update(updateObjError).then(done => {
										return true;
									}).catch(err => {
										console.log("ERR restoring user balance", err);
										return true;
									})
									// now we will create a withdrawalreceipt with a failed status.
									let withdrawalData = {
										user:user.uid,
										created: new Date(),
										customerTransactionId: customerTransactionId,
										quote: quoteResponse.data.id,
										targetAccount: transferwiseId,
										amount: req.body.amount,
										currency:req.body.currency,
										error: "Transfer could not be created"
									}

									db.collection('withdrawals').add(withdrawalData).then(done => {
										return true;
									}).catch(err => {
										console.log("ERROR creating receipt", err)
										return true;
									});


									return res.status(422).send({error: "Unable to create transfer"});
								}
							}).catch((err)=> {


								let updateObjError = {
									recentWithdrawalAmount: FieldValue.increment((-parseFloat(req.body.amount)))
								}
								updateObjError["balances."+req.body.currency.toLowerCase()] = FieldValue.increment((parseFloat(req.body.amount)))
								db.collection('users').doc(user.uid).update(updateObjError).then(done => {
									return true;
								}).catch(err => {
									console.log("ERR restoring user balance", err)
									return true;
								})
								// now we will create a withdrawalreceipt with a failed status.
								let withdrawalData = {
									user:user.uid,
									created: new Date(),
									customerTransactionId: customerTransactionId,
									quote: quoteResponse.data.id,
									targetAccount: transferwiseId,
									amount: req.body.amount,
									currency:req.body.currency,
									error: err.toString() +"#1"
								}
								
								db.collection('withdrawals').add(withdrawalData).then(done => {
									return true;
								}).catch(err => {
									console.log("ERROR creating receipt", err)
									return true;
								});



								return res.status(500).send({error: err.toString()});
							})
						} else {
							console.log("2 After deducting amount user had less than 0 balance, so we revert and cancel.", userdoc.data().balances)


							let updateObjError = {
								recentWithdrawalAmount: FieldValue.increment((-parseFloat(req.body.amount)))
							}
							updateObjError.balances[req.body.currency.toLowerCase()] = FieldValue.increment((parseFloat(req.body.amount)))
							db.collection('users').doc(user.uid).update(updateObjError).then(done => {
								console.log("RESET USER BALANCE")
								return true;
							}).catch(err => {
								console.log("ERR restoring user balance", err)
								return true;
							})
							// now we will create a withdrawalreceipt with a failed status.
							let withdrawalData = {
								user:user.uid,
								created: new Date(),
								quote: quoteResponse.data.id,
								targetAccount: transferwiseId,
								amount: req.body.amount,
								currency:req.body.currency,
								error: "Insufficient funds"
							}

							console.log("WITHDRAWAL RECEIPT", withdrawalData)

							db.collection('withdrawals').add(withdrawalData).then(done => {
								console.log("CREATED WITHDRAWAL RECEIPT")
								return true;
							}).catch(err => {
								console.log("ERROR creating receipt", err)
								return true;
							});


							return res.status(422).send({error: "Invalid withdrawal amount"});
						}
					}).catch(err => {
						return res.status(500).send({error: err.toString()});
					});
				}).catch(err => {
					return res.status(500).send({error: err.toString()});
				});
			} else {
				return res.status(422).send({error: "Invalid withdrawal amount"});
			}
		}).catch((err)=> {
			return res.status(500).send({error: err.toString()});
		})
	} else {
		console.log("Err amount1 ", req.body.amount ,  req.body.currency , user.balances[req.body.currency.toLowerCase()])
		return res.status(422).send({error: "Invalid withdrawal amount"});
	}
})

app.post("/createCard", userAuthenticated, (req,res)=> {
	let user = req.user.data();
	const { stripetoken, lastfour } = req.body;
	if (!lastfour){
		return res.status(422).send({error: "Invalid Card"});
	} else {
		stripe.customers.create({
		  source:stripetoken,
		  metadata:{
		  	uid:user.uid,
		  	phone:user.phoneNumber,
		  	username:user.username,
		  	displayName:user.displayName,
		  	email:user.email
		  },
		  phone:user.phoneNumber
		}).then(customer => {
			console.log("created stripe customer id:", customer.id, customer)
			db.collection('users').doc(user.uid).update({stripeId:customer.id, stripeLastFourDigits:lastfour}).then(done => {
				console.log('Updated profile');
				return res.send("OK")
			}).catch(err => {
				return res.status(422).send({error: err});
			});
			return res.send("OK");
		}).catch(error => {
			console.error(error)
			return res.status(422).send({error: error.toString()});
		});
	}
})

app.post("/notificationToken", userAuthenticated, (req,res)=> {
	let user = req.user.data();
	let { notificationtoken } = req.body;
	return db.collection('users').doc(user.uid).update({notificationToken:notificationtoken}).then(done => {
		console.log('Updated notification token');
		return res.send("OK")
	}).catch(err => {
		return res.status(422).send({error: err});
	});
})
app.post("/removeNotificationToken", userAuthenticated, (req,res)=> {
	let user = req.user.data();
	return db.collection('users').doc(user.uid).update({notificationToken:null}).then(done => {
		console.log('Removed notification token');
		return res.send("OK")
	}).catch(err => {
		return res.status(422).send({error: err});
	});
})
app.post("/updateProfile", userAuthenticated, (req,res)=> {

	let user = req.user.data();

	let updateData = {};


	if (req.body.bio){
		if (req.body.bio.length <= 240){
			updateData.bio = req.body.bio;
			addEmail()
		} else {
			return res.status(422).send("invalid_bio");
		}
	} else {
		addEmail()
	}
	
	async function addEmail(){
		if (req.body.email){
			let existingUser = await db.collection('users').where('email', '==', req.body.email).get(); 
			if (validator.isEmail(req.body.email) && (!existingUser.exists || user.email === req.body.email)){
				updateData.email = req.body.email;
				return addUsername()
			} else {
				return res.status(422).send("invalid_email");
			}
		} else {
			return addUsername()
		}
	}
	async function addUsername(){
		if (req.body.username){
			let existingUser = await db.collection('users').where('username', '==', req.body.username).get(); 
			if (req.body.username.length <= 28 && (!existingUser.exists || user.username === req.body.username) && /^[a-zA-Z0-9_]+$/g.test(req.body.username) ){
				
				updateData.username = req.body.username;
				return addDisplayName();
			} else {
				console.log("EXISTING USER", existingUser)
				return res.status(422).send("invalid_username");
			}
		} else {
			return addDisplayName()
		}
	}
	function addDisplayName(){
		if (req.body.displayName){
			if (req.body.displayName.length <= 36){
				updateData.displayName = req.body.displayName;
				return addBirthdate()
			} else {
				return res.status(422).send("invalid_displayname");
			}
		} else {
			return addBirthdate()
		}
	}
	function addBirthdate(){
		if (req.body.birthDate){
			if (new Date(req.body.birthDate) < new Date(2005, 12, 31)){
				updateData.birthDate = new Date(req.body.birthDate);
				updateData.birthDay = updateData.birthDate.getDate()
				updateData.birthMonth = updateData.birthDate.getMonth()
				updateData.birthYear = updateData.birthDate.getFullYear()
				return addCurrency()
			} else {
				return res.status(422).send("invalid_birthdate");
			}
		} else {
			return addCurrency()
		}
	}
	function addCurrency(){
		if (req.body.currency){
			if (currencies.indexOf(req.body.currency) > -1){
				updateData.currency = req.body.currency
				return addAvatar()
			} else {
				return res.status(422).send("invalid_currency");
			}
		} else {
			return addAvatar()
		}
	}
	function addAvatar(){
		if (req.body.avatar){
			updateData.avatar = 'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/images%2F'+user.uid +"?alt=media"
			return doUpdates()
		} else {
			return doUpdates()
		}
	}
	function doUpdates(){
		console.log("DO UPDATE ", updateData)
		if (Object.keys(updateData).length <1 ){
			return res.send("OK")
		} else {
			db.collection('users').doc(user.uid).update(updateData).then(done => {
				console.log('Updated profile');
				return res.send("OK")
			}).catch(err => {
				return res.status(422).send({error: err});
			});
		}
	}

})

/*
app.post("/updateCurrency", userAuthenticated, (req,res)=> {

	let user = req.user.data();

	let updateData = {};

	if (req.body.currency){
		if (currencies.indexOf(req.body.currency) > -1){
			updateData.currency = req.body.currency
			db.collection('users').doc(user.uid).update(updateData).then(done => {
				console.log('Updated profile');
				return res.send("OK")
			}).catch(err => {
				return res.status(422).send({error: err});
			});
		} else {
			return res.status(422).send("invalid_currency");
		}
	} else {
		return res.status(422).send("invalid_currency");
	}
})
*/

app.post("/readMessageThread", userAuthenticated, (req,res)=>{
	let user = req.user.data();
	const { userId, chatId } = req.body;
	console.log("BODY READ MSG", req.body)
	if (userId && chatId){
		let updateData = {}

		updateData['chats.'+userId+'.unreadMessageCount'] =  0; 
		
		db.collection('users').doc(user.uid).update(updateData).then(done => {
			console.log('Updated profile');
			return true;
		}).catch(err => {
			console.error("Error writing document: ", err);
			return true;
		});

		let chatUpdate = {}

		db.collection("chats").doc(chatId).collection('messages').where('read', '==', false).get().then(snapshot => {

			if (snapshot.empty) {
				return true;
			}  

			return snapshot.docs.forEach(doc => {
				console.log("UPDTING INDIVIDL MESSG", doc)	
				db.collection("chats").doc(chatId).collection('messages').doc(doc.id).update({read:true}).then(done => {
					console.log('Updated individual message');
					return true;
				}).catch(err => {
					console.error("Error writing invidiual message document: ", err);
					return true;
				});
			})

		}).catch(err => {
			console.error("Error getting invidiual message document: ", err);
			return true;
		});

		return res.send("OK")


	} else {
		return res.status(422).send({error: "Error"});
	}
});

app.post("/sendMessage", userAuthenticated, (req,res)=>{
	
	let user = req.user.data();
	const { message, userId, username, chatId } = req.body;
	console.log("BODY SEND MSG", req.body)
	if (!message || !userId){
		console.log("Missing data message")
		return res.status(422).send({error: "Missing data"});

	} else if (user.chats[userId] && user.chats[userId].chatId && user.chats[userId].chatId !== chatId){
		console.log("CHat id invalid")
		return res.status(422).send({error: "Error"});
	} else if (!user.chats[userId]){

		let newMessage = {
			sent: new Date(),
			read:false,
			message:message,
			from:user.uid,
			to:userId,
			users:[user.uid, userId]
		}

		let newChat = {
			lastMessageDate: new Date(), 
			lastMessage: message,
			users: [userId, user.uid],
		}

		db.collection("chats").add(newChat).then(docRef => {
			let chatId = docRef.id;

			db.collection('chats').doc(chatId).collection('messages').add(newMessage).then(done => {
				console.log('added new message');
				return true;
			}).catch(err => {
				console.error("Error writing document: ", err);
				return true;
			});

			// now add chat ID to both user profiles. 

			let updateDataOtherUser = {}

			
			updateDataOtherUser['chats.'+user.uid+'.chatId'] = chatId; 
			updateDataOtherUser['chats.'+user.uid+'.lastMessageDate'] = new Date(); 
			updateDataOtherUser['chats.'+user.uid+'.unreadMessageCount'] =  0; 
			updateDataOtherUser['chats.'+user.uid+'.lastMessage'] = message;
			updateDataOtherUser['chats.'+user.uid+'.archived'] = false;
			updateDataOtherUser['chats.'+user.uid+'.username'] = user.username;
			

			db.collection('users').doc(userId).update(updateDataOtherUser, { merge: true }).then(done => {
				console.log('Updated profile');
				return true;
			}).catch(err => {
				console.error("Error writing document: ", err);
				return true;
			});
			let updateData = {}

			
			updateData['chats.'+userId+'.chatId'] = chatId;
			updateData['chats.'+userId+'.lastMessageDate'] = new Date(); 
			updateData['chats.'+userId+'.unreadMessageCount'] =  0; 
			updateData['chats.'+userId+'.lastMessage'] = message;
			updateData['chats.'+userId+'.archived'] = false;
			updateData['chats.'+userId+'.username'] = username;
			

			db.collection('users').doc(user.uid).update(updateData, { merge: true }).then(done => {
				console.log('Updated profile');
				return true;
			}).catch(err => {
				console.error("Error writing document: ", err);
				return true;
			});

			sendPushNotification(userId, "New Message from "+(user.displayName || "Unknown"), message, newMessage)

			return res.json({chatId})
		    
		})
		.catch(error => {
		    console.error("Error writing document: ", error);
		});
	} else {

		let newMessage = {
			sent: new Date(),
			read:false,
			message:message,
			from:user.uid,
			to:userId,
			users:[user.uid, userId]
		}

		db.collection('chats').doc(chatId).collection("messages").add(newMessage).then(done => {
			console.log('added new message');


			// here we jsut update the last message stuff like date
			let updateDataOtherUser = {}
			updateDataOtherUser['chats.'+user.uid+'.lastMessageDate'] = new Date();
			updateDataOtherUser['chats.'+user.uid+'.unreadMessageCount'] = FieldValue.increment(1); 
			updateDataOtherUser['chats.'+user.uid+'.lastMessage'] = message;
			updateDataOtherUser['chats.'+user.uid+'.username'] = user.username;
			
			db.collection('users').doc(userId).update(updateDataOtherUser, { merge: true }).then(done => {
				console.log('Updated profile');
				return true;
			}).catch(err => {
				console.error("Error writing document: ", err);
				return true;
			});

			let updateData = {}
			updateData['chats.'+userId+'.lastMessageDate'] = new Date();
			updateData['chats.'+userId+'.lastMessage'] = message;
			updateData['chats.'+userId+'.username'] = username;
			
			
			db.collection('users').doc(user.uid).update(updateData, { merge: true }).then(done => {
				console.log('Updated profile');
				return true;
			}).catch(err => {
				console.error("Error writing document: ", err);
				return true;
			});


			let chatUpdate = {
				lastMessageDate: new Date(), 
				lastMessage: message,
			}

			db.collection("chats").doc(chatId).update(chatUpdate, { merge: true }).then(done => {
				console.log('Updated profile');
				return true;
			}).catch(err => {
				console.error("Error writing document: ", err);
				return true;
			});

			sendPushNotification(userId, "New Message from "+(user.displayName || "Unknown"), message, newMessage)

			return res.send("OK")




		}).catch(err => {
			return res.status(422).send({error: err});
		});
	}
});

app.post("/currencies", userAuthenticated, (req,res)=> {

	db.collection('currencyrates').doc("rates").get().then(doc => {
		console.log('Updated currency rates data');
		if (!doc.exists){
			return res.status(422).send({error: "empty currencies"});
		} else {
			return res.json({currencies: doc.data()})
		}
	}).catch(err => {
		console.log("ERR UPDATING CURRENCY", err)
		return res.status(422).send({error: err});
	});
})
app.post("/countView", userAuthenticated, (req,res)=> {

	const { marketplace, badgeid } = req.body;

		
	let checkBadge = (badgeowner, badgeid, callback)=>{

		const data = {
			badgeid,
			badgeowner,
			token: functions.config().blockchainauth.token,
		}
		console.log("BAGDE VERIFICATION DATA", data)

		
		/*axios.post(blockchainServer+'/getMetadataOfBadge', {badgetype:"57896044618658097711785492504343953941267134110420635948653900123522597912576", token: functions.config().blockchainauth.token})
		.then(async (response) => {
		    console.log("METADATA", response.data);
		    return true;
		}).catch((e)=>{
			console.log("error verifying badge ownership", e)
			return true;
		})

		axios.post(blockchainServer+'/getOwnershipOfBadge', {badgeid, token: functions.config().blockchainauth.token})
		.then(async (response) => {
		    console.log("current owner is:", response.data);
		    return true;
		}).catch((e)=>{
			console.log("error verifying badge ownership", e)
			return true;
		})


		axios.post(blockchainServer+'/verifyBadgeInEscrow', {badgeid, token: functions.config().blockchainauth.token})
		.then(async (response) => {
		    console.log("escrow is:", response.data);
		    return true;
		}).catch((e)=>{
			console.log("error verifying badge escrow", e)
			return true;
		})
*/
		return axios.post(blockchainServer+'/verifyOwnershipOfBadge', data)
		.then(async (response) => {
		    console.log(response.data);
		    if (response.data.isOwner){
		    	return callback(true)
		    } else {
		    	return callback()
		    }
		}).catch((e)=>{
			console.log("error verifying badge balance", e)
			return callback(true); // we don't want to have a network error make peole get banned.
		})
		
	}
	//random badge inspection....
    let min = Math.ceil(1);
    let max = Math.floor(51);
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
	if(!marketplace){

		//check badge
		db.collection('badges').doc(badgeid).get().then(doc => {
			console.log("LAST VIEWED", doc.data().lastViewed)
			if (randomNum === 51){
				
				return db.collection('users').doc(doc.data().creatorId).get().then(userdoc => {
					console.log("CHECKING BADGE from creator", doc.data().creatorId, userdoc)
					console.log("CHECKING BADGE_"+doc.data().creatorId+"_")
					if (!userdoc.exists){
						return res.status(422).send("creator not found");
					} else {
						return checkBadge(userdoc.data().crypto.address, doc.data().tokenId, function(success){

							console.log("CHECKING BADGE 1", success)
							if (success){

								return db.collection('badges').doc(badgeid).update({views:FieldValue.increment(1), lastViewed:(new Date())}).then(snapshot => {
									console.log("CHECKING BADGE 2")
									return res.send("OK")
								}).catch((e)=>{
									console.log('Error getting documents', err);
									return res.send("OK")
								})

							} else {
								db.collection('users').doc(doc.data().creatorId).update({banned:true})
								db.collection('badges').doc(badgeid).update({removedFromShowcase:true})
								return res.status(422).send("removed");
							}
						})
					}
				}).catch((err)=>{
					console.log('Error getting documents', err);
					return res.status(422).send({error: err});
				})
			} else {
				return db.collection('badges').doc(badgeid).update({views:FieldValue.increment(1), lastViewed:(new Date())}).then(snapshot => {
					return res.send("OK")
				}).catch((e)=>{
					console.log('Error getting documents', err);
					return res.status(422).send({error: err});
				})
			}
		}).catch((err)=>{
			console.log('Error getting documents', err);
			return res.status(422).send({error: err});
		})


	} else {

		db.collection('badgesales').doc(badgeid).update({views:FieldValue.increment(1)}).then(snapshot => {
			return res.send("OK")
		}).catch((err)=>{
			console.log('Error getting documents', err);
			return res.status(422).send({error: err});
		})
	}



	

})
app.post("/countLike", userAuthenticated, (req,res)=> {
	
	const { marketplace, badgeid } = req.body;
	let user = req.user.data();

	if (user.liked && user.liked[badgeid]){
		return res.status(422).send("Already liked");
	} else {
		//let updateData = {liked:FieldValue.arrayUnion(badgeid)};
		user.liked[badgeid] = true;
		db.collection('users').doc(user.uid).update({liked:user.liked}).then(snapshot => {
			if (marketplace){
				return db.collection('badgesales').doc(badgeid).update({likes:FieldValue.increment(1)}).then(snapshot => {
					return res.send("OK")
				}).catch((err)=>{
					console.log('Error getting documents', err);
					return res.status(422).send({error: err});
				})
			} else {
				return db.collection('badges').doc(badgeid).update({likes:FieldValue.increment(1)}).then(snapshot => {
					return res.send("OK")
				}).catch((err)=>{
					console.log('Error getting documents', err);
					return res.status(422).send({error: err});
				})
			}
		}).catch((err)=>{
			console.log('Error getting documents', err);
			return res.status(422).send({error: err});
		})
	}
})
app.post("/unLike", userAuthenticated, (req,res)=> {
	
	const { marketplace, badgeid } = req.body;
	let user = req.user.data();

	if (!user.liked || !user.liked[badgeid]){
		return res.status(422).send("Already unliked");
	} else {
		//let updateData = {liked:FieldValue.arrayUnion(badgeid)};
		delete user.liked[badgeid];
		db.collection('users').doc(user.uid).update({liked:user.liked}).then(snapshot => {
			if (marketplace){
				return db.collection('badgesales').doc(badgeid).update({likes:FieldValue.increment(-1)}).then(snapshot => {
					return res.send("OK")
				}).catch((err)=>{
					console.log('Error getting documents', err);
					return res.status(422).send({error: err});
				})
			} else {
				return db.collection('badges').doc(badgeid).update({likes:FieldValue.increment(-1)}).then(snapshot => {
					return res.send("OK")
				}).catch((err)=>{
					console.log('Error getting documents', err);
					return res.status(422).send({error: err});
				})
			}
		}).catch((err)=>{
			console.log('Error getting documents', err);
			return res.status(422).send({error: err});
		})
	}
})
app.post("/causes", userAuthenticated, (req,res)=> {
	db.collection('causes').get().then(snapshot => {

		if (snapshot.empty) {
			return res.status(422).send({error: "No causes"});
		}  

		let docs = snapshot.docs.map(x => x.data())

		return res.json({causes:docs})

	}).catch((e)=>{
		console.log('Error getting documents', err);
		return res.status(422).send({error: err});
	})
})
app.post("/loadUserWithdrawals", userAuthenticated, (req,res)=> {
	
	let user = req.user.data();

	let feedQuery = db.collection('withdrawals');
	feedQuery = feedQuery.where('user', '==', user.uid.toLowerCase());
	feedQuery = feedQuery.where('success', '==', true);

	if (req.body.lastdate){
		feedQuery = feedQuery.where('created', '<', new Date(req.body.lastdate));
	}

	feedQuery = feedQuery.orderBy('created', 'desc').limit(15);

	feedQuery.get().then(snapshot => {

		if (snapshot.empty) {
			return res.status(422).send({error: "End of feed"});
		}  

		let docs = snapshot.docs.map((x) => {
			y = x.data()
			y.id = x.id;
			return y;
		})

		return res.json({feed:docs})

	}).catch(err => {

		console.log('Error getting documents', err);
		return res.status(422).send({error: err});

	});

})
app.post("/loadUserFeed", userAuthenticated, (req,res)=> {
	
	let user = req.user.data();

	let feedQuery = db.collection('badges');
	feedQuery = feedQuery.where('ownerId', '==', user.uid.toLowerCase());

	feedQuery = feedQuery.where('removedFromShowcase', '==', false);

	if (req.body.lastdate){
		feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate));
	}

	feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15);

	feedQuery.get().then(snapshot => {

		if (snapshot.empty) {
			return res.status(422).send({error: "End of feed"});
		}  

		let docs = snapshot.docs.map((x) => {
			y = x.data()
			y.id = x.id;
			return y;
		})

		return res.json({feed:docs})

	}).catch(err => {

		console.log('Error getting documents', err);
		return res.status(422).send({error: err});

	});

})
app.post("/loadUserTrades", userAuthenticated, (req,res)=> {

	let user = req.user.data();

	let feedQuery = db.collection('badgesales');
	feedQuery = feedQuery.where('resaleUser', '==', user.uid.toLowerCase());

	feedQuery = feedQuery.where('removedFromShowcase', '==', false);

	if (req.body.lastdate){
		feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate));
	}

	feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15);

	feedQuery.get().then(snapshot => {

		if (snapshot.empty) {
			return res.status(422).send({error: "End of feed"});
		}  

		let docs = snapshot.docs.map((x) => {
			y = x.data()
			y.id = x.id;
			return y;
		})

		return res.json({feed:docs})

	}).catch(err => {

		console.log('Error getting documents', err);
		return res.status(422).send({error: err});

	});


})

app.post("/loadUserMarketplace", userAuthenticated, (req,res)=> {

	let user = req.user.data();

	let feedQuery = db.collection('badgesales');
	feedQuery = feedQuery.where('creatorId', '==', user.uid.toLowerCase());

	feedQuery = feedQuery.where('removedFromShowcase', '==', false);

	if (req.body.lastdate){
		feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate));
	}

	feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15);

	feedQuery.get().then(snapshot => {

		if (snapshot.empty) {
			return res.status(422).send({error: "End of feed"});
		}  

		let docs = snapshot.docs.map((x) => {
			y = x.data()
			y.id = x.id;
			return y;
		})

		return res.json({feed:docs})

	}).catch(err => {

		console.log('Error getting documents', err);
		return res.status(422).send({error: err});

	});


})
app.post("/loadOtherUserFeed", userAuthenticated, (req,res)=> {

	if (req.body.userid){

		let feedQuery = db.collection('badges');
		feedQuery = feedQuery.where('ownerId', '==', req.body.userid.toLowerCase());

		feedQuery = feedQuery.where('removedFromShowcase', '==', false);

		if (req.body.lastdate){
			feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate));
		}

		feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15);

		feedQuery.get().then(snapshot => {

			if (snapshot.empty) {
				return res.status(422).send({error: "End of feed"});
			}  

			let docs = snapshot.docs.map((x) => {
				y = x.data()
				y.id = x.id;
				return y;
			})

			return res.json({feed:docs})

		}).catch(err => {

			console.log('Error getting documents', err);
			return res.status(422).send({error: err});

		});

		
	} else {
		return res.status(422).send({error: "Invalid user"});
	}

})
/*
app.get('/testfix', (req,res)=> {
  db.collection('badges').get().then(resp => {
    
    console.log(resp.docs)

    let batch = db.batch();

    resp.docs.forEach(badge => {

      batch.update(badge.ref, {removedFromShowcase:false});

    })

    return batch.commit().catch(err => console.error(err));

  }).catch(error => console.error(error))
  return db.collection('badgesales').get().then(resp => {
    
    console.log(resp.docs)

    let batch = db.batch();

    resp.docs.forEach(badge => {

      batch.update(badge.ref, {removedFromShowcase:false});

    })

    return batch.commit().catch(err => console.error(err));

  }).catch(error => console.error(error))

});
*/
app.post("/loadOtherUserMarketplace", userAuthenticated, (req,res)=> {

	if (req.body.userid){

		let feedQuery = db.collection('badgesales');
		feedQuery = feedQuery.where('creatorId', '==', req.body.userid.toLowerCase());

		feedQuery = feedQuery.where('removedFromShowcase', '==', false);

		if (req.body.lastdate){
			feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate));
		}

		feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15);

		feedQuery.get().then(snapshot => {

			if (snapshot.empty) {
				return res.status(422).send({error: "End of feed"});
			}  

			let docs = snapshot.docs.map((x) => {
				y = x.data()
				y.id = x.id;
				return y;
			})

			return res.json({feed:docs})

		}).catch(err => {

			console.log('Error getting documents', err);
			return res.status(422).send({error: err});

		});

		
	} else {
		return res.status(422).send({error: "Invalid user"});
	}

})
app.post("/getOtherUser", userAuthenticated, async (req,res)=> {
	let user = req.user.data();
	if (req.body.userid){
		let fields =[
			'uid',
			'bio',
			'creator',
			'displayName',
			'username',
			'avatar',
		];
		try {
			let otherUser = await db.collection('users').doc(req.body.userid).get(); 
			let otherUserFollowing = await db.collection('users').doc(user.uid).collection('following').doc(req.body.userid).get(); 
			console.log("FOLLOWING?", otherUserFollowing)
			return res.json({
				user:{
					uid: otherUser.get(fields[0]),
					bio: otherUser.get(fields[1]),
					creator: otherUser.get(fields[2]),
					displayName: otherUser.get(fields[3]),
					username: otherUser.get(fields[4]),
					avatar: otherUser.get(fields[5]),
					otherUserFollowing: otherUserFollowing.exists
				},
			})
		} catch (err){
			console.log('ERROR GETTING OTHER USER', err)
			return res.status(422).send({error: err});
		}
	} else {
		return res.status(422).send({error: "Invalid user"});
	}
	
})

app.post("/removeFriend", userAuthenticated, async (req,res)=> {

	let user = req.user.data();
	if (req.body.userid){
		db.collection('users').doc(user.uid).collection('following').doc(req.body.userid).delete().then(() => {
			return db.collection('users').doc(req.body.userid).collection('followers').doc(user.uid).delete().then(() => {
				db.collection('users').doc(user.uid).update({followingCount:FieldValue.increment(-1)}).then(() => {
					return true;
				}).catch((err) => {
					console.log("ERR updating user on unfollow", err)
					return true;
				})
				db.collection('users').doc(req.body.userid).update({followersCount:FieldValue.increment(-1)}).then(() => {
					return true;
				}).catch((err) => {
					console.log("ERR updating other user on unfollow", err)
					return true;
				})
				return res.send("OK");
			}).catch((err) => {
				console.log("ERR0 updating other user on unfollow", err)
				return res.status(422).send({error: err});
			})
		}).catch((err) => {
			console.log("ERR0 updating user on unfollow", err)
			return res.status(422).send({error: err});
		})
	} else {
		return res.status(422).send({error: "Invalid user"});
	}
	
})
app.post("/addFriend", userAuthenticated, async (req,res)=> {

	let user = req.user.data();
	if (req.body.userid){
		db.collection('users').doc(user.uid).collection('following').doc(req.body.userid).set({uid:req.body.userid, createdDate:new Date()}).then(() => {
			return db.collection('users').doc(req.body.userid).collection('followers').doc(user.uid).set({uid:user.uid, createdDate:new Date()}).then(() => {
				db.collection('users').doc(user.uid).update({followingCount:FieldValue.increment(1)}).then(() => {
					return true;
				}).catch((err) => {
					console.log("ERR updating user on follow", err)
					return true;
				})
				db.collection('users').doc(req.body.userid).update({followersCount:FieldValue.increment(1)}).then(() => {
					return true;
				}).catch((err) => {
					console.log("ERR updating other user on follow", err)
					return true;
				})
				return res.send("OK");
			}).catch((err) => {
				console.log("ERR0 updating other user on follow", err)
				return res.status(422).send({error: err});
			})
		}).catch((err) => {
			console.log("ERR0 updating user on follow", err)
			return res.status(422).send({error: err});
		})
	} else {
		return res.status(422).send({error: "Invalid user"});
	}
	
})

app.post("/listFollowing", userAuthenticated, async (req,res)=> {

	let user = req.user.data();
	let { lastdate } = req.body;
	let myQuery = db.collection('users').doc(user.uid).collection('following');
	
	if (lastdate){
		lastdate = new Date(lastdate)
		myQuery=myQuery.where('createdDate', '<', lastdate).orderBy('createdDate', 'desc')
	}
	myQuery.limit(30).get().then(async (snapshot)=> {
		
		let newlastdate=null;
		let docs = snapshot.docs.map(x => x.data())
		if (docs && docs.length >0){
			newlastdate = docs[docs.length -1].createdDate;
		}
		var allProfiles = [];
		// here we need to attach profile metadata.
		/* eslint-disable no-await-in-loop */
		for (var i=0; i< docs.length; i++){
			try {
				let otherUser = await db.collection('users').doc(docs[i].uid).get();
				let profileData = otherUser.data();
				console.log("GOT following", profileData);
				allProfiles.push({
					uid: profileData.uid,
					bio: profileData.bio,
					creator: profileData.creator,
					displayName: profileData.displayName,
					username: profileData.username,
					avatar: profileData.avatar,
				});
			} catch(e){
				console.log("Err fetching profile for following", e)
			}
		}
		/* eslint-enable no-await-in-loop */
		console.log("FOLLOWING",docs,allProfiles)

		return res.json({profiles:allProfiles, lastdate:newlastdate.toDate()});
	}).catch((err) => {
		console.log("Err listing followers")
		return res.status(422).send({error: err});
	})

})

app.post("/listFollowers", userAuthenticated, async (req,res)=> {

	let user = req.user.data();
	let { lastdate } = req.body;
	let myQuery = db.collection('users').doc(user.uid).collection('followers');
	if (lastdate){
		lastdate = new Date(lastdate)
		myQuery = myQuery.where('createdDate', '<', lastdate).orderBy('createdDate', 'desc')
	}
	myQuery.limit(30).get().then(async (snapshot)=> {
		
		let newlastdate=null;
		let docs = snapshot.docs.map(x => x.data())
		if (docs && docs.length >0){
			newlastdate = docs[docs.length -1].createdDate;
		}

		let allProfiles = [];
		// here we need to attach profile metadata.
		/* eslint-disable no-await-in-loop */
		for (var i=0; i< docs.length; i++){
			try {
				let otherUser = await db.collection('users').doc(docs[i].uid).get();
				let profileData = otherUser.data();
				console.log("GOT followers", profileData);
				allProfiles.push({
					uid: profileData.uid,
					bio: profileData.bio,
					creator: profileData.creator,
					displayName: profileData.displayName,
					username: profileData.username,
					avatar: profileData.avatar,
				});
			} catch(e){
				console.log("ERROR FETCHING PROFIEL FOR FOLLOWER", e)
			}
		}
		/* eslint-enable no-await-in-loop */

		return res.json({profiles:allProfiles, lastdate:newlastdate.toDate()});
	}).catch((err) => {
		console.log("Err listing followers")
		return res.status(422).send({error: err});
	})
	
})

app.post("/marketplace", optionallyHasUser, (req,res)=> {


	//if (req.user){
	//}
	let feedQuery = db.collection('badgesales');

	feedQuery = feedQuery.where('soldout', '==', false);

	if (req.body.lastdate){
		feedQuery = feedQuery.where('createdDate', '<', new Date(req.body.lastdate));
	}

	if (req.body.category){
		feedQuery = feedQuery.where('category', '==', req.body.category.toLowerCase());
	}

	feedQuery = feedQuery.orderBy('createdDate', 'desc').limit(15);

	feedQuery.get().then(snapshot => {

		if (snapshot.empty) {
			return res.status(422).send({error: "End of feed"});
		}  

		let docs = snapshot.docs.map(x => x.data())

		return res.json({feed:docs})

	}).catch(err => {

		console.log('Error getting documents', err);
		return res.status(422).send({error: err});

	});
	

	
})

app.post('/unlistBadgeForSale', userAuthenticated, async (req,res)=> {
	
	let user = req.user.data();

	let { badgeid } = req.body;

	// here we need to make sure user currently owns the badge because the removebadge is called from escrow
	db.collection('badges').where('tokenId' === badgeid).get().then((snapshot)=> {
		if (snapshot.docs){
			let badgeRecord = snapshot.docs[0].data()
			if (badgeRecord.ownerId === user.uid){
				return axios.post(blockchainServer+'/removeBadgeFromEscrow', {badgeid}).then(async function (response) {
					if (response && response.data && response.data.success){
						// now we need to delete the badge sale for this listing
						return db.collection('badges').where('tokenId' === badgeid).delete().then(()=> {
							return res.json({success:true})
						}).catch((err)=> {
							console.log("Err unlist badge 5", err)
							return res.status(422).send({error: err});
						});

					} else {
						console.log("Err unlist badge 4")
						return res.status(422).send({error: "Error"});
					}
				}).catch((err)=> {
					return res.status(422).send({error: err});
				})
			} else {
				console.log("Err unlist badge 3")
				return res.status(422).send({error: "Error"});
			}
		} else {
			console.log("Err unlist badge 2")
			return res.status(422).send({error: "Error"});
		}
	}).catch((err)=> {
		console.log("Err unlist badge 1", err)
		return res.status(422).send({error: err});
	})


})

app.post('/listBadgeForSale', userAuthenticated, async (req,res)=> {
	
	let user = req.user.data();

	let { sig, message, badgeid, currency, price } = req.body;

	let postData = { 
		sig, message, badgeid, badgeowner: user.crypto.address, token: functions.config().blockchainauth.token,
	};

	if (price < 0 || price > 200 || isNaN(price) ||  typeof price !== 'number'){
		return res.status(422).send({error: "Invalid Price"});
	} else {
		db.collection('badges').where('tokenId', '==', badgeid).get().then((snapshot)=> {
		if (snapshot.docs){
			let badgeRecord = snapshot.docs[0].data()
			if (badgeRecord.ownerId === user.uid){
				return axios.post(blockchainServer+'/addNonFungibleToEscrowWithSignatureRelay', postData).then(async function (response) {
					if (response && response.data && response.data.success){
						// do we make a new badge sale here? probably. then we will delete the badge from user profile on purchase
						let badgeDoc = Object.assign(badgeRecord, {
								currency: user.currency,
								price: price,
								removedFromShowcase:false,
								soldout:false,
								sold:0,
								shares:0,
								likes:0,
								supply:1,
								id: snapshot.docs[0].id,
								uri: 'https://showcase.to/badge/'+snapshot.docs[0].id,
								resale:true,
								resaleUser:user.uid,
								resaleUsername:user.username,
						})

						return db.collection('badgesales').add(badgeDoc).then(docRef => {
							// here we need to set forSale = true in the original badge doc and set saleId = the bade sale doc id
							return db.collection('badges').doc(badgeid).update({forSale:true, saleid:docRef.id}).then(done => {
								return res.json({success:true});
							}).catch((err)=> {
								console.log("Err list badge 6", err)
								return res.status(422).send({error: err});
							});
						}).catch((err)=> {
							console.log("Err list badge 6", err)
							return res.status(422).send({error: err});
						})

					} else {
						console.log("Err list badge 5")
						return res.status(422).send({error: "Error"});
					}
				}).catch((err)=> {
					console.log("Err list badge 4", err)
					return res.status(422).send({error: err});
				})
			} else {
				console.log("Err list badge 3", err)
				return res.status(422).send({error: "Error"});
			}
		} else {
			console.log("Err list badge 2", err)
			return res.status(422).send({error: "Error"});
			}
		}).catch((err)=> {
			console.log("Err list badge 1", err)
			return res.status(422).send({error: err});
		})
	} 

})




app.post("/purchaseBadge", userAuthenticated, async (req,res)=> {
	const { itemId, currencyRate, displayedPrice } = req.body;
	let user = req.user.data();
	console.log("BOUGHT BADGE", user.crypto)
	if ((user.spent > 1000 && !user.kycVerified) || (user.kycVerified && user.spent > 10000 )){
		return res.status(422).send({error: "You have reached the maximum spending limit. Please contact team@showcase.to to increase your limits."});
	} else if (user.crypto && user.crypto.address && user.stripeId){

		try {
			let existingBadge = await db.collection('badges').where('saleId', '==', itemId).where('ownerId', '==', user.uid).get();
			if (existingBadge.exists){
				console.log(existingBadge.exists, "EXISTING BADGE EXISTS!!!")
				return res.status(422).send({error: "You already purchased this badge"});
			}
		} catch(err){
			console.log("Error checking if badge exists")
			return res.status(422).send({error: err});
		}

		let badgeSaleRef = db.collection('badgesales').doc(itemId);

		db.collection('currencyrates').doc("rates").get().then(currencyDoc => {
			console.log('Updated currency rates data');
			if (!currencyDoc.exists){
				return res.status(422).send({error: "empty currencies"});
			} else {
				let currenciesData = currencyDoc.data()

				return db.runTransaction(t => {
					return t.get(badgeSaleRef)
					    .then( async(doc) => {
					    	if (doc.data().sold < doc.data().supply){
					    		let sold = doc.data().sold + 1;

					    		let newLastDigits = (parseInt(doc.data().tokenType.slice(-10)) + sold).toFixed(0);

					    		while (newLastDigits.length < 10) {
					    			console.log("ADDING 0")
					    			newLastDigits = "0" + newLastDigits;
					    		}

						      	let newBadgeTokenId = doc.data().tokenType.slice(0, -10) + newLastDigits

						      	console.log("NEW BADGE ID-", newLastDigits.length, doc.data().tokenType, doc.data().tokenType.slice(-10), doc.data().tokenType.slice(0, -10), newLastDigits,  newBadgeTokenId)



							    let multiplier = (1 / currenciesData[doc.data().currency]) * currenciesData[user.currency]
							    let calculatedPrice = parseFloat((doc.data().price * multiplier).toFixed(2))
							    console.log("PRICE CURRENCY DATA", doc.data().price, doc.data().currency, user.currency, currenciesData[user.currency], currenciesData[user.currency], calculatedPrice)
							    if (doc.data().price ===0 || calculatedPrice === displayedPrice){


							      	


							      	//make sure currency conversion rates are the same
							      	if (currenciesData[user.currency] === currencyRate){

							      		t.update(badgeSaleRef, {sold});
							      	//return Promise.resolve({doc:doc.data(), newBadgeTokenId, edition:sold});
							      		const twoDecimalCurrencyMultiplier = 100;

							      		let refundChargeId =""
							      		try {
										const charge = await stripe.charges.create(
										  {
										    amount: (calculatedPrice * twoDecimalCurrencyMultiplier),
										    currency: user.currency,
										   	customer:user.stripeId,
										    description: 'Showcase Badge "'+doc.data().title+'" (ID: '+newBadgeTokenId+')',
										    metadata:{
										    	badgeid: newBadgeTokenId,
										    	badgename: doc.data().title,
										    	creatorid: doc.data().creatorId,
										    },
										    //receipt_email: user.email || null, //avoid email for now..
										  });
										  console.log("STRIPE CHARGE", charge)
										  if (!charge || !charge.id || !charge.paid){
										    	return Promise.reject(new Error("Unable to create charge"));
										    } else {

												const data = {
													to:[user.crypto.address],
													type:newBadgeTokenId,
													token: functions.config().blockchainauth.token,
												}

												return axios.post(blockchainServer+'/mintBadge', data)
												.then(async function (response) {
												    console.log("transfer badge response", response.data);
												    if (response.data.success){





														// now we make the new badge document to display in their feed
													  	let newBadgeDoc = {
															uri:doc.data().uri,
															saleId:doc.data().id,
															title:doc.data().title, 
															description:doc.data().description, 
															creatorName:doc.data().creatorName, 
															image:doc.data().image, 
															imageHash: doc.data().imageHash, 
															supply: doc.data().supply,
															creatorAddress: doc.data().creatorAddress,
															creatorId: doc.data().creatorId,
															createdDate: doc.data().createdDate,
															edition:sold,
															tokenId:newBadgeTokenId,
															tokenType:doc.data().tokenType,
															ownerAddress: user.crypto.address,
															category: doc.data().category,
															ownerId: user.uid,
															purchasedDate: new Date(),
															donationAmount: doc.data().donationAmount || 0,
															donationCause: doc.data().donationCause || "None",
															views:0,
															likes:0,
															shares:0,
															removedFromShowcase:false,
															lastViewed: new Date(),
													  	}


														if (doc.data().donationAmount && doc.data().donationAmount >0){
															try {
																let foundCause = await db.collection('causes').where('site', '==', doc.data().donationCause).limit(1).get();
																if (!foundCause.empty){
																	newBadgeDoc.donationCause = foundCause.docs[0].data().site;
																	newBadgeDoc.donationCauseImage = foundCause.docs[0].data().image;
																	newBadgeDoc.donationCauseName = foundCause.docs[0].data().name;
																	newBadgeDoc.donationAmount = doc.data().donationAmount;
																}
															} catch (e){
																console.log("ERR FINDING CAUSE", e)
															}		
														} 



														return db.collection('badges').doc(newBadgeTokenId).set(newBadgeDoc).then(done => {
															console.log('Updated badge data', done);

															// insert receipt, should track blockchain transaction hash, stripe payment hash, and payouts amounts.

															let receiptData = {
																saleId : doc.data().id,
																badgeToken : newBadgeTokenId,
																transactionHash: response.data.transactionHash,
																salePrice: doc.data().price,
																saleCurrency: doc.data().currency,
																convertedPrice: calculatedPrice,
																convertedCurrency: user.currency,
																convertedRate: currenciesData[user.currency],
																donationAmount: doc.data().donationAmount || 0,
																chargeId: charge.id,
																created:new Date(),
																user:user.uid,
																creator: doc.data().creatorId,
															}

															console.log("RECEIPT DATA", receiptData)

															
															db.collection('receipts').doc(doc.data().id).set(receiptData).then(done => {
																return true;
															}).catch(err => {
																console.log("ERROR creating receipt", err)
																return true;
															});




															if (doc.data().price > 0){


															    let USDmultiplier = (1 / currenciesData[doc.data().currency]) 
															    let USDPrice = parseFloat((doc.data().price * USDmultiplier).toFixed(2))

																let updateData = {
																	badgesCount:FieldValue.increment(1),
																	spent:FieldValue.increment(USDPrice),
																}
																let totalPrice = doc.data().price;
																let feeMultiplier = 0.9;
																let causeFullAmount =0;

																if (doc.data().donationAmount){
																	feeMultiplier -= doc.data().donationAmount
																	causeFullAmount = doc.data().donationAmount * totalPrice
																} 

																let payoutAmount = totalPrice * feeMultiplier;

																if (doc.data().currency === "USD"){
																	updateData["balances.usd"] = FieldValue.increment(payoutAmount)
																} else if (doc.data().currency === "EUR"){
																	updateData["balances.eur"] = FieldValue.increment(payoutAmount)
																} else if (doc.data().currency === "GBP"){
																	updateData["balances.gbp"] = FieldValue.increment(payoutAmount)
																}

																// we will have to update the cause document to increment the cause benefit amount.
																if (causeFullAmount && causeFullAmount > 0){
																	
																	let updateCause = {
																		contributionsAmount:FieldValue.increment(1)
																	};

																	if (doc.data().currency === "USD"){
																		updateCause["balances.usd"] = FieldValue.increment(causeFullAmount)
																	} else if (doc.data().currency === "EUR"){
																		updateCause["balances.eur"] = FieldValue.increment(causeFullAmount)
																	} else if (doc.data().currency === "GBP"){
																		updateCause["balances.gbp"] = FieldValue.increment(causeFullAmount)
																	}

																	console.log("UPDATING CAUSE", doc.data().donationCauseId, updateCause)

																	db.collection('causes').doc(doc.data().donationCauseId).update(updateCause).then(done => {
																		console.log('Updated cause balance');
																		return true;
																		
																	}).catch(err => {
																		console.log("ERROR updating cause balance!!", err)
																		return true;
																	});

																}

																console.log("UPDATING USER", updateData)

																db.collection('users').doc(user.uid).update(updateData).then(done => {
																	console.log('Updated profile');
																	return true;
																	
																}).catch(err => {
																	console.log("ERROR updating user balance!!", err)
																	return true;
																});

															}

															if (sold === doc.data().supply){
																console.log("SETTING SOLDout=true");
																db.collection('badgesales').doc(itemId).update({soldout: true}).then(done => {
																	return true;
																}).catch(err => {
																	console.log("ERROR SETTING IT SOLOUT", err)
																	return true;
																});
															}

															//sendNotification(doc.data().creatorId, "Badge Sale", "You sold a badge: "+doc.data().title, userdoc.data().notificationToken);

															
															return Promise.resolve(true);


														}).catch(async (err) => {
															try {
																let refund = await stripe.refunds.create({charge: charge.id})
																console.log("REFUNDED CHARGE1", refund)
															} catch (err){
																console.log("UNABLE TO REFUND CUSTOMER1")
															}
															console.log("ERR creating badge", err)

															return Promise.reject(new Error("Error creating badge"));
														});
													} else {
														console.log("BLOCKCHAIN ERR MISSING PARAMS");
														try {
															let refund = await stripe.refunds.create({charge: charge.id})
															console.log("REFUNDED CHARGE2", refund)
														} catch (err){
															console.log("UNABLE TO REFUND CUSTOMER2")
														}
														return Promise.reject(new Error('Missing response parameters'));
													}
												}).catch(async (error) => {
												    console.log("BLOCKCHAIN ERR RECEIEVD", error);
												    try {
														let refund = await stripe.refunds.create({charge: charge.id})
														console.log("REFUNDED CHARGE3", refund)
													} catch (err){
														console.log("UNABLE TO REFUND CUSTOMER3")
													}
												    return Promise.reject(new Error('Error connecting to Blockchain'));
												})



										    }
										  /*}).catch((err) => {
										  	console.log("Stripe err");
										  	return Promise.reject(new Error(err));
										  });*/

										} catch (err){
											console.log("Stripe err", err);
											return Promise.reject(new Error(err));
										}
									} else {
										return Promise.reject(new Error('currencies'));
									}
								} else {
									console.log("MISMATCHING PRICES", doc.data().price,  calculatedPrice, displayedPrice)
									return Promise.reject(new Error('Wrong price displayed'));
								}

					    	} else {
					    		console.log("Sold out", doc.data().sold , doc.data().supply)
					    		return Promise.reject(new Error('Out of stock'));
					    	}
					    });
				}).then(result => {
				  	console.log('Transaction success', result);
				  	return res.send("OK")
				  	// do blockchain transfer
				}).catch(err => {
				  console.log('Transaction failure:', err);
				  return res.status(422).send({error: err.toString()});
				});
			}
		}).catch(err => {
		  console.log('currency loading err', err);
		  return res.status(422).send({error: err});
		});
	} else {
		return res.status(422).send({error: "No wallet or card"});
	}
})
app.get('/test1', (req,res)=>{

	db.collection("badgesales").get().then(function(querySnapshot) {
	    return querySnapshot.forEach(function(doc) {
			let price = parseInt(Math.random() * 20)
	        return doc.ref.update({ price});
	    });
	}).catch(e => {
		return console.log(e)
	});
})
app.get('/test2', (req,res)=>{

	db.collection("badgesales").get().then(function(querySnapshot) {
	    return querySnapshot.forEach(function(doc) {
			let category = "art"
			/*if (Math.random() < 0.5){
				category="causes"
			}*/
	        return doc.ref.update({ category: category});
	    });
	}).catch(e => {
		return console.log(e)
	});
})
app.get('/testq', async (req,res)=>{
	let donationcause = "http://www.conserveturtles.org/";
	console.log("LOKING UPp ", donationcause)
		if (donationcause && donationcause.length && donationcause.length >0){
			try {
				foundCause = await db.collection('causes').where('site', '==', donationcause).limit(1).get();
				if (!foundCause.empty){
					console.log("FOUND", foundCause.docs[0].data())
				} else {
					console.log("ERR MISSING", foundCause.empty, foundCause)
				}
			} catch (e){
				console.log("ERR FINDING CAUSE", e)
			}
		} 
})
app.post("/publishBadge", userAuthenticated, async (req,res)=> {

	let user = req.user.data();
	if (!user.creator){
		return res.status(422).send({error: "You are not a verified creator"});
	}

	let { title, price, quantity, description, id, image, imagehash, category, donationamount, donationcause, gif } = req.body;

	if (title.length > 20 || title.length===0){
		return res.status(422).send({error: "Invalid Title Length"});
	} else if (price < 0 || price > 200 || isNaN(price) ||  typeof price !== 'number'){
		return res.status(422).send({error: "Invalid Price"});
	} else if (quantity < 1 || quantity > 1000000 || isNaN(quantity) ||  typeof quantity !== 'number'){
		return res.status(422).send({error: "Invalid Quantity"});
	} else if (!image || image.length ===0){
		return res.status(422).send({error: "Invalid Image"});
	} else if (description && description.length>240){
		return res.status(422).send({error: "Invalid Description"});
	} else if (donationamount && (donationamount< 0.05 || donationamount > 0.5) ){
		return res.status(422).send({error: "Invalid Donation Amount"});
	} else {


		let foundDonationSite = "None";
		let foundDonationImage = "None";
		let foundDonationName = "None";
		let foundDonationId = "None";
		let foundDonationAmount = 0;
		var foundCause;
		if (donationcause && donationcause.length && donationcause.length >0){
			try {
				foundCause = await db.collection('causes').where('site', '==', donationcause).limit(1).get();
				
				console.log("UID?", foundCause.docs[0].id)
				if (!foundCause.empty){
					foundDonationSite = foundCause.docs[0].data().site;
					foundDonationImage = foundCause.docs[0].data().image;
					foundDonationName = foundCause.docs[0].data().name;
					foundDonationId = foundCause.docs[0].id;
					foundDonationAmount = donationamount;
				} else {
					console.log("Could not find cause ", donationcause)
				}
			} catch (e){
				console.log("ERR FINDING CAUSE", e)
			}		
		} 



		const data = {
			token: functions.config().blockchainauth.token,
			uri: 'https://showcase.to/badge/'+id, 
			name: title, 
			description: description || "None", 
			creatorname: user.username, 
			category: category.toLowerCase(), 
			image, 
			imagehash, 
			supply: quantity,
			creatoraddress:user.crypto.address,
			//causeSite: foundDonationSite,
			//causeAmount: foundDonationAmount,
		}


		console.log("PUBLISH BADGE DATA OBJ", data);

		axios.post(blockchainServer+'/createBadge', data)
		.then(function (response) {
		    try {
		    console.log("data from blockchain server", response.data);
		    if (response.data.tokenType){
				const badgeDoc = {
					uri: 'https://showcase.to/badge/'+id, 
					id:id,
					title, 
					description, 
					creatorName: user.username, 
					category: category.toLowerCase(),
					image, 
					price,
					currency:user.currency,
					imageHash: imagehash, 
					supply: quantity,
					creatorAddress:user.crypto.address,
					creatorId:user.uid,
					createdDate: new Date(),
					sold:0,
					tokenType:response.data.tokenType,
					views:0,
					likes:0,
					shares:0,
					soldout:false,
					forSale:false,
					removedFromShowcase:false,
					donationAmount: foundDonationAmount,
					donationCause: foundDonationSite,
					donationCauseImage:foundDonationImage,
					donationCauseName:foundDonationName,
					donationCauseId: foundDonationId,
					gif

				}
				return db.collection('badgesales').doc(id).set(badgeDoc).then(docRef => {
					console.log('Updated badge data');
					return res.json({badgeSaleId:docRef.id})
				}).catch(err => {

					return res.status(422).send({error: err});
				});
			} else {
				console.log("BLOCKCHAIN ERR MISSING PARAMS");
				return res.status(422).send({error: "ERR MISSING RESPONSE PARAMS"});
			}
		} catch (e){ console.log(e); return res.status(422).send({error: "ERR INVALID PARAMS"}); }
		})
		.catch(function (error) {
		    console.log("BLOCKCHAIN ERR RECEIEVD",error.response.data);
		    return res.status(422).send({error: "ERR INVALID PARAMS"});
		})
	}
	
})
/*
//run once just to create the table
app.get("/fiatgenerate", (req,res)=> {

	const initialClient = new Client({
	  connectionString: conString,
	});

	const fiatwalletsTable = `fiatwallets(
		id BIGSERIAL PRIMARY KEY,
		lastused timestamp,
		balanceusd numeric DEFAULT 0,
		balanceeur numeric DEFAULT 0,
		uid varchar(100) UNIQUE,
		phone varchar(100)
	)`;

	console.log("STARTING GEN")

	initialClient.connect();
	initialClient.query("CREATE TABLE IF NOT EXISTS "+fiatwalletsTable, function(err2, res2){
		if (err2){
			console.error("ERR", err2)
		}
		console.log("Creating fiat wallet tables")
		res.send("OK")
		initialClient.end()
	});

})
*/
app.use(function(err, req, res, next) {
  console.error("ERROR LOG",err, (new Error(err)).stack)
  if (req && req.path){
    console.error("ERROR LOG CONT.", req.path);
  }
  if (req && req.body){
    console.error("ERROR LOG CONT.", req.body);
  }
  if (req){
    console.error("ERROR LOG CONT.", req);
  }
  if (err.status === 502 || err.status===504){
    res.status(500);
    res.send("Error Connecting to server. Please try again.")
  } else {
    res.status(err.status || 500);
    res.send((new Error(err)).stack ) // for now, in development
  }
});

exports.app = functions.runWith({ timeoutSeconds: 540 }).https.onRequest(app);




exports.scheduledFunction = functions.pubsub.schedule('30 16 * * *').onRun((context) => {
	console.log("CALLED SCHEDULED FUNCTION")
  return axios.get("https://openexchangerates.org/api/latest.json?app_id=c5e771e507934e40a423df403e54d0ae").then((res)=>{
  	if (res.data.rates){
		return db.collection('currencyrates').doc("rates").set(res.data.rates).then(docRef => {
			console.log('Updated currency rates data');
			return Promise.resolve(true);
		}).catch(err => {
			console.log("ERR UPDATING CURRENCY", err)
			return Promise.resolve(true);
		});
  	} else {
  		console.error("ERROR cannot get currency prices")
  		return true;
  	}
  }).catch((e)=> {
  	console.error("ERROR cannot get currency prices 1", e)
  	return true;
  })
});

/*
// automatically create fiat wallets for users
exports.createFiatWallet = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
	const newUser = snap.data();

	const client = new Client({
	  connectionString: conString,
	})

	client.connect();

	client.query("INSERT INTO fiatwallets (uid, phone) VALUES ($1, $2) ON CONFLICT (uid) DO NOTHING", [newUser.uid, newUser.phoneNumber], function(err, res){
		if (err){
			console.error("ERROR CREATING FIAT WALLET", err)
		} else {
		console.log("Creating fiat wallet tables")
		
		}
		client.end();
	})
})

*/

									/*
									initialClient.connect();
									initialClient.query("UPDATE wallets SET "+balanceCurrency+"="+balanceCurrency+"+$1, lastused=$2 WHERE uid=$3", [payoutAmount, (new Date()), user.uid], function(err2, res2){
										
										if (err2){
											console.error("ERR UPDATING PAYOUT...", err2)
										}

										console.log("Creating fiat wallet tables")

										initialClient.end()
									});*/


