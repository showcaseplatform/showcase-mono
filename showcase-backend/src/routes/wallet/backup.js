const crypto = require('crypto')

module.exports = (req, res) => {
  let user = req.user.data()

  const { password } = req.body

  const algorithm = 'aes256'

  const encryptionKeyHash = crypto.createHash('sha256').update(password).digest()

  //const decipherPrivateKey = crypto.createDecipheriv(algorithm, encryptionKeyHash, ivPrivateKey);
  const decipherMnemonic = crypto.createDecipheriv(
    algorithm,
    encryptionKeyHash,
    user.crypto.ivMnemonic
  )

  //var decryptedPrivateKey = decipherPrivateKey.update(encryptedPrivateKey, 'hex', 'utf8') + decipherPrivateKey.final('utf8');
  var decryptedMnemonic =
    decipherMnemonic.update(user.crypto.encryptedMnemonic, 'hex', 'utf8') +
    decipherMnemonic.final('utf8')
  //console.log("decrypted", decryptedMnemonic, decryptedPrivateKey);
  res.send({ mnemonic: decryptedMnemonic })
}
