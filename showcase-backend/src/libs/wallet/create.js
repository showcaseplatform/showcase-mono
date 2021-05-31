const { firestore: db } = require('../../services/firestore')
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')
const crypto = require('crypto')

//creates crypto wallet for nft storage
module.exports = (req, res) => {
  const { user } = req

  // todo: maybe not a good idea to send password without hashing
  const { password, hint } = req.body

  // check auth
  // check for wallet existing
  // if not wallet continue
  //console.log("CREATING WALLET", req.user);

  const mnemonic = bip39.generateMnemonic()
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const hdwallet = hdkey.fromMasterSeed(seed)
  const wallet_hdpath = "m/44'/60'/0'/0/"
  const newwallet = hdwallet.derivePath(wallet_hdpath + 0).getWallet()
  const addr = newwallet.getAddressString() //wallet.getAddress().toString('hex');
  const pubKey = newwallet.getPublicKeyString()
  const privKey = newwallet.getPrivateKeyString()
  const privKeyString = newwallet.getPrivateKeyString()
  const wallet = {
    address: addr,
    publicKey: pubKey,
    privateKey: privKey,
    mnemonic: mnemonic,
  }

  //console.log("TYPES", typeof privKey, typeof mnemonic)

  const algorithm = 'aes256' //'aes-256-cbc';

  const ivPrivateKey = crypto.randomBytes(128).toString('hex').slice(0, 16)
  const ivMnemonic = crypto.randomBytes(128).toString('hex').slice(0, 16)

  const encryptionKeyHash = crypto.createHash('sha256').update(password).digest()

  //console.log("Key", encryptionKeyHash.toString('hex'))

  const cipherPrivateKey = crypto.createCipheriv(algorithm, encryptionKeyHash, ivPrivateKey)
  const cipherMnemonic = crypto.createCipheriv(algorithm, encryptionKeyHash, ivMnemonic)

  const encryptedPrivateKey =
    cipherPrivateKey.update(privKey, 'utf8', 'hex') + cipherPrivateKey.final('hex')
  const encryptedMnemonic =
    cipherMnemonic.update(mnemonic, 'utf8', 'hex') + cipherMnemonic.final('hex')

  console.log('encrypted', encryptedMnemonic, encryptedPrivateKey)

  console.log('USER', user)
  // save to databas

  db.collection('users')
    .doc(user.uid)
    .update({
      crypto: {
        address: addr,
        publicKey: pubKey,
        encryptedPrivateKey: encryptedPrivateKey,
        encryptedMnemonic: encryptedMnemonic,
        ivPrivateKey: ivPrivateKey,
        ivMnemonic: ivMnemonic,
        passwordHint: hint,
      },
    })
    .then((done) => {
      console.log('Added wallet to DB')
      return res.send('OK')
    })
    .catch((err) => {
      return res.status(422).send({ error: err })
    })
}