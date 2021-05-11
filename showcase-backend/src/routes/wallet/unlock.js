const crypto = require('crypto')

module.exports = (req, res) => {
  const { user } = req

  const { password } = req.body

  const algorithm = 'aes256'

  const encryptionKeyHash = crypto.createHash('sha256').update(password).digest()

  const decipherPrivateKey = crypto.createDecipheriv(
    algorithm,
    encryptionKeyHash,
    user.crypto.ivPrivateKey
  )
  const decipherMnemonic = crypto.createDecipheriv(
    algorithm,
    encryptionKeyHash,
    user.crypto.ivMnemonic
  )

  var decryptedPrivateKey =
    decipherPrivateKey.update(user.crypto.encryptedPrivateKey, 'hex', 'utf8') +
    decipherPrivateKey.final('utf8')
  var decryptedMnemonic =
    decipherMnemonic.update(user.crypto.encryptedMnemonic, 'hex', 'utf8') +
    decipherMnemonic.final('utf8')

  var mnemonicLength = decryptedMnemonic.split(' ').length
  console.log('CHECKIGN MNEMONIC VALID???', decryptedMnemonic, mnemonicLength)
  if (mnemonicLength === 12) {
    return res.send({ decryptedPrivateKey, decryptedMnemonic })
  } else {
    return res.status(422).send({ error: 'invalid' })
  }
  //console.log("decrypted", decryptedMnemonic, decryptedPrivateKey);
}
