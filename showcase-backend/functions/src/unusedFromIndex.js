//SQL DB for fiat payments
//fiatwallets
//mGlBq09h0qb4pNo2
//35.229.62.21
//const { Client } = require('pg')
//var conString = "postgres://postgres:mGlBq09h0qb4pNo2@104.155.107.134:5432/fiatwallets";

// const currencies = ['USD', 'EUR', 'GBP']

/*
  set environment variables via terminal
  $ firebase functions:config:set twilio.account=<accountSid> twilio.token=<authToken> twilio.from=<your from number>
*/
// const config = functions.config()
//const twilio = require('twilio')(config.twilio.account, config.twilio.token);
//+12056274546

//var mongoConnectionUri = "mongodb+srv://admin:PouzIjQ1etIVEY93@showcase0-ozcje.mongodb.net/test?retryWrites=true&w=majority"

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
// END AUTHENTICATION


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
});
*/